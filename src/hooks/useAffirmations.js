import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import shuffleAndLimit from "../utils/shuffleAndLimit";

const useAffirmations = () => {
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const storedCategories = localStorage.getItem("selectedCategories");
    return storedCategories ? JSON.parse(storedCategories) : null;
  });

  const [jobStatus, setJobStatus] = useState(() => {
    return localStorage.getItem("jobStatus");
  });

  const [affirmations, setAffirmations] = useState(() => {
    return JSON.parse(localStorage.getItem("affirmations")) || [];
  });

  const [currentIndex, setCurrentIndex] = useState(() => {
    return parseInt(localStorage.getItem("currentIndex"), 10) || 0;
  });

  const [togglesChanged, setTogglesChanged] = useState(false);

  // Log initial values of selectedCategories and jobStatus
  console.log("Initial selected categories:", selectedCategories);
  console.log("Initial job status:", jobStatus);

  useEffect(() => {
    const fetchAffirmations = async () => {
      try {
        console.log("Fetching affirmations...");
        console.log("Job Status during fetch:", jobStatus);
        console.log("Selected Categories during fetch:", selectedCategories);

        let categoryMap = {};

        for (const category of selectedCategories) {
          const path = `/topic/career_growth/job_status/${jobStatus}/practice/${category}`;
          console.log("Fetching from path:", path);

          const docRef = doc(db, path);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            console.log(
              "Document data found for category:",
              category,
              docSnap.data()
            );
            categoryMap[category] = Object.values(docSnap.data());
          } else {
            console.warn("No document found at path:", path);
            categoryMap[category] = [];
          }
        }

        // Shuffle and limit affirmations
        const limitedAffirmations = shuffleAndLimit(categoryMap, 30); // Max 30 affirmations
        console.log("Limited affirmations:", limitedAffirmations);

        setAffirmations(limitedAffirmations);
        setCurrentIndex(0); // Reset index when new affirmations are fetched
        localStorage.setItem(
          "affirmations",
          JSON.stringify(limitedAffirmations)
        );
        localStorage.setItem("currentIndex", "0");
      } catch (error) {
        console.error("Error fetching affirmations:", error);
      }
    };

    if (togglesChanged) {
      console.log("Toggles have changed. Fetching affirmations...");
      fetchAffirmations();
      setTogglesChanged(false);
    }
  }, [togglesChanged, jobStatus, selectedCategories]);

  useEffect(() => {
    console.log(
      "selectedCategories changed. Saving to localStorage:",
      selectedCategories
    );
    localStorage.setItem(
      "selectedCategories",
      JSON.stringify(selectedCategories)
    );
  }, [selectedCategories]);

  useEffect(() => {
    console.log("jobStatus changed. Saving to localStorage:", jobStatus);
    localStorage.setItem("jobStatus", jobStatus);
  }, [jobStatus]);

  useEffect(() => {
    console.log("currentIndex changed. Saving to localStorage:", currentIndex);
    localStorage.setItem("currentIndex", currentIndex.toString());
  }, [currentIndex]);

  const nextAffirmation = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % affirmations.length; // Loop back to the start
      console.log("Moving to next affirmation. New index:", newIndex);
      localStorage.setItem("currentIndex", newIndex.toString());
      return newIndex;
    });
  };

  return {
    affirmations,
    currentAffirmation: affirmations[currentIndex] || null,
    selectedCategories,
    setSelectedCategories,
    jobStatus,
    setJobStatus,
    setTogglesChanged,
    currentIndex,
    setCurrentIndex,
    nextAffirmation,
  };
};

export default useAffirmations;
