import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { LANGUAGE } from "../utils/constants";
import GptMovieCard from "./GptMovieCard";

const GRID = "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5";

const GptMovies = ({ loading }) => {
  const { movies, query, lang } = useSelector((store) => store.gpt);
  const text = LANGUAGE[lang];
  const resultsRef = useRef(null);
  const previousMovies = useRef(movies);

  // Bring fresh results into view (they start below the fold on phones),
  // but not when returning to this screen with old results.
  useEffect(() => {
    if (movies && movies !== previousMovies.current) {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    previousMovies.current = movies;
  }, [movies]);

  if (loading) {
    return (
      <div className="mt-12" aria-busy="true">
        <p className="mb-6 flex items-center gap-3 text-white/70">
          <span className="size-2 animate-ping rounded-full bg-red-500" />
          {text.thinking}
        </p>
        <div className={GRID}>
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-2/3 rounded-lg bg-white/10" />
              <div className="mt-3 h-4 w-3/4 rounded bg-white/10" />
              <div className="mt-2 h-3 w-1/2 rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!movies) return null;

  return (
    <section ref={resultsRef} className="mt-12 scroll-mt-24 text-white">
      <h2 className="mb-6 text-xl font-semibold sm:text-2xl">
        {text.resultsFor(query)}
      </h2>
      {movies.length ? (
        <div className={GRID}>
          {movies.map((movie) => (
            <GptMovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <p className="text-white/70">{text.noResults}</p>
      )}
    </section>
  );
};

export default GptMovies;
