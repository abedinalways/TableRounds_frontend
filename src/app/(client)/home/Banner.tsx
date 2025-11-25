import Btn from '@/components/reusable/button/Btn';
import Image from 'next/image';
import React from 'react';

export default function Banner() {
  return (
    <div className="font-[manrope]">
      <div>
        <Image
          src="/images/banner.png"
          fill
          alt=""
          className="relative top-0 left-0 right-0 object-cover w-fit md:w-full"
        />
      </div>
      <div className="text-white z-20 relative md:top-50 md:left-69 md:w-[976px] h-[483px] space-y-6 md:leading-[120%] px-4">
        <h2 className="font-bold text-2xl md:text-5xl space-y-2">
          Where healthcare providers come
          to learn and collaborate, in all
         
          fields of medicine and dentistry
        </h2>
        <p className="text-sm md:text-md">
          TableRounds brings board-style questions, structured learning <br />
          tools, and a vetted professional community into one platform
        </p>
        <div className='md:flex gap-4 '>
          <Btn text="Create Your Free Account" className="bg-[#B79E6B] width-[245px] height-[54px] px-[24px] py-[14px]"/>
          <Btn text="Learn More" className="bg-white text-[#B79E6B] width-[217px] height-[54px] px-[65px] py-[14px] mt-3 md:mt-0"/>
        </div>
      </div>
    </div>
  );
}
