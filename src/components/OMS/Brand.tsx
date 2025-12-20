import Image from 'next/image'
import React from 'react'

export default function Brand() {
  return (
    <div className="card-bg relative py-[100px] md:flex items-center">
      <div className="absolute top-5 left-0">
              <Image
                src="/images/elevate/background.png"
                width={1920}
                height={404}
                alt=""
              />
            </div>
      <div className="custom-container px-4 md:px-20 py-10 md:py-0 z-20">
        <Image src="/images/osm/osm.png" width={578} height={190} alt="" />
      </div>
      <div className="custom-container px-4 md:px-0 z-20">
        <Image src="/images/osm/elevate.png" width={926} height={466} alt="" />
      </div>
    </div>
  );
}
