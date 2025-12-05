'use client'
import React from 'react'
import SpecialtyCard from '../reusable/SpecialtyCard'
import Lottie from 'lottie-react';
import heartbeat from '../../../public/images/Heartbeat.json';
export default function Specialty() {
  return (
    <div className="background py-[120px]">
      {/* Heartbeat Animation */}
      <div className="relative">
        <Lottie
          animationData={heartbeat}
          loop
          autoplay
          className="
          absolute -left-[60px] md:-top-[70px]
          md:left-[-160px] top-0
          w-[200px] md:w-[500px]
          opacity-20
        "
        />
      </div>
      <h1 className="text-xl sm:text-3xl custom-container md:px-30 px-4 font-bold text-white font-[roboto]">
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
          absolute  md:-top-[390px]
          md:-right-40 -top-[200px]  -right-6
          w-[200px] md:w-[500px]
          opacity-20
        "
        />
      </div>
    </div>
  );
}
