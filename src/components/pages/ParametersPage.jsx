import "../../styles/Parameters.css";
import React from "react";
import AffirmationTopic from "../AffirmationsTopics.jsx";
import Tabs from "../Tabs.js";
import FeedbackButton from "../FeedbackButton.js";

function ParametersPage() {
  return (
    <div className="parameters-page-wrapper">
      <div className="tabs-container">
        <Tabs />
      </div>
      <div className="affirmation-topics-container">
        <AffirmationTopic />
      </div>
      <div className="feedback-container">
        <FeedbackButton />
      </div>
    </div>
  );
}

export default ParametersPage;
