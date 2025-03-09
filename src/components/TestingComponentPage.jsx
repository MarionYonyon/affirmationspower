import React, { useState, useRef } from "react";
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
  const [paused, setPaused] = useState(false);
  const audioRef = useRef(null);

  const playSequentially = async (index = 0) => {
    if (index >= audioKeys.length) {
      setPlaying(false);
      return;
    }

    setPlaying(true);
    setCurrentIndex(index);

    const url = await getPresignedUrl(audioKeys[index]);
    if (!url) {
      console.error("Failed to fetch pre-signed URL");
      setPlaying(false);
      return;
    }

    const audio = new Audio(url);
    audioRef.current = audio;
    audio.play();

    audio.onended = () => {
      if (!paused) {
        setTimeout(() => {
          playSequentially(index + 1);
        }, 2000);
      }
    };
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPaused(true);
      setPlaying(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          if (!playing) {
            setPaused(false);
            playSequentially(0);
          }
        }}
        disabled={playing}
      >
        {playing
          ? `Playing: ${currentIndex + 1} / ${audioKeys.length}`
          : "Play Audio"}
      </button>
      <button onClick={pauseAudio} disabled={!playing}>
        Pause
      </button>
    </div>
  );
};

export default AudioPlayer;
