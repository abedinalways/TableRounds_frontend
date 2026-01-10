'use client';

import Image from 'next/image';
import Lottie from 'lottie-react';
import Btn from '@/components/reusable/button/Btn';

import heartbeat from '../../../public/images/Heartbeat.json';
import { useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);


export default function Banner() {
   const handleExploreMore = useCallback(() => {
     const target = document.querySelector('#features');
     if (!target) return;

     const offsetY = 40;

     gsap.to(window, {
       duration: 1,
       ease: 'power2.out',
       scrollTo: { y: target, offsetY },
     });
   }, []);
  return (
    <section className="relative font-[manrope] py-10 px-4 md:px-0">
      {/* Background Image */}
      <Image
        src="/images/banner.png"
        alt="Banner background"
        fill
        className="object-cover brightness-90"
        priority
      />

      {/* === Decorative Elements === */}

      {/*Banner Image */}
      <Image
        src="/images/osm/banner.png"
        alt=""
        width={826}
        height={820}
        className="
    absolute 
    right-[-60px]
    top-5
    w-[500px] 
    
    md:w-[730px] 
    md:-right-10 
    md:top-4
    z-10 opacity-50 md:opacity-100
  "
      />

      {/* Heartbeat Animation */}
      <Lottie
        animationData={heartbeat}
        loop
        autoplay
        className="
          absolute -left-[30px] md:top-[200px]
          md:left-[-130px] top-[300px]
          w-[200px] md:w-[400px]
          opacity-20
        "
      />

     

      {/* === TEXT + BUTTONS === */}
      <div
        className="
          relative z-20 md:bottom-18
          max-w-3xl 
          mx-auto md:mx-0 md:ml-40
           md:text-left
          pt-[100px] md:pt-[210px]
          
          text-white custom-container
        "
      >
        
          <h2 className="font-bold text-3xl md:text-[40px] xl:text-[48px]  leading-tight">
            Mastering Every Aspect of<br />
            Oral and Maxillofacial Surgery
          </h2>

          <p className="mt-4 text-sm md:text-[24px] text-white/90">
            Built by surgeons. <br /> Evidence-based. <br /> Specialty-driven.
          </p>

          <div className="mt-16 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <Btn
              onClick={handleExploreMore}
              text="Explore OMS Features"
              className="bg-white text-green-700 md:w-[217px] w-full h-[54px]"
            />
          </div>
      </div>
    </section>
  );
}
