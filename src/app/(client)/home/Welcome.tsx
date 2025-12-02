
import Image from 'next/image';
import React from 'react'

export default function Welcome() {
  return (
    <div className="card-bg py-10">
      <div className="flex gap-6 items-center md:px-[300px] px-4 leading-[110%] py-6">
        <h2 className="text-md sm:text-3xl  font-bold text-black">
          Welcome to TableRounds
        </h2>
        <p className="text-sm text-gray-600">
          Watch the short overview video to see how it fits into your training
          and day-to- <br />
          day practice.
        </p>
      </div>
      {/* intro video */}
      <div className="px-4 md:px-0 mx-auto custom-container">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="md:w-[1320px] md:max-w-[1320px]  md:h-[455px] h-[300px] w-fit  md:px-0 object-cover rounded-md "
        >
          <source src="/video/tablerounds.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="relative">
        <Image
          src="/images/TR.png"
          width={451}
          height={453}
          alt=""
          className="absolute md:-top-112 -top-100 md:left-26  -left-10 opacity-60"
        />
      </div>
    </div>
  );
}
