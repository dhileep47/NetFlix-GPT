import { IMG_CDN } from "../utils/constants";

const GptMovieCard = ({ movie }) => {
  const { id, title, poster_path, release_date, vote_average, overview } = movie;
  const year = release_date?.slice(0, 4);

  return (
    <a
      href={`https://www.themoviedb.org/movie/${id}`}
      target="_blank"
      rel="noreferrer"
      className="group block focus:outline-none"
    >
      <div className="overflow-hidden rounded-lg bg-white/10 ring-red-600 transition group-hover:ring-2 group-focus-visible:ring-2">
        <img
          src={IMG_CDN + poster_path}
          alt={title}
          loading="lazy"
          className="aspect-2/3 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <h3 className="mt-3 line-clamp-1 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-white/60">
        {year}
        {vote_average > 0 && (
          <>
            {year && " · "}
            <span className="text-yellow-400">★</span> {vote_average.toFixed(1)}
          </>
        )}
      </p>
      <p className="mt-2 hidden text-sm leading-relaxed text-white/60 sm:line-clamp-3">
        {overview}
      </p>
    </a>
  );
};

export default GptMovieCard;
