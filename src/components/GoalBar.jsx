import useGoalAndProgress from "../hooks/useGoalAndProgress";
import "../styles/GoalBar.css";
import React from "react";

const GoalBar = () => {
  const { progress, dailyGoal } = useGoalAndProgress();
  return (
    <div className="goal-bar-container">
      <div className="fixed-goal-bar"></div>
      <div
        className="progress-goal-bar"
        style={{ width: `${(progress / dailyGoal) * 100}%` }}
      ></div>
      <div className="goal-text-container">
        <span className="goal-text-left legend-goal-bar-1">Daily goal</span>
        <span className="goal-text-right legend-goal-bar-2" translate="no">
          {progress} / {dailyGoal}
        </span>
      </div>
    </div>
  );
};

export default GoalBar;
