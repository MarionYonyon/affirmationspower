import React from "react";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { saveJobStatus } from "./firebaseHelpers";

const Dropdown = ({ id, options }) => {
  const handleDropdownChange = (event) => {
    const value = event.target.value;

    // Get the authenticated user and log dropdown change
    onAuthStateChanged(auth, (user) => {
      if (user) {
        saveJobStatus(user.uid, value)
      }
    });
  }

  return (
    <select
      id={id}
      className="settings-value dropdown-style"
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