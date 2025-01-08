import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import { DEFAULT_USER_DATA, DEFAULT_USER_SETTINGS } from "../constants";

// Initialize Firestore data for a new user
export const initializeUserData = async (user) => {
  if (!user) {
    console.log("No user provided to initializeUserData.");
    return;
  }

  console.log("Initializing user data for user ID:", user.uid);

  const userDocRef = doc(db, "users", user.uid);
  const userSettingsRef = doc(db, `users/${user.uid}/settings/preferences`);

  try {
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      console.log("User document does not exist. Setting default user data.");
      await setDoc(userDocRef, DEFAULT_USER_DATA, { merge: true });
      console.log("Default user data initialized successfully!");
    } else {
      console.log("User document already exists. Skipping default data initialization.");
    }

    const userSettingsDoc = await getDoc(userSettingsRef);
    if (!userSettingsDoc.exists()) {
      console.log("User settings document does not exist. Setting default user settings.");
      await setDoc(userSettingsRef, DEFAULT_USER_SETTINGS, { merge: true });
      console.log("Default user settings initialized successfully!");
    } else {
      console.log("User settings document already exists. Skipping default settings initialization.");
    }
  } catch (error) {
    console.error("Error initializing user data:", error);
  }
};

// Automatically initialize on user authentication
auth.onAuthStateChanged(async (user) => {
  if (user) {
    console.log("Auth state changed. User is logged in:", user.uid);
    try {
      await initializeUserData(user);
      console.log("User data initialization completed successfully.");
    } catch (error) {
      console.error("Error during onAuthStateChanged initialization:", error);
    }
  } else {
    console.log("Auth state changed. No user is logged in.");
  }
});
