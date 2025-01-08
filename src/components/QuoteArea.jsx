import "../styles/QuoteArea.css";
import ProgressPractice from "./ProgressPractice";
import React, { useContext } from "react";
import { logClickAction } from "../utils/firebase/loggingUtils";
import { AppContext } from "../context/AppContext";
import next from "../images/next.svg";

const QuoteArea = () => {
  const { currentAffirmation, nextAffirmation, affirmationsLoading } = useContext(AppContext);

  const handleNextClick = () => {
    logClickAction("NextClick");
    nextAffirmation();
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
