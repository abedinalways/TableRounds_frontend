'use client';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { getUser } from '@/lib/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const [userName] = useState(() => getUser()?.name ?? '');
  const textRef = useRef<HTMLHeadingElement | null>(null);

  return (
    <div className="md:px-4 px-2 pt-2 d:pt-0 background md:h-[130px] text-white rounded-lg shadow-lg md:relative overflow-hidden font-[manrope] flex md:items-center max-w-full ">
      <div className="md:flex flex-wrap items-center justify-between md:gap-10 md:w-full ">
        <div className="md:flex flex-wrap md:gap-4 items-center">
          <div>
            <Image
              src="/images/dashboard/main_dashboard/doctor.png"
              width={90}
              height={90}
              alt="doctor"
              className="md:w-[90px] md:h-[90px] w-[30px] h-[30px]"
            />
          </div>
          <div className="space-y-2">
            <h2 ref={textRef} className="md:text-2xl text-sm font-bold">
              Dr. {userName}
            </h2>
            <p className="md:text-sm text-xs ">
             Chat with your colleague
            </p>
            <div className="flex md:space-x-4 space-x-2 text-[#b79e6b]">
              <span className="md:text-lg text-xs font-semibold">
                333 Followers
              </span>
              <span className="opacity-60">|</span>
              <span className="md:text-lg text-xs font-semibold">
                666 Following
              </span>
            </div>
          </div>
        </div>

        {/* 🔽 DROPDOWN MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="absolute top-6 right-3 text-xl rotate-90 cursor-pointer focus:outline-none">
              ...
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-40 bg-background text-foreground"
          >
            <DropdownMenuItem className="cursor-pointer">
              Report User
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Unfollow User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
