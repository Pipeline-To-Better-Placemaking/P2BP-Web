import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDDGViCn0hRT65s__fK3V_OsxYJTtMinsk",
  authDomain: "better-placemaking.firebaseapp.com",
  projectId: "better-placemaking",
  storageBucket: "better-placemaking.appspot.com",
  messagingSenderId: "15566872110",
  appId: "1:15566872110:web:c345798ca42311230509bf",
  measurementId: "G-8WZJVJQQYY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);