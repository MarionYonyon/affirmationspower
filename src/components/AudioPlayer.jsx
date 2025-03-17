import { useState, useEffect, useRef, useContext } from "react";
import { AppContext } from "../context/AppContext"; // Import AppContext

const introKey = "intro-outro-voice/intro/01.wav";
const outroKey = "intro-outro-voice/outro/01.wav";
const musicKey = "music/01.wav";

const AudioPlayer = () => {
  const { affirmations } = useContext(AppContext);
  const [audioUrls, setAudioUrls] = useState([]);
  const [musicUrl, setMusicUrl] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);
  const musicRef = useRef(null);
  const isMounted = useRef(true); // ✅ Track component mount state

  // ✅ Handle component unmount
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // ✅ Fetch signed URLs including music
  useEffect(() => {
    const fetchSignedUrls = async () => {
      if (!affirmations || affirmations.length === 0) {
        console.warn("Affirmations not loaded yet.");
        return;
      }

      setIsLoading(true);
      const fileNames = [
        musicKey, // 🔹 Include background music
        introKey,
        ...affirmations
          .map((affirmation) => affirmation.audioUrl)
          .filter((file) => file),
        outroKey,
      ];

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
          if (isMounted.current) {
            // ✅ Ensure component is still mounted
            setAudioUrls(data.urls.slice(1) || []); // ✅ Exclude music
            setMusicUrl(data.urls[0]); // ✅ Music URL is first in the list
            console.log("Signed URLs received:", data.urls);
          }
        } else {
          console.error("Failed to fetch signed URLs");
        }
      } catch (error) {
        console.error("Error fetching signed URLs:", error);
      }
      setIsLoading(false);
    };

    if (affirmations.length > 0) {
      fetchSignedUrls();
    }
  }, [affirmations]);

  // ✅ Smooth Fade In (2 seconds)
  const fadeInMusic = () => {
    if (musicRef.current) {
      musicRef.current.volume = 0; // Start muted
      musicRef.current.src = musicUrl;
      musicRef.current.play(); // Ensure it starts playing

      let volume = 0;
      const step = 0.01; // Gradual increase
      const fadeInterval = setInterval(() => {
        if (!isMounted.current || !musicRef.current) {
          clearInterval(fadeInterval);
          return;
        }
        if (volume < 0.5) {
          volume += step;
          musicRef.current.volume = Math.min(volume, 0.5);
        } else {
          clearInterval(fadeInterval);
        }
      }, 100);
    }
  };

  // ✅ Smooth Fade Out (2 seconds)
  const fadeOutMusic = () => {
    if (musicRef.current) {
      let volume = musicRef.current.volume;
      const step = 0.01; // Gradual decrease
      const fadeInterval = setInterval(() => {
        if (!isMounted.current || !musicRef.current) {
          clearInterval(fadeInterval);
          return;
        }
        if (volume > 0) {
          volume -= step;
          musicRef.current.volume = Math.max(volume, 0);
        } else {
          clearInterval(fadeInterval);
          musicRef.current.pause(); // Stop playback after fading out
          musicRef.current.currentTime = 0; // Reset playback position
        }
      }, 100);
    }
  };

  // ✅ Play Audio
  const playAudio = async () => {
    if (!musicUrl || audioUrls.length === 0) {
      console.warn("Music or audio URLs are not available yet.");
      return;
    }

    fadeInMusic(); // 🔊 Start music with fade-in effect

    // Wait 2 seconds before starting the intro
    setTimeout(() => {
      if (audioRef.current) {
        setCurrentTrack(0);
        audioRef.current.src = audioUrls[0];
        audioRef.current.play();
      }
    }, 2000);
  };

  // ✅ Play Next Track with a 2-Second Delay
  const playNext = () => {
    if (currentTrack < audioUrls.length - 1) {
      setTimeout(() => {
        setCurrentTrack((prev) => prev + 1);
        audioRef.current.src = audioUrls[currentTrack + 1];
        audioRef.current.play();
      }, 2000);
    } else {
      // ✅ End with 2 seconds of music after the outro, then fade out
      setTimeout(() => {
        fadeOutMusic(); // 🔉 Smooth fade-out after outro
      }, 2000);
    }
  };

  return (
    <div>
      <button
        onClick={playAudio}
        disabled={isLoading || audioUrls.length === 0 || !musicUrl}
      >
        Play
      </button>
      <button
        onClick={() => {
          audioRef.current?.pause();
          fadeOutMusic(); // 🔉 Fade out music instead of stopping suddenly
        }}
        disabled={isLoading}
      >
        Pause
      </button>
      <audio ref={audioRef} onEnded={playNext} />
      <audio ref={musicRef} />
    </div>
  );
};

export default AudioPlayer;
