import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addGptMovieResult } from "../utils/gptSlice";

// The Worker asks a Workers AI reasoning model for picks (with a reason for each, in the
// selected language) and returns only the ones it could verify on TMDB.
const useGptSearch = () => {
  const dispatch = useDispatch();
  const lang = useSelector((store) => store.gpt.lang);
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
        body: JSON.stringify({ query, lang }),
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
