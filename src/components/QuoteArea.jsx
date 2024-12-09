import "../styles/QuoteArea.css";
import AffirmationGenerator from "./AffirmationGenerator";
import crossIcon from "../images/icon-cross-quote.png";
import React, { useState } from "react";
import { logClickAction } from "../utils/firebaseHelpers";

const QuoteArea = () => {
  const [fetchTrigger, setFetchTrigger] = useState(false);

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
