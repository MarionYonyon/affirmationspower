// initializeSettings.js

import { DEFAULT_USER_SETTINGS } from "../utils/constants";

const initializeSettings = () => {
  const getLocalStorageItem = (key, defaultValue) => {
    try {
      const item = localStorage.getItem(key);
      // Check if the value is a valid JSON or a plain string
      return item
        ? item.startsWith("{") || item.startsWith("[")
          ? JSON.parse(item)
          : item
        : defaultValue;
    } catch (error) {
      console.warn(`Error parsing localStorage item "${key}":`, error);
      return defaultValue;
    }
  };

  // Use default settings from constants
  const selectedCategories = getLocalStorageItem(
    "selectedCategories",
    DEFAULT_USER_SETTINGS.selectedCategories
  );
  const jobStatus = getLocalStorageItem(
    "jobStatus",
    DEFAULT_USER_SETTINGS.jobStatus
  );

  return {
    selectedCategories,
    jobStatus,
  };
};

export default initializeSettings;
