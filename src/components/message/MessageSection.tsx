'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { getUser } from '@/lib/auth';

type Message = {
  id: string;
  sender: 'me' | 'doctor';
  text?: string;
  attachments?: File[];
};

export default function MessageSection() {
  const [userName] = useState(() => getUser()?.name ?? '');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'doctor',
      text: 'Hi! Did you see the latest research on TMJ disorders?',
    },
    {
      id: '2',
      sender: 'me',
      text: 'Yes! The findings were fascinating. I can send you the full paper if you would like.',
    },
    {
      id: '3',
      sender: 'doctor',
      text: 'That would be great! I am particularly interested in the surgical approaches.',
    },
  
  ]);

  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  /* Auto scroll */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="p-6 space-y-4 overflow-y-auto">
      {messages.map(msg =>
        msg.sender === 'doctor' ? (
          <div key={msg.id} className="flex gap-3">
            <div className="flex items-start">
              <Image
                src="/images/dashboard/message/doctor.png"
                alt="doctor"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>

            <div className="bg-gray-100 p-4 rounded-xl max-w-md text-sm">
              {msg.text}
            </div>
          </div>
        ) : (
          <div key={msg.id} className="flex justify-end gap-3">
            <div className="bg-[#095f48] text-white p-4 rounded-xl max-w-md text-sm">
              {msg.text}
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
      <div ref={messagesEndRef} />

      {/* Typing indicator */}
      {isTyping && (
        <div className="px-6 pb-2 flex items-center gap-2 text-gray-500 text-sm">
          <div className="flex gap-1">
            <span className="typing-dot" />
            <span className="typing-dot delay-1" />
            <span className="typing-dot delay-2" />
          </div>
          <span>Someone is typing</span>
        </div>
      )}
    </div>
  );
}
