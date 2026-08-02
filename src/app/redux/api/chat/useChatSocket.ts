'use client';

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Socket } from 'socket.io-client';
import { disconnectSocket, getSocket, joinRoom, joinRooms, isRoomJoined } from '@/lib/socket';
import { store, type AppDispatch, type RootState } from '../../store';
import {
  chatApi,
  type ChatAttachment,
  type Message,
  useGetConversationsQuery,
} from './chatApi';
import { authApi } from '../authApi';
import { notificationApi } from '../notificationApi';
import { addNotification } from '@/store/NotificationSlice';
import { toast } from 'sonner';

const attachedSockets = new Set<Socket | null>();

type SocketMessagePayload = {
  id?: string;
  _id?: string;
  message_id?: string;
  messageId?: string;
  conversation_id?: string;
  conversationId?: string;
  room_id?: string;
  from?: string;
  sender_id?: string;
  senderId?: string;
  sender_name?: string;
  senderName?: string;
  sender_avatar?: string;
  senderAvatar?: string;
  body_text?: string;
  bodyText?: string;
  text?: string;
  content?: string;
  message?: string | SocketMessagePayload;
  created_at?: string;
  createdAt?: string;
  attachments?: ChatAttachment[];
  sender?: { id?: string; name?: string; avatar?: string; avatar_url?: string };
  data?: SocketMessagePayload;
};

const isSocketMessagePayload = (value: unknown): value is SocketMessagePayload =>
  typeof value === 'object' && value !== null;

function resolveSenderFromConversation(
  conversationId: string,
  senderId: string | undefined,
) {
  const conversations =
    chatApi.endpoints.getConversations.select()(store.getState())?.data?.data ||
    [];
  const conv = conversations.find(item => item.id === conversationId);

  if (!conv || !senderId) {
    return { name: 'User', avatar_url: '' };
  }

  const sender =
    conv.creator_id === senderId ? conv.creator : conv.participant;

  return {
    name: sender?.name || 'User',
    avatar_url: sender?.avatar_url || sender?.avatar || '',
  };
}

