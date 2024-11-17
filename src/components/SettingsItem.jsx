import React from "react";

const SettingsItem = ({ label, value, children }) => {
  return (
    <div className="settings-item">
      <span className="settings-label">{label}</span>
      {value ? <span className="settings-value">{value}</span> : children}
    </div>
  );
};

export default SettingsItem;