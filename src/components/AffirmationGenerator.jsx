import "../styles/QuoteArea.css";
import React, { useState, useEffect } from "react";
import useDailyAffirmations from "../hooks/useDailyAffirmations";
import useGoalAndProgress from "../hooks/useGoalAndProgress";
import { logClickAction } from "../utils/firebaseHelpers";

const AffirmationGenerator = ({ fetchTrigger }) => {
  const { affirmations, loading } = useDailyAffirmations();
  const { incrementDailyProgress } = useGoalAndProgress(); // Hook for incrementing progress
  const [currentAffirmation, setCurrentAffirmation] = useState("");
  const [progressStep, setProgressStep] = useState(0); // Track progress
  const maxSteps = 4; // Total steps, but last one auto-transitions

  useEffect(() => {
    if (!loading && affirmations.length > 0) {
      // Display a random affirmation when the component mounts or fetchTrigger changes
      setCurrentAffirmation(
        affirmations[Math.floor(Math.random() * affirmations.length)]
      );
      setProgressStep(0); // Reset progress when a new affirmation is fetched
    }
  }, [loading, affirmations, fetchTrigger]);

  useEffect(() => {
    // Auto-transition after Step 3
    if (progressStep === maxSteps - 1) {
      // Automatically fetch a new affirmation after the final step
      const timer = setTimeout(() => {
        incrementDailyProgress(1); // Increment daily progress here
        setProgressStep(0);
        logClickAction("YesClick");
        setCurrentAffirmation(
          affirmations[Math.floor(Math.random() * affirmations.length)]
        );
      }, 1000); // Delay of 1 second for smooth transition

      return () => clearTimeout(timer); // Cleanup timeout
    }
  }, [progressStep, affirmations, incrementDailyProgress]);

  const handleYesClick = () => {
    if (progressStep < maxSteps - 1) {
      // Move to the next step
      setProgressStep(progressStep + 1);
    }
  };

  const progressText =
    ["Read Silently", "Read Aloud", "Visualize", "Visualize"][progressStep] ||
    "Read Silently";

  if (loading) {
    return <p>Loading today's affirmations...</p>;
  }

  return (
    <div className="affirmation-generator">
      <p>{currentAffirmation}</p>
      <div className="read-visualize-container">
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
    </div>
  );
};

export default AffirmationGenerator;
