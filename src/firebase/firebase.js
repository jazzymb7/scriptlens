import { initializeApp } from "firebase/app";
import {
  getFirestore,
  serverTimestamp,
  getCountFromServer,
} from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_REACT_APIKEY,
  authDomain: import.meta.env.VITE_REACT_AUTHDOMAIN,
  projectId: import.meta.env.VITE_REACT_PROJECTID,
  storageBucket: import.meta.env.VITE_REACT_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_REACT_MESSAGESENDERID,
  appId: import.meta.env.VITE_REACT_APPID,
  measurementId: import.meta.env.VITE_REACT_MEASUREMENTID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export {
  app,
  auth,
  db,
  googleProvider,
  signInWithPopup,
  serverTimestamp,
  getCountFromServer,
};
