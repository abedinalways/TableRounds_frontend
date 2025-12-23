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
    <div className="px-4 pt-2 d:pt-0 background text-white rounded-lg shadow-lg relative overflow-hidden font-[manrope] flex items-center max-w-full">
      <div className="flex items-center justify-between gap-10 w-full">
        <div className="flex gap-4 items-center">
          <Image
            src="/images/dashboard/main_dashboard/doctor.png"
            width={90}
            height={90}
            alt="doctor"
            className="md:w-[90px] md:h-[90px] w-[40px] h-[40px]"
          />
          <div className="space-y-2">
            <h2 ref={textRef} className="md:text-2xl text-lg font-bold">
              Dr. {userName}
            </h2>
            <p className="md:text-sm text-xs">
              Stay up to date on your current progress
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
