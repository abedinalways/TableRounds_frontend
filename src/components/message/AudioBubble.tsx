import { useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

type AudioBubbleProps = {
  src: string;
};

export function AudioBubble({ src }: AudioBubbleProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const waveform = useMemo(
    () => [
      8, 12, 16, 10, 18, 14, 20, 11, 24, 16, 12, 22, 14, 18, 10, 20, 15, 11, 17,
      13, 9, 14, 12, 8,
    ],
    [],
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('durationchange', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('durationchange', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
      } else {
        await audio.play();
      }
    } catch (error) {
      console.error('Audio playback failed:', error);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const nextTime = Number(e.target.value);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const formatTime = (time: number) => {
    if (!Number.isFinite(time)) return '0:00';

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-[290px] max-w-full rounded-[24px] bg-[#1f2a35] px-3 py-2.5 text-white shadow-sm">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={togglePlay}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#21c063] text-[#0f1720] transition hover:scale-[1.03]"
        >
          {isPlaying ? (
            <Pause size={20} fill="currentColor" />
          ) : (
            <Play size={20} fill="currentColor" className="ml-0.5" />
          )}
        </button>

        <div className="relative flex-1">
          <div className="pointer-events-none flex h-7 items-center gap-[2px]">
            {waveform.map((height, index) => {
              const barPercent = ((index + 1) / waveform.length) * 100;
              const isActive = progressPercent >= barPercent;

              return (
                <span
                  key={index}
                  className={`w-[3px] rounded-full transition-colors duration-150 ${
                    isActive ? 'bg-[#4de39a]' : 'bg-[#7c8792]'
                  }`}
                  style={{ height: `${height}px` }}
                />
              );
            })}
          </div>

          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </div>
      </div>

      <div className="mt-1 flex items-center justify-between pl-14 pr-1 text-sm text-[#d5dde4]">
        <div className="flex items-center gap-2 tabular-nums">
          <span>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <span className="h-2.5 w-2.5 rounded-full bg-[#25d366]" />
        </div>

        <div className="w-14 h-[3px] rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#25d366] transition-all duration-150"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
}
