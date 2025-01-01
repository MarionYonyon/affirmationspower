// initializeSettings.js

const initializeSettings = () => {
  const defaultSettings = {
    selectedCategories: ['financial_abundance'],
    jobStatus: 'unemployed',
  };

  const getLocalStorageItem = (key, defaultValue) => {
    try {
      const item = localStorage.getItem(key);
      // Check if the value is a valid JSON or a plain string
      return item ? (item.startsWith('{') || item.startsWith('[') ? JSON.parse(item) : item) : defaultValue;
    } catch (error) {
      console.warn(`Error parsing localStorage item "${key}":`, error);
      return defaultValue;
    }
  };

  const selectedCategories = getLocalStorageItem('selectedCategories', defaultSettings.selectedCategories);
  const jobStatus = getLocalStorageItem('jobStatus', defaultSettings.jobStatus);

  return {
    selectedCategories,
    jobStatus,
  };
};

export default initializeSettings;
