import "../styles/QuoteArea.css";
import ProgressPractice from "./ProgressPractice";
import React from "react";
import { logClickAction } from "../utils/firebaseHelpers";
import useAffirmations from "../hooks/useAffirmations";
import next from "../images/next.svg";

const QuoteArea = () => {
  const { currentAffirmation, nextAffirmation, loading } = useAffirmations();

  const handleNextClick = () => {
    logClickAction("NextClick");
    nextAffirmation();
  };

  if (loading) {
    return <p>Loading affirmations...</p>;
  }

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
