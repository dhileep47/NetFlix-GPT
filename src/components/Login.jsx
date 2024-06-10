import { useRef, useState } from "react";
import Header from "./Header";
import { checkFormData } from "../utils/validate";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { LOGIN_BG } from "../utils/constants";
const Login = () => {
  const [isSignInForm, setisSignInForm] = useState(false);
  const [errMessage, seterrMessage] = useState("");

  const name = useRef(null);
  const email = useRef(null);
  const password = useRef(null);

  const handleButtonClick = () => {
    const message = checkFormData(
      name.current?.value || "",
      email.current.value,
      password.current.value,
      isSignInForm
    );
    seterrMessage(message);
    if (message) return;
    if (isSignInForm) {
      createUserWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          const user = userCredential.user;
          updateProfile(user, {
            displayName: name.current.value,
          })
            .then(() => {
              const { uid, email, displayName } = auth.currentUser;
              dispatch(
                addUser({ uid: uid, email: email, displayName: displayName })
              );
            })
            .catch((error) => {
              seterrMessage(error);
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          seterrMessage(errorCode + "-" + errorMessage);
        });
    } else {
      signInWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          const user = userCredential.user;
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          seterrMessage(errorCode + "-" + errorMessage);
        });
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <Header />
      <div className="absolute ">
        <img
          className="inset-0 md:h-full h-screen w-full object-cover"
          src={LOGIN_BG}
          alt="logo"
        />
      </div>
      <div className="flex justify-center">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-[90%] md:w-3/12 my-36 flex flex-col items-start absolute p-12 bg-black text-white rounded-lg bg-opacity-80"
        >
          <h1 className="text-3xl font-bold py-4">
            {isSignInForm ? "Sign Up" : "Sign In"}
          </h1>
          {isSignInForm && (
            <input
              ref={name}
              type="text"
              placeholder="Full Name"
              className="p-4 my-4 w-full bg-gray-700"
            />
          )}
          <input
            ref={email}
            type="email"
            placeholder="Email address"
            className="p-4 my-4 w-full bg-gray-700"
          />
          <input
            ref={password}
            type="password"
            placeholder="Password"
            className="p-4 my-4 w-full bg-gray-700"
          />
          <p className="text-red-500 text-lg py-2">{errMessage}</p>
          <button
            className="p-4 my-4 bg-red-700 rounded-lg w-full"
            onClick={handleButtonClick}
          >
            {isSignInForm ? "Sign Up" : "Sign In"}
          </button>
          <p
            onClick={() => setisSignInForm(!isSignInForm)}
            className="py-4 cursor-pointer"
          >
            {!isSignInForm
              ? "New to Netflix? Sign Up now."
              : "Existing user? Sign In."}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
