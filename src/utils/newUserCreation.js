import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../components/firebaseConfig";
import {
  AFFIRMATION_LABELS,
  JOBSTATUS_LABELS,
  APPEARANCE_LABELS,
} from "./constants"; // Import the constants

// Default parameters for new users
const defaultUserData = {
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
  dailyGoal: 20, // Default daily affirmation goal
  dailyProgress: {}, // To track progress, reset daily
  jobStatus: JOBSTATUS_LABELS.career_changer, // Default job status
  createdAt: new Date().toISOString(), // Record creation timestamp
  appearance: APPEARANCE_LABELS.light, // Default appearance
};

// Function to initialize user data
export const initializeUserData = async (user) => {
  if (!user) return;

  const userDocRef = doc(db, "users", user.uid);

  try {
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      // If the user doesn't exist, set default data
      await setDoc(userDocRef, defaultUserData, { merge: true });
      console.log("Default user data initialized successfully!");
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