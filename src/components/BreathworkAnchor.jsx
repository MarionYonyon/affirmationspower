import React, { useState } from 'react';
import "../styles/ToggleButtons.css";
import breathworkGrey from "../images/breathworkGrey.svg";
import breathworkPurple from "../images/breathworkPurple.svg";

const BreathworkAnchor = () => {
  const [isActive, setIsActive] = useState(false);
  const [isGifVisible, setGifVisible] = useState(false);

  const toggleButton = () => {
    setIsActive((prevState) => !prevState);
    setGifVisible((prevState) => !prevState);
  };

  return (
    <div className="toggle-onoff-container">
      <button
        className={`toggle-anchor-button ${isActive ? "active" : ""}`}
        onClick={toggleButton}
      >
        <img
          src={isActive ? breathworkPurple : breathworkGrey} /* Fixed here */
          alt="breathwork-icon"
        />
      </button>
      {isGifVisible && (
        <img
          src={`${process.env.PUBLIC_URL}/Breathe-symbol-purple.gif`}
          alt="Breathe Symbol"
          className="breathe-gif"
        />
      )}
    </div>
  );
};

export default BreathworkAnchor;
