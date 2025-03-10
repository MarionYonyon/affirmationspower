import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Fetch Firestore document
export const fetchFirestoreDoc = async (path) => {
  try {
    const docRef = doc(db, path);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      // If the data is an array of objects, return as is
      if (Array.isArray(data)) {
        return data.map((item) => ({
          text: item.text || "", // Ensure text field exists
          audioUrl: item.audioUrl || "", // Ensure audioUrl field exists
        }));
      }

      return data; // Return the stored object as is
    }

    return null;
  } catch (error) {
    console.error(`Error fetching Firestore document at ${path}:`, error);
    return null;
  }
};

// Save Firestore document
export const saveFirestoreDoc = async (path, data) => {
  try {
    const docRef = doc(db, path);

    // Ensure data is stored as an object with both 'text' and 'audioUrl'
    if (typeof data === "string") {
      data = { text: data, audioUrl: "" };
    } else if (Array.isArray(data)) {
      data = data.map((item) => ({
        text: item.text || "", // Preserve original text
        audioUrl: item.audioUrl || "", // Preserve original audio URL
      }));
    }

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
