// useUserSettings.js
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";

const useUserSettings = (userId) => {
  const [userSettings, setUserSettings] = useState(() => {
    // Prioritize localStorage values during initialization
    const selectedCategories = localStorage.getItem("selectedCategories");
    const jobStatus = localStorage.getItem("jobStatus");

    return {
      selectedCategories: selectedCategories
        ? JSON.parse(selectedCategories)
        : ["financial_abundance"],
      jobStatus: jobStatus || "unemployed",
    };
  });

  const [loading, setLoading] = useState(true);

  // Fetch settings from Firestore
  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        if (!userId) return;

        const userDoc = doc(db, `users/${userId}/settings/preferences`);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          console.log("Fetched user settings:", docSnap.data());
          setUserSettings((prevSettings) => ({
            ...prevSettings,
            ...docSnap.data(),
          }));
        } else {
          console.log("No user settings found. Using defaults.");
        }
      } catch (error) {
        console.error("Error fetching user settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSettings();
  }, [userId]);

  // Save settings to Firestore
  const saveUserSettings = async (newSettings) => {
    try {
      if (!userId) return;

      // Ensure at least one category is enabled
      if (
        newSettings.selectedCategories &&
        newSettings.selectedCategories.length === 0
      ) {
        console.warn("Cannot save settings with no categories enabled.");
        return;
      }

      // Validate newSettings
      const serializableSettings = JSON.parse(JSON.stringify(newSettings)); // Ensure serializable

      const userDoc = doc(db, `users/${userId}/settings/preferences`);
      await setDoc(userDoc, serializableSettings, { merge: true });

      console.log("User settings saved:", serializableSettings);
      setUserSettings(serializableSettings);

      // Save to localStorage
      localStorage.setItem(
        "selectedCategories",
        JSON.stringify(serializableSettings.selectedCategories)
      );
      localStorage.setItem("jobStatus", serializableSettings.jobStatus);
    } catch (error) {
      console.error("Error saving user settings:", error);
    }
  };

  return { userSettings, setUserSettings: saveUserSettings, loading };
};

export default useUserSettings;
