import useGptSearch from "../hooks/useGptSearch";
import { LOGIN_BG } from "../utils/constants";
import GptMovies from "./GptMovies";
import GptSearchBar from "./GptSearchBar";

const GptSearch = () => {
  const { search, loading, error } = useGptSearch();

  return (
    <div className="relative min-h-dvh">
      <div className="fixed inset-0 -z-10">
        <img className="h-full w-full object-cover" src={LOGIN_BG} alt="" />
        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/85 to-black" />
      </div>
      <div className="mx-auto max-w-6xl px-4 pt-28 pb-16 sm:px-8 sm:pt-36">
        <GptSearchBar onSearch={search} loading={loading} error={error} />
        <GptMovies loading={loading} />
      </div>
    </div>
  );
};

export default GptSearch;
