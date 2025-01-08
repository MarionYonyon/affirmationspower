import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import shuffleAndLimit from "../utils/shuffleAndLimit";

const useAffirmations = (userId, userSettings) => {
  const [affirmations, setAffirmations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [togglesChanged, setTogglesChanged] = useState(false);

  useEffect(() => {
    const fetchAffirmations = async () => {
      if (!userId || !userSettings.selectedCategories?.length || !userSettings.jobStatus) return;

      try {
        console.log("Fetching affirmations...");
        console.log("Job Status during fetch:", userSettings.jobStatus);
        console.log("Selected Categories during fetch:", userSettings.selectedCategories);

        let categoryMap = {};

        for (const category of userSettings.selectedCategories) {
          const path = `/topic/career_growth/job_status/${userSettings.jobStatus}/practice/${category}`;
          console.log("Fetching from path:", path);

          const docRef = doc(db, path);
          const docSnap = await getDoc(docRef);

          categoryMap[category] = docSnap.exists()
            ? Object.values(docSnap.data())
            : [];
        }

        const limitedAffirmations = shuffleAndLimit(categoryMap, 30); // Max 30 affirmations
        console.log("Limited affirmations:", limitedAffirmations);

        setAffirmations(limitedAffirmations);
        setCurrentIndex(0); // Reset index when new affirmations are fetched
      } catch (error) {
        console.error("Error fetching affirmations:", error);
      }
    };

    if (togglesChanged) {
      console.log("Toggles have changed. Fetching affirmations...");
      fetchAffirmations();
      setTogglesChanged(false);
    }
  }, [togglesChanged, userSettings, userId]);

  const nextAffirmation = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % affirmations.length; // Loop back to the start
      console.log("Moving to next affirmation. New index:", newIndex);
      return newIndex;
    });
  };

  return {
    affirmations,
    currentAffirmation: affirmations[currentIndex] || null,
    setTogglesChanged,
    currentIndex,
    nextAffirmation,
  };
};

export default useAffirmations;
