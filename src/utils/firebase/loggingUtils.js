import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { getCurrentDate } from "../dateUtils";
import { getCurrentUser } from "./userUtils";
import { getUserActionLogPath, getUserClickLogPath } from "./pathUtils";

// Log user action
export const logUserAction = async (action, details = {}) => {
  const user = getCurrentUser();
  if (!user) {
    console.error("User is not authenticated. Cannot log action.");
    return;
  }

  const timestamp = new Date().toISOString();
  const logEntry = { action, details, timestamp, email: user.email };

  try {
    const docRef = doc(db, getUserActionLogPath(user.uid, timestamp));
    await setDoc(docRef, logEntry);
    console.log("Log saved successfully:", logEntry);
  } catch (error) {
    console.error("Error logging user action:", error);
  }
};

// Log clicks and progress steps
export const logClickAction = async (clickType, step = null) => {
  const user = getCurrentUser();
  if (!user) {
    console.error("User is not authenticated. Cannot log click action.");
    return;
  }

  const currentDate = getCurrentDate();
  const docRef = doc(db, getUserClickLogPath(user.uid, currentDate));

  try {
    const docSnap = await getDoc(docRef);
    const key = step !== null ? `Step${step}` : clickType;

    if (docSnap.exists()) {
      const data = docSnap.data();
      await updateDoc(docRef, { [key]: (data[key] || 0) + 1 });
    } else {
      await setDoc(docRef, { [key]: 1 });
    }

    console.log(`Logged ${key} successfully for ${currentDate}.`);
  } catch (error) {
    console.error("Error logging click action:", error);
  }
};
