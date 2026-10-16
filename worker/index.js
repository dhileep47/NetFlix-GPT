const TMDB_BASE = "https://api.themoviedb.org/3";
// Best free-tier reasoning model in our evals: follows constraints (e.g. "not Miyazaki")
// reliably at ~9s per search. Low effort was as accurate as medium at ~60% of the cost.
const MODEL = "@cf/openai/gpt-oss-120b";
const REASONING_EFFORT = "low";
const MAX_QUERY_LENGTH = 200;
// Ask for extra candidates so we still have enough after dropping any TMDB can't verify.
const CANDIDATES = 8;
const RESULTS = 5;
const LANGUAGES = { en: "English", hi: "Hindi", es: "Spanish" };

// Only these TMDB endpoints are reachable through the proxy.
const TMDB_ROUTES = [
  /^movie\/(now_playing|popular|upcoming)$/,
  /^trending\/movie\/(day|week)$/,
  /^discover\/movie$/,
  /^search\/movie$/,
  /^movie\/\d+\/videos$/,
  /^movie\/\d+$/,
];

const systemPrompt = (language) => `You are CineMatch, an expert film curator for a movie streaming app.

Task: recommend ${CANDIDATES} feature films that best match the user's request, ranked best match first.

How to choose:
- Work out what the user really wants: genre, mood, themes, era, country or language, audience (e.g. family), and any "like <movie>" reference.
- Treat explicit constraints as hard rules: decades, countries, languages, directors to include or exclude, franchises to avoid. Check every pick against them before answering.
- If the user references a specific movie ("like X"), do not recommend X itself or its sequels.
- If the request is written in a language other than English and names no country, favor films from that language's film industry (for example Hindi → Indian cinema), adding international films only if they fit clearly better.
- Only recommend real, released feature films that you are certain exist. No TV series, shorts or unreleased films. Never invent or guess titles; if unsure, pick a film you know well instead.
- Prefer well-reviewed films. When the user asks for underrated or hidden gems, pick lesser-known but real and well-regarded films.
- Keep the list varied: avoid multiple films from the same franchise or director unless the user asks for that.
- If the request is vague or not about movies, interpret it generously as a mood and still recommend films.

Output rules:
- "title": the film's official English release title exactly as listed on TMDB/IMDb (no year, numbering or extra words).
- "year": the original release year.
- "reason": one short sentence (max 20 words) on why it fits this request, written in ${language}.`;

const RECOMMENDATION_SCHEMA = {
  type: "object",
  properties: {
    movies: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          year: { type: "integer" },
          reason: { type: "string" },
        },
        required: ["title", "year", "reason"],
      },
    },
  },
  required: ["movies"],
};

const json = (data, status = 200, headers = {}) =>
  Response.json(data, { status, headers });

