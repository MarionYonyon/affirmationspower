import React, { useState } from "react";
import { getPresignedUrl } from "../api/getPresignedUrl";

const audioKeys = [
  "career/career_changer/push_through_failure/07.wav",
  "career_test/career_changer/career_growth/02.wav",
  "career/career_changer/enjoy_your_work/03.wav",
];

const AudioPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const playSequentially = async (index = 0) => {
    if (index >= audioKeys.length) {
      setPlaying(false);
      return;
    }

    setPlaying(true);
    setCurrentIndex(index);

    // Get a pre-signed URL for the current file
    const url = await getPresignedUrl(audioKeys[index]);

    if (!url) {
      console.error("Failed to fetch pre-signed URL");
      setPlaying(false);
      return;
    }

    const audio = new Audio(url);
    audio.play();

    audio.onended = () => {
      setTimeout(() => {
        playSequentially(index + 1);
      }, 2000);
    };
  };

  return (
    <div>
      <button
        onClick={() => {
          if (!playing) playSequentially(0);
        }}
        disabled={playing}
      >
        {playing
          ? `Playing: ${currentIndex + 1} / ${audioKeys.length}`
          : "Play Audio"}
      </button>
    </div>
  );
};

export default AudioPlayer;
