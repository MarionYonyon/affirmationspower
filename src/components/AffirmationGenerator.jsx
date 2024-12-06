import "../styles/QuoteArea.css";
import React, { useState, useEffect } from "react";
import useDailyAffirmations from "../hooks/useDailyAffirmations";

const AffirmationGenerator = ({ fetchTrigger }) => {
  const { affirmations, loading } = useDailyAffirmations();
  const [currentAffirmation, setCurrentAffirmation] = useState("");

  useEffect(() => {
    if (!loading && affirmations.length > 0) {
      // Display a random affirmation when the component mounts or fetchTrigger changes
      setCurrentAffirmation(
        affirmations[Math.floor(Math.random() * affirmations.length)]
      );
    }
  }, [loading, affirmations, fetchTrigger]);

  if (loading) {
    return <p>Loading today's affirmations...</p>;
  }

  return (
    <div className="affirmation-generator">
      <p>{currentAffirmation}</p>
    </div>
  );
};

export default AffirmationGenerator;