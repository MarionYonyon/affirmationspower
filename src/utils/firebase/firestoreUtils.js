import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Fetch Firestore document
export const fetchFirestoreDoc = async (path) => {
  try {
    const docRef = doc(db, path);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error(`Error fetching Firestore document at ${path}:`, error);
    return null;
  }
};

// Save Firestore document
export const saveFirestoreDoc = async (path, data) => {
  try {
    const docRef = doc(db, path);
    await setDoc(docRef, data, { merge: true });
    console.log(`Successfully saved data to Firestore at ${path}:`, data);
  } catch (error) {
    console.error(`Error saving Firestore document at ${path}:`, error);
  }
};

// Update Firestore document
export const updateFirestoreDoc = async (path, data) => {
  try {
    const docRef = doc(db, path);
    await updateDoc(docRef, data);
    console.log(`Successfully updated Firestore document at ${path}:`, data);
  } catch (error) {
    console.error(`Error updating Firestore document at ${path}:`, error);
  }
};
