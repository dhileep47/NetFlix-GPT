import MovieCard from "./MovieCard";

const MovieList = ({ title, movies }) => {
  const withPosters = movies?.filter((movie) => movie.poster_path) ?? [];

  return (
    <div className="px-6 text-white">
      <h1 className="text-3xl font-semibold py-4">{title}</h1>
      <div className="flex overflow-x-scroll hide-scrollbar">
        <div className="flex">
          {withPosters.map((movie) => (
            <MovieCard
              key={movie.id}
              posterPath={movie.poster_path}
              title={movie.title}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieList;
