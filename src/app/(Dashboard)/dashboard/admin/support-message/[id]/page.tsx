'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setActiveConversation } from '@/app/redux/api/chat/chatSlice';




import MessageInput from '@/components/admin-message/MessageInput';
import MessageSection from '@/components/admin-message/MessageSection';
import Header from '@/components/admin-message/Header';

export default function ChatPage() {
  const params = useParams();
  const dispatch = useDispatch();

  const conversationId = params.id as string;

  useEffect(() => {
    if (conversationId) {
      dispatch(setActiveConversation(conversationId));
    }
  }, [conversationId, dispatch]);

  return (
    <>
      <Header />
      <MessageSection/>
      <MessageInput/>
    </>
  );
}
