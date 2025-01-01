// CategoryToggle.js

import React from "react";
import { AFFIRMATION_LABELS } from "../utils/constants";
import "../styles/CategoryToggle.css";

const CategoryToggle = ({
  keys = [], // Accept specific keys to render
  selectedCategories = [],
  setSelectedCategories,
}) => {
  const toggleCategory = (category) => {
    if (!Array.isArray(selectedCategories)) {
      console.error("selectedCategories is not an array:", selectedCategories);
      return;
    }

    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    // Ensure at least one toggle remains enabled
    if (updatedCategories.length === 0) {
      console.warn("At least one category must remain enabled.");
      return;
    }

    setSelectedCategories(updatedCategories);
  };

  return (
    <div className="container2">
      {keys.map((category) => (
        <div
          key={category}
          className={`button ${selectedCategories.includes(category) ? "selected" : ""}`}
          onClick={() => toggleCategory(category)}
        >
          <span>{AFFIRMATION_LABELS[category]}</span>
          {selectedCategories.includes(category) && <span className="tick">✓</span>}
        </div>
      ))}
    </div>
  );
};

export default CategoryToggle;
