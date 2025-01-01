//ProgressPractice

import React, { useState, useEffect } from "react";

const ProgressPractice = ({ currentAffirmation, nextAffirmation, loading }) => {
  const [progressStep, setProgressStep] = useState(0);
  const maxSteps = 4; // Total steps (0: Read Silently, 1: Read Aloud, 2: Visualize, 3: ✓ Complete)

  const progressText = [
    "Read Silently",
    "Read Aloud",
    "Visualize",
    "✓ Complete",
  ];

  useEffect(() => {
    if (progressStep === maxSteps - 1) {
      // Auto-transition to next affirmation after the last step
      const timer = setTimeout(() => {
        nextAffirmation();
        setProgressStep(0);
      }, 1000); // 1 second delay for smooth transition
      return () => clearTimeout(timer); // Cleanup timer on unmount or step change
    }
  }, [progressStep, nextAffirmation]);

  const handleProgressClick = () => {
    if (progressStep < maxSteps - 1) {
      setProgressStep((prevStep) => prevStep + 1);
    }
  };

  if (loading) {
    return <p>Loading today's affirmations...</p>;
  }

  if (!currentAffirmation) {
    return <p>No affirmations available.</p>;
  }

  return (
    <div className="affirmation-generator">
      <p>{currentAffirmation}</p>
      <button
        id="read-visualize-btn"
        className="yes-icon"
        onClick={handleProgressClick}
        disabled={progressStep === maxSteps - 1}
      >
        <span id="read-visualize-text">{progressText[progressStep]}</span>
        <div
          className="read-visualize-progress-bar"
          style={{ width: `${(progressStep / (maxSteps - 1)) * 100}%` }}
        ></div>
      </button>
    </div>
  );
};

export default ProgressPractice;
