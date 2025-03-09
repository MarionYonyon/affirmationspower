import React, { useState } from "react";
import { getPresignedUrl } from "../api/getPresignedUrl";

const audioKeys = [
  "career_growth/career_changer/career_growth/01.wav",
  "career_growth/career_changer/career_growth/02.wav",
  "career_growth/career_changer/career_growth/03.wav",
  "career_growth/career_changer/career_growth/04.wav",
  "career_growth/career_changer/career_growth/05.wav",
  "career_growth/career_changer/career_growth/06.wav",
  "career_growth/career_changer/career_growth/07.wav",
  "career_growth/career_changer/career_growth/08.wav",
  "career_growth/career_changer/career_growth/09.wav",
  "career_growth/career_changer/career_growth/10.wav",
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
