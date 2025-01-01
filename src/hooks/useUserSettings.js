import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";

const useUserSettings = (userId) => {
  const [userSettings, setUserSettings] = useState(() => {
    const selectedCategories = localStorage.getItem("selectedCategories");
    const jobStatus = localStorage.getItem("jobStatus");
    const currentIndex = localStorage.getItem("currentIndex");

    return {
      selectedCategories: selectedCategories
        ? JSON.parse(selectedCategories)
        : ["jobFinancials"],
      jobStatus: jobStatus || "unemployed",
      currentIndex: currentIndex ? parseInt(currentIndex, 10) : 0,
    };
  });

  const [loading, setLoading] = useState(true);

  // Fetch settings from Firestore
  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!userId) {
        console.log("No userId provided. Skipping fetch.");
        return;
      }

      setLoading(true);

      try {
        const userDoc = doc(db, `users/${userId}/settings/preferences`);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Fetched user settings:", data);

          setUserSettings((prevSettings) => ({
            ...prevSettings,
            ...data,
          }));

          // Update localStorage with fetched values
          if (data.selectedCategories) {
            localStorage.setItem(
              "selectedCategories",
              JSON.stringify(data.selectedCategories)
            );
          }
          if (data.jobStatus) {
            localStorage.setItem("jobStatus", data.jobStatus);
          }
          if (data.currentIndex !== undefined) {
            localStorage.setItem("currentIndex", data.currentIndex.toString());
          }
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
    if (!userId) {
      console.warn("No userId provided. Skipping save.");
      return;
    }

    try {
      if (
        newSettings.selectedCategories &&
        newSettings.selectedCategories.length === 0
      ) {
        console.warn("Cannot save settings with no categories enabled.");
        return;
      }

      const serializableSettings = JSON.parse(JSON.stringify(newSettings));
      const userDoc = doc(db, `users/${userId}/settings/preferences`);
      await setDoc(userDoc, serializableSettings, { merge: true });

      console.log("User settings saved:", serializableSettings);
      setUserSettings(serializableSettings);

      if (serializableSettings.selectedCategories) {
        localStorage.setItem(
          "selectedCategories",
          JSON.stringify(serializableSettings.selectedCategories)
        );
      }
      if (serializableSettings.jobStatus) {
        localStorage.setItem("jobStatus", serializableSettings.jobStatus);
      }
      if (serializableSettings.currentIndex !== undefined) {
        localStorage.setItem(
          "currentIndex",
          serializableSettings.currentIndex.toString()
        );
      }
    } catch (error) {
      console.error("Error saving user settings:", error);
    }
  };

  return { userSettings, setUserSettings: saveUserSettings, loading };
};

export default useUserSettings;