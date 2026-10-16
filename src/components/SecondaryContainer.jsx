import { useSelector } from "react-redux";
import { MOVIE_LISTS } from "../utils/constants";
import MovieList from "./MovieList";

const SecondaryContainer = () => {
  const lists = useSelector((store) => store.movies.lists);
  if (!lists.nowPlaying) return null;

  return (
    <div className="bg-black">
      <div className="mt-0 md:-mt-52 md:pl-12 pl-2 relative z-10">
        {MOVIE_LISTS.map(({ key, title }) => (
          <MovieList key={key} title={title} movies={lists[key]} />
        ))}
      </div>
    </div>
  );
};

export default SecondaryContainer;
