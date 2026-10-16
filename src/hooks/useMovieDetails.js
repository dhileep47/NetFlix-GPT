import { useEffect, useState } from "react";
import tmdb from "../utils/tmdb";

// One request per movie per session: runtime, genres, certification and trailer.
const cache = new Map();

export const loadMovieDetails = (id) => {
  if (!cache.has(id)) {
    const request = tmdb(
      `movie/${id}?append_to_response=release_dates,videos`
    ).catch((error) => {
      cache.delete(id);
      throw error;
    });
    cache.set(id, request);
  }
  return cache.get(id);
};

const useMovieDetails = (id) => {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    let cancelled = false;
    loadMovieDetails(id)
      .then((data) => !cancelled && setDetails(data))
      .catch((error) => {
        console.error(error);
        // Settle with no extras so the preview stops showing a loading state.
        if (!cancelled) setDetails({});
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return details;
};

export default useMovieDetails;
