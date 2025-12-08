'use client';

import { Card } from '@/components/ui/card';
import { useEffect, useRef, useState } from 'react';
import { getUser } from '@/lib/auth';
import Image from 'next/image';
import gsap from 'gsap';

export const WelcomeBanner = () => {
  const [userName, setUserName] = useState('');
  const textRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const user = getUser();
    setUserName(user?.name ?? '');
  }, []);

  
  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        }
      );
    }
  }, [userName]);

  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="px-4 pt-2 d:pt-0 background text-white rounded-lg shadow-lg relative overflow-hidden font-[manrope]">
      <div className="flex items-center justify-between relative z-10">
        <div className="md:flex items-center gap-2">
          <div >
            <Image
              src="/images/dashboard/main_dashboard/doctor.png"
              width={90}
              height={90}
              alt="doctor"
              className='md:w-[90px] md:h-[90px] w-[40px] h-[40px]'
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">{formattedDate}</p>

            <h2 ref={textRef} className="md:text-2xl text-lg font-bold">
              Welcome, Dr. {userName}!
            </h2>

            <p className="md:text-sm text-xs">Stay up to date on your current progress</p>

            <div className="flex md:space-x-4 space-x-2 py-2 text-[#b79e6b]">
              <span className="md:text-lg text-xs font-semibold">333 Followers</span>
              <span className="flex items-center opacity-60">|</span>
              <span className="md:text-lg text-xs font-semibold">666 Following</span>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="flex items-center relative">
          <Image
            src="/images/dashboard/main_dashboard/tr.png"
            width={138}
            height={138}
            alt="doctor"
            className="absolute md:top-14 top-8 md:left-30 right-20 md:opacity-80 opacity-40"
          />
          <Image
            src="/images/dashboard/main_dashboard/img01.png"
            width={257}
            height={213}
            alt=""
            className="absolute md:top-10 top-5 md:right-45 right-3 "
          />
          <Image
            src="/images/dashboard/main_dashboard/doc.png"
            width={176}
            height={245}
            alt="doctor"
            className="md:mr-32 mr-32 mt-10 md:mt-0 z-30"
          />
        </div>
      </div>
    </div>
  );
};
