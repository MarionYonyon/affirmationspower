import { useState, useEffect } from "react";
import { auth, db } from "../components/firebaseConfig";
import { doc, onSnapshot, setDoc, updateDoc, deleteField } from "firebase/firestore";
import { AFFIRMATION_LABELS } from "../utils/constants";
import { logUserAction } from "../utils/firebaseHelpers";

const useAffirmationsToggles = () => {
  const defaultState = Object.keys(AFFIRMATION_LABELS).reduce(
    (acc, key) => ({
      ...acc,
      [key]: key === "motivation_and_inspiration", // Enable "Motivation and Inspiration" by default
    }),
    {}
  );

  const [affirmations, setAffirmations] = useState(defaultState);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      console.warn("User not logged in. Skipping real-time listener.");
      return;
    }

    const docRef = doc(db, "users", user.uid, "settings", "userSettings");

    // Real-time listener for the affirmationsToggles field
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.affirmationsToggles) {
          setAffirmations((prev) => ({
            ...prev,
            ...data.affirmationsToggles,
          }));
        }
      } else {
        console.warn("User document does not exist.");
      }
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);

  const saveAffirmation = async (uid, affirmationKey, value) => {
    try {
      const docRef = doc(db, "users", uid, "settings", "userSettings");
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
        const docRef = doc(db, "users", user.uid, "settings", "userSettings");

        // Check if the toggle being set to false is the last enabled one
        if (!value) {
          const remainingToggles = Object.entries(affirmations).filter(
            ([toggleKey, toggleValue]) => toggleKey !== key && toggleValue
          );

          if (remainingToggles.length === 0) {
            console.warn("At least one toggle must remain enabled!");
            return; // Prevent disabling the last enabled toggle
          }
        }

        // Log the toggle change
        await logUserAction("toggle_change", { toggle: key, value });

        // Delete dailyAffirmations if the toggle changes
        const currentDate = new Date().toISOString().split("T")[0];
        await updateDoc(docRef, {
          [`dailyAffirmations.${currentDate}`]: deleteField(),
        });
        console.log(
          `Daily affirmations for ${currentDate} deleted due to toggle change.`
        );

        // Save the updated toggle value
        await saveAffirmation(user.uid, key, value);

        // Update local state (this is redundant but ensures instant UI updates)
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
