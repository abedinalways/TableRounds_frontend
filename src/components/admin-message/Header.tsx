'use client';

import Image from 'next/image';
import React, { useRef } from 'react';


import { useChat } from '@/app/(Dashboard)/context/ChatContext';
import Link from 'next/link';


export default function Header() {
  const { conversations, activeConversationId } = useChat();
  const textRef = useRef<HTMLHeadingElement | null>(null);

 

  const activeConversation = conversations.find(
    conv => conv.id === activeConversationId,
  );
  console.log(activeConversation, 'activeConversation=====================++++++++++++++++',);

  if (!activeConversation) return null;

  

  return (
    <div className="md:px-4 px-2 pt-2 md:pt-0 background md:h-[100px] text-white rounded-lg shadow-lg overflow-hidden font-[manrope] flex md:items-center max-w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/admin/user-profile/${activeConversation?.participant?.id}`} className='cursor-pointer'>
          <Image
            src={activeConversation?.participant?.avatar_url}
            width={90}
            height={90}
            alt="doctor"
            className="md:w-[90px] md:h-[90px] w-[35px] h-[35px] rounded-full aspect-square object-cover"
            unoptimized
            />
            </Link>

          <div className="space-y-1">
            <h2 ref={textRef} className="md:text-2xl text-sm font-bold">
             {activeConversation?.participant?.name}
            </h2>

            <p className="md:text-sm text-xs opacity-90">
              Chat with your colleague
            </p>
          </div>
        </div>

        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-xl rotate-90 cursor-pointer focus:outline-none">
              ...
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-40 bg-background text-foreground"
          >
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={handleReportUser}
              disabled={isLoading}
            >
              {isLoading ? 'Reporting...' : 'Report User'}
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer">
              Unfollow User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
    </div>
  );
}
