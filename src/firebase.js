
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCS7Q0h6-Pc-kB1Dqa-WlB2LdaLnl4zaY4",
  authDomain: "bau-vision25.firebaseapp.com",
  projectId: "bau-vision25",
  storageBucket: "bau-vision25.firebasestorage.app",
  messagingSenderId: "399020543777",
  appId: "1:399020543777:web:a9fa20f03007cbf0043860",
  measurementId: "G-138WN9NWSH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
