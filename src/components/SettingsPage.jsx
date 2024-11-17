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
        <SettingsItem label="Motivation and Inspiration">
          <SwitchToggle dataKey="motivation_and_inspiration" />
        </SettingsItem>
        <SettingsItem label="Self-Confidence">
          <SwitchToggle dataKey="self_confidence" />
        </SettingsItem>
        <SettingsItem label="Career Growth and Advancement">
          <SwitchToggle dataKey="career_growth" />
        </SettingsItem>
        <SettingsItem label="Resilience and Perseverance">
          <SwitchToggle dataKey="resilience" />
        </SettingsItem>
        <SettingsItem label="Skill Recognition and Development">
          <SwitchToggle dataKey="skill_recognition" />
        </SettingsItem>
        <SettingsItem label="Networking and Connections">
          <SwitchToggle dataKey="networking" />
        </SettingsItem>
        <SettingsItem label="Goal Setting and Achievement">
          <SwitchToggle dataKey="goal_setting" />
        </SettingsItem>
        <SettingsItem label="Interview Preparation">
          <SwitchToggle dataKey="interview_preparation" />
        </SettingsItem>
        <SettingsItem label="Stress Relief and Mindfulness">
          <SwitchToggle dataKey="stress_relief" />
        </SettingsItem>
        <SettingsItem label="Financial Abundance and Stability">
          <SwitchToggle dataKey="financial_abundance" />
        </SettingsItem>
        <SettingsItem label="Work-Life Balance">
          <SwitchToggle dataKey="work_life_balance" />
        </SettingsItem>
      </SettingsSection>
      <SettingsSection title="ACCOUNT">
        <Logout />
      </SettingsSection>
      <NavBar />
    </div>
  );
};

export default SettingsPage;
