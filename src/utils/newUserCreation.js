import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../components/firebaseConfig";

// Default parameters for new users
const defaultUserData = {
  affirmationsToggles: {
    motivation_and_inspiration: true,
    self_confidence: false,
    career_growth: false,
    resilience: false,
    skill_recognition: false,
    networking: false,
    goal_setting: false,
    interview_preparation: false,
    stress_relief: false,
    financial_abundance: false,
    work_life_balance: false,
    gratitude_positivity: false,
    purpose_fulfillment: false,
  },
  dailyGoal: 100, // Default daily affirmation goal
  dailyProgress: {}, // To track progress, reset daily
  jobStatus: "Career Changer", // Default job status, adjust as needed
  createdAt: new Date().toISOString(), // Record creation timestamp
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