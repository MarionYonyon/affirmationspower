import "../styles/Settings.css";
import React from "react";
import SettingsSection from "./SettingsSection";
import SettingsItem from "./SettingsItem";
import SwitchToggle from "./SwitchToggle";
import Dropdown from "./Dropdown";
import NumberInput from "./NumberInput";
import NavBar from "./NavBar";
import Logout from "./Logout";
import useGoalAndProgress from "../hooks/useGoalAndProgress";
import { AFFIRMATION_LABELS } from "../hooks/useAffirmations";

const SettingsPage = () => {
  const { dailyGoal, handleGoalChange } = useGoalAndProgress(); // Destructure hook values

  return (
    <div id="content" className="container">
      <SettingsSection title="GENERAL">
        <SettingsItem label="Topic" value="Work & Career >" />
        <SettingsItem label="Appearance" value="Light >" />
        <SettingsItem label="Daily reminder" value=">" />
        <SettingsItem label="Daily goal">
          <NumberInput
            id="daily-goal-input"
            type="number"
            value={dailyGoal} // Display the current dailyGoal
            onChange={handleGoalChange} // Handle updates to the dailyGoal
          />
        </SettingsItem>
        <SettingsItem label="Job Status">
          <Dropdown
            id="job-status-dropdown"
            options={[
              { dataKey: "career_changer", label: "Career Changer" },
              { dataKey: "unemployed", label: "Unemployed" },
            ]}
          />
        </SettingsItem>
      </SettingsSection>

      <SettingsSection title="AFFIRMATIONS">
        {Object.entries(AFFIRMATION_LABELS).map(([key, label]) => (
          <SettingsItem key={key} label={label}>
            <SwitchToggle dataKey={key} />
          </SettingsItem>
        ))}
      </SettingsSection>

      <SettingsSection title="ACCOUNT">
        <Logout />
      </SettingsSection>
      <NavBar />
    </div>
  );
};

export default SettingsPage;
