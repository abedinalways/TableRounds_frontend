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
        src="/images/DNA_prime.png"
        alt="DNA"
        width={1024}
        height={1536}
        className="
          absolute top-1 right-20
          md:right-5 md:-top-22
          w-[1024px]
          opacity-100 md:opacity-100
          rotate-7 md:rotate-0
        "
      />

      {/* Small DNA */}
      <Image
        src="/images/Little_DNA.png"
        alt="Small DNA"
        width={80}
        height={80}
        className="
          absolute top-[190px] right-[30px]
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
          absolute -left-[60px] top-[420px] md:top-[170px]
          md:left-[-120px] 
          w-[200px] md:w-[600px]
          opacity-40 **:stroke-[8px]
        "
      />

      {/* Ellipses / Loading Animation */}
      {/* <Lottie
        animationData={loadingAnim}
        loop
        autoplay
        className="
          absolute -bottom-90 left-[-550px]
          w-[900px] opacity-10 rotate-9
        "
      /> */}

      {/* === TEXT + BUTTONS === */}
      <div
        className="
          relative z-20
          md:space-y-[
          64px]
          max-w-3xl
          mx-auto md:mx-0 md:ml-[160px]
           md:text-left
          pt-[280px] md:pt-[270px]
          px-4 ms:px-0
          text-white
          custom-container
        "
      >
        <h2 className="font-bold text-3xl md:text-[60px] leading-[120%]">
          Where healthcare providers come
          <br />
          to learn and collaborate, in all <br />
          fields of medicine and dentistry
        </h2>

        <p className=" text-sm md:text-base text-white/90 md:mt-[64px] mt-8">
          TableRounds brings board-style questions, structured learning{' '}
          <br className="hidden md:block" />
          tools, and a vetted professional community into one platform.
        </p>

        <div className=" flex flex-col sm:flex-row gap-4 justify-center md:justify-start  md:mt-[64px] mt-8">
          <Btn
            text="Create Your Free Account"
            className="bg-[#B79E6B] text-white md:w-[245px] h-[54px]"
          />

          <Btn
            text="Learn More"
            className="bg-white text-[#B79E6B] md:w-[217px] h-[54px]"
          />
        </div>
      </div>
    </section>
  );
}
