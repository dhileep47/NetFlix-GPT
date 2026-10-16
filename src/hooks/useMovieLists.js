import { useEffect } from "react";
import { useDispatch, useStore } from "react-redux";
import { MOVIE_LISTS } from "../utils/constants";
import { addMovieList } from "../utils/movieSlice";
import tmdb from "../utils/tmdb";

// Fetches every browse row once; lists already in the store are skipped.
const useMovieLists = () => {
  const dispatch = useDispatch();
  const store = useStore();

  useEffect(() => {
    const { lists } = store.getState().movies;
    MOVIE_LISTS.filter(({ key }) => !lists[key]).forEach(({ key, path }) => {
      tmdb(path)
        .then((json) => dispatch(addMovieList({ key, movies: json.results })))
        .catch((error) => console.error(error));
    });
  }, [dispatch, store]);
};

export default useMovieLists;
