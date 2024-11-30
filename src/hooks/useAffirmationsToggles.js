import { useState, useEffect } from "react";
import { auth, db } from "../components/firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, deleteField } from "firebase/firestore";
import { AFFIRMATION_LABELS } from "../utils/constants";

const useAffirmationsToggles = () => {
  // Initialize state dynamically from AFFIRMATION_LABELS
  const defaultState = Object.keys(AFFIRMATION_LABELS).reduce(
    (acc, key) => ({
      ...acc,
      [key]: key === "motivation_and_inspiration", // Only enable "Motivation and Inspiration" by default
    }),
    {}
  );

  const [affirmations, setAffirmations] = useState(defaultState);

  useEffect(() => {
    const fetchAffirmations = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(docRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.affirmationsToggles) {
            setAffirmations((prev) => ({
              ...prev,
              ...data.affirmationsToggles,
            }));
          }
        }
      }
    };

    fetchAffirmations();
  }, []);

  const saveAffirmation = async (uid, affirmationKey, value) => {
    try {
      const docRef = doc(db, "users", uid);
      await setDoc(
        docRef,
        { affirmationsToggles: { [affirmationKey]: value } },
        { merge: true }
      );
      console.log(`Affirmation ${affirmationKey} updated successfully!`);
    } catch (error) {
      console.error(`Error updating affirmation ${affirmationKey}:`, error);
    }
  };

  const handleToggleChange = async (key, value) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const docRef = doc(db, "users", user.uid);
  
        // Delete dailyAffirmations if the toggle changes
        const currentDate = new Date().toISOString().split("T")[0]; // Get the current date in 'YYYY-MM-DD' format
        await updateDoc(docRef, {
          [`dailyAffirmations.${currentDate}`]: deleteField(),
        });
        console.log(`Daily affirmations for ${currentDate} deleted due to toggle change.`);
  
        // Save the updated toggle value
        await saveAffirmation(user.uid, key, value);
  
        // Update local state
        setAffirmations((prev) => ({
          ...prev,
          [key]: value,
        }));
      } catch (error) {
        console.error("Failed to save affirmation:", error);
      }
    }
  };

  return { affirmations, handleToggleChange };
};

export default useAffirmationsToggles;
