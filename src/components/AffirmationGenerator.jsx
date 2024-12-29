import "../styles/QuoteArea.css";
import React, { useState, useEffect } from "react";
import useDailyAffirmations from "../hooks/useDailyAffirmations";
import useGoalAndProgress from "../hooks/useGoalAndProgress";
import { logClickAction } from "../utils/firebaseHelpers";

const AffirmationGenerator = ({ fetchTrigger }) => {
  const { affirmations, loading } = useDailyAffirmations();
  const { incrementDailyProgress } = useGoalAndProgress(); // Hook for incrementing progress
  const [currentAffirmation, setCurrentAffirmation] = useState("");
  const [previousAffirmation, setPreviousAffirmation] = useState(null); // Track the last affirmation
  const [progressStep, setProgressStep] = useState(0); // Track progress
  const maxSteps = 4; // Total steps, but last one auto-transitions

  const getRandomAffirmation = () => {
    if (affirmations.length === 1) {
      return affirmations[0]; // If there's only one affirmation, return it
    }
    let newAffirmation;
    do {
      newAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
    } while (newAffirmation === previousAffirmation); // Ensure it's not the same as the last one
    return newAffirmation;
  };

  useEffect(() => {
    if (!loading && affirmations.length > 0) {
      // Display a random affirmation when the component mounts or fetchTrigger changes
      const affirmation = getRandomAffirmation();
      setCurrentAffirmation(affirmation);
      setPreviousAffirmation(affirmation);
      setProgressStep(0); // Reset progress when a new affirmation is fetched
    }
  }, [loading, affirmations, fetchTrigger]);

  useEffect(() => {
    // Auto-transition after Step 3
    if (progressStep === maxSteps - 1) {
      const timer = setTimeout(() => {
        incrementDailyProgress(1); // Increment daily progress here
        logClickAction("YesClick"); // Log final step
        setProgressStep(0);
        const affirmation = getRandomAffirmation();
        setCurrentAffirmation(affirmation);
        setPreviousAffirmation(affirmation);
      }, 1000); // Delay of 1 second for smooth transition

      return () => clearTimeout(timer); // Cleanup timeout
    }
  }, [progressStep, affirmations, incrementDailyProgress]);

  const handleYesClick = () => {
    if (progressStep < maxSteps - 1) {
      // Log the click for the current progress step
      logClickAction(null, progressStep);
      // Move to the next step
      setProgressStep(progressStep + 1);
    }
  };

  const progressText =
    ["Read Silently", "Read Aloud", "Visualize", "✓"][progressStep] ||
    "Read Silently";

  if (loading) {
    return <p>Loading today's affirmations...</p>;
  }

  return (
    <div className="affirmation-generator">
      <p>{currentAffirmation}</p>
      <button
        id="read-visualize-btn"
        className="yes-icon"
        onClick={handleYesClick}
        disabled={progressStep === maxSteps - 1} // Disable button during auto-transition
      >
        <span id="read-visualize-text">{progressText}</span>
        <div
          className="read-visualize-progress-bar"
          style={{ width: `${(progressStep / (maxSteps - 1)) * 100}%` }}
        ></div>
      </button>
    </div>
  );
};

export default AffirmationGenerator;