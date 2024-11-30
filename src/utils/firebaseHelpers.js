import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../components/firebaseConfig";
import { getCurrentDate } from "../utils/dateUtils";
/**
 * Get the current authenticated user.
 * @returns {object|null} User object or null if not authenticated.
 */
export const getCurrentUser = () => auth.currentUser;

/**
 * Fetch a Firestore document for a user.
 * @param {string} uid - User ID.
 * @param {string} collection - Firestore collection name.
 * @returns {object|null} Document data or null if the document doesn't exist.
 */
export const fetchUserDoc = async (uid, collection = "users") => {
  const docRef = doc(db, collection, uid);
  const userDoc = await getDoc(docRef);
  return userDoc.exists() ? userDoc.data() : null;
};

/**
 * Save data to a Firestore document for a user.
 * @param {string} uid - User ID.
 * @param {object} data - Data to save.
 * @param {string} collection - Firestore collection name.
 */
export const saveUserDoc = async (uid, data, collection = "users") => {
  const docRef = doc(db, collection, uid);
  await setDoc(docRef, data, { merge: true });
};

/**
 * Log user behavior to Firestore.
 * @param {string} action - The action the user performed (e.g., "login", "toggle_change").
 * @param {object} details - Additional information about the action (e.g., toggle name, new value).
 */
export const logUserAction = async (action, details = {}) => {
  const user = auth.currentUser;
  if (!user) {
    console.error("User is not authenticated. Cannot log action.");
    return;
  }

  const timestamp = new Date().toISOString(); // Create a timestamp
  const logEntry = {
    action,
    details,
    timestamp,
    email: user.email, // Optional: include user email for easier tracking
  };

  try {
    const docRef = doc(db, `logs/${user.uid}/actions`, timestamp);
    await setDoc(docRef, logEntry);
    console.log("Log saved successfully:", logEntry);
  } catch (error) {
    console.error("Error logging user action:", error);
  }
};

/**
 * Log click actions (YesClick or NoClick) for the current user in the structure logs/{userId}/clicks/{date}.
 * @param {string} clickType - Either "YesClick" or "NoClick".
 */
export const logClickAction = async (clickType) => {
  const user = auth.currentUser;
  if (!user) {
    console.error("User is not authenticated. Cannot log click action.");
    return;
  }

  const currentDate = getCurrentDate(); // e.g., "YYYY-MM-DD"
  const docRef = doc(db, `logs/${user.uid}/clicks`, currentDate);

  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Increment the count for the click type
      const data = docSnap.data();
      await updateDoc(docRef, {
        [clickType]: (data[clickType] || 0) + 1,
      });
    } else {
      // Create a new document with initial count
      await setDoc(docRef, {
        YesClick: clickType === "YesClick" ? 1 : 0,
        NoClick: clickType === "NoClick" ? 1 : 0,
      });
    }

    console.log(`Logged ${clickType} successfully for ${currentDate}.`);
  } catch (error) {
    console.error("Error logging click action:", error);
  }
};