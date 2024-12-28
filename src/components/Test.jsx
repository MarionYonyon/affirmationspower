import React, { useState } from "react";
import "../styles/Test.css";
import futureSelfIcon from "../images/future-self-purple-green.svg";
import overcomingBarriersIcon from "../images/overcoming-barriers-purple-green.svg";
import specialSituationsIcon from "../images/special-situations-purple-green.svg";
import mindsetInspirationIcon from "../images/mindset-inspiration-purple-green.svg";

const Test = () => {
  const [selectedButtons, setSelectedButtons] = useState({});

  const toggleButton = (category, button) => {
    setSelectedButtons((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [button]: !prev[category]?.[button],
      },
    }));
  };

  return (
    <div className="container2">
      <div className="block purple-block">
        <div className="main-text">
          <img src={futureSelfIcon} alt="Future Self Icon" className="icon" />
          Future Self
        </div>
        <div className="sub-buttons">
          {["Financial Abundance", "Work-Life Balance", "Career Growth", "Skill Recognition"].map((button) => (
            <button
              key={button}
              className={selectedButtons["Future Self"]?.[button] ? "selected" : ""}
              onClick={() => toggleButton("Future Self", button)}
            >
              {button}
              {selectedButtons["Future Self"]?.[button] && <span className="tick">✔</span>}
            </button>
          ))}
        </div>
      </div>
      <div className="block white-block">
        <div className="main-text">
          <img src={overcomingBarriersIcon} alt="Overcoming Barriers Icon" className="icon" />
          Overcoming Barriers
        </div>
        <div className="sub-buttons">
          {["Stress Relief", "Self-Confidence", "Resilience"].map((button) => (
            <button
              key={button}
              className={selectedButtons["Overcoming Barriers"]?.[button] ? "selected" : ""}
              onClick={() => toggleButton("Overcoming Barriers", button)}
            >
              {button}
              {selectedButtons["Overcoming Barriers"]?.[button] && <span className="tick">✔</span>}
            </button>
          ))}
        </div>
      </div>
      <div className="block white-block">
        <div className="main-text">
          <img src={specialSituationsIcon} alt="Special Situations Icon" className="icon" />
          Special Situations
        </div>
        <div className="sub-buttons">
          {["Interview Prep", "Networking"].map((button) => (
            <button
              key={button}
              className={selectedButtons["Special Situations"]?.[button] ? "selected" : ""}
              onClick={() => toggleButton("Special Situations", button)}
            >
              {button}
              {selectedButtons["Special Situations"]?.[button] && <span className="tick">✔</span>}
            </button>
          ))}
        </div>
      </div>
      <div className="block purple-block">
        <div className="main-text">
          <img src={mindsetInspirationIcon} alt="Mindset & Inspiration Icon" className="icon" />
          Mindset & Inspiration
        </div>
        <div className="sub-buttons">
          {["Gratitude", "Purpose", "Motivation", "Goal Setting"].map((button) => (
            <button
              key={button}
              className={selectedButtons["Mindset & Inspiration"]?.[button] ? "selected" : ""}
              onClick={() => toggleButton("Mindset & Inspiration", button)}
            >
              {button}
              {selectedButtons["Mindset & Inspiration"]?.[button] && <span className="tick">✔</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Test;