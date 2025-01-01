import "../styles/QuoteArea.css";
import ProgressPractice from "./ProgressPractice"; // Replacing AffirmationGenerator
import React from "react";
import { logClickAction } from "../utils/firebaseHelpers";
import useAffirmations from "../hooks/useAffirmations";
import next from "../images/next.svg";

const QuoteArea = () => {
  const { currentAffirmation, nextAffirmation, loading } = useAffirmations(); // Using state management from useAffirmations.js

  const handleNextClick = () => {
    logClickAction("NextClick");
    nextAffirmation(); // Move to the next affirmation
  };

  return (
    <div className="Quote-area">
      <div className="Quote">
        <ProgressPractice
          currentAffirmation={currentAffirmation}
          nextAffirmation={handleNextClick}
          loading={loading}
        />
      </div>
      <button className="next-icon" onClick={handleNextClick}>
        <img src={next} alt="next-icon" />
      </button>
    </div>
  );
};

export default QuoteArea;
