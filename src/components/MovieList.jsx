import MovieCard from "./MovieCard";

const MovieList = ({ title, movies }) => {
  const withPosters = movies?.filter((movie) => movie.poster_path) ?? [];
  if (!withPosters.length) return null;

  return (
    <section className="text-white">
      <h2 className="mb-2 px-4 text-lg font-semibold sm:mb-3 sm:px-8 sm:text-xl lg:px-12 lg:text-2xl">
        {title}
      </h2>
      <div className="hide-scrollbar flex snap-x snap-mandatory scroll-px-4 gap-2 overflow-x-auto px-4 py-2 sm:scroll-px-8 sm:gap-3 sm:px-8 lg:scroll-px-12 lg:px-12">
        {withPosters.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            posterPath={movie.poster_path}
            title={movie.title}
          />
        ))}
      </div>
    </section>
  );
};

export default MovieList;
