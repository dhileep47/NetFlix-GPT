import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LANGUAGE } from "../utils/constants";
import { addGptMovieResult } from "../utils/gptSlice";

const GptSearchBar = () => {
  const lang = useSelector((store) => store.gpt.lang);
  const dispatch = useDispatch();
  const searchText = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGptSearch = async (e) => {
    e.preventDefault();
    const query = searchText.current.value.trim();
    if (!query || loading) return;

    setLoading(true);
    setError("");
    try {
      // The Worker asks Workers AI for titles and looks each one up on TMDB.
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");

      dispatch(
        addGptMovieResult({
          movieNames: data.movies.map((movie) => movie.title),
          movieResults: data.movies.map((movie) => movie.results),
        })
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-[30%] md:pt-[10%] flex flex-col justify-center items-center">
      <form
        onSubmit={handleGptSearch}
        className="w-[90%] md:w-1/2 bg-black grid grid-cols-12"
      >
        <input
          ref={searchText}
          className="p-4 m-4 col-span-9 bg-white text-black"
          type="text"
          maxLength={200}
          placeholder={LANGUAGE[lang].placeholder}
        />
        <button
          type="submit"
          disabled={loading}
          className="col-span-3 m-4 py-2 px-4 bg-red-700 text-white rounded-lg disabled:opacity-60"
        >
          {loading ? LANGUAGE[lang].searching : LANGUAGE[lang].search}
        </button>
      </form>
      {error && (
        <p className="w-[90%] md:w-1/2 mt-2 p-3 bg-black/80 text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default GptSearchBar;
