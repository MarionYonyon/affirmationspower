// ParametersPage

import "../styles/Parameters.css";
import React from "react";
import NavBar from "./NavBar.jsx";
import AffirmationTopic from "./AffirmationsTopics.jsx";
import Tabs from "./Tabs.js";
import FeedbackButton from "./FeedbackButton.js"

const ParametersPage = ({ selectedCategories, handleCategoryChange }) => {
  return (
    <div className="parameters-page-wrapper">
      <div className="tabs-container">
        <Tabs />
      </div>
      <div className="affirmation-topics-container">
      <AffirmationTopic
          selectedCategories={selectedCategories}
          handleCategoryChange={handleCategoryChange}
        />
      </div>
      <div className="feedback-container">
        <FeedbackButton />
      </div>
      <NavBar />
    </div>
  );
}

export default ParametersPage;
