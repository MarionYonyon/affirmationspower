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
import { saveCurrentIndex } from "../utils/firebase/saveCurrentIndex";

// Hook: Manages user settings
const useUserSettings = (userId) => {
  const [userSettings, setUserSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      console.log("No user ID. Skipping user settings fetch.");
      setUserSettings(null); // Ensure state is reset
      setLoading(false);
      return;
    }

    const fetchUserSettings = async () => {
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
    if (!userId) {
      console.warn("No user ID. Skipping user settings save.");
      return;
    }

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
    if (!userId) {
      console.log("No user ID. Skipping affirmations initialization.");
      setAffirmations([]); // Reset affirmations when no user is logged in
      setCurrentIndex(0); // Reset the index
      setNewAffirmationsFetched(false); // Reset the fetch flag
      return;
    }

    const initializeAffirmations = async () => {
      const today = new Date().toISOString().split("T")[0];

      console.log("Starting initialization of affirmations...");
      console.log("Today's date:", today);
      console.log("Current user settings:", userSettings);
      console.log("Affirmations state before initialization:", affirmations);
      console.log("Current togglesChanged:", togglesChanged);
      console.log(
        "New affirmations fetched this session:",
        newAffirmationsFetched
      );

      if (!userSettings) {
        console.log("No user settings available. Clearing affirmations...");
        setAffirmations([]);
        setCurrentIndex(0);
        setNewAffirmationsFetched(false);
        return;
      }

      // Case 1: Affirmations for current day do not exist
      if (!userSettings?.dailyAffirmations?.[today]?.length) {
        console.log(
          "CASE 1: No affirmations for today found in dailyAffirmations."
        );
        if (
          userId &&
          userSettings?.selectedCategories?.length &&
          userSettings?.jobStatus
        ) {
          console.log("CASE 1: Fetching new affirmations...");
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

            console.log(
              "CASE 1: Final categoryMap after fetching:",
              categoryMap
            );

            const newAffirmations = shuffleAndLimit(categoryMap, 4); // Limit to 4 affirmations
            setAffirmations(newAffirmations);
            setCurrentIndex(0);

            // Save the new affirmations to Firestore
            await saveDailyAffirmations(userId, today, newAffirmations);
            console.log("CASE 1: New affirmations saved successfully!");

            // Mark that new affirmations were fetched
            setNewAffirmationsFetched(true);
          } catch (error) {
            console.error("CASE 1: Error fetching affirmations:", error);
          }
        }
        console.log("Exiting CASE 1.");
        return;
      }

     // Case 2: Affirmations for current day exist and togglesChanged is false
if (
  userSettings?.dailyAffirmations?.[today]?.length &&
  !togglesChanged &&
  !newAffirmationsFetched // Skip if new affirmations were just fetched
) {
  console.log(
    "CASE 2: Affirmations for today exist and togglesChanged is false."
  );

  const existingAffirmations = userSettings.dailyAffirmations[today];
  setAffirmations(existingAffirmations);

  const validIndex =
    userSettings.currentIndex >= 0 &&
    userSettings.currentIndex < existingAffirmations.length
      ? userSettings.currentIndex
      : 0; // Ensure the currentIndex is within bounds

  console.log(`CASE 2: currentIndex mapped to validIndex (${validIndex}).`);
  
  setCurrentIndex(validIndex);

  // Immediately update the current affirmation
  console.log("CASE 2: Updating current affirmation...");
  setAffirmations(existingAffirmations);
  console.log(
    "CASE 2: Affirmations state updated with existing affirmations."
  );
  console.log("Exiting CASE 2.");
  return;
}


      // Case 3: Affirmations for current day exist but togglesChanged is true
      if (userSettings?.dailyAffirmations?.[today]?.length && togglesChanged) {
        console.log(
          "CASE 3: Affirmations for today exist, but togglesChanged is true."
        );
        if (
          userId &&
          userSettings?.selectedCategories?.length &&
          userSettings?.jobStatus
        ) {
          console.log("CASE 3: Fetching updated affirmations...");
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

            console.log(
              "CASE 3: Final categoryMap after togglesChanged:",
              categoryMap
            );

            const updatedAffirmations = shuffleAndLimit(categoryMap, 4); // Limit to 4 affirmations
            setAffirmations(updatedAffirmations);
            setCurrentIndex(0);

            // Save the updated affirmations to Firestore
            await saveDailyAffirmations(userId, today, updatedAffirmations);
            console.log("CASE 3: Updated affirmations saved successfully!");

            // Mark that new affirmations were fetched
            setNewAffirmationsFetched(true);
          } catch (error) {
            console.error(
              "CASE 3: Error fetching updated affirmations:",
              error
            );
          }
        }
        setTogglesChanged(false);
        console.log("Exiting CASE 3.");
      }
    };

    initializeAffirmations();
    // eslint-disable-next-line
  }, [userId, userSettings, togglesChanged]);

  const nextAffirmation = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % affirmations.length; // Loop back to the start
      console.log(`Advancing to next affirmation: index ${newIndex}`);

      if (userId) {
        saveCurrentIndex(userId, newIndex)
          .then(() => {
            console.log(`Current index (${newIndex}) saved to Firestore.`);
          })
          .catch((error) => {
            console.error("Error saving current index to Firestore:", error);
          });
      } else {
        console.log("No user ID available. Skipping index save.");
      }

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
