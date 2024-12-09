import "../styles/QuoteArea.css";
import AffirmationGenerator from "./AffirmationGenerator";
import crossIcon from "../images/icon-cross-quote.png";
import React, { useState } from "react";
import useGoalAndProgress from "../hooks/useGoalAndProgress";
import { logClickAction } from "../utils/firebaseHelpers";

const QuoteArea = () => {
  const { incrementProgress } = useGoalAndProgress();
  const [fetchTrigger, setFetchTrigger] = useState(false);

  const handleYesClick = () => {
    incrementProgress(1); // Increment by 1 for "Yes"
    logClickAction("YesClick");
    setFetchTrigger(!fetchTrigger); // Toggle to refresh affirmations
  };

  const handleCrossClick = () => {
    logClickAction("CrossClick");
    setFetchTrigger(!fetchTrigger); // Toggle to refresh affirmations
  };

  return (
    <div className="Quote-area">
      <div className="Quote">
        <AffirmationGenerator fetchTrigger={fetchTrigger} />
      </div>
      <button className="cross-icon" onClick={handleCrossClick}>
        <img src={crossIcon} alt="cross-icon" />
      </button>
    </div>
  );
};

export default QuoteArea;
