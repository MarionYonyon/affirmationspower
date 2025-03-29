import { useState, useEffect, useRef } from "react";

const introKey = "intro-outro-voice/intro/01.wav";
const outroKey = "intro-outro-voice/outro/01.wav";
const musicKey = "music/01.wav";

function useAudioManager(affirmations) {
  const [audioUrls, setAudioUrls] = useState([]);
  const [musicUrl, setMusicUrl] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const audioRef = useRef(null);
  const musicRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchSignedUrls = async () => {
      if (!affirmations?.length) return;

      setIsLoading(true);
      const fileNames = [
        musicKey,
        ...affirmations.map((a) => a.audioUrl).filter(Boolean),
        outroKey,
      ];

      const queryParams = fileNames
        .map((f) => `file=${encodeURIComponent(f)}`)
        .join("&");

      try {
        const res = await fetch(
          `https://r2-signed-url-worker.myrvana-m.workers.dev/?${queryParams}`
        );
        const data = await res.json();
        if (isMounted.current) {
          setMusicUrl(data.urls[0]);
          setAudioUrls(data.urls.slice(1));
        }
      } catch (err) {
        console.error("Error fetching audio:", err);
      }
      setIsLoading(false);
    };

    fetchSignedUrls();
  }, [affirmations]);

  const fadeInMusic = () => {
    if (musicRef.current && musicUrl) {
      musicRef.current.volume = 0;
      musicRef.current.src = musicUrl;
      musicRef.current.play();

      let volume = 0;
      const step = 0.01;
      const fadeInterval = setInterval(() => {
        if (!isMounted.current || !musicRef.current)
          return clearInterval(fadeInterval);
        if (volume < 0.5) {
          volume += step;
          musicRef.current.volume = Math.min(volume, 0.5);
        } else {
          clearInterval(fadeInterval);
        }
      }, 100);
    }
  };

  const fadeOutMusic = () => {
    if (musicRef.current) {
      let volume = musicRef.current.volume;
      const step = 0.01;
      const fadeInterval = setInterval(() => {
        if (!isMounted.current || !musicRef.current)
          return clearInterval(fadeInterval);
        if (volume > 0) {
          volume -= step;
          musicRef.current.volume = Math.max(volume, 0);
        } else {
          clearInterval(fadeInterval);
          musicRef.current.pause();
          musicRef.current.currentTime = 0;
        }
      }, 100);
    }
  };

  const playAudio = () => {
    if (!musicUrl || !audioUrls.length) return;
    fadeInMusic();

    setTimeout(() => {
      if (audioRef.current) {
        setCurrentTrack(0);
        audioRef.current.src = audioUrls[0];
        audioRef.current.play();
      }
    }, 2000);
  };

  const playNext = () => {
    if (currentTrack < audioUrls.length - 1) {
      setTimeout(() => {
        if (audioRef.current) {
          setCurrentTrack((prev) => prev + 1);
          audioRef.current.src = audioUrls[currentTrack + 1];
          audioRef.current.play();
        }
      }, 2000);
    } else {
      setTimeout(() => {
        fadeOutMusic();
      }, 2000);
    }
  };

  const fadeOutAllAudio = () => {
    // Fade out background music
    if (musicRef.current) {
      let musicVolume = musicRef.current.volume;
      const musicStep = 0.01;
      const musicInterval = setInterval(() => {
        if (!isMounted.current || !musicRef.current)
          return clearInterval(musicInterval);
        if (musicVolume > 0) {
          musicVolume -= musicStep;
          musicRef.current.volume = Math.max(musicVolume, 0);
        } else {
          clearInterval(musicInterval);
          musicRef.current.pause();
        }
      }, 100);
    }

    // Fade out spoken audio
    if (audioRef.current) {
      let audioVolume = audioRef.current.volume;
      const audioStep = 0.01;
      const audioInterval = setInterval(() => {
        if (!isMounted.current || !audioRef.current)
          return clearInterval(audioInterval);
        if (audioVolume > 0) {
          audioVolume -= audioStep;
          audioRef.current.volume = Math.max(audioVolume, 0);
        } else {
          clearInterval(audioInterval);
          audioRef.current.pause();
        }
      }, 100);
    }
  };

  return {
    audioRef,
    musicRef,
    isLoading,
    audioUrls,
    musicUrl,
    playAudio,
    playNext,
    fadeOutMusic,
    fadeOutAllAudio,
  };
}

export default useAudioManager;
