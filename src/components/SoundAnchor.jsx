import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom"; // For route detection
import "../styles/ToggleButtons.css";
import soundGrey from "../images/soundGrey.svg";
import soundPurple from "../images/soundPurple.svg";
import { auth, db } from "../utils/firebase/firebaseConfig"; // Firebase imports
import { doc, setDoc } from "firebase/firestore";
import { logUserAction } from "../utils/firebase/loggingUtils"; // Logging helper
import { getPresignedUrl } from "../api/getPresignedUrl"; // Import function to fetch pre-signed URL

const AUDIO_KEY = "music/01.wav"; // S3 path for the audio file
const fadeOutDuration = 1000; // Fade-out duration in milliseconds

const SoundAnchor = () => {
  const [isActive, setIsActive] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(new Audio());
  const location = useLocation(); // Get current route

  // Function to fetch the pre-signed URL
  const fetchAudioUrl = async () => {
    try {
      const url = await getPresignedUrl(AUDIO_KEY);
      if (url) {
        setAudioUrl(url);
        audioRef.current.src = url; // Set the new audio source
      } else {
        console.error("Failed to fetch pre-signed URL.");
      }
    } catch (error) {
      console.error("Error fetching pre-signed URL:", error);
    }
  };

  // Ensure the audio loops and loads dynamically
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
          if (!audioUrl) {
            await fetchAudioUrl(); // Fetch pre-signed URL only when needed
          }
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
