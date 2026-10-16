import { useEffect } from "react";
import { useDispatch, useStore } from "react-redux";
import { addTrailerVideo } from "../utils/movieSlice";
import tmdb from "../utils/tmdb";

const useMovieTrailer = (movieId) => {
  const dispatch = useDispatch();
  const store = useStore();

  useEffect(() => {
    if (!movieId || store.getState().movies.trailerVideo) return;

    tmdb(`movie/${movieId}/videos`)
      .then(({ results }) => {
        const trailer =
          results.find((video) => video.type === "Trailer") ?? results[0];
        if (trailer) dispatch(addTrailerVideo(trailer));
      })
      .catch((error) => console.error(error));
  }, [movieId, dispatch, store]);
};

export default useMovieTrailer;
