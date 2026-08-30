import Image from 'next/image'
import React from 'react'
import ImageSkeleton from '../reusable/ImageSkeleton';

interface BrandProps {
  brandImg?: string;
}

export default function Brand({ brandImg }: BrandProps) {
  
  return (
    <div className="card-bg relative md:py-[100px] py-[70px] md:flex items-center">
      <div className="absolute top-5 left-0">
        <Image
          src="/images/elevate/background.png"
          width={1920}
          height={404}
          alt=""
        />
      </div>
      <div className="custom-container px-4 md:px-20 py-10 md:py-0 z-20">
       
        <div className="relative md:w-[578px] md:h-[190px] w-[280px] h-[100px]">
          {brandImg ? (
            <Image
              src={brandImg}
              alt="Brand"
              fill
              loading="lazy"
              className="object-contain w-fit"
            />
          ) : (
            <ImageSkeleton className='w-full h-full'/>
          )}
        </div>
      </div>
      <div className="custom-container px-4 md:px-0 z-20">
        <Image src="/images/osm/elevate.png" width={926} height={466} alt="" />
      </div>
    </div>
  );
}
