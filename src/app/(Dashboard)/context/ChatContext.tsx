'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { store, type AppDispatch, type RootState } from '@/app/redux/store';
import { useChatSocket } from '@/app/redux/api/chat/useChatSocket';
import {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  Conversation,
  Message,
} from '@/app/redux/api/chat/chatApi';
import {
  setActiveConversation,
  setTyping,
} from '@/app/redux/api/chat/chatSlice';
import { skipToken } from '@reduxjs/toolkit/query';
import { useParams } from 'next/navigation';

interface ChatContextType {
  conversations: Conversation[];
  messages: Message[];
  activeConversationId: string | null;
  selectConversation: (id: string) => void;
  sendMessage: (text: string, attachments?: File[]) => Promise<void>;
  isTyping: boolean;
  setTyping: (v: boolean) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used inside ChatProvider');
  return ctx;
};

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const conversationIdFromUrl = params?.id as string | undefined;

  const dispatch = useDispatch<AppDispatch>();

  const { activeConversationId, typing } = useSelector(
    (state: RootState) => state.chat,
  );

  const { joinConversation } = useChatSocket();

  const { data: conversationsData } = useGetConversationsQuery();

  const conversationId = activeConversationId ?? conversationIdFromUrl;

  const { data: messagesData } = useGetMessagesQuery(
    conversationId ? { conversationId, limit: 20 } : skipToken,
  );

  const [sendMessageApi] = useSendMessageMutation();

  // restore redux from URL (refresh safe)
  useEffect(() => {
    if (!conversationIdFromUrl) return;

    if (conversationIdFromUrl !== activeConversationId) {
      dispatch(setActiveConversation(conversationIdFromUrl));
    }
  }, [conversationIdFromUrl, activeConversationId, dispatch]);

  // join socket room
  useEffect(() => {
    if (!conversationId) return;

    joinConversation(conversationId);
  }, [conversationId, joinConversation]);

  async function sendMessage(text: string, attachments: File[] = []) {
    if (!conversationId) return;

    const conv = conversationsData?.data?.find(c => c.id === conversationId);

    if (!conv) return;

    const meId = store.getState().auth?.user?.id;

    const receiverId =
      conv.creator_id === meId ? conv.participant_id : conv.creator_id;

    await sendMessageApi({
      conversationId,
      receiverId,
      message: text,
      attachments,
    }).unwrap();
  }

  return (
    <ChatContext.Provider
      value={{
        conversations: conversationsData?.data ?? [],
        messages: messagesData?.data ?? [],
        activeConversationId: conversationId ?? null,
        selectConversation: id => dispatch(setActiveConversation(id)),
        sendMessage,
        isTyping: typing,
        setTyping: v => dispatch(setTyping(v)),
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
