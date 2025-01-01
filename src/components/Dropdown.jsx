import React from "react";

const Dropdown = ({ id, options, value, onChange }) => (
  <select
    id={id}
    className="settings-value dropdown-style"
    value={value}
    onChange={(event) => onChange(event.target.value)} // Ensure correct callback
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

export default Dropdown;
