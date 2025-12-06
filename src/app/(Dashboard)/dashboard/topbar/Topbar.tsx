'use client';

import { useEffect, useState } from 'react';
import { getUser } from '@/lib/auth';
import Image from 'next/image';

export default function Topbar() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = getUser();
    setUserName(user?.name ?? '');
  }, []);

  return (
    <header className="flex justify-end items-center border-b border-[#e9e9e9] gap-4 bg-white shadow px-6 py-4">
      <div className="rounded-full shadow-md bg-[#fff] p-[8px] cursor-pointer hover:bg-green-100">
        <Image
          src="/images/dashboard/topbar/bell.png"
          width={24}
          height={24}
          alt=""
        />
      </div>
      <div className="rounded-full shadow-md bg-[#fff] p-[8px] cursor-pointer hover:bg-green-100">
        <Image
          src="/images/dashboard/topbar/message.png"
          width={24}
          height={24}
          alt=""
          
        />
      </div>
      <div className="rounded-full shadow-md cursor-pointer hover:bg-green-100">
        <Image
          src="/images/dashboard/topbar/doctor.png"
          width={56}
          height={56}
          alt=""
          
        />
      </div>
      <span className="text-gray-700 font-semibold"> Dr. {userName}</span>
    </header>
  );
}
