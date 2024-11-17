// firebaseHelpers.js
import { db } from "./firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { getCurrentDate } from "../utils/dateUtils";

export const saveAffirmation = async (uid, affirmationKey, value) => {
  try {
    const docRef = doc(db, "users", uid);
    await setDoc(
      docRef,
      { affirmationsToggles: { [affirmationKey]: value } },
      { merge: true }
    );
    console.log(`Affirmation ${affirmationKey} updated successfully!`);
  } catch (error) {
    console.error(`Error updating affirmation ${affirmationKey}: `, error);
  }
};

export const saveJobStatus = async (uid, value) => {
  try {
    const docRef = doc(db, "users", uid);
    await setDoc(
      docRef,
      { jobStatus: value },
      { merge: true }
    );
    console.log(`Job Status ${value} updated successfully!`);
  } catch (error) {
    console.error(`Error updating Job Status ${value}: `, error);
  }
};

export const saveGoal = async (uid, value) => {
  try {
    const docRef = doc(db, "users", uid);
    await setDoc(
      docRef,
      { dailyGoal: Number(value) },
      { merge: true }
    );
    console.log(`Daily Goal ${value} updated successfully!`);
  } catch (error) {
    console.error(`Error updating Daily Goal ${value}: `, error);
  }
};

export const saveProgress = async (uid, value) => {
  try {
    const currentDate = getCurrentDate();
    const docRef = doc(db, "users", uid);
    await setDoc(
      docRef, 
      { dailyProgress: { [currentDate]: value } },
      { merge: true } // Prevent overwriting other fields
    );
    console.log(`Progress for ${currentDate} updated successfully to: ${value}`);
  } catch (error) {
    console.error("Error updating progress: ", error);
  }
};