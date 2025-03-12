import React, { useState, useRef, useContext } from "react";
import { getPresignedUrl } from "../api/getPresignedUrl";
import { AppContext } from "../context/AppContext"; // Import AppContext

const introKey =
  "https://affirmations-ms-audio.s3.eu-north-1.amazonaws.com/intro-outro-voice/intro/01.wav";
const outroKey =
  "https://affirmations-ms-audio.s3.eu-north-1.amazonaws.com/intro-outro-voice/outro/01.wav";
const musicKey =
  "https://affirmations-ms-audio.s3.eu-north-1.amazonaws.com/music/01.wav";

const AudioPlayer = () => {
  const { affirmations } = useContext(AppContext); // Get affirmations from context
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);
  const musicSourceRef = useRef(null);
  const buffersRef = useRef({});
  const activeSourcesRef = useRef([]);

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }
  };

  const fetchAudioBuffers = async (keys) => {
    const urls = await Promise.all(keys.map(getPresignedUrl));
    const audioData = await Promise.all(
      urls.map((url) => fetch(url).then((res) => res.arrayBuffer()))
    );
    return Promise.all(
      audioData.map((data) => audioContextRef.current.decodeAudioData(data))
    );
  };

  const playBuffer = (buffer, startTime, gain = 1) => {
    if (!buffer) return;
    const source = audioContextRef.current.createBufferSource();
    const volumeNode = audioContextRef.current.createGain();
    source.buffer = buffer;
    volumeNode.gain.value = gain;
    source.connect(volumeNode).connect(audioContextRef.current.destination);
    source.start(startTime);
    activeSourcesRef.current.push(source);
  };

  const stopAllAudio = () => {
    activeSourcesRef.current.forEach((source) => source.stop());
    activeSourcesRef.current = [];
    musicSourceRef.current?.stop();
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setPlaying(false);
    setLoading(false);
  };

  const playSequence = async () => {
    if (playing) return;
    await audioContextRef.current.resume();
    setPlaying(true);
    setLoading(true);

    // 🔹 Get all audioUrls from Firebase affirmations
    const audioUrls = affirmations
      .map((affirmation) => affirmation.audioUrl)
      .filter((url) => url); // Remove empty/null entries

    if (audioUrls.length === 0) {
      console.error("No valid audio URLs available.");
      stopAllAudio();
      return;
    }

    const [introBuffer, musicBuffer, ...affirmationBuffers] =
      await fetchAudioBuffers([introKey, musicKey, ...audioUrls, outroKey]);

    const outroBuffer = affirmationBuffers.pop();

    buffersRef.current = {
      introBuffer,
      musicBuffer,
      affirmationBuffers,
      outroBuffer,
    };

    let startTime = audioContextRef.current.currentTime;
    gainNodeRef.current.gain.value = 0;
    musicSourceRef.current = playBuffer(musicBuffer, startTime - 1, 0.5);

    playBuffer(introBuffer, startTime + 3);
    let bufferStartTime = startTime + 3 + introBuffer.duration;

    affirmationBuffers.forEach((buffer) => {
      playBuffer(buffer, bufferStartTime);
      bufferStartTime += buffer.duration + 2;
    });

    playBuffer(outroBuffer, bufferStartTime);

    bufferStartTime += outroBuffer.duration + 3;
    gainNodeRef.current.gain.linearRampToValueAtTime(0, bufferStartTime + 2);

    setTimeout(stopAllAudio, (bufferStartTime + 4 - startTime) * 1000);
    setLoading(false);
  };

  return (
    <div>
      <button
        onClick={() => {
          initAudioContext();
          playSequence();
        }}
        disabled={playing || loading}
      >
        {loading ? "Loading..." : playing ? "Playing..." : "Play Audio"}
      </button>
      {playing && (
        <button onClick={stopAllAudio} style={{ marginLeft: "10px" }}>
          Stop
        </button>
      )}
    </div>
  );
};

export default AudioPlayer;
