import { useState, useEffect } from "react";
import { auth, db } from "../components/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const AFFIRMATION_LABELS = {
  motivation_and_inspiration: "Motivation and Inspiration",
  self_confidence: "Self-Confidence",
  career_growth: "Career Growth and Advancement",
  resilience: "Resilience and Perseverance",
  skill_recognition: "Skill Recognition and Development",
  networking: "Networking and Connections",
  goal_setting: "Goal Setting and Achievement",
  interview_preparation: "Interview Preparation",
  stress_relief: "Stress Relief and Mindfulness",
  financial_abundance: "Financial Abundance and Stability",
  work_life_balance: "Work-Life Balance",
};

const useAffirmations = () => {
  // Initialize state dynamically from AFFIRMATION_LABELS
  const defaultState = Object.keys(AFFIRMATION_LABELS).reduce(
    (acc, key) => ({
      ...acc,
      [key]: key === "motivation_and_inspiration", // Only enable "Motivation and Inspiration" by default
    }),
    {}
  );

  const [affirmations, setAffirmations] = useState(defaultState);

  useEffect(() => {
    const fetchAffirmations = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(docRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.affirmationsToggles) {
            setAffirmations((prev) => ({
              ...prev,
              ...data.affirmationsToggles,
            }));
          }
        }
      }
    };

    fetchAffirmations();
  }, []);

  const saveAffirmation = async (uid, affirmationKey, value) => {
    try {
      const docRef = doc(db, "users", uid);
      await setDoc(
        docRef,
        { affirmationsToggles: { [affirmationKey]: value } },
        { merge: true }
      );
      console.log(`Affirmation ${affirmationKey} updated successfully!`);
    } catch (error) {
      console.error(`Error updating affirmation ${affirmationKey}:`, error);
    }
  };

  const handleToggleChange = async (key, value) => {
    const user = auth.currentUser;
    if (user) {
      try {
        await saveAffirmation(user.uid, key, value);
        setAffirmations((prev) => ({
          ...prev,
          [key]: value,
        }));
      } catch (error) {
        console.error("Failed to save affirmation:", error);
      }
    }
  };

  return { affirmations, handleToggleChange };
};

export default useAffirmations;