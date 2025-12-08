'use client'
import React from 'react'
import heartbeat from '../../../../public/images/Heartbeat.json';
import Lottie from 'lottie-react';
export default function Details() {
  return (
    <div className="gradient-bg flex flex-col items-center justify-center gap-6 max-w-[1920px] h-[492px]  text-white text-center ">
      <h2 className="text-md sm:text-3xl px-4 md:px-0 font-bold">
        TableRounds: Specialty-Level Learning and a <br /> Verified Professional
        Network
      </h2>
      <p className="text-xs sm:text-sm px-4 md:px-0">
        TableRounds is a clinician-built platform that brings board-style
        question banks and a vetted community of <br /> surgeons, dentists, and
        trainees into one place. Create a verified profile, work through
        specialty- tagged <br />
        questions with detailed explanations, track your performance by topic,
        and connect with colleagues who are <br />
        equally invested in maintaining a high standard of practice.
      </p>
      <div className="relative">
        {/* Heartbeat Animation */}
        <Lottie
          animationData={heartbeat}
          loop
          autoplay
          className="
          absolute top-0 left-10 md:-top-20
          md:left-100 
          w-[200px] md:w-[300px]
          opacity-20
        "
        />
      </div>
      <div className="relative">
        <Lottie
          animationData={heartbeat}
          loop
          autoplay
          className="
          absolute -top-[250px] right-10 md:-top-70
          md:right-69 
          w-[300px] md:w-[600px]
          opacity-20
        "
        />
      </div>
    </div>
  );
}
