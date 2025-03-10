import "../styles/AffirmationTopics.css";
import React from "react";
import CategoryToggle from "./CategoryToggle";
import { AFFIRMATION_CATEGORIES } from "../utils/constants";

const AffirmationTopics = ({ selectedCategories, handleCategoryChange }) => {
  const renderSection = (title, { icon, keys }) => {
    // Determine the block style based on the title
    const blockStyle =
      title === "Confidence & Self-Belief" ||
      title === "Success & Career Growth"
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
      {Object.entries(AFFIRMATION_CATEGORIES).map(([title, categoryData]) =>
        renderSection(title, categoryData)
      )}
    </div>
  );
};

export default AffirmationTopics;
