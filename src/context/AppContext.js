import React, { createContext, useState } from "react";
import useAuthState from "../hooks/useAuthState";
import useFirestoreSync from "../hooks/useFirestoreSync";
import { useUserSettings, useAffirmations } from "../hooks/newHook";
import { DEFAULT_USER_SETTINGS } from "../utils/constants";
import { logUserAction } from "../utils/firebase/loggingUtils";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [initializing, setInitializing] = useState(true); // State to track initialization
  const [idx, setIdx] = useState(33);
  const { userId, isLoggedIn, initialized } = useAuthState();

  // Use the new hooks for user settings and affirmations
  const {
    userSettings = DEFAULT_USER_SETTINGS,
    setUserSettings,
    loading: settingsLoading,
  } = useUserSettings(userId);

  const {
    affirmations = [],
    currentAffirmation = null,
    nextAffirmation = () => {},
    setTogglesChanged = () => {},
    currentIndex = 0,
  } = useAffirmations(userId, userSettings);

  // Firestore sync logic
  useFirestoreSync({
    userId,
    affirmations,
    jobStatus: userSettings?.jobStatus || "",
    selectedCategories: userSettings?.selectedCategories || [],
    currentIndex,
    initialized,
  });

  // Ensure initialization completes before proceeding
  React.useEffect(() => {
    if (userId && initialized) {
      const initialize = async () => {
        try {
          // Add your initialization logic here if needed
          console.log("Initialization successful.");
          setInitializing(false);
        } catch (error) {
          console.error("Error during initialization:", error);
          setInitializing(false);
        }
      };

      initialize();
    } else {
      console.log("No user ID or app not initialized yet.");
      setInitializing(false);
    }
  }, [userId, initialized]);

  // Reset state on logout or if no user is authenticated
  React.useEffect(() => {
    if (!userId) {
      console.log("No user logged in. Resetting state to default.");
      setUserSettings(DEFAULT_USER_SETTINGS); // Reset user settings
      setTogglesChanged(false); // Reset togglesChanged in useAffirmations
    }
  }, [userId, setUserSettings, setTogglesChanged]);

  // Log the current state whenever userSettings or affirmations change
  React.useEffect(() => {
    console.log("Current User Settings:", userSettings);
    console.log("Current Affirmations:", affirmations);
    console.log("Current Affirmation:", currentAffirmation);
  }, [userSettings, affirmations, currentAffirmation]);

  // Category change handler
  const handleCategoryChange = async (newCategories) => {
    if (!userSettings || newCategories.length === 0) {
      console.warn("At least one category must remain enabled.");
      return;
    }

    console.log("Changing categories to:", newCategories);

    // Log the change to Firestore
    try {
      await logUserAction("categoryChange", {
        selectedCategories: newCategories,
      });
      console.log("Category change logged successfully.");
    } catch (error) {
      console.error("Failed to log category change:", error);
    }

    setUserSettings({ ...userSettings, selectedCategories: newCategories });
    setTogglesChanged(true);
  };

  // Job status change handler
  const handleJobStatusChange = (newStatus) => {
    if (!userSettings) return;
    console.log("Changing job status to:", newStatus);
    setUserSettings({ ...userSettings, jobStatus: newStatus });
    setTogglesChanged(true);
  };

  return (
    <AppContext.Provider
      value={{
        initializing,
        userId,
        isLoggedIn,
        userSettings,
        setUserSettings,
        affirmations,
        currentAffirmation,
        nextAffirmation,
        settingsLoading,
        setTogglesChanged,
        currentIndex,
        handleCategoryChange,
        handleJobStatusChange,
        idx,
        setIdx,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
