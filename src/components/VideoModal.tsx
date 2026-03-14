'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';

const VideoModal = () => {
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="absolute w-16 md:w-24 h-16 md:h-24 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Image
            src="/images/play.png"
            alt="play button"
            fill
            className="absolute cursor-pointer"
          />
        </div>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="w-full max-w-4xl! h-fit bg-[#0F1016] border border-gray-800 p-0 overflow-hidden"
        onOpenAutoFocus={e => {
          e.preventDefault();
          const video = videoRef.current;
          if (video) {
            video.play().catch(() => {});
          }
        }}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Trailer video</DialogTitle>
        </DialogHeader>

        <div className="relative w-full h-full rounded-2xl">
          <DialogClose asChild>
            <button
              className="absolute top-2 right-2 text-white bg-gray-800/50 hover:bg-gray-700 rounded-full p-2 transition z-20 cursor-pointer!"
              aria-label="Close"
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.pause();
                  videoRef.current.currentTime = 0;
                }
              }}
            >
              <X size={20} />
            </button>
          </DialogClose>

          <video
            ref={videoRef}
            controls
            className="w-full h-auto"
            src="/video/Amrounds00.mp4"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;
