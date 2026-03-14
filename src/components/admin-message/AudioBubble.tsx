import { useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';

export function AudioBubble({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setPlaying(!playing);
  };

  return (
    <div className="flex items-center gap-3 bg-green-900 text-white px-4 py-2 rounded-xl w-[260px]">
      <button
        onClick={toggle}
        className="w-9 h-9 rounded-full cursor-pointer bg-green-600 flex items-center justify-center"
      >
        {playing ? <Pause size={16} /> : <Play size={16} />}
      </button>

      <div className="flex-1 h-[3px] bg-white/40 rounded relative">
        <div className="absolute left-0 top-0 h-[3px] bg-white w-1/3"></div>
      </div>

      <audio ref={audioRef} src={src} />
    </div>
  );
}
