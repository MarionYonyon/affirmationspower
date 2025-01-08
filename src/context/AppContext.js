import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../utils/firebaseConfig";
import useAffirmations from "../hooks/useAffirmations";
import useUserSettings from "../hooks/useUserSettings";
import saveDailyAffirmations from "../utils/saveDailyAffirmations";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [initialized, setInitialized] = useState(false);

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
    currentIndex,
    setCurrentIndex,
  } = useAffirmations(userId);

  // Handle user authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setIsLoggedIn(true);
        setInitialized(true);
      } else {
        setIsLoggedIn(false);
        setUserId(null);
        localStorage.clear();
        sessionStorage.clear();
      }
    });

    return () => unsubscribe();
  }, []);

  // Save affirmations when jobStatus or selectedCategories changes
  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    if (userId && affirmations.length > 0) {
      saveDailyAffirmations(
        userId,
        currentDate,
        affirmations,
        jobStatus,
        selectedCategories
      )
        .then(() => console.log("Daily affirmations saved successfully!"))
        .catch((error) =>
          console.error("Error saving daily affirmations:", error)
        );
    }
  }, [jobStatus, selectedCategories, affirmations, userId]);

  // Save the currentIndex to Firestore when it changes
  useEffect(() => {
    const saveCurrentIndex = async () => {
      try {
        const userDocRef = doc(db, `users/${userId}/settings/preferences`);
        await setDoc(userDocRef, { currentIndex }, { merge: true });
        console.log("Current index saved to Firestore:", currentIndex);
      } catch (error) {
        console.error("Error saving current index:", error);
      }
    };

    if (initialized) {
      saveCurrentIndex();
    }
  }, [currentIndex, userId, initialized]);

  // Handle category changes
  const handleCategoryChange = (newCategories) => {
    if (newCategories.length === 0) {
      console.warn("At least one category must remain enabled.");
      return;
    }
    setSelectedCategories(newCategories);
    setUserSettings({ ...userSettings, selectedCategories: newCategories });
    setTogglesChanged(true);
  };

  // Handle job status changes
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
