// src/components/FunFactGenerator.jsx
import React, { useState, useEffect } from "react";

const FunFactGenerator = ({ fetchFactTrigger }) => {
  const [fact, setFact] = useState("");

  const fetchFunFact = async () => {
    try {
      const response = await fetch(
        "https://uselessfacts.jsph.pl/random.json?language=en"
      );
      const data = await response.json();
      setFact(data.text);
    } catch (error) {
      setFact("Couldn't fetch a fact. Try again!");
    }
  };

  useEffect(() => {
    if (fetchFactTrigger) {
      fetchFunFact();
    }
  }, [fetchFactTrigger]);

  return (
    <div className="max-w-md p-6 bg-white rounded-lg shadow-lg text-center">
      {<p className="text-gray-600 italic mb-6">
        {fact || "Click 'Yes' to get a fun fact!"}
      </p>}
    </div>
  );
};

export default FunFactGenerator;
