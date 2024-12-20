import React from "react";

const NumberDropdown = ({ id, min, max, value, onChange }) => {
  const generateOptions = (min, max, step) => {
    const options = [];
    for (let i = min; i <= max; i += step) {
      options.push(i);
    }
    return options;
  };

  const handleSelectChange = (event) => {
    const newValue = Number(event.target.value); // Convert to number
    if (onChange) {
      onChange(newValue); // Call the onChange handler
    }
  };

  const options = generateOptions(min, max, 5); // Increment by 5

  return (
    <select
      id={id}
      value={value}
      onChange={handleSelectChange}
      className="settings-value dropdown-style"

    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default NumberDropdown;
