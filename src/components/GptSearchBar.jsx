import { useRef } from "react";
import { useSelector } from "react-redux";
import { LANGUAGE } from "../utils/constants";

const GptSearchBar = ({ onSearch, loading, error }) => {
  const lang = useSelector((store) => store.gpt.lang);
  const text = LANGUAGE[lang];
  const searchText = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchText.current.value);
  };

  const handleExample = (example) => {
    searchText.current.value = example;
    onSearch(example);
  };

  return (
    <div className="mx-auto max-w-3xl text-center text-white">
      <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
        {text.heading}
      </h1>
      <p className="mt-3 text-base text-white/70 sm:text-lg">{text.subheading}</p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-0 sm:rounded-lg sm:bg-white sm:p-1.5"
      >
        <label htmlFor="gpt-search" className="sr-only">
          {text.placeholder}
        </label>
        <input
          id="gpt-search"
          ref={searchText}
          className="min-w-0 flex-1 rounded-lg bg-white px-4 py-3.5 text-base text-black placeholder:text-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 sm:rounded-md sm:py-3 sm:text-lg sm:focus-visible:ring-0"
          type="text"
          maxLength={200}
          placeholder={text.placeholder}
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-red-600 px-6 py-3.5 text-lg font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60 sm:rounded-md sm:py-3"
        >
          {loading ? text.searching : text.search}
        </button>
      </form>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {text.examples.map((example) => (
          <button
            key={example}
            type="button"
            disabled={loading}
            onClick={() => handleExample(example)}
            className="rounded-full border border-white/25 bg-white/5 px-3.5 py-1.5 text-sm text-white/80 transition-colors hover:border-white/60 hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            {example}
          </button>
        ))}
      </div>

      {error && (
        <p
          role="alert"
          className="mx-auto mt-6 max-w-xl rounded-lg border border-red-500/40 bg-red-950/60 px-4 py-3 text-red-200"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default GptSearchBar;
