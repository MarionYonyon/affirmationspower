import "../styles/QuoteArea.css";
import ProgressPractice from "./ProgressPractice";
import React, { useContext } from "react";
import { logClickAction } from "../utils/firebase/loggingUtils";
import { AppContext } from "../context/AppContext";
import useGoalAndProgress from "../hooks/useGoalAndProgress"; // Import the hook
import next from "../images/next.svg";

const QuoteArea = () => {
  const { currentAffirmation, nextAffirmation, affirmationsLoading } = useContext(AppContext);
  const { incrementDailyProgress } = useGoalAndProgress(); // Use the hook

  const handleNextClick = () => {
    logClickAction("NextClick"); // Log the click action
    incrementDailyProgress(1); // Increment progress by 1
    nextAffirmation(); // Proceed to the next affirmation
  };

  if (affirmationsLoading) {
    return <p>Loading affirmations...</p>;
  }

  return (
    <div className="Quote-area">
      <div className="Quote">
        <ProgressPractice
          currentAffirmation={currentAffirmation}
          nextAffirmation={handleNextClick}
          loading={affirmationsLoading}
        />
      </div>
      <button className="next-icon" onClick={handleNextClick}>
        <img src={next} alt="next-icon" />
      </button>
    </div>
  );
};

export default QuoteArea;
