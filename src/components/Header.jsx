import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../utils/firebase";
import { addUser, removeUser } from "../utils/userSlice";
import { LOGO, SUPPORTED_LANGUAGES } from "../utils/constants";
import { changeLanguage, toggleGptSearchView } from "../utils/gptSlice";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const { showGptSearch, lang } = useSelector((store) => store.gpt);

  const handleSignOut = () => {
    signOut(auth).catch((error) => console.error(error));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName } = user;
        dispatch(addUser({ uid, email, displayName }));
        navigate("/browse");
      } else {
        dispatch(removeUser());
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [dispatch, navigate]);

  return (
    <div className="absolute px-8 py-2 bg-linear-to-b from-black z-10 w-full flex justify-between items-center flex-col md:flex-row">
      <img src={LOGO} alt="Netflix" className="w-44" />
      {user && (
        <div className="flex justify-between flex-row-reverse md:flex-row md:justify-end w-full text-white gap-4">
          {showGptSearch && (
            <select
              className="py-2 px-4 bg-gray-900 text-white rounded-lg"
              value={lang}
              onChange={(e) => dispatch(changeLanguage(e.target.value))}
            >
              {SUPPORTED_LANGUAGES.map((language) => (
                <option key={language.id} value={language.id}>
                  {language.name}
                </option>
              ))}
            </select>
          )}
          <button
            className="py-2 px-4 bg-purple-800 text-white rounded-lg"
            onClick={() => dispatch(toggleGptSearchView())}
          >
            {!showGptSearch ? "GPT Search" : "Home"}
          </button>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      )}
    </div>
  );
};

export default Header;
