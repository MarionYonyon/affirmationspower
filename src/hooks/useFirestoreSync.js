import { useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import saveDailyAffirmations from "../utils/saveDailyAffirmations";

const useFirestoreSync = ({
  userId,
  affirmations,
  jobStatus,
  selectedCategories,
  currentIndex,
  initialized,
}) => {
  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    if (userId && affirmations.length > 0) {
      saveDailyAffirmations(
        userId,
        currentDate,
        affirmations,
        jobStatus,
        selectedCategories
      )
        .then(() => console.log("Daily affirmations saved successfully!"))
        .catch((error) =>
          console.error("Error saving daily affirmations:", error)
        );
    }
  }, [jobStatus, selectedCategories, affirmations, userId]);

  useEffect(() => {
    const saveCurrentIndex = async () => {
      try {
        const userDocRef = doc(db, `users/${userId}/settings/preferences`);
        await setDoc(userDocRef, { currentIndex }, { merge: true });
        console.log("Current index saved to Firestore:", currentIndex);
      } catch (error) {
        console.error("Error saving current index:", error);
      }
    };

    if (initialized) {
      saveCurrentIndex();
    }
  }, [currentIndex, userId, initialized]);
};

export default useFirestoreSync;
