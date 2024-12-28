import React from "react";
import useAffirmationsToggles from "../hooks/useAffirmationsToggles";
import "../styles/SwitchToggle.css";

const SwitchToggle = ({ dataKey, label, blockStyle }) => {
  const { affirmations, handleToggleChange } = useAffirmationsToggles();

  const handleChange = () => {
    const currentValue = affirmations[dataKey] || false;
    handleToggleChange(dataKey, !currentValue); // Save the key to the database
  };

  return (
    <div
      className={`button ${blockStyle} ${affirmations[dataKey] ? "selected" : ""}`}
      onClick={handleChange}
    >
      <span>{label}</span> {/* Display the label */}
      {affirmations[dataKey] && <span className="tick">✓</span>} {/* Tick icon */}
    </div>
  );
};

export default SwitchToggle;