'use client'
import Btn from '@/components/reusable/button/Btn';
import Threads from '@/components/Threads';
import Lottie from 'lottie-react';
import heartbeat from '../../../../public/images/Heartbeat.json';
import Image from 'next/image';
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap';
import MotionPathPlugin from 'gsap/MotionPathPlugin';

gsap.registerPlugin(MotionPathPlugin);
export default function Elevate() {
  const imageRef = useRef(null);
  useEffect(() => {
    const tl = gsap.timeline({
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });
    tl.to(imageRef.current, {
      duration: 8,
      motionPath: {
        path: [
          { x: 0, y: 0 },
          { x: 50, y: -80 }, 
          { x: 100, y: -100 }, 
          { x: 150, y: -80 },
          { x: 200, y: -40 }, 
        ],
        curviness: 1.5, 
        autoRotate: false, 
      },
    });

    // Cleanup function
    return () => {
      tl.kill();
    };
  }, [])
  
  return (
    <div className="relative  flex flex-col items-center justify-center gap-6 max-w-[1920px] h-[492px]  text-white text-center bg-[url('/images/elevate/bg.png')] bg-cover bg-no-repeat backdrop-blur-xs font-[manrope]">
      <div
        style={{ width: '2020px', height: '800px' }}
        className="absolute -top-10 left-0 rotate-180 opacity-30"
      >
        <Threads amplitude={1} distance={0} enableMouseInteraction={true} />
      </div>
      <div className="absolute md:top-25 md:-left-16 top-40 -left-6">
        {/* Heartbeat Animation */}
        <Lottie
          animationData={heartbeat}
          loop
          autoplay
          className="
          
          w-[200px] md:w-[600px]
          opacity-20
        "
        />
      </div>

      {/* litte DNA */}
      <div ref={imageRef} className="absolute top-62 right-72 opacity-60 ">
        <Image src="/images/elevate/img03.png" width={80} height={80} alt="" />
      </div>
      {/* animated medicine box */}
      <div className="absolute md:top-12 md:left-90 top-12 left-18 opacity-60 animate-float ">
        <Image src="/images/elevate/img04.png" width={80} height={80} alt="" />
      </div>

      <h2 className="text-xl md:text-3xl lg:text-[60px] px-4 md:px-0 font-bold">
        Ready to Elevate Your Medical <br /> Practice and Master Your Specialty?
      </h2>
      <p className="text-sm sm:text-lg px-4 md:px-0">
        Achieve unmatched clinical mastery and accelerate your professional
        growth <br /> through our proven, integrated learning platform today.
      </p>
      <Btn
        text="Sing Up"
        href="/register"
        className="bg-[#B79E6B] text-white w-fit h-10 hover:bg-[#a08c5f] transition-colors rounded-[8px] px-[32px] py-[14px] w-[150px] h-[54px] z-20 cursor-pointer"
      />
    </div>
  );
}
