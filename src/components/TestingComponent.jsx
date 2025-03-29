import React, { useState, useMemo } from "react";

export default function FlameBackground() {
  const [clickFlames, setClickFlames] = useState([]);

  const handleClick = (e) => {
    const durationMs = 8000 + Math.random() * 4000;

    const flame = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
      size: 120 + Math.random() * 150,
      duration: `${durationMs}ms`,
      durationMs,
      color: getVividFlameColor(Math.floor(Math.random() * 10)),
      blur: 60 + Math.random() * 30,
    };

    setClickFlames((prev) => [...prev, flame]);

    // Remove flame after animation completes
    setTimeout(() => {
      setClickFlames((prev) => prev.filter((f) => f.id !== flame.id));
    }, flame.durationMs);
  };

  // Auto-flames that rise by default (stable via useMemo)
  const autoFlames = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => {
        const durationMs = 8000 + Math.random() * 4000;
        return {
          size: 150 + Math.random() * 200,
          left: `${10 + i * 10}%`,
          delay: `${i * 0.5}s`,
          duration: `${durationMs}ms`,
          durationMs,
          color: getVividFlameColor(i),
          blur: 80 + Math.random() * 40,
        };
      }),
    []
  );

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden bg-black pointer-events-auto"
      onClick={handleClick}
    >
      {/* Auto Flames */}
      {autoFlames.map((flame, i) => (
        <div
          key={`auto-${i}`}
          className="absolute bottom-0 rounded-full mix-blend-screen opacity-60 animate-riseFlame"
          style={{
            width: `${flame.size}px`,
            height: `${flame.size * 2}px`,
            left: flame.left,
            background: `radial-gradient(ellipse at center, ${flame.color} 0%, transparent 70%)`,
            filter: `blur(${flame.blur}px)`,
            animationDelay: flame.delay,
            animationDuration: flame.duration,
          }}
        />
      ))}

      {/* Clicked Flames */}
      {clickFlames.map((flame) => (
        <div
          key={flame.id}
          className="absolute rounded-full mix-blend-screen pointer-events-none animate-riseFlame animate-flameBurst"
          style={{
            width: `${flame.size * 1.2}px`,
            height: `${flame.size * 2.2}px`,
            left: `${flame.x}px`,
            top: `${flame.y}px`,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle at center, #fff 0%, ${flame.color} 20%, transparent 70%)`,
            filter: `blur(${Math.max(flame.blur - 30, 20)}px)`,
            opacity: 1,
            animationDuration: flame.duration,
          }}
        />
      ))}
    </div>
  );
}

function getVividFlameColor(i) {
  const colors = [
    "#673ab7", // Deep Purple
    "#7e57c2", // Medium Purple
    "#9575cd", // Soft Lavender Purple
    "#d8b9ff", // Light Purple
    "#47c9af", // Emerald Green
    "#5cd1b9", // Aqua Mint
    "#83e0cb", // Light Seafoam
    "#b3e9c7", // Soft Mint
  ];
  return colors[i % colors.length];
}
