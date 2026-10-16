const TMDB_BASE = "https://api.themoviedb.org/3";
const MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const MAX_QUERY_LENGTH = 200;

// Only these TMDB endpoints are reachable through the proxy.
const TMDB_ROUTES = [
  /^movie\/(now_playing|popular|upcoming)$/,
  /^trending\/movie\/(day|week)$/,
  /^discover\/movie$/,
  /^search\/movie$/,
  /^movie\/\d+\/videos$/,
];

const SYSTEM_PROMPT =
  "You are a movie recommendation system. The user describes what they want to watch, " +
  "possibly in a language other than English. Suggest exactly 5 real, released feature films " +
  "that best match the request. Use each film's well-known English title, without years, " +
  "numbering or any extra text.";

const RECOMMENDATION_SCHEMA = {
  type: "object",
  properties: {
    movies: { type: "array", items: { type: "string" } },
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

const parseTitles = (response) => {
  const data = typeof response === "string" ? JSON.parse(response) : response;
  if (!Array.isArray(data?.movies)) throw new Error("Unexpected model output");
  return data.movies
    .filter((title) => typeof title === "string" && title.trim())
    .map((title) => title.trim())
    .slice(0, 5);
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
  if (!query || query.length > MAX_QUERY_LENGTH) {
    return json(
      { error: `Search must be between 1 and ${MAX_QUERY_LENGTH} characters.` },
      400
    );
  }

  try {
    const result = await runModel(env, {
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: query },
      ],
      response_format: { type: "json_schema", json_schema: RECOMMENDATION_SCHEMA },
      max_tokens: 256,
      temperature: 0.7,
    });
    const titles = parseTitles(result.response);

    const movies = await Promise.all(
      titles.map(async (title) => {
        const search = new URLSearchParams({ query: title, include_adult: "false" });
        const data = await tmdbFetch(env, "search/movie", `?${search}`);
        return { title, results: data.results };
      })
    );
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
