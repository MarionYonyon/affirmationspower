import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../components/firebaseConfig";

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