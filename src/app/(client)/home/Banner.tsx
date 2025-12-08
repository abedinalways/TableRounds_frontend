'use client';

import Image from 'next/image';
import Lottie from 'lottie-react';
import Btn from '@/components/reusable/button/Btn';

import heartbeat from '../../../../public/images/Heartbeat.json';
import loadingAnim from '../../../../public/images/loading.json';

export default function Banner() {
  return (
    <section className="relative w-full h-[750px] md:h-[900px] overflow-hidden font-[manrope]">
      {/* Background Image */}
      <Image
        src="/images/banner.png"
        alt="Banner background"
        fill
        className="object-cover brightness-95"
        priority
      />

      {/* === Decorative Elements === */}

      {/* Main DNA */}
      <Image
        src="/images/DNA01.png"
        alt="DNA"
        width={1572}
        height={2059}
        className="
          absolute top-0 right-0
          md:-right-5 md:top-0
          w-[967px] md:w-[730px]
          opacity-20 md:opacity-100
          rotate-270 md:rotate-0
        "
      />

      {/* Small DNA */}
      <Image
        src="/images/Little_DNA.png"
        alt="Small DNA"
        width={80}
        height={80}
        className="
          absolute top-[590px] right-[30px]
          md:top-[590px] md:right-[120px]
          animate-float opacity-80
        "
      />

      {/* Heartbeat Animation */}
      <Lottie
        animationData={heartbeat}
        loop
        autoplay
        className="
          absolute -left-[60px] md:top-[120px]
          md:left-[-160px] top-[180px]
          w-[200px] md:w-[600px]
          opacity-20
        "
      />

      {/* Ellipses / Loading Animation */}
      <Lottie
        animationData={loadingAnim}
        loop
        autoplay
        className="
          absolute -bottom-90 left-[-550px]
          w-[900px] opacity-10 rotate-9
        "
      />

      {/* === TEXT + BUTTONS === */}
      <div
        className="
          relative z-20
          max-w-3xl
          mx-auto md:mx-0 md:ml-[160px]
           md:text-left
          pt-[100px] md:pt-[240px]
          px-4
          text-white
        "
      >
        <h2 className="font-bold text-3xl md:text-5xl leading-tight">
          Where healthcare providers come to learn and collaborate, in all
          fields of medicine and dentistry
        </h2>

        <p className="mt-4 text-sm md:text-base text-white/90">
          TableRounds brings board-style questions, structured learning{' '}
          <br className="hidden md:block" />
          tools, and a vetted professional community into one platform.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <Btn
            text="Create Your Free Account"
            className="bg-[#B79E6B] text-white w-[245px] h-[54px]"
          />

          <Btn
            text="Learn More"
            className="bg-white text-[#B79E6B] w-[217px] h-[54px]"
          />
        </div>
      </div>
    </section>
  );
}
