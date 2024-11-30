import "../styles/QuoteArea.css";
import AffirmationGenerator from "./AffirmationGenerator";
import yesIcon from "../images/yes-icon.png";
import noIcon from "../images/no-icon.png";
import crossIcon from "../images/icon-cross-quote.png";
import React, {useState} from "react";
import useGoalAndProgress from "../hooks/useGoalAndProgress";

const QuoteArea = () => {
  const { incrementProgress } = useGoalAndProgress();
  const [fetchTrigger, setFetchTrigger] = useState(false);

  const handleYesClick = () => {
    incrementProgress(1); // Increment by 1 for "Yes"
    setFetchTrigger(!fetchTrigger); // Toggle to refresh affirmations
  };

  const handleNoClick = () => {
    incrementProgress(1); // Increment by 1 for "No" (or adjust as needed)
    setFetchTrigger(!fetchTrigger); // Toggle to refresh affirmations
  };

  return (
    <div className="Quote-area">
      <p className="Quote">
        <AffirmationGenerator fetchTrigger={fetchTrigger} />
      </p>
      <p className="Legend-quote">
        Rate your actual feeling as “Not yet” or “That’s it!”
      </p>
      <div className="yes-no-container">
      <button className="no-icon" onClick={handleNoClick}>
          <img src={noIcon} alt="no-icon" />
        </button>
        <button className="yes-icon" onClick={handleYesClick}>
          <img src={yesIcon} alt="yes-icon" />
        </button>
      </div>
      <button className="cross-icon">
        <img src={crossIcon} alt="cross-icon" />
      </button>
    </div>
  );
};

export default QuoteArea;
