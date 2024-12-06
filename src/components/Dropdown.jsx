import React from "react";
import useJobStatus from "../hooks/useJobStatus";

const Dropdown = ({ id, options }) => {
  const { jobStatus, handleJobStatusChange } = useJobStatus();

  const handleDropdownChange = (event) => {
    const value = event.target.value;

    // Ensure the change only applies to the job-status-dropdown
    if (id === "job-status-dropdown") {
      handleJobStatusChange(value);
    }
  };

  return (
    <select
      id={id}
      className="settings-value dropdown-style"
      value={id === "job-status-dropdown" ? jobStatus : ""}
      onChange={handleDropdownChange}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
