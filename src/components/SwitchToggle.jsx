import React from "react";
import useAffirmationsToggles from "../hooks/useAffirmationsToggles";

const SwitchToggle = ({ dataKey }) => {
  const { affirmations, handleToggleChange } = useAffirmationsToggles();

  const handleChange = (event) => {
    const value = event.target.checked;
    handleToggleChange(dataKey, value);
  };

  return (
    <label className="switch">
      <input
        type="checkbox"
        data-affirmation-key={dataKey}
        checked={affirmations[dataKey] || false} // Default to false if not in state
        onChange={handleChange}
      />
      <span className="slider"></span>
    </label>
  );
};

export default SwitchToggle;
