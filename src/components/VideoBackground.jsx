import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useMovieTrailer from "../hooks/useMovieTrailer";
import { BACKDROP_CDN } from "../utils/constants";

let youTubeApi;
const loadYouTubeApi = () => {
  youTubeApi ??= new Promise((resolve) => {
    if (window.YT?.Player) return resolve(window.YT);
    window.onYouTubeIframeAPIReady = () => resolve(window.YT);
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  });
  return youTubeApi;
};

const VideoBackground = ({ movieId, backdropPath }) => {
  useMovieTrailer(movieId);
  const trailerKey = useSelector((store) => store.movies.trailerVideo?.key);
  const containerRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!trailerKey) return;
    let player;
    let cancelled = false;

    loadYouTubeApi().then((YT) => {
      if (cancelled) return;
      // YT.Player replaces its target element, so give it one React doesn't own.
      const target = document.createElement("div");
      containerRef.current.replaceChildren(target);
      player = new YT.Player(target, {
        videoId: trailerKey,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          disablekb: 1,
          loop: 1,
          playlist: trailerKey,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: (e) => {
            e.target.mute();
            e.target.playVideo();
          },
          // Only reveal the video once it is actually playing; trailers that
          // can't be embedded never get here and the backdrop stays visible.
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING) setPlaying(true);
          },
          onError: () => setPlaying(false),
        },
      });
    });

    return () => {
      cancelled = true;
      player?.destroy();
      setPlaying(false);
    };
  }, [trailerKey]);

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {backdropPath && (
        <img
          src={BACKDROP_CDN + backdropPath}
          alt=""
          className="h-full w-full object-cover"
        />
      )}
      {/* Sized to cover the hero: full height on tall mobile screens, full width from sm up.
          The slight scale hides YouTube's title bar and edges. */}
      <div
        ref={containerRef}
        className={`pointer-events-none absolute top-1/2 left-1/2 aspect-video h-full -translate-x-1/2 -translate-y-1/2 scale-125 transition-opacity duration-1000 sm:h-auto sm:w-full ${
          playing ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

export default VideoBackground;
