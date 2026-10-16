import { createSlice } from "@reduxjs/toolkit";

const gptSlice = createSlice({
  name: "gpt",
  initialState: {
    lang: "en",
    showGptSearch: false,
    query: null,
    movies: null,
  },
  reducers: {
    toggleGptSearchView: (state) => {
      state.showGptSearch = !state.showGptSearch;
    },
    changeLanguage: (state, action) => {
      state.lang = action.payload;
    },
    addGptMovieResult: (state, action) => {
      const { query, movies } = action.payload;
      state.query = query;
      state.movies = movies;
    },
  },
});

export const { toggleGptSearchView, changeLanguage, addGptMovieResult } =
  gptSlice.actions;

export default gptSlice.reducer;
