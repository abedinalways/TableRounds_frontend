'use client';

import Image from 'next/image';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import { useChat } from '@/app/(Dashboard)/context/ChatContext';
import { useRouter } from 'next/navigation';
import { useMeQuery } from '@/app/redux/api/authApi';

export default function MessageListSection() {
  const { conversations, selectConversation, activeConversationId } = useChat();
  const router = useRouter();
  const me = useMeQuery();
  return (
    <>
      <h4 className=" mb-3 text-green-900 font-semibold">All Messages</h4>

      {/* <div className="relative mb-4">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={16}
        />
        <Input placeholder="Search messages..." className="pl-9" />
      </div> */}

      <div className="space-y-3">
        {conversations.map(conv => (
          <div
            key={conv.id}
            onClick={() => {
              selectConversation(conv.id);
              router.push(`/dashboard/user/messages/${conv.id}`);
            }}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${
              activeConversationId === conv.id
                ? 'bg-gray-100'
                : 'hover:bg-gray-50'
            }`}
          >
            <Image
              src="/images/dashboard/message/doctor.png"
              alt="user"
              width={40}
              height={40}
              className="rounded-full"
            />

            <div className="flex-1">
              <p className="text-sm font-medium">
                {me.data?.id === conv.participant.id
                  ? conv.creator.name
                  : conv.participant.name}
                -{conv.id}
              </p>
              <p className="text-xs text-gray-500 truncate">
                Last message preview
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