const tmdbFetch = async (env, path, search = "") => {
  const res = await fetch(`${TMDB_BASE}/${path}${search}`, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${env.TMDB_TOKEN}`,
    },
  });
  if (!res.ok) throw new Error(`TMDB ${path} responded ${res.status}`);
  return res.json();
};

const handleTmdb = async (request, env, ctx, url) => {
  if (request.method !== "GET") return json({ error: "Method not allowed" }, 405);

  const path = url.pathname.slice("/api/tmdb/".length);
  if (!TMDB_ROUTES.some((route) => route.test(path))) {
    return json({ error: "Not found" }, 404);
  }

  const cache = caches.default;
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const data = await tmdbFetch(env, path, url.search);
    const response = json(data, 200, { "Cache-Control": "public, max-age=3600" });
    ctx.waitUntil(cache.put(request, response.clone()));
    return response;
  } catch (error) {
    console.error(error);
    return json({ error: "Could not load movies right now." }, 502);
  }
};

// Workers AI flags transient failures as retryable; give those one more attempt.
const runModel = async (env, input, attempts = 2) => {
  try {
    return await env.AI.run(MODEL, input);
  } catch (error) {
    if (attempts > 1 && error?.retryable) return runModel(env, input, attempts - 1);
    throw error;
  }
};

// gpt-oss replies in OpenAI chat format; other Workers AI models use `response`.
const parseSuggestions = (result) => {
  const output = result.response ?? result.choices?.[0]?.message?.content;
  let data = output;
  if (typeof output === "string") {
    data = JSON.parse(output.slice(output.indexOf("{"), output.lastIndexOf("}") + 1));
  }
  if (!Array.isArray(data?.movies)) throw new Error("Unexpected model output");
  return data.movies
    .filter((movie) => typeof movie?.title === "string" && movie.title.trim())
    .map(({ title, year, reason }) => ({
      title: title.trim(),
      year: Number(year) || null,
      reason: typeof reason === "string" ? reason.trim() : "",
    }))
    .slice(0, CANDIDATES);
};

const normalizeTitle = (title) =>
  title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/^(the|a|an) /, "")
    .trim();

// Only accept a TMDB result that really is the suggested film, so made-up titles are
// dropped instead of showing an unrelated movie. In order of preference:
// 1. same title and year (tells remakes apart: "Oldboy" 2003 vs 2013)
// 2. same title, best known, when the model's year is off ("Donnie Darko" re-releases)
// 3. one of TMDB's top hits from that year, which covers alternate titles
//    ("Taare Zameen Par" is listed as "Like Stars on Earth")
const pickMatch = ({ title, year }, results) => {
  const withPoster = results.filter((movie) => movie.poster_path);
  const wanted = normalizeTitle(title);
  const titleMatches = (movie) =>
    [movie.title, movie.original_title].some((t) => t && normalizeTitle(t) === wanted);
  const sameYear = (movie) =>
    year && Math.abs(Number(movie.release_date?.slice(0, 4)) - year) <= 1;
  const [bestKnown] = withPoster
    .filter(titleMatches)
    .sort((a, b) => b.vote_count - a.vote_count);

  const movie =
    withPoster.find((m) => titleMatches(m) && sameYear(m)) ??
    bestKnown ??
    withPoster.slice(0, 3).find(sameYear);
  if (!movie) return null;

  const { id, poster_path, release_date, vote_average, overview } = movie;
  return { id, title: movie.title, poster_path, release_date, vote_average, overview };
};

const handleRecommend = async (request, env) => {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const ip = request.headers.get("cf-connecting-ip") ?? "local";
  const { success } = await env.AI_LIMITER.limit({ key: ip });
  if (!success) {
    return json({ error: "Too many searches. Try again in a minute." }, 429);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }
  const query = typeof body?.query === "string" ? body.query.trim() : "";
  const language = LANGUAGES[body?.lang] ?? LANGUAGES.en;
  if (!query || query.length > MAX_QUERY_LENGTH) {
    return json(
      { error: `Search must be between 1 and ${MAX_QUERY_LENGTH} characters.` },
      400
    );
  }

  try {
    const result = await runModel(env, {
      messages: [
        { role: "system", content: systemPrompt(language) },
        { role: "user", content: query },
      ],
      response_format: { type: "json_schema", json_schema: RECOMMENDATION_SCHEMA },
      reasoning_effort: REASONING_EFFORT,
      // Reasoning tokens count towards this limit, so leave plenty of room.
      max_tokens: 3000,
      temperature: 0.6,
    });
    const suggestions = parseSuggestions(result);

    const matches = await Promise.all(
      suggestions.map(async (suggestion) => {
        const search = new URLSearchParams({
          query: suggestion.title,
          include_adult: "false",
        });
        try {
          const data = await tmdbFetch(env, "search/movie", `?${search}`);
          const movie = pickMatch(suggestion, data.results);
          return movie && { ...movie, reason: suggestion.reason };
        } catch (error) {
          console.error(error);
          return null;
        }
      })
    );
    const seen = new Set();
    const movies = matches
      .filter((movie) => {
        if (!movie || seen.has(movie.id)) return false;
        seen.add(movie.id);
        return true;
      })
      .slice(0, RESULTS);
    return json({ movies });
  } catch (error) {
    console.error(error);
    return json({ error: "AI search is unavailable right now. Please try again." }, 502);
  }
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/tmdb/")) {
      return handleTmdb(request, env, ctx, url);
    }
    if (url.pathname === "/api/recommend") {
      return handleRecommend(request, env);
    }
    return json({ error: "Not found" }, 404);
  },
};
