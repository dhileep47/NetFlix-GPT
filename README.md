# NetflixGPT

Netflix-inspired movie browser with AI-powered recommendations.

**Live:** https://netflix-gpt.ananddhileep.workers.dev

- Firebase email/password authentication
- Movie rows (Now Playing, Trending, Popular, Upcoming, Horror) and a trailer hero from TMDB
- "GPT Search": describe what you want to watch in English, Hindi or Spanish and get 5 picks from Workers AI

## Stack

React 19 · React Router · Redux Toolkit · Tailwind CSS 4 · Vite · Firebase Auth · Cloudflare Workers + Workers AI

## How it works

The app is a single Cloudflare Worker. Static assets serve the React app (with SPA fallback for client routes), and `worker/index.js` handles `/api/*`:

| Route | Purpose |
| --- | --- |
| `GET /api/tmdb/*` | Proxies an allowlisted set of TMDB endpoints so the token stays server-side; responses are edge-cached for an hour |
| `POST /api/recommend` | Asks Workers AI (`@cf/meta/llama-3.3-70b-instruct-fp8-fast`, JSON output) for 5 titles and looks each up on TMDB. Rate limited to 10 requests/min per IP |

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
