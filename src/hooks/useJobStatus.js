import { useState, useEffect } from "react";
import { auth, db } from "../utils/firebaseConfig";
import { doc, getDoc, updateDoc, deleteField } from "firebase/firestore";
import { logUserAction } from "../utils/firebaseHelpers";
import { cleanUserCategories } from "../utils/cleanUserCategories"; // Import cleanup

const useJobStatus = () => {
  const [jobStatus, setJobStatus] = useState(); // Default value

  useEffect(() => {
    const fetchJobStatus = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid, "settings", "userSettings");
        const userDoc = await getDoc(docRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.jobStatus !== undefined) {
            setJobStatus(data.jobStatus);
          }
        }
      }
    };

    fetchJobStatus();
  }, []);

  const handleJobStatusChange = async (newStatus) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const docRef = doc(db, "users", user.uid, "settings", "userSettings");

        // Log the job status change
        await logUserAction("jobStatus_change", { newStatus });

        // Delete dailyAffirmations if the job status changes
        const currentDate = new Date().toISOString().split("T")[0];
        await updateDoc(docRef, {
          [`dailyAffirmations.${currentDate}`]: deleteField(),
        });
        console.log(
          `Daily affirmations for ${currentDate} deleted due to job status change.`
        );

        // Save the updated job status in Firestore
        await updateDoc(docRef, { jobStatus: newStatus });

        // 🔥 Remove outdated categories
        await cleanUserCategories(user.uid);

        console.log("Job status updated successfully!");
        setJobStatus(newStatus);
      } catch (error) {
        console.error("Error updating job status:", error);
      }
    }
  };

  return { jobStatus, setJobStatus, handleJobStatusChange };
};

export default useJobStatus;
