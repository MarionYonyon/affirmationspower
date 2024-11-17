import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCsi6d-ttdoRpqZ79yAMkIsMDN1ObR56Vw",
  authDomain: "positive-affirmations-6f4de.firebaseapp.com",
  projectId: "positive-affirmations-6f4de",
  storageBucket: "positive-affirmations-6f4de.appspot.com",
  messagingSenderId: "673466441825",
  appId: "1:673466441825:web:f55187a876022c1886ca20",
  measurementId: "G-ESWHMNTB6C",
};

// Initialize Firebase app only if it hasn't been initialized yet
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };