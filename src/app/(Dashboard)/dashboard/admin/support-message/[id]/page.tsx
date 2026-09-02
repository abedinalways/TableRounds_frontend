'use client';

import { useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setActiveConversation } from '@/app/redux/api/chat/chatSlice';




import MessageInput from '@/components/admin-message/MessageInput';
import MessageSection from '@/components/admin-message/MessageSection';
import Header from '@/components/admin-message/Header';

export default function ChatPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const conversationId = params.id as string;

  // Deep-link from a notification (?messageId=) — MessageSection scrolls to
  // and highlights this message after the conversation loads.
  const highlightMessageId = searchParams.get('messageId');

  useEffect(() => {
    if (conversationId) {
      dispatch(setActiveConversation(conversationId));
    }
  }, [conversationId, dispatch]);

  return (
    <>
      <Header />
      <MessageSection highlightMessageId={highlightMessageId} />
      <MessageInput/>
    </>
  );
}
