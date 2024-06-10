import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS, LANGUAGE } from "../utils/constants";
import { addGptMovieResult } from "../utils/gptSlice";

const GptSearchBar = () => {
  const lang = useSelector((store) => store.gpt.lang);
  const dispatch = useDispatch();
  const searchText = useRef(null);

  const getMovieSearch = async (movie) => {
    const data = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
        movie
      )}&include_adult=false&language=en-US&page=1`,
      API_OPTIONS
    );
    const json = await data.json();
    return json.results;
  };

  const handleGptSearch = async () => {
    const api_key = import.meta.env.VITE_GPT_API_KEY;
    const api_base_url = import.meta.env.VITE_GPT_API_BASE_URL;
    try {
      const gptQuery =
        "Act as a movie recommendation system and suggest some movies for the query " +
        searchText.current.value +
        ". Strictly give me names of 5 movies, comma separated like the example result given ahead with no other additional text or serial number in front of the movie name. Example Result: Movie1, Movie2, Movie3, Movie4, Movie5 don't add any serial numbers in front.";

      const response = await fetch(`${api_base_url}/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${api_key}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: gptQuery,
            },
          ],
          temperature: 0.7,
          max_tokens: 256,
          stop: ["System:", "User:"],
        }),
      });
      const result = await response.json();
      const gptMovies = result.choices[0].message.content
        .split(",")
        .map((movie) => movie.trim());
      const promiseArray = gptMovies.map((movie) => getMovieSearch(movie));
      const tmdbResults = await Promise.all(promiseArray);
      dispatch(
        addGptMovieResult({ movieNames: gptMovies, movieResults: tmdbResults })
      );
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
    }
  };

  return (
    <div className="pt-[30%] md:pt-[10%] flex justify-center items-center">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="md:w-1/2 bg-black grid grid-cols-12"
      >
        <input
          ref={searchText}
          className="p-4 m-4 col-span-9"
          type="text"
          placeholder={LANGUAGE[lang].placeholder}
        />
        <button
          className="col-span-3 m-4 py-2 px-4 bg-red-700 text-white rounded-lg"
          onClick={handleGptSearch}
        >
          {LANGUAGE[lang].search}
        </button>
      </form>
    </div>
  );
};

export default GptSearchBar;
