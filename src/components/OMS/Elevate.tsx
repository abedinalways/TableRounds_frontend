'use client';
import Btn from '@/components/reusable/button/Btn';
import Threads from '@/components/Threads';
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
    <div className="relative  flex flex-col items-center justify-center gap-6 max-w-[1920px] h-[492px]  text-white text-center bg-[url('/images/elevate/bg.png')] bg-cover bg-no-repeat backdrop-blur-xs">
      <div
        style={{ width: '1320px', height: '800px' }}
        className="absolute -top-10 -left-7 rotate-180 opacity-10"
      >
        <Threads amplitude={1} distance={0} enableMouseInteraction={true} />
        <div className="absolute top-100 left-160">
          {/* Heartbeat Animation */}
          <Lottie
            animationData={heartbeat}
            loop
            autoplay
            className="
          
          w-[200px] md:w-[600px]
          opacity-40
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
        <div className="absolute bottom-90 -left-68 opacity-100 ">
          <div ref={imageRef}>
            <Image
              src="/images/elevate/img03.png"
              width={80}
              height={80}
              alt=""
            />
          </div>
        </div>
        {/* animated medicine box */}
        <div className="absolute bottom-20 right-110 opacity-100 ">
          <Image
            src="/images/elevate/img04.png"
            width={80}
            height={80}
            alt=""
            className="animate-float"
          />
        </div>
      </div>
      <h2 className="text-xl  md:text-3xl lg:text-5xl px-4 md:px-0 font-bold">
        Ready to Elevate Your OMS <br />
        Training?
      </h2>
      <p className="text-sm sm:text-lg px-4 md:px-0">
        Join our growing community of OMS trainees and surgeons dedicated to{' '}
        <br />
        improving everyday practice.
      </p>
      <div className="md:flex gap-4">
        <Btn
          text="Create Your Free Account"
          href="/register"
          className="bg-[#B79E6B] text-white w-fit h-10 hover:bg-[#B79E6B] transition-colors rounded-[8px] px-[32px] py-[14px] w-[150px] h-[54px] cursor-pointer z-30 cursor-pointer"
        />
        <Btn
          text="Learn More About OMS Tools"
          className="bg-white text-[#B79E6B] w-fit h-10  transition-colors rounded-[8px] px-[32px] py-[14px] w-[150px] h-[54px] cursor-pointer z-30 cursor-pointer"
        />
      </div>
    </div>
  );
}
