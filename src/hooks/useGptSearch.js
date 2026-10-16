import { useState } from "react";
import { useDispatch } from "react-redux";
import { addGptMovieResult } from "../utils/gptSlice";

// The Worker asks Workers AI for titles and returns the best TMDB match for each.
const useGptSearch = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = async (rawQuery) => {
    const query = rawQuery.trim();
    if (!query || loading) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      dispatch(addGptMovieResult({ query, movies: data.movies }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { search, loading, error };
};

export default useGptSearch;
