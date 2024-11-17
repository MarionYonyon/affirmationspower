import { useState, useEffect } from "react";
import { auth, db } from "../components/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getCurrentDate } from "../utils/dateUtils";

const useGoalAndProgress = () => {
  const [dailyGoal, setDailyGoal] = useState(100); // Default to 100
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchDailyGoalAndProgress = async () => {
      const user = auth.currentUser;
      if (user) {
        const currentDate = getCurrentDate();
        const docRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(docRef);

        if (userDoc.exists()) {
          const data = userDoc.data();

          // Update progress
          if (data.dailyProgress) {
            const dailyProgress = data.dailyProgress[currentDate];
            setProgress(dailyProgress || 0); // Use 0 if no entry for currentDate
          }

          // Update dailyGoal
          if (data.dailyGoal !== undefined) {
            setDailyGoal(data.dailyGoal);
          }
        }
      }
    };

    fetchDailyGoalAndProgress();
  }, []);

  const handleGoalChange = async (newGoal) => {
    setDailyGoal(newGoal); // Update the state immediately for UI responsiveness
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, "users", user.uid);
      try {
        await updateDoc(docRef, { dailyGoal: newGoal });
        console.log("Daily goal updated successfully!");
      } catch (error) {
        console.error("Error updating daily goal:", error);
      }
    }
  };

  const incrementProgress = async (incrementValue) => {
    const user = auth.currentUser;
    const currentDate = getCurrentDate();
    const newProgress = progress + incrementValue;

    // Update state immediately for UI responsiveness
    setProgress(newProgress);

    if (user) {
      const docRef = doc(db, "users", user.uid);
      try {
        await updateDoc(docRef, {
          dailyProgress: { [currentDate]: newProgress },
        });
        console.log("Progress incremented successfully!");
      } catch (error) {
        console.error("Error incrementing progress:", error);
      }
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
