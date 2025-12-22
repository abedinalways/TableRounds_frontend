'use client'
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Mic, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { getUser } from '@/lib/auth';

import gsap from 'gsap';

export default function ChatLayout() {
  const [userName] = useState(() => getUser()?.name ?? '');
  const textRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
        }
      );
    }
  }, [userName]);

  return (
    <section className="grid grid-cols-12 gap-6 h-[90vh] p-6 bg-[#f7f8f4] font-[manrope]">
      {/* Chat Area */}
      <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl shadow-sm flex flex-col">
        {/* Header */}
        <div className="px-4 pt-2 d:pt-0 background text-white rounded-lg shadow-lg relative overflow-hidden font-[manrope] m-6">
          <div className="flex  items-start justify-between relative z-10">
            <div className="flex flex-col justify-between gap-18 md:p-8">
              <div className="md:flex items-center gap-2">
                <div>
                  <Image
                    src="/images/dashboard/main_dashboard/doctor.png"
                    width={90}
                    height={90}
                    alt="doctor"
                    className="md:w-[90px] md:h-[90px] w-[40px] h-[40px]"
                  />
                </div>
                <div className="space-y-2">
                  <h2 ref={textRef} className="md:text-2xl text-lg font-bold">
                    Dr. {userName}
                  </h2>

                  <p className="md:text-sm text-xs">
                    Stay up to date on your current progress
                  </p>

                  <div className="flex md:space-x-4 space-x-2  text-[#b79e6b]">
                    <span className="md:text-lg text-xs font-semibold">
                      333 Followers
                    </span>
                    <span className="flex items-center opacity-60">|</span>
                    <span className="md:text-lg text-xs font-semibold">
                      666 Following
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*  */}
        {/* Messages */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          <div className="flex gap-3">
            <Image
              src="/images/dashboard/message/doctor.png"
              alt="user"
              width={50}
              height={50}
              className="rounded-[36px]"
            />
            <div className="bg-gray-100 p-4 rounded-xl max-w-md text-sm">
              Hi! Did you see the latest research on TMJ disorders?
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <div className="bg-[#095f48] text-white p-4 rounded-xl max-w-md text-sm">
              Yes! The findings were fascinating. I can send you the full paper
              if you would like.
            </div>
            <Image
              src="/images/dashboard/message/me.png"
              alt="me"
              width={12}
              height={12}
              className="rounded-[36px]"
            />
          </div>

          <div className="flex gap-3">
            <Image
              src="/images/dashboard/message/doctor.png"
              alt="user"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="bg-gray-100 p-4 rounded-xl max-w-md text-sm">
              That would be great! I am particularly interested in the surgical
              approaches.
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t flex items-center gap-3">
          <Input placeholder="Enter message..." className="flex-1" />
          <Button size="icon" variant="ghost">
            <Mic size={18} />
          </Button>
          <Button size="icon">
            <Send size={18} />
          </Button>
        </div>
      </div>

      {/* Message List */}
      <aside className="col-span-12 lg:col-span-4 bg-white rounded-2xl shadow-sm p-4 flex flex-col">
        <h4 className="font-semibold mb-3">Message list</h4>
        <div className="relative mb-4">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <Input placeholder="Search messages..." className="pl-9" />
        </div>

        <div className="space-y-3 overflow-y-auto">
          {[1, 2, 3, 4, 5].map(item => (
            <div
              key={item}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 cursor-pointer"
            >
              <Image
                src="/images/dashboard/message/doctor.png"
                alt="list"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">Dr. Michael Rodriguez</p>
                <p className="text-xs text-gray-500 truncate">
                  Can we schedule a consultation for next...
                </p>
              </div>
              <span className="text-xs text-gray-400">15m</span>
            </div>
          ))}
        </div>
      </aside>
    </section>
  );
}
