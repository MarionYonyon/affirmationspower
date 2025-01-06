import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

/**
 * Saves daily affirmations for a specific date in Firestore.
 *
 * @param {string} userId - The ID of the user.
 * @param {string} date - The current date (e.g., '2024-01-01').
 * @param {Array} affirmations - The affirmations to save for the given date.
 * @returns {Promise<void>} Resolves when affirmations are successfully saved.
 */
const saveDailyAffirmations = async (userId, date, affirmations) => {
  try {
    console.log("saveDailyAffirmations called with:", { userId, date, affirmations });

    if (!userId || !date || !Array.isArray(affirmations)) {
      throw new Error(
        "Invalid parameters. Ensure userId, date, and affirmations are provided correctly."
      );
    }

    const userDocRef = doc(db, `users/${userId}/settings/preferences`);
    const updatedData = {
      dailyAffirmations: {
        [date]: affirmations,
      },
    };

    // Save affirmations to Firestore
    await setDoc(userDocRef, updatedData, { merge: true });
    console.log(`Daily affirmations saved for user: ${userId}, date: ${date}`);
  } catch (error) {
    console.error("Error saving daily affirmations:", error);
    throw error; // Propagate error for higher-level handling
  }
};

export default saveDailyAffirmations;
