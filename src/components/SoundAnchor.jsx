import React, { useState, useRef } from "react";
import "../styles/ToggleButtons.css";
import soundGrey from "../images/soundGrey.svg";
import soundPurple from "../images/soundPurple.svg";

const SoundAnchor = () => {
  const [isActive, setIsActive] = useState(false);
  const audioRef = useRef(
    new Audio(`${process.env.PUBLIC_URL}/AnchorMusic1.mp3`)
  );

  // Ensure the audio loops
  audioRef.current.loop = true;

  const toggleSound = () => {
    setIsActive((prevState) => {
      const newState = !prevState;

      if (newState) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // Reset playback to the start
      }

      return newState;
    });
  };

  return (
    <div className="toggle-onoff-container">
      <button
        className={`toggle-anchor-button ${isActive ? "active" : ""}`}
        onClick={toggleSound}
      >
        <img
          src={isActive ? soundPurple : soundGrey} /* Icon changes */
          alt="sound-icon"
        />
      </button>
    </div>
  );
};

export default SoundAnchor;
