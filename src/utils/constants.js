export const LOGO =
  "https://cdn.cookielaw.org/logos/dd6b162f-1a32-456a-9cfe-897231c7763c/4345ea78-053c-46d2-b11e-09adaef973dc/Netflix_Logo_PMS.png";

export const LOGIN_BG =
  "https://i.pinimg.com/1200x/19/8b/2f/198b2f01e73b905772279616eccc7c65.jpg";

export const IMG_CDN = "https://image.tmdb.org/t/p/w500";

// Rows shown on the browse page, in order. `path` is a TMDB endpoint served via /api/tmdb.
export const MOVIE_LISTS = [
  { key: "nowPlaying", title: "Now Playing", path: "movie/now_playing" },
  { key: "trending", title: "Trending", path: "trending/movie/day" },
  { key: "popular", title: "Popular", path: "movie/popular" },
  { key: "upcoming", title: "Upcoming", path: "movie/upcoming" },
  {
    key: "horror",
    title: "Horror",
    path: "discover/movie?with_genres=27&sort_by=popularity.desc",
  },
];

export const LANGUAGE = {
  en: {
    placeholder: "What would you like to watch today?",
    search: "Search",
    searching: "Searching…",
  },
  hi: {
    placeholder: "आज आप क्या देखना चाहेंगे?",
    search: "खोज",
    searching: "खोज रहे हैं…",
  },
  es: {
    placeholder: "¿Qué te gustaría ver hoy?",
    search: "Buscar",
    searching: "Buscando…",
  },
};

export const SUPPORTED_LANGUAGES = [
  { id: "en", name: "English" },
  { id: "hi", name: "Hindi" },
  { id: "es", name: "Spanish" },
];
