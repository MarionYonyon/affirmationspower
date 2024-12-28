import "../styles/Parameters.css";
import React from "react";
import NavBar from "./NavBar.jsx";
import AffirmationTopic from "./AffirmationsTopics.jsx";
import Tabs from "./Tabs.js";

function ParametersPage() {
  return (
    <div className="parameters-page-wrapper">
      <NavBar />
      <Tabs />
      <div className="affirmation-topics-container">
        <AffirmationTopic />
      </div>
    </div>
  );
}

export default ParametersPage;
