import { createSlice } from "@reduxjs/toolkit";

const movieSlice = createSlice({
  name: "movies",
  initialState: {
    lists: {},
    trailerVideo: null,
  },
  reducers: {
    addMovieList: (state, action) => {
      const { key, movies } = action.payload;
      state.lists[key] = movies;
    },
    addTrailerVideo: (state, action) => {
      state.trailerVideo = action.payload;
    },
  },
});

export const { addMovieList, addTrailerVideo } = movieSlice.actions;

export default movieSlice.reducer;
