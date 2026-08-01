'use client';

import Image from 'next/image';
import Lottie from 'lottie-react';
import Btn from '@/components/reusable/button/Btn';

import heartbeat from '../../../../public/images/Heartbeat.json';
// import loadingAnim from '../../../../public/images/loading.json';
import { useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

export default function Banner() {
  const handleLearnMore = useCallback(() => {
    const target = document.querySelector('#details');
    if (!target) return;

    const offsetY = 80;

    gsap.to(window, {
      duration: 1,
      ease: 'power2.out',
      scrollTo: { y: target, offsetY },
    });
  }, []);

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

      {/* Dark overlay for text clarity */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-transparent z-10" />

      {/* === Decorative Elements === */}

      {/* Main DNA */}
      <Image
        src="/images/DNA_prime.png"
        alt="DNA"
        width={1024}
        height={1536}
        className="absolute top-10 right-10 md:-right-10 lg:right-10 md:top-23 lg:-top-20 w-[1024px] opacity-90 md:opacity-100 rotate-7  md:rotate-0 "
      />

      {/* Small DNA */}
      <Image
        src="/images/Little_DNA.png"
        alt="Small DNA"
        width={80}
        height={80}
        className="absolute top-[190px] right-[30px] md:top-[590px] md:right-[120px] animate-float opacity-80"
      />

      {/* Heartbeat Animation */}
      <Lottie
        animationData={heartbeat}
        loop
        autoplay
        className="absolute -left-[60px] top-[340px] md:top-[170px] md:left-[-120px] w-[400px] md:w-[600px] opacity-40 **:stroke-[8px]"
      />
      {/* === TEXT + BUTTONS === */}
      <div className="relative z-20 md:space-y-6 max-w-3xl mx-auto md:mx-0 md:ml-[160px] md:text-left pt-[200px] md:pt-[270px] px-4 ms:px-0 text-white custom-container">
        <h2 className="font-bold text-3xl md:text-[36px] lg:text-[48px] leading-[120%] drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]">
          Where healthcare providers come
          <br />
          to learn and collaborate, in all <br />
          fields of medicine and dentistry
        </h2>

        <p className="text-sm md:text-base text-white md:mt-[64px] mt-8 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
          TableRounds brings board-style questions, structured learning{' '}
          <br className="hidden md:block" />
          tools, and a vetted professional community into one platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start md:mt-[64px] mt-8">
          <Btn
            href="/register"
            text="Create Your Free Account"
            className="bg-[#B79E6B] text-white text-sm xl:text-md md:w-[245px] h-[54px]"
          />

          <Btn
            text="Learn More"
            onClick={handleLearnMore}
            className="bg-white text-[#B79E6B] md:w-[217px] h-[54px] text-sm xl:text-md"
          />
        </div>
      </div>
    </section>
  );
}
