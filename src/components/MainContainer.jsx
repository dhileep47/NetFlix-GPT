import { useSelector } from "react-redux";
import VideoTitle from "./VideoTitle";
import VideoBackground from "./VideoBackground";

const MainContainer = () => {
  const movies = useSelector((store) => store.movies.lists.nowPlaying);
  if (!movies?.length) {
    return <div className="aspect-4/5 max-h-dvh w-full bg-black sm:aspect-video" />;
  }

  const { title, overview, id, backdrop_path } = movies[0];

  return (
    <section className="relative aspect-4/5 max-h-dvh w-full overflow-hidden bg-black sm:aspect-video">
      <VideoBackground movieId={id} backdropPath={backdrop_path} />
      <VideoTitle movieId={id} title={title} overview={overview} />
    </section>
  );
};

export default MainContainer;
