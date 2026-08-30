import React from 'react'
import FeaturesCard from './FeaturesCard'
interface props {
  specialityName: string;
}

export default function Features({ specialityName }:props) {
  return (
    <div id='features' className="custom-container bg-card py-[100px] px-10 font-[manrope] text-[#01281e]">
      <h2 className="text-2xl md:text-3xl lg:text-5xl font-extrabold font-[roboto] pb-8">
        What We Get
      </h2>
      <FeaturesCard specialityName={specialityName} />
    </div>
  );
}
