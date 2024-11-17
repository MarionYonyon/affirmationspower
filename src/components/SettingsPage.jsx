import "../styles/Settings.css";
import React, { useState, useEffect } from "react";
import SettingsSection from "./SettingsSection";
import SettingsItem from "./SettingsItem";
import SwitchToggle from "./SwitchToggle";
import Dropdown from "./Dropdown";
import NumberInput from "./NumberInput";
import NavBar from "./NavBar";
import Logout from "./Logout";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { saveGoal } from "./firebaseHelpers";

const SettingsPage = () => {
  const [dailyGoal, setDailyGoal] = useState(100); // Default to 0
  useEffect(() => {
    // Fetch dailyGoal from Firestore when the page loads
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(docRef);
        if (userDoc.exists() && userDoc.data().dailyGoal !== undefined) {
          setDailyGoal(userDoc.data().dailyGoal); // Set the fetched value
        }
      }
    });
  }, []);

  const handleDailyGoalChange = (newGoal) => {
    setDailyGoal(newGoal); // Update the local state
    onAuthStateChanged(auth, (user) => {
      if (user) {
        saveGoal(user.uid, newGoal); // Save the new value to Firestore
      }
    });
  };

  return (
    <div id="content" className="container">
      <SettingsSection title="GENERAL">
        <SettingsItem label="Topic" value="Work & Career >" />
        <SettingsItem label="Appearance" value="Light >" />
        <SettingsItem label="Daily reminder" value=">" />
        <SettingsItem label="Daily goal">
          <NumberInput
            id="daily-goal-input"
            min={10}
            max={100}
            value={dailyGoal} // Display the current dailyGoal
            onChange={handleDailyGoalChange} // Handle updates to the dailyGoal
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
