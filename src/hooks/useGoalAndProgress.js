import { useState, useEffect } from "react";
import { auth, db } from "../components/firebaseConfig";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { getCurrentDate } from "../utils/dateUtils";
import { logUserAction } from "../utils/firebaseHelpers";

const useGoalAndProgress = () => {
  const [dailyGoal, setDailyGoal] = useState(100); // Default to 100
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const currentDate = getCurrentDate();
      const docRef = doc(db, "users", user.uid);

      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();

          // Check for daily progress for the current date
          if (!data.dailyProgress?.[currentDate]) {
            // Reset progress for the new day
            updateDoc(docRef, {
              [`dailyProgress.${currentDate}`]: 0,
            }).catch((error) =>
              console.error("Error resetting daily progress:", error)
            );
          }

          // Update progress and dailyGoal in state
          const dailyProgress = data.dailyProgress?.[currentDate] || 0;
          setProgress(dailyProgress);

          if (data.dailyGoal !== undefined) {
            setDailyGoal(data.dailyGoal);
          }
        }
      });

      // Clean up the listener when the component unmounts
      return () => unsubscribe();
    }
  }, []);

  const handleGoalChange = async (newGoal) => {
    setDailyGoal(newGoal);

    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, "users", user.uid);

      try {
        // Log the DailyGoal change
        await logUserAction("dailyGoal_change", { newGoal });

        // Update the dailyGoal in Firestore
        await updateDoc(docRef, { dailyGoal: newGoal });
        console.log("Daily goal updated in Firestore:", newGoal);
      } catch (error) {
        console.error("Error updating daily goal:", error);
      }
    }
  };

  const incrementProgress = (incrementValue) => {
    const currentDate = getCurrentDate();
    const newProgress = progress + incrementValue;

    setProgress(newProgress);

    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, "users", user.uid);
      updateDoc(docRef, {
        [`dailyProgress.${currentDate}`]: newProgress,
      })
        .then(() =>
          console.log("Progress incremented in Firestore:", newProgress)
        )
        .catch((error) => console.error("Error incrementing progress:", error));
    }
  };

  return {
    dailyGoal,
    setDailyGoal,
    progress,
    setProgress,
    handleGoalChange,
    incrementProgress,
  };
};

export default useGoalAndProgress;