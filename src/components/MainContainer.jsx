import { useSelector } from "react-redux";
import VideoTitle from "./VideoTitle";
import VideoBackgorund from "./VideoBackgorund";

const MainContainer = () => {
  const movies = useSelector((store) => store.movies?.nowPlayingMovies);
  if (!movies) return;

  const mainMovie = movies[0];
  const { original_title, overview, id } = mainMovie;

  return (
    <div className="pt-[30%] bg-black md:p-0">
      <VideoTitle title={original_title} overview={overview} />
      <VideoBackgorund movieId={id} />
    </div>
  );
};

export default MainContainer;
