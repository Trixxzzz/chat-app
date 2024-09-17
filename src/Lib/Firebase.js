import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,  // Ensure REACT_APP_ prefix is used
  authDomain: "reactchat-77f0e.firebaseapp.com",
  projectId: "reactchat-77f0e",
  storageBucket: "reactchat-77f0e.appspot.com",
  messagingSenderId: "239794280390",
  appId: "1:239794280390:web:4ee53cd2d53cd04594c4c7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);  // Ensure getAuth uses the app instance
export const db = getFirestore(app);  // Ensure getFirestore uses the app instance
export const storage = getStorage(app);  // Ensure getStorage uses the app instance
