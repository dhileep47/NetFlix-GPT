export const LOGO =
  "https://cdn.cookielaw.org/logos/dd6b162f-1a32-456a-9cfe-897231c7763c/4345ea78-053c-46d2-b11e-09adaef973dc/Netflix_Logo_PMS.png";

export const LOGIN_BG ="https://i.pinimg.com/1200x/19/8b/2f/198b2f01e73b905772279616eccc7c65.jpg"
export const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
  },
};

export const IMG_CDN = "https://image.tmdb.org/t/p/w500";

export const LANGUAGE = {
  en: {
    placeholder: "What would you like to watch today?",
    search: "Search",
  },
  hi: {
    placeholder: "आज आप क्या देखना चाहेंगे?",
    search: "खोज",
  },
  es: {
    placeholder: "¿Qué te gustaría ver hoy?",
    search: "Buscar",
  },
};
export const SUPPORTED_LANGUAGES = [
  { id: "en", name: "English" },
  { id: "hi", name: "Hindi" },
  { id: "es", name: "Spanish" },
];

export const GPT_KEY = "pk-SlknSHmlAExIQmTwHzPRxsyKzfiJUVDkLdLueJxYCqdblJha";
