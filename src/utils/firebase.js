import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase web config is public by design; access is controlled by Firebase Auth rules.
const firebaseConfig = {
  apiKey: "AIzaSyBVwwJJZmgPwKIHq5REO-xpcIQexby9eRA",
  authDomain: "netflix-gpt-c3733.firebaseapp.com",
  projectId: "netflix-gpt-c3733",
  storageBucket: "netflix-gpt-c3733.appspot.com",
  messagingSenderId: "798522391875",
  appId: "1:798522391875:web:f0028881e59abe400e03f6",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
