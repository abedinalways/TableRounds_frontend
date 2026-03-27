'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '@/app/redux/store';
import { useChatSocket } from '@/app/redux/api/chat/useChatSocket';
import {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useCreateConversationMutation,
  useCreateAdminConversationMutation,
  Conversation,
  Message,
} from '@/app/redux/api/chat/chatApi';
import {
  setActiveConversation,
  setTyping,
} from '@/app/redux/api/chat/chatSlice';
import { skipToken } from '@reduxjs/toolkit/query';
import { useParams, usePathname } from 'next/navigation';

interface ChatContextType {
  conversations: Conversation[];
  messages: Message[];
  activeConversationId: string | null;
  selectConversation: (id: string) => void;
  sendMessage: (text: string, attachments?: File[]) => Promise<void>;
  startConversation: (targetUserId: string) => Promise<string>;
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
  const pathname = usePathname();
  const conversationIdFromUrl = params?.id as string | undefined;
  const dispatch = useDispatch<AppDispatch>();

  const auth = useSelector((state: RootState) => state.auth);
  const currentUser = auth?.user || (auth as any)?.data?.user;

  const { activeConversationId, typing } = useSelector(
    (state: RootState) => state.chat,
  );

  // API Hooks
  const { joinConversation } = useChatSocket();
  const { data: conversationsData } = useGetConversationsQuery();
  const [sendMessageApi] = useSendMessageMutation();
  const [createAdminChat] = useCreateAdminConversationMutation();
  const [createUserChat] = useCreateConversationMutation();

  const conversationId = activeConversationId ?? conversationIdFromUrl;

  const { data: messagesData } = useGetMessagesQuery(
    conversationId ? { conversationId, limit: 20 } : skipToken,
  );

  // debugging
  useEffect(() => {
    console.log('Chat Context User:', currentUser);
  }, [currentUser]);

  // Restore active chat from URL
  useEffect(() => {
    if (!conversationIdFromUrl) return;
    if (conversationIdFromUrl !== activeConversationId) {
      dispatch(setActiveConversation(conversationIdFromUrl));
    }
  }, [conversationIdFromUrl, activeConversationId, dispatch]);

  // Join socket
  useEffect(() => {
    if (!conversationId) return;
    joinConversation(conversationId);
  }, [conversationId, joinConversation]);

  /**
   * Start Conversation Logic
   */
  async function startConversation(targetUserId: string): Promise<string> {
    const existingConv = conversationsData?.data?.find(
      c => c.creator_id === targetUserId || c.participant_id === targetUserId,
    );

    if (existingConv) {
      dispatch(setActiveConversation(existingConv.id));
      return existingConv.id;
    }

    try {
      const isAdminPath = pathname.includes('/admin/');
      const userRole = currentUser?.role?.toString().toLowerCase();
      const userType = (currentUser as any)?.type?.toString().toLowerCase();

      const isAdmin =
        isAdminPath || userRole === 'admin' || userType === 'admin';

      console.log('Initiating chat as:', isAdmin ? 'ADMIN' : 'USER');

      let response;
      if (isAdmin) {
        response = await createAdminChat({ user_id: targetUserId }).unwrap();
      } else {
        response = await createUserChat({
          participant_id: targetUserId,
        }).unwrap();
      }

      const newConversationId = response.data.id;
      dispatch(setActiveConversation(newConversationId));
      return newConversationId;
    } catch (error: any) {
      console.error('Start Conversation Error:', error);
      throw error;
    }
  }

  async function sendMessage(text: string, attachments: File[] = []) {
    if (!conversationId) return;

    const conv = conversationsData?.data?.find(c => c.id === conversationId);
    if (!conv) return;

    const meId = currentUser?.id;
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
        startConversation,
        isTyping: typing,
        setTyping: v => dispatch(setTyping(v)),
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
