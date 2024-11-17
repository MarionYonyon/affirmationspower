import React from "react";

const SettingsSection = ({ title, children }) => {
  return (
    <>
      <div className="settings-section-title">{title}</div>
      <div className="settings-section">{children}</div>
    </>
  );
};

export default SettingsSection;
