import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../utils/firebase";
import { LOGO, SUPPORTED_LANGUAGES } from "../utils/constants";
import { changeLanguage, toggleGptSearchView } from "../utils/gptSlice";

const Header = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const user = useSelector((store) => store.user);
  const { showGptSearch, lang } = useSelector((store) => store.gpt);
  const [scrolled, setScrolled] = useState(false);
  const onLoginPage = pathname === "/login";

  const handleSignOut = () => {
    signOut(auth).catch((error) => console.error(error));
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const initial = (user?.displayName || user?.email || "?")[0].toUpperCase();

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 transition-colors duration-300 ${
        scrolled ? "bg-black/95" : "bg-linear-to-b from-black/90 to-transparent"
      }`}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-8 lg:px-12">
        <Link to="/" className="shrink-0">
          <img src={LOGO} alt="Netflix" className="w-24 sm:w-32 lg:w-40" />
        </Link>
        {!onLoginPage && (
          <nav className="flex items-center gap-2 text-sm text-white sm:gap-3 sm:text-base">
            {showGptSearch && (
              <select
                aria-label="Language"
                className="rounded-md border border-white/20 bg-black/70 px-2 py-1.5 sm:px-3 sm:py-2"
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
              className="rounded-md bg-purple-700 px-3 py-1.5 font-medium whitespace-nowrap transition-colors hover:bg-purple-600 sm:px-4 sm:py-2"
              onClick={() => {
                dispatch(toggleGptSearchView());
                window.scrollTo({ top: 0 });
              }}
            >
              {showGptSearch ? (
                "Home"
              ) : (
                <>
                  <span aria-hidden="true">✨ </span>Ask AI
                </>
              )}
            </button>
            {user ? (
              <button
                onClick={handleSignOut}
                title="Sign out"
                className="flex items-center gap-2 rounded-md px-1 py-1 transition-colors hover:bg-white/10 sm:px-2"
              >
                <span
                  aria-hidden="true"
                  className="flex size-8 items-center justify-center rounded bg-red-600 font-semibold"
                >
                  {initial}
                </span>
                <span className="hidden md:inline">Sign out</span>
                <span className="sr-only md:hidden">Sign out</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="rounded-md bg-red-600 px-3 py-1.5 font-medium whitespace-nowrap transition-colors hover:bg-red-700 sm:px-4 sm:py-2"
              >
                Sign In
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
