'use client';

import Image from 'next/image';
import Lottie from 'lottie-react';
import Btn from '@/components/reusable/button/Btn';

import heartbeat from '../../../public/images/Heartbeat.json';
// import loadingAnim from '../../../public/images/loading.json';

export default function Banner() {
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
    top-[20px]
    w-[500px] 
    sm:w-[650px] 
    md:w-[750px] 
    md:right-[0px] 
    md:top-[24px]
    z-10 opacity-50 md:opacity-100
  "
      />

      {/* Heartbeat Animation */}
      <Lottie
        animationData={heartbeat}
        loop
        autoplay
        className="
          absolute -left-[30px] md:top-[210px]
          md:left-[-70px] top-[300px]
          w-[200px] md:w-[400px]
          opacity-20
        "
      />

      {/* Ellipses / Loading Animation */}
      {/* <Lottie
        animationData={loadingAnim}
        loop
        autoplay
        className="
          absolute -bottom-70 left-[-350px]
          w-[700px] opacity-10 rotate-9
        "
      /> */}

      {/* === TEXT + BUTTONS === */}
      <div
        className="
          relative z-20 md:bottom-18
          max-w-3xl 
          mx-auto md:mx-0 md:ml-[160px]
           md:text-left
          pt-[100px] md:pt-[210px]
          
          text-white custom-container
        "
      >
        
          <h2 className="font-bold text-3xl md:text-[60px] leading-tight">
            Mastering Every Aspect of <br />
            Oral and Maxillofacial Surgery
          </h2>

          <p className="mt-4 text-sm md:text-[24px] text-white/90">
            Built by surgeons. <br /> Evidence-based. <br /> Specialty-driven.
          </p>

          <div className="mt-[64px] flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Btn
              text="Explore OSM Features"
              className="bg-white text-green-700 md:w-[217px] w-full h-[54px]"
            />
          </div>
      </div>
    </section>
  );
}
