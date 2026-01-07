'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

import gsap from 'gsap';
import {
  isCustomAttachment,
  useChat,
} from '@/app/(Dashboard)/context/ChatContext';
import TestCard from '../message/TestCard';

export default function MessageSection() {
  const { activeConversation, isTyping } = useChat();
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });

    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.04 }
      );
    }
  }, [activeConversation?.messages.length]);

  if (!activeConversation) return null;
  const isImage = (file: File) => file.type.startsWith('image/');

  return (
    <div ref={containerRef} className="md:p-6 p-2 space-y-4  overflow-y-auto">
      {activeConversation.messages.map(msg =>
        msg.sender === 'doctor' ? (
          <div key={msg.id} className="flex md:gap-3 gap-1">
            <div className="flex items-start">
              <Image
                src={activeConversation.avatar}
                alt="doctor"
                width={40}
                height={40}
                className="rounded-full md:w-[40px] md:h-[40px] w-[20px] h-[20px] "
              />
            </div>
            <div className="bg-gray-100 md:p-4  p-2 rounded-xl max-w-md md:text-sm text-xs">
              {msg.text}
              {msg.attachments?.length && (
                <div className="mt-2 space-y-2 ">
                  {msg.attachments.map((file, i) => {
                    if (isCustomAttachment(file)) {
                      switch (file.attachmentsType) {
                        case 'test-result':
                          return (
                            <TestCard
                              questions={25}
                              correctPercentage={85}
                              time="20 minutes"
                              percentile={90}
                              difficulty="Medium"
                              category="Psychology"
                            />
                          );

                        default:
                          return 'unkown file';
                      }
                    }

                    const url = URL.createObjectURL(file);

                    return isImage(file) ? (
                      <img
                        key={i}
                        src={url}
                        alt={file.name}
                        className="rounded-lg max-w-full cursor-pointer"
                        onClick={() => window.open(url)}
                      />
                    ) : (
                      <div
                        key={i}
                        className="text-xs underline cursor-pointer opacity-80"
                        onClick={() => window.open(url)}
                      >
                        📎 {file.name}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div key={msg.id} className="flex justify-end md:gap-3 gap-1">
            <div className="bg-[#095f48] text-white p-4 rounded-xl max-w-md text-sm">
              {msg.text}
              {msg.attachments?.length && (
                <div className="mt-2 space-y-2">
                  {msg.attachments.map((file, i) => {
                    if (isCustomAttachment(file)) {
                      switch (file.attachmentsType) {
                        case 'test-result':
                          return (
                            <TestCard
                              questions={25}
                              correctPercentage={85}
                              time="20 minutes"
                              percentile={90}
                              difficulty="Medium"
                              category="Psychology"
                            />
                          );

                        default:
                          return 'unkown file';
                      }
                    }
                    
                    const url = URL.createObjectURL(file);

                    return isImage(file) ? (
                      <img
                        key={i}
                        src={url}
                        alt={file.name}
                        className=" cursor-pointer"
                        onClick={() => window.open(url)}
                      />
                    ) : (
                      <div
                        key={i}
                        className="text-xs underline cursor-pointer opacity-80"
                        onClick={() => window.open(url)}
                      >
                        📎 {file.name}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="flex items-end">
              <Image
                src="/images/dashboard/message/me.png"
                alt="me"
                width={12}
                height={12}
                className="rounded-full"
              />
            </div>
          </div>
        )
      )}

      {isTyping && (
        <p className="text-sm text-gray-400">Someone is typing...</p>
      )}

      <div ref={endRef} />
    </div>
  );
}
