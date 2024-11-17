import { useState, useEffect } from "react";
import { auth, db } from "../components/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const useJobStatus = () => {
  const [jobStatus, setJobStatus] = useState("Career Changer"); // Default value

  useEffect(() => {
    const fetchJobStatus = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
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
    setJobStatus(newStatus); // Update state immediately for UI responsiveness
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, "users", user.uid);
      try {
        await updateDoc(docRef, { jobStatus: newStatus });
        console.log("Job status updated successfully!");
      } catch (error) {
        console.error("Error updating job status:", error);
      }
    }
  };

  return { jobStatus, setJobStatus, handleJobStatusChange };
};

export default useJobStatus;