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
};

const defaultUserSettings = {
  affirmationsToggles: {
    [AFFIRMATION_LABELS.motivation_and_inspiration]: true,
    [AFFIRMATION_LABELS.self_confidence]: false,
    [AFFIRMATION_LABELS.career_growth]: false,
    [AFFIRMATION_LABELS.resilience]: false,
    [AFFIRMATION_LABELS.skill_recognition]: false,
    [AFFIRMATION_LABELS.networking]: false,
    [AFFIRMATION_LABELS.goal_setting]: false,
    [AFFIRMATION_LABELS.interview_preparation]: false,
    [AFFIRMATION_LABELS.stress_relief]: false,
    [AFFIRMATION_LABELS.financial_abundance]: false,
    [AFFIRMATION_LABELS.work_life_balance]: false,
    [AFFIRMATION_LABELS.gratitude_positivity]: false,
    [AFFIRMATION_LABELS.purpose_fulfillment]: false,
  },
  jobStatus: JOBSTATUS_LABELS.career_changer, // Default job status
  appearance: APPEARANCE_LABELS.light, // Default appearance
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
