'use client'
import Btn from '@/components/reusable/button/Btn';

import Image from 'next/image';
import lottie from '../../../../public/images/Heartbeat.json'
import Lottie from 'lottie-react';
import loading from '../../../../public/images/loading.json'

export default function Banner() {
 
  
  return (
    <div className="font-[manrope]">
      <div className="">
        <Image
          src="/images/banner.png"
          fill
          alt=""
          className="relative top-0 left-0 right-0 object-cover w-fit md:w-full"
        />
      </div>
      <div className="relative">
        {/* DNA */}
        <Image
          src="/images/DNA_prime.png"
          width={967}
          height={1203}
          alt="TableRounds Logo"
          className="md:w-fit md:h-fit min-h-screen object-cover absolute md:-top-34  md:right-0 right-1 rotate-1 md:rotate-0 opacity-20 md:opacity-100"
        />
      </div>

      {/* little DNA */}
      <div className="  relative">
        <Image
          src="/images/Little_DNA.png"
          width={80}
          height={80}
          alt="TableRounds Logo"
          className="w-fit h-fit absolute md:top-150 md:right-30 animate-float"
        />
      </div>
      {/* heartbit */}
      <div className="">
        <Lottie
          animationData={lottie}
          loop={true}
          autoplay={true}
          style={{ width: 700, height: 300 }}
          className="absolute md:-left-27 top-30 md:top-44 opacity-10"
        />
      </div>
      {/* elipses */}
      <div className=" ">
        <Lottie
          animationData={loading}
          loop={true}
          autoplay={true}
          style={{ width: 1000, height: 300 }}
          className="absolute -left-130 bottom-0 opacity-5"
        />
      </div>
      <div className="fixed md:top-74 top-30 right-65 md:left-78 space-y-6 text-white  px-2  md:px-0">
        <h2 className="  font-bold text-2xl md:text-5xl space-y-6">
          Where healthcare providers come <br /> to learn and collaborate, in
          all
          <br />
          fields of medicine and dentistry
        </h2>
        <p className="text-sm md:text-md">
          TableRounds brings board-style questions, structured learning <br />
          tools, and a vetted professional community into one platform
        </p>
        <div className="md:flex gap-4 ">
          <Btn
            text="Create Your Free Account"
            className="bg-[#B79E6B] width-[245px] height-[54px] px-[24px] py-[14px]"
          />
          <Btn
            text="Learn More"
            className="bg-white text-[#B79E6B] width-[217px] height-[54px] px-[65px] py-[14px] mt-3 md:mt-0"
          />
        </div>
      </div>
    </div>
  );
}
