'use client';

import Image from 'next/image';
import { useChat } from '@/app/(Dashboard)/context/ChatContext';
import { useRouter } from 'next/navigation';
import { useMeQuery } from '@/app/redux/api/authApi';

export default function MessageListSection() {
  const { conversations, selectConversation, activeConversationId } = useChat();
  const router = useRouter();

  // Fetching the current admin user data
  const { data: adminData } = useMeQuery();

  return (
    <>
      <h4 className="mb-3 text-green-900 font-semibold">All Messages</h4>

      <div className="space-y-3">
        {conversations.map(conv => {
          // 1. Identify the 'other user' (the person the admin is talking to)
          const otherUser =
            adminData?.id === conv.id
              ? conv.creator
              : conv.participant;

          // 2. Get the actual last message text
          const lastMessage =
            conv.messages && conv.messages.length > 0
              ? conv.messages[conv.messages.length - 1].message
              : 'No messages yet';

          return (
            <div
              key={conv.id}
              onClick={() => {
                selectConversation(conv.id);
                // Ensure the path matches your Admin routing structure
                router.push(`/dashboard/admin/support-message/${conv.id}`);
              }}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${
                activeConversationId === conv.id
                  ? 'bg-gray-100'
                  : 'hover:bg-gray-50'
              }`}
            >
              <Image
                // Use the user's actual avatar or a fallback
                src={
                  otherUser?.avatar_url ||
                  '/images/dashboard/message/doctor.png'
                }
                alt={otherUser?.name || 'User'}
                width={40}
                height={40}
                className="rounded-full h-10 w-10 object-cover"
                unoptimized
              />

              <div className="flex-1 truncate">
                <p className="text-sm font-medium">
                  {otherUser?.name || 'Unknown User'}
                </p>
                <p className="text-xs text-gray-500 truncate">{lastMessage}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
