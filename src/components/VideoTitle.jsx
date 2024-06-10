const VideoTitle = ({ title, overview }) => {
  return (
    <div className="absolute pt-[20%] px-6 md:px-24 text-white bg-gradient-to-r from-black aspect-video">
      <h1 className="text-2xl font-semibold md:text-6xl md:font-bold">
        {title}
      </h1>
      <p className="hidden md:block py-6 text-lg w-1/3">{overview}</p>
      <div className="flex gap-2">
        <button className=" mt-4 md:m-0 px-8 p-2 md:px-16 md:p-4 bg-white text-black text-lg font-semibold hover:bg-opacity-50 rounded-lg">
          Play
        </button>
        <button className="hidden md:block px-16 p-4 bg-gray-500 text-white text-lg bg-opacity-50 rounded-lg">
          More Info
        </button>
      </div>
    </div>
  );
};

export default VideoTitle;
