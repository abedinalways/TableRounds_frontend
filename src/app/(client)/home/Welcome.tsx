import Image from 'next/image';
import React from 'react';

export default function Welcome() {
  return (
    <div className="card-bg py-10 font-[manrope]">
      <div className="md:flex gap-6 items-center justify-between md:px-[300px] px-4  py-6">
        <h2 className="text-[28px] leading-[110%] sm:text-[48px] text-center md:text-start  font-bold text-black">
          Welcome to TableRounds
        </h2>
        <p className="text-sm text-gray-600 mt-6 md:mt-0 text-center md:text-start leading-[110%]">
          Watch the short overview video to see how it fits into your training
          and day-to- <br />
          day practice.
        </p>
      </div>
      {/* intro video */}
      <div className="px-4 md:px-0 mx-auto custom-container z-20">
        <video
          loop
          muted
          playsInline
          className="w-full aspect-video object-cover rounded-md cursor-pointer"
        >
          <source src="/video/tablerounds.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="relative -z-15">
        <Image
          src="/images/TR.png"
          width={451}
          height={453}
          alt=""
          className="absolute md:-top-160 -top-78 md:left-26  left-14 md:opacity-70 opacity-50 md:w-fit w-1/2"
        />
      </div>
    </div>
  );
}
