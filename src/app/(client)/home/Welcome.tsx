'use client'
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, useRef } from 'react';
import VideoModal from '@/components/VideoModal';

export default function Welcome() {
   const sectionRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Heading + text animation
      gsap.from('.trailer-heading, .trailer-text', {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true, 
        },
      });

      // Poster animation
      gsap.from('.trailer-video', {
        scale: 0.9,
        opacity: 0,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      });
    }, sectionRef);
    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      gsap.killTweensOf('*');
    };
  }, []);
  return (
    <div className="card-bg py-[100px] font-[manrope]" id="welcome">
      <div className="md:flex justify-between   custom-container md:px-0 px-4 pb-12">
        <h2 className="text-[28px] md:[36px] leading-[110%] xl:text-[48px] text-center md:text-start  font-bold text-[#01281e] ">
          Welcome to TableRounds
        </h2>
        <p className="md:text-[18px] text-xs text-gray-600 mt-6 md:mt-0 text-center md:text-start font-light leading-[160%] ">
          Watch the short overview video to see how it fits into your training
          and day-to-<br />day practice.
        </p>
      </div>
      {/* intro video */}
      <div className="px-4 relative md:px-0 mx-auto  custom-container z-20 trailer-video ">
        <Image
          src="/images/welcome.png"
          alt="trailer poster"
          width={1320}
          height={547}
          className=""
        />
        <VideoModal />
        {/* <video
          loop
          controls
          playsInline
          className="w-full aspect-video object-cover rounded-md cursor-pointer"
        >
          <source src="/video/amrounds.mp4" type="video/mp4" />
        </video> */}
      </div>

      <div className="relative -z-15">
        <Image
          src="/images/TR.png"
          width={451}
          height={453}
          alt=""
          className="absolute md:-top-160 -top-78 md:left-26  left-14 md:opacity-70 opacity-50 md:w-fit w-1/2"
        />
      </div>
    </div>
  );
}
