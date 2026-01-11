'use client';
import Btn from '@/components/reusable/button/Btn';
import Lottie from 'lottie-react';
import heartbeat from '../../../public/images/Heartbeat.json';
import Image from 'next/image';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import MotionPathPlugin from 'gsap/MotionPathPlugin';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation'; // Import this hook to get the current path

gsap.registerPlugin(ScrollToPlugin);
gsap.registerPlugin(MotionPathPlugin);

export default function Elevate() {
  const router = useRouter();
  const pathname = usePathname(); // Get the current path
  const isHomepage = pathname === '/'; // Check if we're on the homepage

  const imageRef = useRef(null);

  const handleScrollToSection = () => {
    router.push('/'); // Navigate to homepage
    setTimeout(() => {
      const el = document.querySelector('#welcome');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);
  };

  // GSAP animation for the image movement
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

    return () => {
      tl.kill();
    };
  }, []);

  // Scroll to the "Welcome" section after the homepage is loaded
  useEffect(() => {
    if (isHomepage) {
      const section = document.getElementById('welcome');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' }); // Smooth scroll to the #welcome section
      }
    }
  }, [isHomepage]); // Trigger when we are on the homepage

  return (
    <div className="relative flex flex-col items-center justify-center gap-6 max-w-[1920px] h-[492px] text-white text-center bg-[url('/images/elevate/bg.png')] bg-cover bg-no-repeat backdrop-blur-xs px-4 md:px-0">
      <div className="absolute top-10 left-0">
        <Image
          src="/images/elevate/background.png"
          width={1920}
          height={404}
          alt=""
        />
      </div>
      <div className="absolute md:top-22 top-40 -left-16">
        <Lottie
          animationData={heartbeat}
          loop
          autoplay
          className="w-[200px] md:w-[600px] opacity-40"
        />
      </div>

      <div ref={imageRef} className="absolute top-62 right-72 opacity-60">
        <Image src="/images/elevate/img03.png" width={80} height={80} alt="" />
      </div>

      <div className="absolute md:top-12 md:left-90 top-2 left-18 opacity-60 animate-float ">
        <Image src="/images/elevate/img04.png" width={80} height={80} alt="" />
      </div>

      <h2 className="text-[28px] md:text-3xl lg:text-5xl px-4 md:px-0 font-bold">
        Ready to Elevate Your OMS <br />
        Training?
      </h2>
      <p className="text-sm sm:text-lg px-4 md:px-0">
        Join our growing community of OMS trainees and surgeons dedicated to
        <br />
        improving everyday practice.
      </p>

      <div className="md:flex gap-4 space-y-6 md:space-y-0">
        <Btn
          text="Create Your Free Account"
          href="/register"
          className="bg-[#B79E6B] text-white hover:bg-[#B79E6B] transition-colors rounded-xl w-full h-10 md:w-[261px] md:h-[54px] text-sm cursor-pointer z-30"
        />

        <Btn
          text="Learn More About TableRounds"
          // href="/#welcome"
          className="bg-white text-[#B79E6B] w-full h-10 transition-colors rounded-xl md:w-[305px] md:h-[54px] cursor-pointer z-30 text-sm"
          onClick={handleScrollToSection} // Scroll to section when clicked
        />
      </div>
    </div>
  );
}
