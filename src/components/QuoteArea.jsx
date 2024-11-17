import "../styles/QuoteArea.css";
import FunFactGenerator from "./FunFactGenerator";
import yesIcon from "../images/yes-icon.png";
import noIcon from "../images/no-icon.png";
import crossIcon from "../images/icon-cross-quote.png";
import React, { useState } from "react";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { saveProgress } from "./firebaseHelpers";

function QuoteArea({ progress, setProgress }) {
  const [fetchFactTrigger, setFetchFactTrigger] = useState(false);

  const handleYesClick = () => {
    setFetchFactTrigger((prev) => !prev);
    incrementProgress();
  };

  const handleNoClick = () => {
    incrementProgress();
  };

  const incrementProgress = () => {
    const newProgress = Math.min(progress + 1, 100); // Cap at 100
    setProgress(newProgress);

    // Save progress to Firebase
    onAuthStateChanged(auth, (user) => {
      if (user) {
        saveProgress(user.uid, newProgress);
      } else {
        console.error("User is not authenticated.");
      }
    });
  };

  return (
    <div className="Quote-area">
      <p className="Quote">
        <FunFactGenerator fetchFactTrigger={fetchFactTrigger} />
      </p>
      <p className="Legend-quote">
        Rate your actual feeling as “Not yet” or “That’s it!”
      </p>
      <div className="yes-no-container">
        <button className="yes-icon" onClick={handleYesClick}>
          <img src={yesIcon} alt="yes-icon" />
        </button>
        <button className="no-icon" onClick={handleNoClick}>
          <img src={noIcon} alt="no-icon" />
        </button>
      </div>
      <button className="cross-icon">
        <img src={crossIcon} alt="cross-icon" />
      </button>
    </div>
  );
}

export default QuoteArea;
