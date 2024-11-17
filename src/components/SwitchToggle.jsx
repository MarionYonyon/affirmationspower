import React from "react";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { saveAffirmation } from "./firebaseHelpers";

const SwitchToggle = ({ dataKey }) => {
  const handleToggleChange = (event) => {
    const value = event.target.checked;

    // Get the authenticated user and log affirmation toggle change
    onAuthStateChanged(auth, (user) => {
      if (user) {
        saveAffirmation(user.uid, dataKey, value);
      }
    });
  };

  return (
    <label className="switch">
      <input
        type="checkbox"
        data-affirmation-key={dataKey}
        onChange={handleToggleChange}
      />
      <span className="slider"></span>
    </label>
  );
};

export default SwitchToggle;