export function useChatSocket() {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.auth.token);
  const { data: convData } = useGetConversationsQuery(undefined, { skip: !token });

  // Use ref to track if we've already synced rooms for this convData
  const syncedConvIdsRef = useRef<string[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) {
      disconnectSocket();
      syncedConvIdsRef.current = [];
      socketRef.current = null;
      return;
    }

    const socket = getSocket(token);
    if (!socket) return;
    socketRef.current = socket;

    if (attachedSockets.has(socket)) {
      if (socket.connected && convData?.data) {
        const convIds = convData.data.map(c => c.id);
        const newConvIds = convIds.filter(id => !syncedConvIdsRef.current.includes(id));
        if (newConvIds.length > 0) {
          joinRooms(newConvIds);
          syncedConvIdsRef.current = [...syncedConvIdsRef.current, ...newConvIds];
        }
      }
      return;
    }

    attachedSockets.add(socket);

    const syncAfterConnect = () => {
      console.log('[Chat Socket UI] Syncing after connection');
      const state = store.getState();
      const cached =
        chatApi.endpoints.getConversations.select()(state)?.data?.data || [];

      const convIds = cached.map(c => c.id);
      const newConvIds = convIds.filter(id =>
        !syncedConvIdsRef.current.includes(id) && !isRoomJoined(id)
      );

      if (newConvIds.length > 0) {
        syncedConvIdsRef.current = [...syncedConvIdsRef.current, ...newConvIds];
        joinRooms(newConvIds);
      }

      dispatch(notificationApi.util.invalidateTags([
        'notification',
        'adminNotification',
      ]));
      dispatch(chatApi.util.invalidateTags(['Chat']));
    };

    const handleMessage = (payload: unknown) => {
      console.log('[Chat Socket UI] Received message event payload:', payload);
      if (!isSocketMessagePayload(payload)) return;

      const nestedMessage = payload.data?.message;
      const topLevelMessage = payload.message;
      const data = isSocketMessagePayload(nestedMessage)
        ? nestedMessage
        : isSocketMessagePayload(topLevelMessage)
          ? topLevelMessage
          : payload.data || payload;

      const conversationId =
        data?.conversation_id || data?.conversationId || data?.room_id;
      const senderId =
        data?.from || data?.sender_id || data?.senderId || data?.sender?.id;

      if (!conversationId) {
        console.warn('[Chat Socket UI] Ignored message payload because of missing conversationId');
        return;
      }

      const createdAt =
        data.created_at || data.createdAt || new Date().toISOString();
      const messageId =
        data.message_id ||
        data.messageId ||
        data.id ||
        data._id ||
        `${conversationId}:${senderId || 'unknown'}:${createdAt}`;
      const body =
        data.body_text ||
        data.bodyText ||
        data.text ||
        data.content ||
        (typeof data.message === 'string' ? data.message : '');

      const senderFromConv = resolveSenderFromConversation(
        conversationId,
        senderId,
      );
      const sender = {
        id: senderId || '',
        name:
          data.sender?.name ||
          data.sender_name ||
          data.senderName ||
          senderFromConv.name,
        avatar_url:
          data.sender?.avatar_url ||
          data.sender?.avatar ||
          data.sender_avatar ||
          data.senderAvatar ||
          senderFromConv.avatar_url,
      };

      const me =
        authApi.endpoints.me.select()(store.getState())?.data ||
        store.getState().auth.user;

      const newMessage: Message = {
        id: messageId,
        message: body,
        created_at: createdAt,
        sender,
        receiver: {
          id: senderId === me?.id ? '' : (me?.id ?? ''),
          name: '',
          avatar_url: '',
        },
        status: 'SENT',
        attachments: data.attachments || [],
      };

      const queryArgs = { conversationId, limit: 20 };
      const hasMessagesCache = Boolean(
        chatApi.endpoints.getMessages.select(queryArgs)(store.getState())?.data,
      );

      dispatch(
        chatApi.util.updateQueryData('getMessages', queryArgs, draft => {
          if (!draft) return;
          if (!draft.data) draft.data = [];

          if (me?.id === senderId) {
            draft.data = draft.data.filter(message => !message.id?.startsWith('temp_'));
          }

          const existingIndex = draft.data.findIndex(
            message => message.id === messageId,
          );

          if (existingIndex > -1) {
            draft.data[existingIndex] = {
              ...draft.data[existingIndex],
              ...newMessage,
            };
          } else {
            draft.data.push(newMessage);
          }
        }),
      );

      if (!hasMessagesCache) {
        dispatch(
          chatApi.util.upsertQueryData('getMessages', queryArgs, {
            success: true,
            message: '',
            data: [newMessage],
          }),
        );
      }

      let isNewConv = true;
      dispatch(
        chatApi.util.updateQueryData('getConversations', undefined, draft => {
          if (!draft?.data) return;

          const conversationIndex = draft.data.findIndex(
            item => item.id === conversationId,
          );

          if (conversationIndex !== -1) {
            isNewConv = false;
            const conversation = draft.data[conversationIndex];
            conversation.messages = [
              { id: messageId, message: body, created_at: createdAt },
            ];
            conversation.updated_at = createdAt;

            draft.data.splice(conversationIndex, 1);
            draft.data.unshift(conversation);
          }
        }),
      );

      if (isNewConv) {
        dispatch(chatApi.util.invalidateTags(['Chat']));
      } else {
        dispatch(chatApi.util.invalidateTags([{ type: 'Chat', id: conversationId }]));
      }

      if (me?.id !== senderId) {
        dispatch(
          addNotification({
            id: messageId,
            type: 'conversation',
            message: body || 'New message',
            timestamp: createdAt,
            isRead: false,
            isNew: true,
            user: {
              name: sender.name || 'User',
              avatar: sender.avatar_url || '',
              initials: (sender.name || 'U').slice(0, 2).toUpperCase(),
            },
            senderId,
            conversationId,
            messageId,
          }),
        );
        toast.info('New message received');
      }
    };

    const handleConversation = (payload: unknown) => {
      console.log('[Chat Socket UI] Received conversation event payload:', payload);
      if (!isSocketMessagePayload(payload)) return;

      const convId = payload.data?.id || payload.id;
      if (!convId) return;

      joinRoom(convId);
      dispatch(chatApi.util.invalidateTags(['Chat']));
    };

    socket.on('connect', syncAfterConnect);
    socket.on('message', handleMessage);
    socket.on('conversation', handleConversation);

    if (!socket.connected) {
      // Socket will connect and trigger syncAfterConnect
    } else {
      syncAfterConnect();
    }

    return () => {
      console.log('[Chat Socket UI] Cleaning up socket listeners');
      socket.off('connect', syncAfterConnect);
      socket.off('message', handleMessage);
      socket.off('conversation', handleConversation);
      attachedSockets.delete(socket);
      socketRef.current = null;
    };
  }, [token, dispatch]);

  useEffect(() => {
    if (!token || !convData?.data?.length) return;

    const convIds = convData.data.map(conv => conv.id);
    const newConvIds = convIds.filter(id =>
      !syncedConvIdsRef.current.includes(id) && !isRoomJoined(id)
    );

    if (newConvIds.length > 0) {
      console.log('[Chat Socket UI] Syncing new conversations:', newConvIds);
      joinRooms(newConvIds);
      syncedConvIdsRef.current = [...syncedConvIdsRef.current, ...newConvIds];
    }

    return () => {
      if (!socketRef.current?.connected) {
        syncedConvIdsRef.current = [];
      }
    };
  }, [convData, token]);
}

export const joinConversation = (conversationId: string) => {
  joinRoom(conversationId);
};
