import "../styles/AffirmationTopics.css";
import React from "react";
import CategoryToggle from "./CategoryToggle";
import futureSelfIcon from "../images/future-self.svg";
import overcomingBarriersIcon from "../images/overcoming-barriers.svg";
import specialSituationsIcon from "../images/special-situations.svg";
import mindsetInspirationIcon from "../images/mindset-inspiration.svg";

const AffirmationTopics = ({ selectedCategories, handleCategoryChange }) => {
  // Define categories for the keys
  const categories = {
    "Future Self": [
      "financial_abundance",
      "work_life_balance",
      "career_growth",
      "skill_recognition",
    ],
    "Overcoming Barriers": ["stress_relief", "self_confidence", "resilience"],
    "Special Situations": ["interview_preparation", "networking", "face_rejection"],
    "Mindset & Inspiration": [
      "gratitude_positivity",
      "purpose_fulfillment",
      "motivation_and_inspiration",
      "goal_setting",
    ],
  };

  const renderSection = (title, icon, keys) => {
    // Determine the block style based on the title
    const blockStyle =
      title === "Future Self" || title === "Mindset & Inspiration"
        ? "purple-block"
        : "white-block";

    return (
      <div className={`block ${blockStyle}`} key={title}>
        <div className="main-text">
          <img src={icon} alt={`${title} Icon`} className="icon" />
          {title}
        </div>
        <div className="sub-buttons">
          <CategoryToggle
            keys={keys}
            selectedCategories={selectedCategories}
            setSelectedCategories={handleCategoryChange}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="container2">
      {renderSection("Future Self", futureSelfIcon, categories["Future Self"])}
      {renderSection(
        "Overcoming Barriers",
        overcomingBarriersIcon,
        categories["Overcoming Barriers"]
      )}
      {renderSection(
        "Special Situations",
        specialSituationsIcon,
        categories["Special Situations"]
      )}
      {renderSection(
        "Mindset & Inspiration",
        mindsetInspirationIcon,
        categories["Mindset & Inspiration"]
      )}
    </div>
  );
};

export default AffirmationTopics;
