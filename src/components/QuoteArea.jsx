import "../styles/QuoteArea.css";
import AffirmationGenerator from "./AffirmationGenerator";
import yesIcon from "../images/yes-icon.png";
import noIcon from "../images/no-icon.png";
import crossIcon from "../images/icon-cross-quote.png";
import React, {useState} from "react";
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

  const handleNoClick = () => {
    incrementProgress(1); // Increment by 1 for "No" (or adjust as needed)
    logClickAction("NoClick");
    setFetchTrigger(!fetchTrigger); // Toggle to refresh affirmations
  };

  const handleCrossClick = () => {
    incrementProgress(1); // Increment by 1 for "No" (or adjust as needed)
    logClickAction("CrossClick");
    setFetchTrigger(!fetchTrigger); // Toggle to refresh affirmations
  };

  return (
    <div className="Quote-area">
      <div className="Quote">
        <AffirmationGenerator fetchTrigger={fetchTrigger} />
      </div>
      <p className="Legend-quote">
      Does this resonate with you?
      </p>
      <div className="yes-no-container">
      <button className="no-icon" onClick={handleNoClick}>
          <img src={noIcon} alt="no-icon" />
        </button>
        <button className="yes-icon" onClick={handleYesClick}>
          <img src={yesIcon} alt="yes-icon" />
        </button>
      </div>
      <button className="cross-icon" onClick={handleCrossClick}>
        <img src={crossIcon} alt="cross-icon" />
      </button>
    </div>
  );
};

export default QuoteArea;
