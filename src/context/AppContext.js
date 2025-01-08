import React, { createContext } from "react";
import useAuthState from "../hooks/useAuthState";
import useFirestoreSync from "../hooks/useFirestoreSync";
import useAffirmations from "../hooks/useAffirmations";
import useUserSettings from "../hooks/useUserSettings";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { userId, isLoggedIn, initialized } = useAuthState();
  const { userSettings, setUserSettings, loading: settingsLoading } = useUserSettings(userId);
  const {
    affirmations,
    currentAffirmation,
    nextAffirmation,
    loading: affirmationsLoading,
    selectedCategories,
    setSelectedCategories,
    jobStatus,
    setJobStatus,
    setTogglesChanged,
    currentIndex,
    setCurrentIndex,
  } = useAffirmations(userId);

  useFirestoreSync({
    userId,
    affirmations,
    jobStatus,
    selectedCategories,
    currentIndex,
    initialized,
  });

  const handleCategoryChange = (newCategories) => {
    if (newCategories.length === 0) {
      console.warn("At least one category must remain enabled.");
      return;
    }
    setSelectedCategories(newCategories);
    setUserSettings({ ...userSettings, selectedCategories: newCategories });
    setTogglesChanged(true);
  };

  const handleJobStatusChange = (newStatus) => {
    setJobStatus(newStatus);
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
        affirmationsLoading,
        settingsLoading,
        selectedCategories,
        setSelectedCategories,
        jobStatus,
        setJobStatus,
        setTogglesChanged,
        currentIndex,
        setCurrentIndex,
        handleCategoryChange,
        handleJobStatusChange,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
