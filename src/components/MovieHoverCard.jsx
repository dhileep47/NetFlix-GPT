import { createPortal } from "react-dom";
import useMovieDetails from "../hooks/useMovieDetails";
import { IMG_CDN, PREVIEW_CDN } from "../utils/constants";

const formatRuntime = (minutes) => {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
};

// US rating (e.g. PG-13), falling back to the first country that has one.
const getCertification = (details) => {
  const countries = details?.release_dates?.results ?? [];
  const sorted = [...countries].sort(
    (a, b) => (b.iso_3166_1 === "US") - (a.iso_3166_1 === "US")
  );
  for (const country of sorted) {
    const rated = country.release_dates.find((release) => release.certification);
    if (rated) return rated.certification;
  }
  return null;
};

const formatVotes = (count) =>
  count >= 1000 ? `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k` : count;

const MovieHoverCard = ({ movie, position, onMouseEnter, onMouseLeave }) => {
  const details = useMovieDetails(movie.id);
  const { id, title, backdrop_path, poster_path, release_date, vote_average, vote_count, overview } =
    movie;

  const year = release_date?.slice(0, 4);
  const runtime = formatRuntime(details?.runtime);
  const certification = getCertification(details);
  const trailer = details?.videos?.results.find(
    (video) => video.site === "YouTube" && video.type === "Trailer"
  );
  const genres = details?.genres?.slice(0, 3).map((genre) => genre.name);
  const image = backdrop_path ? PREVIEW_CDN + backdrop_path : IMG_CDN + poster_path;

  return createPortal(
    <div
      style={{ top: position.top, left: position.left, width: position.width }}
      className="absolute z-40 -translate-y-1/2"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="animate-pop overflow-hidden rounded-lg bg-neutral-900 text-white shadow-2xl ring-1 shadow-black/80 ring-white/10">
        <div className="relative aspect-video bg-neutral-800">
          <img src={image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-neutral-900 via-neutral-900/10 to-transparent" />
          <h3 className="absolute inset-x-4 bottom-2 line-clamp-2 text-lg font-bold drop-shadow-lg">
            {title}
          </h3>
        </div>

        <div className="space-y-3 px-4 pt-2 pb-4">
          <div className="flex items-center gap-2">
            <a
              href={trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : undefined}
              target="_blank"
              rel="noreferrer"
              aria-label={`Play ${title} trailer`}
              aria-disabled={!trailer}
              className={`flex size-9 items-center justify-center rounded-full bg-white text-sm text-black transition-colors hover:bg-white/80 ${
                trailer ? "" : "pointer-events-none opacity-40"
              }`}
            >
              ▶
            </a>
            <a
              href={`https://www.themoviedb.org/movie/${id}`}
              target="_blank"
              rel="noreferrer"
              aria-label={`More info about ${title}`}
              className="flex size-9 items-center justify-center rounded-full border-2 border-white/50 text-sm transition-colors hover:border-white"
            >
              ⓘ
            </a>
            {vote_average > 0 && (
              <span className="ml-auto text-sm font-semibold">
                <span className="text-yellow-400">★</span> {vote_average.toFixed(1)}
                <span className="font-normal text-white/50"> ({formatVotes(vote_count)})</span>
              </span>
            )}
          </div>

          <div className="flex min-h-5 flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/70">
            {certification && (
              <span className="rounded-sm border border-white/40 px-1.5 text-xs leading-5">
                {certification}
              </span>
            )}
            {year && <span>{year}</span>}
            {runtime && <span>{runtime}</span>}
          </div>

          {details ? (
            genres?.length > 0 && (
              <p className="text-sm text-white/90">{genres.join(" • ")}</p>
            )
          ) : (
            <div className="h-5 w-2/3 animate-pulse rounded bg-white/10" />
          )}

          {overview && (
            <p className="line-clamp-3 text-sm leading-relaxed text-white/60">{overview}</p>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MovieHoverCard;
