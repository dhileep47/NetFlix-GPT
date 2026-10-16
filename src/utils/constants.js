export const LOGO =
  "https://cdn.cookielaw.org/logos/dd6b162f-1a32-456a-9cfe-897231c7763c/4345ea78-053c-46d2-b11e-09adaef973dc/Netflix_Logo_PMS.png";

export const LOGIN_BG =
  "https://i.pinimg.com/1200x/19/8b/2f/198b2f01e73b905772279616eccc7c65.jpg";

export const IMG_CDN = "https://image.tmdb.org/t/p/w342";
export const BACKDROP_CDN = "https://image.tmdb.org/t/p/w1280";
export const PREVIEW_CDN = "https://image.tmdb.org/t/p/w780";

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
    heading: "Find your next favorite movie",
    subheading: "Describe your mood and AI will pick 5 movies for you.",
    placeholder: "What would you like to watch today?",
    search: "Search",
    searching: "Searching…",
    thinking: "AI is thinking through your request…",
    examples: [
      "Mind-bending sci-fi with time loops",
      "Feel-good movies for a rainy day",
      "Slow-burn Korean thrillers",
      "90s action classics",
    ],
    resultsFor: (query) => `Picks for “${query}”`,
    noResults: "We couldn't find those movies. Try another search.",
  },
  hi: {
    heading: "अपनी अगली पसंदीदा फ़िल्म खोजें",
    subheading: "अपना मूड बताइए, AI आपके लिए 5 फ़िल्में चुनेगा।",
    placeholder: "आज आप क्या देखना चाहेंगे?",
    search: "खोज",
    searching: "खोज रहे हैं…",
    thinking: "AI आपके अनुरोध पर सोच रहा है…",
    examples: [
      "दिल छू लेने वाली पारिवारिक फ़िल्में",
      "दिमाग घुमा देने वाली साइंस-फ़िक्शन",
      "90 के दशक की एक्शन फ़िल्में",
      "हल्की-फुल्की कॉमेडी",
    ],
    resultsFor: (query) => `“${query}” के लिए सुझाव`,
    noResults: "कोई फ़िल्म नहीं मिली। कुछ और खोजकर देखें।",
  },
  es: {
    heading: "Encuentra tu próxima película favorita",
    subheading: "Describe lo que te apetece y la IA elegirá 5 películas para ti.",
    placeholder: "¿Qué te gustaría ver hoy?",
    search: "Buscar",
    searching: "Buscando…",
    thinking: "La IA está analizando tu petición…",
    examples: [
      "Comedias románticas de los 2000",
      "Thrillers coreanos intensos",
      "Ciencia ficción que te vuela la cabeza",
      "Películas animadas para toda la familia",
    ],
    resultsFor: (query) => `Recomendaciones para “${query}”`,
    noResults: "No encontramos esas películas. Prueba con otra búsqueda.",
  },
};

export const SUPPORTED_LANGUAGES = [
  { id: "en", name: "English" },
  { id: "hi", name: "Hindi" },
  { id: "es", name: "Spanish" },
];
