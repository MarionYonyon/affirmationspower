import { useState, useEffect, useRef, useContext } from "react";
import { AppContext } from "../context/AppContext"; // Import AppContext

const AudioPlayer = () => {
  const { affirmations } = useContext(AppContext); // Get affirmations from Firebase
  const [audioUrls, setAudioUrls] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);

  // ✅ Fetch signed URLs only when affirmations are ready
  useEffect(() => {
    const fetchSignedUrls = async () => {
      if (!affirmations || affirmations.length === 0) {
        console.warn("Affirmations not loaded yet.");
        return;
      }

      setIsLoading(true);
      const fileNames = affirmations
        .map((affirmation) => affirmation.audioUrl) // Extract file paths
        .filter((file) => file); // Remove invalid entries

      if (fileNames.length === 0) {
        console.warn("No valid file names found.");
        setIsLoading(false);
        return;
      }

      // 🔹 Convert file paths into query parameters
      const queryParams = fileNames
        .map((file) => `file=${encodeURIComponent(file)}`)
        .join("&");

      try {
        console.log("Fetching signed URLs for files:", fileNames);
        const response = await fetch(
          `https://r2-signed-url-worker.myrvana-m.workers.dev/?${queryParams}`
        );

        if (response.ok) {
          const data = await response.json();
          setAudioUrls(data.urls || []); // Ensure array format
          console.log("Signed URLs received:", data.urls);
        } else {
          console.error("Failed to fetch signed URLs");
        }
      } catch (error) {
        console.error("Error fetching signed URLs:", error);
      }
      setIsLoading(false);
    };

    // ✅ Delay execution until affirmations are available
    if (affirmations.length > 0) {
      fetchSignedUrls();
    }
  }, [affirmations]); // Depend on affirmations to trigger the effect

  // ✅ Play Audio
  const playAudio = () => {
    if (audioUrls.length === 0) {
      console.warn("No audio URLs available yet.");
      return;
    }

    if (audioRef.current) {
      audioRef.current.src = audioUrls[currentTrack];
      audioRef.current.play();
    }
  };

  // ✅ Play Next Track with a 2-Second Delay
  const playNext = () => {
    if (currentTrack < audioUrls.length - 1) {
      setTimeout(() => {
        setCurrentTrack((prev) => prev + 1);
        audioRef.current.src = audioUrls[currentTrack + 1];
        audioRef.current.play();
      }, 2000); // ⏳ 2-second delay before playing next track
    }
  };

  return (
    <div>
      {isLoading ? <p>Loading audio...</p> : null}
      <button
        onClick={playAudio}
        disabled={isLoading || audioUrls.length === 0}
      >
        Play
      </button>
      <button onClick={() => audioRef.current?.pause()} disabled={isLoading}>
        Pause
      </button>
      <audio ref={audioRef} onEnded={playNext} />
    </div>
  );
};

export default AudioPlayer;
