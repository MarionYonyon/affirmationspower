import React from "react";
import useAffirmations from "../hooks/useAffirmations";

const SwitchToggle = ({ dataKey }) => {
  const { affirmations, handleToggleChange } = useAffirmations();

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
