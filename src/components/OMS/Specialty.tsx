'use client'
import React from 'react'
import SpecialtyCard from '../reusable/SpecialtyCard'
import Lottie from 'lottie-react';
import heartbeat from '../../../public/images/Heartbeat.json';
export default function Specialty() {
  return (
    <div className="background py-[120px] font-[manrope]">
      {/* Heartbeat Animation */}
      <div className="relative">
        <Lottie
          animationData={heartbeat}
          loop
          autoplay
          className="
          absolute -left-[60px] md:top-0
          md:left-[-50px] top-0
          w-[200px] md:w-[400px]
          opacity-20
        "
        />
      </div>
      <h1 className="text-3xl sm:text-[48px] custom-container text-start  px-4 font-bold text-white font-[roboto]">
        Specialty Level Content
      </h1>
      <SpecialtyCard />

      {/* Heartbeat Animation */}
      <div className="relative">
        <Lottie
          animationData={heartbeat}
          loop
          autoplay
          className="
          absolute md:-top-[420px] md:-right-12 -top-[200px] -right-6 w-[200px] md:w-[400px] opacity-20"
        />
      </div>
    </div>
  );
}
