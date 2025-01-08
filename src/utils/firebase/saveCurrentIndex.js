import { saveFirestoreDoc } from "./firestoreUtils";
import { getUserSettingsPath } from "./pathUtils";

/**
 * Saves the current index to Firestore.
 *
 * @param {string} userId - The ID of the user.
 * @param {number} currentIndex - The current index to save.
 * @returns {Promise<void>} Resolves when the index is successfully saved.
 */
export const saveCurrentIndex = async (userId, currentIndex) => {
  try {
    console.log("saveCurrentIndex called with:", { userId, currentIndex });

    if (!userId || typeof currentIndex !== "number") {
      throw new Error("Invalid parameters. Ensure userId and currentIndex are provided correctly.");
    }

    const path = getUserSettingsPath(userId); // Use pathUtils to generate path
    const data = { currentIndex };

    // Use the generic `saveFirestoreDoc` to save the data
    await saveFirestoreDoc(path, data);
    console.log(`Current index (${currentIndex}) saved for user: ${userId}`);
  } catch (error) {
    console.error("Error saving current index:", error);
    throw error; // Propagate error for higher-level handling
  }
};