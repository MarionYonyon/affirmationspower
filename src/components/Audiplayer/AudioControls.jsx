export function PlayButton({ playAudio, isLoading, disabled }) {
  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50">
      <button
        onClick={playAudio}
        disabled={isLoading || disabled}
        className="bg-white text-black w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:scale-105 transition-transform"
      >
        ▶
      </button>
    </div>
  );
}

export function StopButton({ stopAudio, isLoading }) {
  return (
    <button
      onClick={stopAudio}
      disabled={isLoading}
      className="bg-white text-black w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:scale-105 transition-transform"
    >
      ✖
    </button>
  );
}
