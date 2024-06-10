import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBVwwJJZmgPwKIHq5REO-xpcIQexby9eRA",
  authDomain: "netflix-gpt-c3733.firebaseapp.com",
  projectId: "netflix-gpt-c3733",
  storageBucket: "netflix-gpt-c3733.appspot.com",
  messagingSenderId: "798522391875",
  appId: "1:798522391875:web:f0028881e59abe400e03f6",
  measurementId: "G-WV8TDB5J7V",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();
