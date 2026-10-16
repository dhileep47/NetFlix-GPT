import { LOGIN_BG } from "../utils/constants";
import GptMovies from "./GptMovies";
import GptSearchBar from "./GptSearchBar";

const GptSearch = () => {
  return (
    <>
      <div className="fixed -z-10">
        <img
          className="inset-0 h-screen w-screen object-cover"
          src={LOGIN_BG}
          alt=""
        />
      </div>
      <div>
        <GptSearchBar />
        <GptMovies />
      </div>
    </>
  );
};

export default GptSearch;
