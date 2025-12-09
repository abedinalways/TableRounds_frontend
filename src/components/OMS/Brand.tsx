import Image from 'next/image'
import React from 'react'

export default function Brand() {
  return (
    <div className="card-bg  py-[100px] md:flex items-center">
      <div className="custom-container px-4 md:px-0 py-10 md;py-0">
        <Image src="/images/osm/osm.png" width={678} height={190} alt="" />
      </div>
      <div className="custom-container px-4 md:px-0 ">
        <Image src="/images/osm/elevate.png" width={678} height={190} alt="" />
      </div>
    </div>
  );
}
