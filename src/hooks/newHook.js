import { useState, useEffect } from "react";
import {
  fetchFirestoreDoc,
  saveFirestoreDoc,
} from "../utils/firebase/firestoreUtils";
import shuffleAndLimit from "../utils/shuffleAndLimit";
import { DEFAULT_USER_SETTINGS } from "../utils/constants";
import {
  getUserSettingsPath,
  getAffirmationPath,
} from "../utils/firebase/pathUtils";
import { saveDailyAffirmations } from "../utils/firebase/saveDailyAffirmations";

// Hook: Manages user settings
const useUserSettings = (userId) => {
  const [userSettings, setUserSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!userId) {
        setUserSettings(null);
        setLoading(false);
        return;
      }

      const path = getUserSettingsPath(userId);
      const settings = await fetchFirestoreDoc(path);

      if (settings) {
        setUserSettings(settings);
      } else {
        console.warn(`No settings found for userId: ${userId}`);
        setUserSettings({ ...DEFAULT_USER_SETTINGS });
      }

      setLoading(false);
    };

    fetchUserSettings();
  }, [userId]);

  const saveUserSettings = async (newSettings) => {
    if (!userId) return;

    if (
      newSettings.selectedCategories &&
      newSettings.selectedCategories.length === 0
    ) {
      console.warn("Cannot save settings with no categories enabled.");
      return;
    }

    const path = getUserSettingsPath(userId);
    await saveFirestoreDoc(path, newSettings);
    setUserSettings(newSettings);
  };

  return { userSettings, setUserSettings: saveUserSettings, loading };
};

// Hook: Manages affirmations
const useAffirmations = (userId, userSettings) => {
  const [affirmations, setAffirmations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [togglesChanged, setTogglesChanged] = useState(false);
  const [newAffirmationsFetched, setNewAffirmationsFetched] = useState(false); // Track if new affirmations were fetched

  useEffect(() => {
    const initializeAffirmations = async () => {
      const today = new Date().toISOString().split("T")[0];

      // Case 1: Affirmations for current day do not exist
      if (!userSettings?.dailyAffirmations?.[today]?.length) {
        console.log(
          "CASE 1: No affirmations for today. Fetching new affirmations..."
        );
        if (
          userId &&
          userSettings?.selectedCategories?.length &&
          userSettings?.jobStatus
        ) {
          try {
            const categoryMap = {};

            // Fetch affirmations for each category
            await Promise.all(
              userSettings.selectedCategories.map(async (category) => {
                const path = getAffirmationPath(
                  userSettings.jobStatus,
                  category
                );
                const data = await fetchFirestoreDoc(path);
                categoryMap[category] = data ? Object.values(data) : [];
              })
            );

            console.log("Final categoryMap after fetching:", categoryMap);

            const newAffirmations = shuffleAndLimit(categoryMap, 4); // Limit to 4 affirmations
            setAffirmations(newAffirmations);
            setCurrentIndex(0);

            // Save the new affirmations to Firestore
            await saveDailyAffirmations(userId, today, newAffirmations);
            console.log("New affirmations saved successfully!");

            // Mark that new affirmations were fetched
            setNewAffirmationsFetched(true);
          } catch (error) {
            console.error("Error fetching affirmations:", error);
          }
        }
        return;
      }

      // Case 2: Affirmations for current day exist and togglesChanged is false
      if (
        userSettings?.dailyAffirmations?.[today]?.length &&
        !togglesChanged &&
        !newAffirmationsFetched // Skip if new affirmations were just fetched
      ) {
        console.log("CASE 2: Using existing affirmations for today.");
        setAffirmations(userSettings.dailyAffirmations[today]);
        setCurrentIndex(0);
        return;
      }

      // Case 3: Affirmations for current day exist but togglesChanged is true
      if (userSettings?.dailyAffirmations?.[today]?.length && togglesChanged) {
        console.log(
          "CASE 3: Fetching new affirmations due to togglesChanged..."
        );
        if (
          userId &&
          userSettings?.selectedCategories?.length &&
          userSettings?.jobStatus
        ) {
          try {
            const categoryMap = {};

            // Fetch affirmations for each category
            await Promise.all(
              userSettings.selectedCategories.map(async (category) => {
                const path = getAffirmationPath(
                  userSettings.jobStatus,
                  category
                );
                const data = await fetchFirestoreDoc(path);
                categoryMap[category] = data ? Object.values(data) : [];
              })
            );

            console.log("Final categoryMap after togglesChanged:", categoryMap);

            const updatedAffirmations = shuffleAndLimit(categoryMap, 4); // Limit to 4 affirmations
            setAffirmations(updatedAffirmations);
            setCurrentIndex(0);

            // Save the updated affirmations to Firestore
            await saveDailyAffirmations(userId, today, updatedAffirmations);
            console.log("Updated affirmations saved successfully!");

            // Mark that new affirmations were fetched
            setNewAffirmationsFetched(true);
          } catch (error) {
            console.error("Error fetching updated affirmations:", error);
          }
        }
        setTogglesChanged(false);
      }
    };

    initializeAffirmations();
  }, [userId, userSettings, togglesChanged]);

  const nextAffirmation = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % affirmations.length; // Loop back to the start
      console.log(`Advancing to next affirmation: index ${newIndex}`);
      return newIndex;
    });
  };

  return {
    affirmations,
    currentAffirmation: affirmations[currentIndex] || null,
    setTogglesChanged,
    currentIndex,
    nextAffirmation,
  };
};

export { useUserSettings, useAffirmations };
