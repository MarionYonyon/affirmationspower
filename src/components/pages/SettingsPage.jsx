import "../../styles/Settings.css";
import React from "react";
import SettingsSection from "../SettingsSection";
import SettingsItem from "../SettingsItem";
import Dropdown from "../Dropdown";
import NumberInput from "../NumberInput";
import Logout from "../Logout";
import useGoalAndProgress from "../../hooks/useGoalAndProgress";
import { JOBSTATUS_LABELS } from "../../utils/constants";
import FeedbackButton from "../FeedbackButton";

const SettingsPage = () => {
  const { dailyGoal, handleGoalChange } = useGoalAndProgress(); // Destructure hook values

  return (
    <div className="settings-page-wrapper">
      <div id="content" className="settings-container">
        <SettingsSection title="GENERAL">
          {/* <SettingsItem label="Topic" value="Work & Career >" />
          <SettingsItem label="Appearance" value="Light >">
            {/*<Dropdown id="appearance-dropdown" options={appearanceOptions} />
          </SettingsItem>*/}
          {/* <SettingsItem label="Daily reminder" value="None >" />
          <SettingsItem label="Language" value="English >" />
          <SettingsItem label="Background music" value="Ambient Bloom >" />*/}
          <SettingsItem label="Daily goal">
            <NumberInput
              id="daily-goal-input"
              type="number"
              value={dailyGoal} // Display the current dailyGoal
              onChange={handleGoalChange} // Handle updates to the dailyGoal
              min={10}
              max={200}
            />
          </SettingsItem>
          <SettingsItem label="Job Status">
            <Dropdown
              id="job-status-dropdown"
              options={Object.entries(JOBSTATUS_LABELS).map(([key, label]) => ({
                value: key,
                label,
              }))}
            />
          </SettingsItem>
        </SettingsSection>
        <SettingsSection title="FEEDBACK">
          <FeedbackButton />
        </SettingsSection>
        <SettingsSection title="ACCOUNT">
          <Logout />
        </SettingsSection>
      </div>
    </div>
  );
};

export default SettingsPage;
