'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setActiveConversation } from '@/app/redux/api/chat/chatSlice';

import Header from '@/components/message/Header';
import MessageSection from '@/components/message/MessageSection';
import MessageInput from '@/components/message/MessageInput';
import ChatSkeleton from '@/components/message/ChatSkeleton';

export default function ChatPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const conversationId = params.id as string;

  // Deep-link from a notification (?messageId=) — MessageSection scrolls to
  // and highlights this message after the conversation loads.
  const highlightMessageId = searchParams.get('messageId');

  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    if (conversationId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(true); 
      dispatch(setActiveConversation(conversationId));

      // ✅ small delay to let data settle before rendering chat
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [conversationId, dispatch]);

  if (isLoading) return <ChatSkeleton />;

  return (
    <>
      <Header />
      <MessageSection highlightMessageId={highlightMessageId} />
      <MessageInput />
    </>
  );
}
