import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
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

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <Header />
      <div className="absolute">
        <img
          className="inset-0 h-screen w-screen object-cover"
          src={LOGIN_BG}
          alt=""
        />
      </div>
      <div className="flex justify-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleButtonClick();
          }}
          className="w-[90%] md:w-3/12 my-36 flex flex-col items-start absolute p-12 bg-black/80 text-white rounded-lg"
        >
          <h1 className="text-3xl font-bold py-4">
            {isSignUp ? "Sign Up" : "Sign In"}
          </h1>
          {isSignUp && (
            <input
              ref={name}
              type="text"
              placeholder="Full Name"
              autoComplete="name"
              className="p-4 my-4 w-full bg-gray-700"
            />
          )}
          <input
            ref={email}
            type="email"
            placeholder="Email address"
            autoComplete="email"
            className="p-4 my-4 w-full bg-gray-700"
          />
          <input
            ref={password}
            type="password"
            placeholder="Password"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            className="p-4 my-4 w-full bg-gray-700"
          />
          <p className="text-red-500 text-lg py-2">{errMessage}</p>
          <button type="submit" className="p-4 my-4 bg-red-700 rounded-lg w-full">
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
          <p
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrMessage("");
            }}
            className="py-4 cursor-pointer"
          >
            {!isSignUp ? "New to Netflix? Sign Up now." : "Existing user? Sign In."}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
