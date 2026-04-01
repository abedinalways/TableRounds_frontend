'use client';

import { useParams } from 'next/navigation';
import { useGetMessagesQuery } from '@/app/redux/api/chat/chatApi'; // Assuming this API exists
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const ViewConversationPage = () => {
  const { id: conversationId } = useParams(); // Access the conversationId from URL
  const router = useRouter();
  const endRef = useRef<HTMLDivElement>(null); // Scroll to the bottom

  // Fetch messages based on conversationId
  const {
    data: messages,
    isLoading,
    error,
  } = useGetMessagesQuery({
    conversationId: conversationId as string, // Pass conversationId for API query
    limit: 20, // Fetch 20 messages per request
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' }); // Smooth scroll to latest message
  }, [messages]);

  // Loading state
  if (isLoading) return <p>Loading...</p>;

  // Error handling
  if (error) return <p>Error fetching conversation</p>;

  const renderMessage = (msg: any) => {
    if (!msg.message) return null;

    // Render the message or specific components (e.g., TestResultCard) if needed
    return (
      <p className="whitespace-pre-wrap break-words leading-relaxed">
        {msg.message}
      </p>
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Conversation</h2>

      <div className="space-y-4">
        {messages?.data?.map(msg => (
          <div key={msg.id} className="flex items-center gap-2">
            {/* Avatar for sender */}
            <Image
              src={msg.sender.avatar_url || '/images/img008.png'}
              alt={msg.sender.name}
              width={40}
              height={40}
              className="rounded-full"
              unoptimized
            />
            <div className="p-4 max-w-[70%] rounded-2xl bg-gray-100">
              {renderMessage(msg)} {/* Render the message */}
              <div className="text-sm text-gray-500">
                {new Date(msg.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={endRef} /> {/* Scroll to the last message */}
      </div>
    </div>
  );
};

export default ViewConversationPage;
