import { useEffect, useRef, useState } from "react";
import { loadMovieDetails } from "../hooks/useMovieDetails";
import { IMG_CDN } from "../utils/constants";
import MovieHoverCard from "./MovieHoverCard";

const OPEN_DELAY = 450;
const CLOSE_DELAY = 120;
const EDGE_GAP = 16;

// Touch screens tap straight through to the TMDB page instead.
const canHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const MovieCard = ({ movie }) => {
  const { id, title, poster_path } = movie;
  const cardRef = useRef(null);
  const openTimer = useRef(null);
  const closeTimer = useRef(null);
  const [position, setPosition] = useState(null);

  const open = () => {
    const rect = cardRef.current.getBoundingClientRect();
    const width = Math.min(Math.max(rect.width * 2, 300), 360);
    const left = Math.min(
      Math.max(rect.left + rect.width / 2 - width / 2, EDGE_GAP),
      window.innerWidth - width - EDGE_GAP
    );
    setPosition({
      top: rect.top + window.scrollY + rect.height / 2,
      left: left + window.scrollX,
      width,
    });
  };

  const handleMouseEnter = () => {
    if (!canHover()) return;
    clearTimeout(closeTimer.current);
    loadMovieDetails(id).catch(() => {});
    openTimer.current = setTimeout(open, OPEN_DELAY);
  };

  const handleMouseLeave = () => {
    clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => setPosition(null), CLOSE_DELAY);
  };

  const keepOpen = () => clearTimeout(closeTimer.current);

  // The preview is positioned once, so dismiss it when anything scrolls or resizes.
  useEffect(() => {
    if (!position) return;
    const dismiss = () => setPosition(null);
    window.addEventListener("scroll", dismiss, { capture: true, passive: true });
    window.addEventListener("resize", dismiss);
    return () => {
      window.removeEventListener("scroll", dismiss, { capture: true });
      window.removeEventListener("resize", dismiss);
    };
  }, [position]);

  useEffect(
    () => () => {
      clearTimeout(openTimer.current);
      clearTimeout(closeTimer.current);
    },
    []
  );

  return (
    <>
      <a
        ref={cardRef}
        href={`https://www.themoviedb.org/movie/${id}`}
        target="_blank"
        rel="noreferrer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="w-26 shrink-0 snap-start overflow-hidden rounded-md bg-white/10 ring-white transition duration-200 hover:scale-105 hover:ring-2 focus-visible:ring-2 focus-visible:outline-none sm:w-36 lg:w-44"
      >
        <img
          src={IMG_CDN + poster_path}
          alt={title}
          loading="lazy"
          className="aspect-2/3 w-full object-cover"
        />
      </a>
      {position && (
        <MovieHoverCard
          movie={movie}
          position={position}
          onMouseEnter={keepOpen}
          onMouseLeave={handleMouseLeave}
        />
      )}
    </>
  );
};

export default MovieCard;
