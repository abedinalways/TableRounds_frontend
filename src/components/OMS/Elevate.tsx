'use client';
import Btn from '@/components/reusable/button/Btn';
// import Threads from '@/components/Threads';
import Lottie from 'lottie-react';
import heartbeat from '../../../public/images/Heartbeat.json';
import Image from 'next/image';
import React, { useEffect, useRef } from 'react';
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
  }, []);

  return (
    <div className="relative  flex flex-col items-center justify-center gap-6 max-w-[1920px] h-[492px]  text-white text-center bg-[url('/images/elevate/bg.png')] bg-cover bg-no-repeat backdrop-blur-xs px-4 md:px-0">
      <div className="absolute top-10 left-0">
        <Image
          src="/images/elevate/background.png"
          width={1920}
          height={404}
          alt=""
        />
      </div>
      {/* <Threads amplitude={1} distance={0} enableMouseInteraction={true} /> */}
      <div className="absolute md:top-22 top-40 -left-16">
        {/* Heartbeat Animation */}
        <Lottie
          animationData={heartbeat}
          loop
          autoplay
          className="
          
          w-[200px] md:w-[600px]
          opacity-40 **:stroke-[8px]
        "
        />
      </div>
      {/* elipses */}
      {/* <div className="absolute bottom-90 -left-50 rotate-180">
          <Image
            src="/images/elevate/Ellipse05.png"
            width={240}
            height={240}
            alt=""
            className="backdrop-blur-xs"
          />
        </div> */}

      {/* litte DNA */}
      <div ref={imageRef} className="absolute top-62 right-72 opacity-60 ">
        <Image src="/images/elevate/img03.png" width={80} height={80} alt="" />
      </div>
      {/* animated medicine box */}
      <div className="absolute md:top-12 md:left-90 top-2 left-18 opacity-60 animate-float ">
        <Image src="/images/elevate/img04.png" width={80} height={80} alt="" />
      </div>

      <h2 className="text-[28px]  md:text-3xl lg:text-5xl px-4 md:px-0 font-bold">
        Ready to Elevate Your OMS <br />
        Training?
      </h2>
      <p className="text-sm sm:text-lg px-4 md:px-0">
        Join our growing community of OMS trainees and surgeons dedicated to{' '}
        <br />
        improving everyday practice.
      </p>
      <div className="md:flex gap-4 space-y-6 md:space-y-0">
        <Btn
          text="Create Your Free Account"
          href="/register"
          className="bg-[#B79E6B] text-white  hover:bg-[#B79E6B] transition-colors rounded-xl w-full h-10 md:w-[261px] md:h-[54px] cursor-pointer z-30 "
        />
        
          <Btn
          text="Learn More About Tablerounds"
          href="/"
            className="bg-white text-[#B79E6B] w-full h-10  transition-colors rounded-xl md:w-[305px] md:h-[54px] cursor-pointer z-30 "
          />
        
      </div>
    </div>
  );
}
