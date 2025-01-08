import React, { createContext } from "react";
import useAuthState from "../hooks/useAuthState";
import useFirestoreSync from "../hooks/useFirestoreSync";
import useAffirmations from "../hooks/useAffirmations";
import useUserSettings from "../hooks/useUserSettings";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { userId, isLoggedIn, initialized } = useAuthState();

  // Always call hooks and handle the absence of userId inside the hooks
  const { userSettings = {}, setUserSettings, loading: settingsLoading } = useUserSettings(userId);
  const {
    affirmations = [],
    currentAffirmation = null,
    nextAffirmation = () => {},
    setTogglesChanged = () => {},
    currentIndex = 0,
  } = useAffirmations(userId, userSettings);

  useFirestoreSync({
    userId,
    affirmations,
    jobStatus: userSettings?.jobStatus || "",
    selectedCategories: userSettings?.selectedCategories || [],
    currentIndex,
    initialized,
  });

  const handleCategoryChange = (newCategories) => {
    if (!userSettings || newCategories.length === 0) {
      console.warn("At least one category must remain enabled.");
      return;
    }
    setUserSettings({ ...userSettings, selectedCategories: newCategories });
    setTogglesChanged(true);
  };

  const handleJobStatusChange = (newStatus) => {
    if (!userSettings) return;
    setUserSettings({ ...userSettings, jobStatus: newStatus });
    setTogglesChanged(true);
  };

  return (
    <AppContext.Provider
      value={{
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
