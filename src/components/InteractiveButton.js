import React, { useState } from "react";
import { motion } from "framer-motion";

const RoundButton = () => {
  const [isHolding, setIsHolding] = useState(false);

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <motion.button
        onMouseDown={() => setIsHolding(true)} // Start holding
        onMouseUp={() => setIsHolding(false)} // Stop holding
        onMouseLeave={() => setIsHolding(false)} // Stop if pointer leaves
        animate={{
          scale: isHolding ? 1.5 : [1.5, 1.2, 1], // Add an intermediate step for smoother shrink
          rotate: isHolding ? [0, 180, 360] : 0, // Gradually slow down as it grows
          boxShadow: isHolding
            ? "0px 20px 40px rgba(103, 58, 183, 0.5)" // Larger shadow when holding
            : "0px 8px 15px rgba(103, 58, 183, 0.3)", // Smaller shadow at rest
          background: isHolding
            ? [
                "linear-gradient(135deg, #b3e9c7, #673ab7)",
                "linear-gradient(135deg, #673ab7, #b3e9c7)",
                "linear-gradient(135deg, #b3e9c7, #673ab7)",
              ]
            : "linear-gradient(135deg, #b3e9c7, #673ab7)", // Resting state
        }}
        transition={{
          scale: {
            duration: isHolding ? 3 : 0.8, // Extend the release duration for smoother transition
            ease: isHolding ? "easeInOut" : "easeOut", // Smooth easing
          },
          rotate: isHolding
            ? {
                duration: 3, // Gradual rotation slows down as it scales up
                repeat: Infinity, // Continue slow rotation
                ease: "linear",
              }
            : {
                duration: 0.5, // Smoothly reset rotation when released
                ease: "easeOut",
              },
          background: {
            duration: 5, // Gradual color shift
            repeat: Infinity, // Continue color movement indefinitely
            ease: "linear",
          },
        }}
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          border: "none",
          color: "white",
          fontSize: "18px",
          fontWeight: "bold",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          outline: "none",
          position: "relative", // Required for child positioning
          overflow: "hidden",
        }}
      >
        <img
          src="play-button.png"
          alt="Play Icon"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            height: "90%",
            zIndex: 1, // Ensure the image is above other layers
            pointerEvents: "none", // Prevent interaction with the image
          }}
        />
      </motion.button>
    </div>
  );
};

export default RoundButton;
