import React, { useState, useEffect } from "react";
import "../styles/ToggleButtons.css";
import breathworkGrey from "../images/breathworkGrey.svg";
import breathworkPurple from "../images/breathworkPurple.svg";
import { auth, db } from "../utils/firebase/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { logUserAction } from "../utils/firebase/loggingUtils"; // Assuming this helper exists

const BreathworkAnchor = () => {
  const [isActive, setIsActive] = useState(false);
  const [isGifVisible, setGifVisible] = useState(false);

  // Fetch initial toggle state from Firestore
  useEffect(() => {
    const fetchInitialState = async () => {
      const user = auth.currentUser;

      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(docRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            const breathworkToggle = data?.anchorToggles?.breathwork;

            if (typeof breathworkToggle === "boolean") {
              setIsActive(breathworkToggle);
              setGifVisible(breathworkToggle);
              console.log(`Loaded breathwork toggle state: ${breathworkToggle}`);
            }
          }
        } catch (error) {
          console.error("Error fetching breathwork toggle state:", error);
        }
      }
    };

    fetchInitialState();
  }, []); // Empty dependency array ensures this runs only once when the component mounts.

  const toggleButton = async () => {
    const user = auth.currentUser;

    if (user) {
      try {
        // Toggle local state
        const newState = !isActive;
        setIsActive(newState);
        setGifVisible(newState);

        // Log the toggle change
        await logUserAction("toggle_change", {
          toggle: "breathwork",
          value: newState,
        });
        console.log(`User toggled breathwork to: ${newState}`);

        // Save the updated toggle to Firestore
        const docRef = doc(db, "users", user.uid);
        await setDoc(
          docRef,
          { anchorToggles: { breathwork: newState } },
          { merge: true }
        );
        console.log(`Breathwork toggle saved: ${newState}`);
      } catch (error) {
        console.error("Failed to save breathwork toggle:", error);
      }
    } else {
      console.warn("No user is signed in.");
    }
  };

  return (
    <div className="toggle-onoff-container">
      <button
        className={`toggle-anchor-button ${isActive ? "active" : ""}`}
        onClick={toggleButton}
      >
        <img
          src={isActive ? breathworkPurple : breathworkGrey}
          alt="breathwork-icon"
        />
      </button>
      {isGifVisible && (
        <img
          src={`${process.env.PUBLIC_URL}/Breathe-symbol-purple.gif`}
          alt="Breathe Symbol"
          className="breathe-gif"
        />
      )}
    </div>
  );
};

export default BreathworkAnchor;
