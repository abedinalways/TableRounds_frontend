'use client';

import { useState } from 'react';
import { getUser } from '@/lib/auth';
import Image from 'next/image';

export default function Topbar() {
  const user = getUser();
  const [userName] = useState(user?.name ?? '');

  return (
    <header className="flex justify-end items-center border-b border-[#e9e9e9] gap-4 bg-white shadow px-6 py-4">
      <div className="rounded-full shadow-md bg-[#fff] md:p-[8px] cursor-pointer hover:bg-green-100">
        <Image
          src="/images/dashboard/topbar/bell.png"
          width={24}
          height={24}
          alt=""
          className="w-[12px] h-[12px] md:w-[24px] md:h-[24px] "
        />
      </div>
      <div className="rounded-full  shadow-md bg-[#fff] md:-[8px] cursor-pointer hover:bg-green-100">
        <Image
          src="/images/dashboard/topbar/message.png"
          width={24}
          height={24}
          alt=""
          className="w-[12px] h-[12px] md:w-[24px] md:h-[24px] "
        />
      </div>
      <div className="rounded-full shadow-md cursor-pointer hover:bg-green-100">
        <Image
          src="/images/dashboard/topbar/doctor.png"
          width={56}
          height={56}
          alt=""
          className="w-[26px] h-[26px] md:w-[56px] md:h-[56px] "
        />
      </div>
      <span className="text-gray-700 font-semibold"> Dr. {userName}</span>
    </header>
  );
}
