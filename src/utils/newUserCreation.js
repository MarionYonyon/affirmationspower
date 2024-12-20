import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../components/firebaseConfig";
import {
  AFFIRMATION_LABELS,
  JOBSTATUS_LABELS,
  APPEARANCE_LABELS,
} from "./constants"; // Import the constants

// Default parameters for new users
const defaultUserData = {
  dailyGoal: 20, // Default daily affirmation goal
  dailyProgress: {}, // To track progress, reset daily
  createdAt: new Date().toISOString(), // Record creation timestamp
  appearance: Object.keys(APPEARANCE_LABELS)[0], // Default to "light" (1st key)
};

// Dynamically create default affirmations toggles using the keys from AFFIRMATION_LABELS
const defaultAffirmationsToggles = Object.keys(AFFIRMATION_LABELS).reduce(
  (toggles, key) => {
    toggles[key] = false; // Default all categories to false
    return toggles;
  },
  {}
);
// Override specific toggles
defaultAffirmationsToggles.motivation_and_inspiration = true;

const defaultUserSettings = {
  affirmationsToggles: defaultAffirmationsToggles, // Dynamically generated toggles
  jobStatus: Object.keys(JOBSTATUS_LABELS)[1], // Default to "career_changer" (2nd key)
};

// Function to initialize user data
export const initializeUserData = async (user) => {
  if (!user) return;

  const userDocRef = doc(db, "users", user.uid);
  const userSettingsRef = doc(db, "users", user.uid, "settings", "userSettings");

  try {
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      // If the user doesn't exist, set default data under "users"
      await setDoc(userDocRef, defaultUserData, { merge: true });
      console.log("Default user data initialized successfully!");
    }

    const userSettingsDoc = await getDoc(userSettingsRef);
    if (!userSettingsDoc.exists()) {
      // Initialize default settings under "settings/userSettings"
      await setDoc(userSettingsRef, defaultUserSettings, { merge: true });
      console.log("Default user settings initialized successfully!");
    }
  } catch (error) {
    console.error("Error initializing user data:", error);
  }
};

// Hook this function after user creation or login
auth.onAuthStateChanged(async (user) => {
  if (user) {
    await initializeUserData(user); // Initialize the user if new
  }
});
