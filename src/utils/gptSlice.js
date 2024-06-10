import { createSlice } from "@reduxjs/toolkit";

const gptSlice = createSlice({
  name: "gpt",
  initialState: {
    lang: "en",
    showGptSearch: false,
    movieNames: false,
    movieResults: false,
  },
  reducers: {
    toogleGptSearchView: (state) => {
      state.showGptSearch = !state.showGptSearch;
    },
    changeLanguage: (state, action) => {
      state.lang = action.payload;
    },
    addGptMovieResult: (state, action) => {
      const { movieNames, movieResults } = action.payload;
      state.movieNames = movieNames;
      state.movieResults = movieResults;
    },
  },
});

export const { toogleGptSearchView, changeLanguage, addGptMovieResult } =
  gptSlice.actions;

export default gptSlice.reducer;
