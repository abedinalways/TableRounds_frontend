'use client';

import Image from 'next/image';
import Lottie from 'lottie-react';
import Btn from '@/components/reusable/button/Btn';

import heartbeat from '../../../public/images/Heartbeat.json';
import { useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import ImageSkeleton from '../reusable/ImageSkeleton';

gsap.registerPlugin(ScrollToPlugin);

interface BannerProps {
  specialityName: string;
  specialityBannerImg: string;
}

export default function Banner({
  specialityName,
  specialityBannerImg,
}: BannerProps) {
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
    <section className="relative font-[manrope] py-10 px-10">
      {/* Background Image */}
      <Image
        src="/images/banner.png"
        alt="Banner background"
        fill
        className="object-cover brightness-100"
        priority
      />

      {/*Banner Image */}
      {specialityBannerImg ? (
        <Image
          src={specialityBannerImg || '/images/osm/banner.png'}
          alt={`${specialityName} speciality`}
          width={826}
          height={820}
          priority
          unoptimized
          className="absolute right-[-60px] top-5 w-[500px] md:w-[730px] md:-right-10 md:top-4 z-10 opacity-80 md:opacity-100"
        />
      ) : (
        <ImageSkeleton className="w-full h-full" />
      )}
      {/* Heartbeat Animation */}
      <Lottie
        animationData={heartbeat}
        loop
        autoplay
        className="absolute -left-[60px] top-[240px] md:top-[60px] md:left-[-120px] w-[400px] md:w-[600px] opacity-40 **:stroke-[8px]"
      />
      {/* === TEXT + BUTTONS === */}
      <div
        className="
          relative z-20 md:bottom-18
          max-w-3xl 
          mx-auto  md:ml-40
           md:text-left
          pt-[100px] md:pt-[210px]
          
          text-white custom-container
        "
      >
        <h2 className="font-bold text-3xl md:text-[40px] bg-blend-darken xl:text-[48px] leading-tight  drop-shadow-[0_2px_4px_rgba(0,0,0,0.55)]">
          Mastering Every Aspect of
          <br />
          {specialityName}
        </h2>

        <p className="mt-4 text-sm md:text-[24px] text-white/90 [-webkit-text-stroke:0.3px_rgba(0,0,0,0.25)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)]">
          Built by surgeons. <br /> Evidence-based. <br /> speciality-driven.
        </p>

        <div className="mt-16 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <Btn
            onClick={handleExploreMore}
            text={`Explore ${specialityName} Features`}
            className="bg-white text-green-700  w-fit h-[54px] px-4"
          />
        </div>
      </div>
    </section>
  );
}
