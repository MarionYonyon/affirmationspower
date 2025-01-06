// useAffirmations.js

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import shuffleAndLimit from "../utils/shuffleAndLimit";
import initializeSettings from "../components/initializeSettings";

const useAffirmations = () => {
  const { selectedCategories: defaultCategories, jobStatus: defaultJobStatus } =
    initializeSettings();

  const [selectedCategories, setSelectedCategories] =
    useState(defaultCategories);
  const [jobStatus, setJobStatus] = useState(defaultJobStatus);
  const [affirmations, setAffirmations] = useState(
    () => JSON.parse(localStorage.getItem("affirmations")) || []
  );
  const [currentIndex, setCurrentIndex] = useState(
    () => parseInt(localStorage.getItem("currentIndex"), 10) || 0
  );
  const [loading, setLoading] = useState(false); // New loading state
  const [togglesChanged, setTogglesChanged] = useState(false);

  useEffect(() => {
    const fetchAffirmations = async () => {
      setLoading(true); // Start loading
      try {
        console.log("Fetching affirmations...");
        console.log("Job Status:", jobStatus);
        console.log("Selected Categories:", selectedCategories);

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
        const limitedAffirmations = shuffleAndLimit(categoryMap, 4); // Max 4 affirmations
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
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (togglesChanged) {
      fetchAffirmations();
      setTogglesChanged(false);
    }
  }, [togglesChanged, jobStatus, selectedCategories]);

  useEffect(() => {
    localStorage.setItem(
      "selectedCategories",
      JSON.stringify(selectedCategories)
    );
  }, [selectedCategories]);

  useEffect(() => {
    localStorage.setItem("jobStatus", jobStatus);
  }, [jobStatus]);

  useEffect(() => {
    localStorage.setItem("currentIndex", currentIndex.toString());
  }, [currentIndex]);

  const nextAffirmation = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % affirmations.length; // Loop back to the start
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
    loading, // Expose loading state
  };
};

export default useAffirmations;
