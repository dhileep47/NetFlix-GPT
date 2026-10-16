import { useSelector } from "react-redux";
import VideoTitle from "./VideoTitle";
import VideoBackground from "./VideoBackground";

const MainContainer = () => {
  const movies = useSelector((store) => store.movies.lists.nowPlaying);
  if (!movies?.length) return null;

  const { original_title, overview, id } = movies[0];

  return (
    <div className="pt-[30%] bg-black md:p-0">
      <VideoTitle title={original_title} overview={overview} />
      <VideoBackground movieId={id} />
    </div>
  );
};

export default MainContainer;
