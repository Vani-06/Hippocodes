// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAgqTXw4saMVjTPEBbxFiVr21_9_AeyFt8",
  authDomain: "productivityhippo.firebaseapp.com",
  projectId: "productivityhippo",
  storageBucket: "productivityhippo.firebasestorage.app",
  messagingSenderId: "442952158992",
  appId: "1:442952158992:web:45a6d588c4159009e0df95",
  measurementId: "G-HSB02R9HML"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);