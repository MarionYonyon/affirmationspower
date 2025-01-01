// saveDailyAffirmations.js
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';

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
    if (!userId || !date || !affirmations || !Array.isArray(affirmations)) {
      throw new Error('Invalid parameters. Ensure userId, date, and affirmations are provided correctly.');
    }

    const userDocRef = doc(db, `users/${userId}/settings/preferences`);

    await setDoc(
      userDocRef,
      {
        dailyAffirmations: {
          [date]: affirmations,
        },
      },
      { merge: true }
    );

    console.log(`Daily affirmations saved for user: ${userId}, date: ${date}`);
  } catch (error) {
    console.error('Error saving daily affirmations:', error);
    throw error;
  }
};

export default saveDailyAffirmations;
