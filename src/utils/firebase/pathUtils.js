/**
 * Constructs the Firestore path for user settings.
 * @param {string} userId - The ID of the user.
 * @returns {string} - Firestore path for the user's settings.
 */
export const getUserSettingsPath = (userId) => {
    if (!userId) throw new Error("User ID is required to construct settings path.");
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
      throw new Error("Both jobStatus and category are required to construct the affirmation path.");
    }
    return `/topic/career_growth/job_status/${jobStatus}/practice/${category}`;
  };
  