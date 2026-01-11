import FeaturedCard from '@/components/reusable/FeaturedCard';
import Image from 'next/image';
import React from 'react';
const features = [
  {
    icon: '/images/function/img02.png',
    title: 'Create a verified professional profile',
    description:
      'Submit proof-of-self to join a vetted network of clinicians and trainees.',
  },
  {
    icon: '/images/function/img01.png',
    title: 'Use board-style learning tools',
    description: 'Access specialty-tagged question banks.',
  },
  {
    icon: '/images/function/img04.png',
    title: 'Track your progress with advanced analytics',
    description:
      'Monitor your scores, spot weak areas, and climb specialty leaderboards.',
  },
  {
    icon: '/images/function/img03.png',
    title: 'Connect with healthcare professionals across the globe',
    description:
      'Join our leaderboard and build a professional network beyond your own institution.',
  },
];
export default function Function() {
  return (
    <div className="card-bg font-[manrope] py-[100px]">
      <div className="custom-container px-4 md:px-0">
        <div className="md:flex gap-8 items-center justify-around leading-[110%] pb-6">
          <h2 className="text-2xl sm:text-[48px]  font-bold text-black">
            How It works
          </h2>
          <p className="mt-4 md:mt-0 text-sm md:text-md text-gray-600">
            We have streamlined advanced medical education into a simple,
            four-step process. <br />
            Here is how you can transform your learning journey from day one.
          </p>
        </div>
        {/* cards */}
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-[32px] space-y-4 md:space-y-0">
          {/* skeleton div */}
          <div className="col-span-5 ">
            <Image
              className="w-full h-full "
              src="/images/function/img06.png"
              width={400}
              height={400}
              alt=""
            />
          </div>
          {/* 4 cards div */}
          <div className="grid col-span-7 grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <FeaturedCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="relative">
        <Image
          src="/images/TR.png"
          width={451}
          height={453}
          alt=""
          className="absolute md:-top-112 -top-100 md:right-0 opacity-90 z-[-10]"
        />
      </div>
    </div>
  );
}
