import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import Header from "./Header";
import { checkFormData } from "../utils/validate";
import { auth } from "../utils/firebase";
import { addUser } from "../utils/userSlice";
import { LOGIN_BG } from "../utils/constants";

const AUTH_ERRORS = {
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
  "auth/network-request-failed": "Network error. Check your connection.",
};

const Login = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const [isSignUp, setIsSignUp] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  const name = useRef(null);
  const email = useRef(null);
  const password = useRef(null);

  const handleButtonClick = async () => {
    const message = checkFormData(
      name.current?.value || "",
      email.current.value,
      password.current.value,
      isSignUp
    );
    setErrMessage(message);
    if (message) return;

    try {
      if (isSignUp) {
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email.current.value,
          password.current.value
        );
        await updateProfile(user, { displayName: name.current.value });
        const { uid, email: userEmail, displayName } = auth.currentUser;
        dispatch(addUser({ uid, email: userEmail, displayName }));
      } else {
        await signInWithEmailAndPassword(
          auth,
          email.current.value,
          password.current.value
        );
      }
    } catch (error) {
      setErrMessage(AUTH_ERRORS[error.code] ?? error.message);
    }
  };

  // Signed in (or just signed in): back to browsing.
  if (user) return <Navigate to="/" replace />;

  const inputClass =
    "w-full rounded-md border border-white/20 bg-neutral-800/80 px-4 py-3.5 text-white placeholder:text-neutral-400 focus:border-white focus:outline-none";

  return (
    <div className="relative min-h-dvh">
      <Header />
      <div className="fixed inset-0">
        <img className="h-full w-full object-cover" src={LOGIN_BG} alt="" />
        <div className="absolute inset-0 bg-black/55" />
      </div>
      <div className="relative flex min-h-dvh items-center justify-center px-4 pt-20 pb-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleButtonClick();
          }}
          className="w-full max-w-md space-y-4 rounded-lg bg-black/80 px-6 py-10 text-white sm:px-14 sm:py-14"
        >
          <h1 className="mb-6 text-3xl font-bold">{isSignUp ? "Sign Up" : "Sign In"}</h1>
          {isSignUp && (
            <input
              ref={name}
              type="text"
              placeholder="Full Name"
              autoComplete="name"
              className={inputClass}
            />
          )}
          <input
            ref={email}
            type="email"
            placeholder="Email address"
            autoComplete="email"
            className={inputClass}
          />
          <input
            ref={password}
            type="password"
            placeholder="Password"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            className={inputClass}
          />
          {errMessage && (
            <p role="alert" className="text-sm text-red-400">
              {errMessage}
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-md bg-red-600 py-3.5 font-semibold transition-colors hover:bg-red-700"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
          <p className="pt-4 text-white/70">
            {isSignUp ? "Already have an account? " : "New to Netflix? "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrMessage("");
              }}
              className="font-medium text-white hover:underline"
            >
              {isSignUp ? "Sign in." : "Sign up now."}
            </button>
          </p>
          <Link to="/" className="inline-block text-sm text-white/60 hover:text-white hover:underline">
            ← Keep browsing without an account
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
