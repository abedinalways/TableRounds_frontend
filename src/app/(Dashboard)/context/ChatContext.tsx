

'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '@/app/redux/store';
import { useChatSocket } from '@/app/redux/api/chat/useChatSocket';
import {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useSendAdminMessageMutation,
  useCreateConversationMutation,
  useCreateAdminConversationMutation,
  chatApi,
  Conversation,
  Message,
} from '@/app/redux/api/chat/chatApi';
import {
  setActiveConversation,
  setTyping,
  addAdminConversationId,
} from '@/app/redux/api/chat/chatSlice';
import { useParams } from 'next/navigation';

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

function isAdminUser(user: unknown) {
  const candidate = user as { role?: string; type?: string } | undefined;
  return candidate?.role === 'admin' || candidate?.type === 'admin';
}

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used inside ChatProvider');
  return ctx;
};

export function ChatProvider({ children }: { children: React.ReactNode }) {
  // ✅ Initialize socket connection inside ChatProvider so it stays alive
  // as long as the user is on any dashboard page
  useChatSocket();

  const params = useParams();
  const conversationIdFromUrl = params?.id as string | undefined;
  const dispatch = useDispatch<AppDispatch>();

  const { user: currentUser, auth } = useSelector(
    (state: RootState) => state.auth,
  );
  const { activeConversationId, typing, adminConversationIds } = useSelector(
    (state: RootState) => state.chat,
  );

  // ✅ Sender is admin (for startConversation routing)
  const isAdmin = auth?.role === 'admin' || currentUser?.role === 'admin';

  // API Hooks
  const { data: conversationsData } = useGetConversationsQuery();
  const [sendMessageApi] = useSendMessageMutation();
  const [sendAdminMessageApi] = useSendAdminMessageMutation(); // ✅ NEW
  const [createAdminChat] = useCreateAdminConversationMutation();
  const [createUserChat] = useCreateConversationMutation();

  const conversationId = activeConversationId ?? conversationIdFromUrl;

  // Fetch messages for the active conversation on demand
  const { data: messagesData } = useGetMessagesQuery(
    { conversationId: conversationId ?? '', limit: 20 },
    {
      skip: !conversationId,
    },
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

  // Note: Socket room joining is handled by useChatSocket via convData loading
  // No need to manually join rooms here
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
      console.log('Initiating chat as:', isAdmin ? 'ADMIN' : 'USER');

      let response;
      if (isAdmin) {
        response = await createAdminChat({ participant_id: targetUserId }).unwrap();
        const newConversationId = response.data.id;
        dispatch(addAdminConversationId(newConversationId));
        dispatch(setActiveConversation(newConversationId));
        return newConversationId;
      } else {
        response = await createUserChat({
          participant_id: targetUserId,
        }).unwrap();
      }

      const newConversationId = response.data.id;
      dispatch(setActiveConversation(newConversationId));
      return newConversationId;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Start Conversation Error:', error);
      throw error;
    }
  }

  /**
   * Send Message Logic
   * ✅ Routes to /chat/message/admin for admins, /chat/message for regular users
   * ✅ Optimistically adds the message to the cache so it shows immediately
   */
  async function sendMessage(text: string, attachments: File[] = []) {
    if (!conversationId) return;

    const conv = conversationsData?.data?.find(c => c.id === conversationId);
    if (!conv) return;

    const meId = currentUser?.id;
    const receiverId =
      conv.creator_id === meId ? conv.participant_id : conv.creator_id;

    const payload = {
      conversationId,
      receiverId,
      message: text,
      attachments,
    };

    // ✅ Optimistic update — add the message to cache immediately so UI updates instantly
    // This prevents the "message only shows after reload" bug
    const tempId = `temp_${crypto.randomUUID()}`;
    const now = new Date().toISOString();

    const optimisticMessage: Message = {
      id: tempId,
      message: text || null,
      created_at: now,
      status: 'SENDING',
      attachments: [], // attachments will appear after API confirms
      sender: {
        id: meId ?? '',
        name: currentUser?.name ?? 'Me',
        avatar_url: currentUser?.avatar ?? '',
      },
      receiver: {
        id: receiverId,
        name: '',
        avatar_url: '',
      },
    };

    // Add to messages cache immediately
    dispatch(
      chatApi.util.updateQueryData(
        'getMessages',
        { conversationId, limit: 20 },
        draft => {
          if (!draft?.data) draft.data = [];
          draft.data.push(optimisticMessage);
        },
      ),
    );

    // Also update conversation list preview immediately
    dispatch(
      chatApi.util.updateQueryData('getConversations', undefined, draft => {
        if (!draft?.data) return;
        const c = draft.data.find(c => c.id === conversationId);
        if (!c) return;
        if (!c.messages) c.messages = [];
        c.messages = [{ id: tempId, message: text, created_at: now }];
        c.updated_at = now;
      }),
    );

    // ✅ Route by conversation type, NOT sender role
    // adminConversationIds covers: admin sender + user sending feedback to admin
    const isAdminConversation =
      isAdmin ||
      adminConversationIds.includes(conversationId) ||
      isAdminUser(conv.creator) ||
      isAdminUser(conv.participant);

    try {
      let result;
      if (isAdminConversation) {
        result = await sendAdminMessageApi(payload).unwrap(); // POST /chat/message/admin
      } else {
        result = await sendMessageApi(payload).unwrap(); // POST /chat/message
      }

      // ✅ Replace temp message with real one from server response
      if (result?.data) {
        dispatch(
          chatApi.util.updateQueryData(
            'getMessages',
            { conversationId, limit: 20 },
            draft => {
              if (!draft?.data) return;
              const idx = draft.data.findIndex(m => m.id === tempId);
              if (idx !== -1) {
                draft.data[idx] = { ...result.data, status: 'SENT' };
              }
            },
          ),
        );
      }
    } catch (error) {
      // On failure, remove the temp message from cache
      dispatch(
        chatApi.util.updateQueryData(
          'getMessages',
          { conversationId, limit: 20 },
          draft => {
            if (!draft?.data) return;
            draft.data = draft.data.filter(m => m.id !== tempId);
          },
        ),
      );
      console.error('Send message failed:', error);
      throw error;
    }
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
