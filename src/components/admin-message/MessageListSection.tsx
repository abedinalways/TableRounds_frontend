'use client';

import Image from 'next/image';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import { useChat } from '@/app/(Dashboard)/context/ChatContext';


export default function MessageListSection() {
  const { conversations, selectConversation, activeConversation } = useChat();

  return (
    <>
      <h4 className="font-semibold mb-3">Message list</h4>

      <div className="relative mb-4">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={16}
        />
        <Input placeholder="Search messages..." className="pl-9" />
      </div>

      <div className="space-y-3">
        {conversations.map(conv => {
          const lastMessage = conv.messages.at(-1);

          return (
            <div
              key={conv.id}
              onClick={() => selectConversation(conv.id)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer
              ${
                activeConversation?.id === conv.id
                  ? 'bg-gray-100'
                  : 'hover:bg-gray-50'
              }`}
            >
              <Image
                src={conv.avatar}
                alt={conv.name}
                width={40}
                height={40}
                className="rounded-full"
              />

              <div className="flex-1">
                <p className="text-sm font-medium">{conv.name}</p>
                <p className="text-xs text-gray-500 truncate">
                  
                  {lastMessage?.text ??
                    (lastMessage?.attachments?.length
                      ? `📎 ${lastMessage.attachments
                          .map(file => file.name)
                          .join(', ')}`
                      : '')}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
