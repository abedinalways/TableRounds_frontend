'use client';

import Image from 'next/image';
import React, { useRef } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useChat } from '@/app/(Dashboard)/context/ChatContext';

export default function Header() {
  const { conversations, activeConversationId } = useChat();
  const textRef = useRef<HTMLHeadingElement | null>(null);

  const activeConversation = conversations.find(
    conv => conv.id === activeConversationId,
  );
  console.log(activeConversation, 'llllllllldscdsasdaaaaaa============')
  if (!activeConversation) return null;

  return (
    <div className="md:px-4 px-2 pt-2 md:pt-0 background md:h-[100px] text-white rounded-lg shadow-lg md:relative overflow-hidden font-[manrope] flex md:items-center max-w-full">
      <div className="flex items-center justify-between w-full">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Image
            src={activeConversation?.avatar_url ?? '/images/dashboard/main_dashboard/doctor.png'
            }
            width={90}
            height={90}
            alt="doctor"
            className="md:w-[90px] md:h-[90px] w-[35px] h-[35px] rounded-full object-cover"
          />

          <div className="space-y-1">
            <h2 ref={textRef} className="md:text-2xl text-sm font-bold">
              Dr. {activeConversation?.participant?.name}
            </h2>

            <p className="md:text-sm text-xs opacity-90">
              Chat with your colleague
            </p>

            {/* <div className="flex md:space-x-4 space-x-2 text-[#b79e6b]">
              <span className="md:text-lg text-xs font-semibold">
                333 Followers
              </span>

              <span className="opacity-60">|</span>

              <span className="md:text-lg text-xs font-semibold">
                666 Following
              </span>
            </div> */}
          </div>
        </div>

        {/* Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-xl rotate-90 cursor-pointer focus:outline-none">
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
