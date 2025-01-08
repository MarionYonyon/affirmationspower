import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation for route detection
import "../styles/ToggleButtons.css";
import soundGrey from "../images/soundGrey.svg";
import soundPurple from "../images/soundPurple.svg";
import { auth, db } from "../utils/firebase/firebaseConfig"; // Import auth for user context
import { doc, setDoc } from "firebase/firestore";
import { logUserAction } from "../utils/firebase/loggingUtils"; // Assuming this helper exists

const SoundAnchor = () => {
  const [isActive, setIsActive] = useState(false);
  const audioRef = useRef(
    new Audio(`${process.env.PUBLIC_URL}/AnchorMusic1.mp3`)
  );
  const location = useLocation(); // Get the current route location
  const fadeOutDuration = 1000; // Fade-out duration in milliseconds

  // Ensure the audio loops
  useEffect(() => {
    audioRef.current.loop = true;
    audioRef.current.volume = 1; // Ensure the volume is at max initially
  }, []);

  const fadeOutSound = () => {
    if (audioRef.current) {
      let currentVolume = audioRef.current.volume;
      const fadeStep = currentVolume / (fadeOutDuration / 50); // Decrease volume every 50ms

      const fadeInterval = setInterval(() => {
        currentVolume -= fadeStep;
        if (currentVolume <= 0) {
          clearInterval(fadeInterval);
          audioRef.current.pause();
          audioRef.current.currentTime = 0; // Reset playback
          audioRef.current.volume = 1; // Reset volume for future playbacks
        } else {
          audioRef.current.volume = currentVolume;
        }
      }, 50);
    }
  };

  const toggleSound = async () => {
    const user = auth.currentUser;

    if (user) {
      try {
        const newState = !isActive;
        setIsActive(newState);

        if (newState) {
          audioRef.current.volume = 1; // Reset volume to full on play
          await audioRef.current.play().catch((err) => {
            console.error("Error playing audio:", err);
          });
        } else {
          fadeOutSound(); // Call fade-out function
        }

        // Log the toggle change
        await logUserAction("toggle_change", {
          toggle: "sound",
          value: newState,
          page: location.pathname,
        });
        console.log(`User toggled sound to: ${newState}`);

        // Save the updated toggle to Firestore
        const docRef = doc(db, "users", user.uid);
        await setDoc(
          docRef,
          { anchorToggles: { sound: newState } },
          { merge: true }
        );
        console.log(`Sound toggle saved: ${newState}`);
      } catch (error) {
        console.error("Failed to save sound toggle:", error);
      }
    } else {
      console.warn("No user is signed in.");
    }
  };

  // Stop and fade out the sound when the route changes
  useEffect(() => {
    return () => {
      if (isActive) {
        fadeOutSound();
        setIsActive(false);
      }
    };
  }, [location, isActive]);

  return (
    <div className="toggle-onoff-container">
      <button
        className={`toggle-anchor-button ${isActive ? "active" : ""}`}
        onClick={toggleSound}
      >
        <img
          src={isActive ? soundPurple : soundGrey} /* Icon changes */
          alt="sound-icon"
        />
      </button>
    </div>
  );
};

export default SoundAnchor;