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
    <div className="md:px-4 px-2 pt-2 d:pt-0 background md:h-[130px] text-white rounded-lg shadow-lg md:relative overflow-hidden font-[manrope] flex md:items-center max-w-full">
      <div className="flex flex-wrap md:items-center justify-between md:gap-10 md:w-full ">
        <div className="md:flex flex-wrap gap-4 items-center ">
          <Image
            src="/images/dashboard/main_dashboard/doctor.png"
            width={90}
            height={90}
            alt="doctor"
            className="md:w-[90px] md:h-[90px] w-[40px] h-[40px]"
          />
          <div className="space-y-1">
            <h2 ref={textRef} className="md:text-2xl text-md font-bold">
              Dr. {userName}
            </h2>
            {/* <p className="md:text-sm text-xs">
              Stay up to date on your current progress
            </p> */}
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
            <button className="absolute md:top-6 md:right-3 top-56 right-6  text-xl rotate-90 cursor-pointer focus:outline-none">
              ...
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="md:w-40 w-20 bg-background text-foreground"
          >
            <DropdownMenuItem className="cursor-pointer text-[8px] md:text-sm">
              Suspend User
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-[8px] md:text-sm">
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
