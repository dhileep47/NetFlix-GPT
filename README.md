# NetflixGPT

Netflix-inspired movie browser with AI-powered recommendations.

**Live:** https://netflix-gpt.ananddhileep.workers.dev

- Open to guests: browse and use AI search without an account; optional Firebase email/password sign-in
- Movie rows (Now Playing, Trending, Popular, Upcoming, Horror) and a trailer hero from TMDB
- "Ask AI": describe what you want to watch in English, Hindi or Spanish and get 5 verified picks, each with a reason, from a Workers AI reasoning model

## Stack

React 19 · React Router · Redux Toolkit · Tailwind CSS 4 · Vite · Firebase Auth · Cloudflare Workers + Workers AI

## How it works

The app is a single Cloudflare Worker. Static assets serve the React app (with SPA fallback for client routes), and `worker/index.js` handles `/api/*`:

| Route | Purpose |
| --- | --- |
| `GET /api/tmdb/*` | Proxies an allowlisted set of TMDB endpoints so the token stays server-side; responses are edge-cached for an hour |
| `POST /api/recommend` | Asks the `@cf/openai/gpt-oss-120b` reasoning model (low effort, JSON schema output) for 8 ranked picks with a short reason in the selected language, verifies each against TMDB by title and year, and returns the top 5. Rate limited to 10 requests/min per IP |

## Local development

```bash
npm install
cp .dev.vars.example .dev.vars   # add your TMDB API read access token
npm run dev
```

The AI binding always calls Cloudflare, so you need to be logged in with `npx wrangler login`. If your login has several accounts, set `CLOUDFLARE_ACCOUNT_ID` in a `.env` file.

## Deploy

```bash
npx wrangler secret put TMDB_TOKEN   # first time only
npm run deploy
```
