import { useEffect } from "react";
import { saveDailyAffirmations } from "../utils/firebase/saveDailyAffirmations";
import { saveCurrentIndex } from "../utils/firebase/saveCurrentIndex";

const useFirestoreSync = ({
  userId,
  affirmations,
  jobStatus,
  selectedCategories,
  currentIndex,
  initialized,
}) => {
  // Sync daily affirmations
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
}

export default useFirestoreSync;
