import React from "react";

const NumberInput = ({ id, min, max, value, onChange }) => {
  const handleInputChange = (event) => {
    const newValue = Number(event.target.value); // Ensure the value is a number
    if (onChange) {
      onChange(newValue); // Call the onChange handler passed from SettingsPage
    }
  };

  return (
    <input
      id={id}
      type="number"
      min={min}
      max={max}
      className="settings-value"
      value={value} // Display the current value
      onChange={handleInputChange} // Trigger updates on change
      style={{ color: "#673ab7", width: "50px" }}
    />
  );
};

export default NumberInput;