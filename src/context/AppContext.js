import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebaseConfig";
import useAffirmations from "../hooks/useAffirmations";
import useUserSettings from "../hooks/useUserSettings";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  // User settings
  const { userSettings, setUserSettings, loading: settingsLoading } =
    useUserSettings(userId);

  // Affirmations logic
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
  } = useAffirmations(userId);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setUserId(null);
        localStorage.clear();
        sessionStorage.clear();
      }
    });

    return () => unsubscribe();
  }, []);

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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};