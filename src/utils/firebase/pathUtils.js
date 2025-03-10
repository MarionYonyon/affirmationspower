/**
 * Constructs the Firestore path for user settings.
 * @param {string} userId - The ID of the user.
 * @returns {string} - Firestore path for the user's settings.
 */
export const getUserSettingsPath = (userId) => {
  if (!userId)
    throw new Error("User ID is required to construct settings path.");
  return `users/${userId}/settings/preferences`;
};

/**
 * Constructs the Firestore path for fetching affirmations.
 * @param {string} jobStatus - The user's job status.
 * @param {string} category - The affirmation category.
 * @returns {string} - Firestore path for the given parameters.
 */
export const getAffirmationPath = (jobStatus, category) => {
  if (!jobStatus || !category) {
    throw new Error(
      "Both jobStatus and category are required to construct the affirmation path."
    );
  }
  return `/topic2/career/job_status/${jobStatus}/practice/${category}`;
};

/**
 * Constructs the Firestore path for logging user actions.
 * @param {string} userId - The ID of the user.
 * @param {string} timestamp - The timestamp of the action.
 * @returns {string} - Firestore path for the user's action log.
 */
export const getUserActionLogPath = (userId, timestamp) => {
  if (!userId || !timestamp) {
    throw new Error(
      "Both userId and timestamp are required to construct the user action log path."
    );
  }
  return `logs/${userId}/actions/${timestamp}`;
};

/**
 * Constructs the Firestore path for logging user clicks.
 * @param {string} userId - The ID of the user.
 * @param {string} currentDate - The current date in ISO format or any standard date format.
 * @returns {string} - Firestore path for the user's click log.
 */
export const getUserClickLogPath = (userId, currentDate) => {
  if (!userId || !currentDate) {
    throw new Error(
      "Both userId and currentDate are required to construct the user click log path."
    );
  }
  return `logs/${userId}/clicks/${currentDate}`;
};
