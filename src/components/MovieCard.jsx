import { IMG_CDN } from "../utils/constants";

const MovieCard = ({ id, posterPath, title }) => {
  return (
    <a
      href={`https://www.themoviedb.org/movie/${id}`}
      target="_blank"
      rel="noreferrer"
      title={title}
      className="w-26 shrink-0 snap-start overflow-hidden rounded-md bg-white/10 ring-white transition duration-200 hover:scale-105 hover:ring-2 focus-visible:ring-2 focus-visible:outline-none sm:w-36 lg:w-44"
    >
      <img
        src={IMG_CDN + posterPath}
        alt={title}
        loading="lazy"
        className="aspect-2/3 w-full object-cover"
      />
    </a>
  );
};

export default MovieCard;
