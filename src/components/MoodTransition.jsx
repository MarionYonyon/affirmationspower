import React from "react";
import "../styles/MoodTransition.css"; // Create a separate CSS file for styling
import SmileyGood from "../images/SmileyGood.svg";
import SmileySad from "../images/SmileySad.svg";

const MoodTransition = () => {
  return (
    <div className="mood-transition-container">
      <div className="mood-card">
        <img src={SmileySad} alt="Overwhelmed" className="mood-icon sad-icon" />
        <p className="mood-text">Overwhelmed</p>
      </div>
      <div className="arrow">→</div>
      <div className="mood-card">
        <img src={SmileyGood} alt="Thriving" className="mood-icon happy-icon" />
        <p className="mood-text thriving-text">Thriving</p>
      </div>
    </div>
  );
};

export default MoodTransition;
