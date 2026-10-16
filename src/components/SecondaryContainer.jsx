import { useSelector } from "react-redux";
import { MOVIE_LISTS } from "../utils/constants";
import MovieList from "./MovieList";

const SecondaryContainer = () => {
  const lists = useSelector((store) => store.movies.lists);
  if (!lists.nowPlaying) return null;

  return (
    <div className="relative z-10 -mt-16 space-y-6 bg-linear-to-b from-transparent to-black to-[6rem] pb-12 sm:-mt-24 sm:space-y-8 lg:-mt-40">
      {MOVIE_LISTS.map(({ key, title }) => (
        <MovieList key={key} title={title} movies={lists[key]} />
      ))}
    </div>
  );
};

export default SecondaryContainer;
