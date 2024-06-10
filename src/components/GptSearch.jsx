import { LOGIN_BG } from "../utils/constants";
import GptMovies from "./GptMovies";
import GptSearchBar from "./GptSearchBar";

const GptSearch = () => {
  return (
    <>
      <div className="fixed -z-10">
        <img
          className="inset-0 h-screen md:h-full w-full object-cover"
          src={LOGIN_BG}
          alt="logo"
        />
      </div>
      <div className="">
        <GptSearchBar />
        <GptMovies />
      </div>
    </>
  );
};

export default GptSearch;
