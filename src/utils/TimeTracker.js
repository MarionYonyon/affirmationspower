import React, { useState, useEffect } from "react";
import { getCurrentUser } from "./firebaseHelpers";
import { getCurrentDate } from "./dateUtils";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

function TimeTracker() {
  const [timeSpent, setTimeSpent] = useState(0); // Total time spent in seconds for the current session
  const [startTime, setStartTime] = useState(null); // When user starts the session

  const saveDailyTimeToFirestore = async (elapsedTime) => {
    const user = getCurrentUser();
    if (user) {
      try {
        const currentDate = getCurrentDate(); // Get current date in YYYY-MM-DD format
        const docRef = doc(db, "users", user.uid); // Reference to the user's document
        const docSnap = await getDoc(docRef); // Fetch the current document

        let existingTimeSpent = {};
        if (docSnap.exists()) {
          existingTimeSpent = docSnap.data().timeSpent || {}; // Get the existing timeSpent field
        }

        // Update the time for the current date
        const updatedTime = (existingTimeSpent[currentDate] || 0) + elapsedTime;
        existingTimeSpent[currentDate] = updatedTime;

        // Save the updated timeSpent field back to Firestore
        await updateDoc(docRef, { timeSpent: existingTimeSpent });
        console.log(`Updated time spent for ${currentDate}: ${updatedTime} seconds.`);
      } catch (error) {
        console.error("Error saving time spent to Firestore:", error);
      }
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setStartTime(new Date()); // Start tracking when the page is visible
      } else {
        if (startTime) {
          const elapsed = Math.round((new Date() - startTime) / 1000);
          setTimeSpent((prevTime) => prevTime + elapsed); // Add elapsed time
          saveDailyTimeToFirestore(elapsed); // Save updated time for today
          setStartTime(null);
        }
      }
    };

    // Set initial start time when the component mounts
    if (!startTime) setStartTime(new Date());

    // Listen for visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [startTime]); // Depend only on `startTime`

  useEffect(() => {
    const handleUnload = () => {
      if (startTime) {
        const elapsed = Math.round((new Date() - startTime) / 1000);
        saveDailyTimeToFirestore(elapsed); // Save updated time to Firestore before unload
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [startTime]); // Depend on `startTime`
}

export default TimeTracker;
