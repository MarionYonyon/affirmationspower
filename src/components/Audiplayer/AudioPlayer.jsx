import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import useAudioManager from "../../hooks/useAudioManager";
import { PlayButton, StopButton } from "./AudioControls";
import RoundButton from "../InteractiveButton";

export default function AudioPlayer() {
  const { affirmations } = useContext(AppContext);
  const [isPlaying, setIsPlaying] = useState(false);

  const {
    audioRef,
    musicRef,
    isLoading,
    audioUrls,
    musicUrl,
    playAudio,
    playNext,
  } = useAudioManager(affirmations);

  const handlePlay = () => {
    playAudio();
    setIsPlaying(true);
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (musicRef.current) {
      musicRef.current.pause();
      musicRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  return (
    <>
      {/* Interactive Play Button - bottom center */}
      <div
        className="fixed bottom-40 left-1/2 transform -translate-x-1/2 z-20"
        onClick={handlePlay}
      >
        <RoundButton />
      </div>

      {/* Stop button - top right */}
      <div className="fixed top-6 right-6 z-50">
        <StopButton stopAudio={handleStop} isLoading={isLoading} />
      </div>

      {/* Hidden audio elements */}
      <audio ref={audioRef} onEnded={playNext} />
      <audio ref={musicRef} />
    </>
  );
}
