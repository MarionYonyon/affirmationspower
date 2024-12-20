import "../styles/QuoteArea.css";
import AffirmationGenerator from "./AffirmationGenerator";
import next from "../images/next.svg";
import React, { useState } from "react";
import { logClickAction } from "../utils/firebaseHelpers";

const QuoteArea = () => {
  const [fetchTrigger, setFetchTrigger] = useState(false);

  const handleNextClick = () => {
    logClickAction("NextClick");
    setFetchTrigger(!fetchTrigger); // Toggle to refresh affirmations
  };

  return (
    <div className="Quote-area">
      <div className="Quote">
        <AffirmationGenerator fetchTrigger={fetchTrigger} />
      </div>
      <button className="next-icon" onClick={handleNextClick}>
        <img src={next} alt="next-icon" />
      </button>
    </div>
  );
};

export default QuoteArea;
