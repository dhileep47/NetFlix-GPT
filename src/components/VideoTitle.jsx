import { useSelector } from "react-redux";

const VideoTitle = ({ movieId, title, overview }) => {
  const trailerKey = useSelector((store) => store.movies.trailerVideo?.key);

  return (
    <div className="absolute inset-0 flex items-end bg-linear-to-t from-black via-black/30 to-black/40 pb-24 sm:items-center sm:bg-linear-to-r sm:from-black/90 sm:via-black/40 sm:to-transparent sm:pb-0 lg:pb-16">
      <div className="w-full px-4 text-white sm:w-3/5 sm:px-8 lg:w-1/2 lg:px-12">
        <h1 className="text-3xl font-bold drop-shadow-lg sm:text-4xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-4 hidden text-base text-white/85 drop-shadow sm:line-clamp-3 lg:text-lg">
          {overview}
        </p>
        <div className="mt-5 flex gap-3">
          <a
            href={trailerKey ? `https://www.youtube.com/watch?v=${trailerKey}` : undefined}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-md bg-white px-5 py-2 text-base font-semibold text-black transition-colors hover:bg-white/75 sm:px-8 sm:py-3 sm:text-lg"
          >
            <span aria-hidden="true">▶</span> Play
          </a>
          <a
            href={`https://www.themoviedb.org/movie/${movieId}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-md bg-neutral-500/60 px-5 py-2 text-base font-semibold text-white transition-colors hover:bg-neutral-500/40 sm:px-8 sm:py-3 sm:text-lg"
          >
            <span aria-hidden="true">ⓘ</span> More Info
          </a>
        </div>
      </div>
    </div>
  );
};

export default VideoTitle;
