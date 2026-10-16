import { IMG_CDN } from "../utils/constants";

const MovieCard = ({ posterPath, title }) => {
  return (
    <div className="w-36 md:w-48 pr-4">
      <img src={IMG_CDN + posterPath} alt={title} loading="lazy" />
    </div>
  );
};

export default MovieCard;
