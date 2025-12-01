
import Image from 'next/image';
import React from 'react'

export default function Welcome() {
  return (
    <div className=" bg-white py-10">
      <div className="md:flex gap-6 items-center px-[300px] leading-[110%] py-6">
        <h2 className='text-md sm:text-3xl  font-bold text-black'>Welcome to TableRounds</h2>
        <p className='text-sm text-gray-600'>
          Watch the short overview video to see how it fits into your training
          and day-to- <br />day practice.
        </p>
      </div>
      {/* intro video */}
      <div className='px-[300px] mx-auto'>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full max-w-[1320px] md:h-[450px] h-[300px] px-4 md:px-0 md:object-cover rounded-md "
        >
          <source src="/video/tablerounds.mp4" type="video/mp4" />
        </video>
      </div>
      <div className='relative'>
        <Image src='/images/TR.png' width={451} height={453} alt='' className='absolute -top-112 left-26 opacity-60'/>
      </div>
    </div>
  );
}
