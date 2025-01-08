import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import { DEFAULT_USER_DATA, DEFAULT_USER_SETTINGS } from "../constants";

// Initialize Firestore data for a new user
export const initializeUserData = async (user) => {
  if (!user) return;

  const userDocRef = doc(db, "users", user.uid);
  const userSettingsRef = doc(db, `users/${user.uid}/settings/preferences`);

  try {
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      await setDoc(userDocRef, DEFAULT_USER_DATA, { merge: true });
      console.log("Default user data initialized successfully!");
    }

    const userSettingsDoc = await getDoc(userSettingsRef);
    if (!userSettingsDoc.exists()) {
      await setDoc(userSettingsRef, DEFAULT_USER_SETTINGS, { merge: true });
      console.log("Default user settings initialized successfully!");
    }
  } catch (error) {
    console.error("Error initializing user data:", error);
  }
};

// Automatically initialize on user authentication
auth.onAuthStateChanged(async (user) => {
  if (user) await initializeUserData(user);
});
