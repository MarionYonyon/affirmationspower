import { auth } from "./firebaseConfig";
import { fetchFirestoreDoc, saveFirestoreDoc } from "./firestoreUtils";

// Get the current authenticated user
export const getCurrentUser = () => auth.currentUser;

// Fetch user-specific Firestore document
export const fetchUserDoc = async (uid, collection = "users") => {
  const path = `${collection}/${uid}`;
  return await fetchFirestoreDoc(path);
};

// Save user-specific Firestore document
export const saveUserDoc = async (uid, data, collection = "users") => {
  const path = `${collection}/${uid}`;
  await saveFirestoreDoc(path, data);
};
