import { useState, useEffect } from "react";
import {
  fetchFirestoreDoc,
  saveFirestoreDoc,
} from "../utils/firebase/firestoreUtils";
import shuffleAndLimit from "../utils/shuffleAndLimit";
import { DEFAULT_USER_SETTINGS } from "../utils/constants";
import { getUserSettingsPath, getAffirmationPath } from "../utils/firebase/pathUtils";

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
  const [currentIndex, setCurrentIndex] = useState();
  const [togglesChanged, setTogglesChanged] = useState(false);

  useEffect(() => {
    const fetchAffirmations = async () => {
      if (
        !userId ||
        !userSettings?.selectedCategories?.length ||
        !userSettings?.jobStatus
      ) {
        console.warn("Missing userId, selected categories, or job status.");
        return;
      }

      let categoryMap = {};

      try {
        for (const category of userSettings.selectedCategories) {
          const path = getAffirmationPath(userSettings.jobStatus, category);
          const data = await fetchFirestoreDoc(path);
          categoryMap[category] = data ? Object.values(data) : [];
        }

        const limitedAffirmations = shuffleAndLimit(categoryMap, 30); // Max 30 affirmations
        setAffirmations(limitedAffirmations);
        setCurrentIndex(0); // Reset index when new affirmations are fetched
      } catch (error) {
        console.error("Error fetching affirmations:", error);
      }
    };

    if (togglesChanged) {
      fetchAffirmations();
      setTogglesChanged(false);
    }
  }, [togglesChanged, userSettings, userId]);

  const nextAffirmation = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % affirmations.length; // Loop back to the start
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