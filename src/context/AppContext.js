import React, { createContext, useState } from "react";
import useAuthState from "../hooks/useAuthState";
import useFirestoreSync from "../hooks/useFirestoreSync";
import { useUserSettings, useAffirmations } from "../hooks/newHook";
import { DEFAULT_USER_SETTINGS } from "../utils/constants";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [initializing, setInitializing] = useState(true); // State to track initialization
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
          setInitializing(false);
        } catch (error) {
          console.error("Error during initialization:", error);
          setInitializing(false);
        }
      };

      initialize();
    } else {
      setInitializing(false);
    }
  }, [userId, initialized]);

  // Category change handler
  const handleCategoryChange = (newCategories) => {
    if (!userSettings || newCategories.length === 0) {
      console.warn("At least one category must remain enabled.");
      return;
    }
    setUserSettings({ ...userSettings, selectedCategories: newCategories });
    setTogglesChanged(true);
  };

  // Job status change handler
  const handleJobStatusChange = (newStatus) => {
    if (!userSettings) return;
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
