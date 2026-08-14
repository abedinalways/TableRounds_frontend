/**
 * Chat Socket Hook - Real-time Messaging
 * 
 * Features:
 * - Listens for incoming messages via socket
 * - Auto-joins conversation rooms
 * - Updates Redux store with new messages
 * - Triggers notifications for new messages
 * - Syncs conversations on socket connect
 */

'use client';

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getSocket,
  joinRoom,
  joinRooms,
  isRoomJoined,
  disconnectSocket,
} from '@/lib/socket';
import { store, type AppDispatch, type RootState } from '../../store';
import {
  chatApi,
  type Message,
  useGetConversationsQuery,
} from './chatApi';
import { notificationApi } from '../notificationApi';
import { addNotification } from '@/store/NotificationSlice';
import { toast } from 'sonner';

// ============================================
// Type Definitions
// ============================================

type SocketPayload = Record<string, unknown>;

// ============================================
// Main Hook
// ============================================

/**
 * useChatSocket - Manages real-time chat via Socket.IO
 * 
 * What it does:
 * 1. Connects to socket server with auth token
 * 2. Joins conversation rooms automatically
 * 3. Listens for incoming messages
 * 4. Updates Redux store with new messages
 * 5. Shows notifications for new messages
 */
export function useChatSocket() {
  const dispatch = useDispatch<AppDispatch>();
  
  // Get auth token from Redux store
  const token = useSelector((state: RootState) => state.auth.auth.token);
  
  // Get user's conversations list
  const { data: convData } = useGetConversationsQuery(undefined, { 
    skip: !token 
  });

  // Track which conversations we've already joined
  const joinedConvsRef = useRef<string[]>([]);

  // ============================================
  // Effect 1: Socket Connection & Event Listeners
  // ============================================
  
  useEffect(() => {
    // No token? Disconnect and cleanup
    if (!token) {
      disconnectSocket();
      joinedConvsRef.current = [];
      return;
    }

    // Get or create socket connection
    const socket = getSocket(token);
    if (!socket) return;

    // ----------------------------------------
    // Handle incoming messages
    // ----------------------------------------
    const handleMessage = (payload: unknown) => {

      // Extract message data from payload
      const data = extractMessageData(payload);
      
      if (data.conversationId) {
        // Create message object for Redux
        const newMessage = createMessageObject(data);

        // Update messages in Redux cache
        updateMessagesCache(dispatch, data.conversationId, newMessage);

        // Update conversation list
        updateConversationList(dispatch, data.conversationId, newMessage);

        // Show notification if message is from someone else
        if (data.senderId !== getCurrentUserId()) {
          showMessageNotification(dispatch, newMessage, data);
        }
      }

      // Always invalidate RTK Query tags to ensure fresh data in UI
      dispatch(chatApi.util.invalidateTags(['Chat']));
      dispatch(notificationApi.util.invalidateTags(['notification', 'adminNotification']));
    };

    // ----------------------------------------
    // Handle new conversation events
    // ----------------------------------------
    const handleNewConversation = (payload: unknown) => {
      const data = payload as SocketPayload;
      const nestedData = data?.data as SocketPayload | undefined;
      const convId = (nestedData?.id || data?.id) as string | undefined;
      
      if (convId) {
        joinRoom(convId);
        
        // Refresh conversations list
        dispatch(chatApi.util.invalidateTags(['Chat']));
      }
    };

    // ----------------------------------------
    // Sync conversations when socket connects
    // ----------------------------------------
    const syncConversations = () => {
      
      // Get cached conversations from Redux
      const cached = chatApi.endpoints.getConversations.select()(store.getState())?.data?.data || [];
      const convIds = cached.map(c => c.id);

      // Re-join any conversations that are no longer in activeRooms.
      const newConvs = convIds.filter(id => !isRoomJoined(id));

      if (newConvs.length > 0) {
        joinRooms(newConvs);
      }

      // Update joinedConvsRef to include all conversation IDs
      joinedConvsRef.current = convIds;

      // Refresh data from server
      dispatch(notificationApi.util.invalidateTags(['notification', 'adminNotification']));
      dispatch(chatApi.util.invalidateTags(['Chat']));
    };

    // ----------------------------------------
    // Register event listeners (All common socket event aliases)
    // ----------------------------------------
    const MESSAGE_EVENTS = [
      'message',
      'newMessage',
      'new_message',
      'receiveMessage',
      'receive_message',
      'chatMessage',
      'chat_message',
      'notification',
      'newNotification',
      'new_notification',
    ];

    const CONVERSATION_EVENTS = [
      'conversation',
      'newConversation',
      'new_conversation',
      'createConversation',
    ];

    MESSAGE_EVENTS.forEach(evt => socket.on(evt, handleMessage));
    CONVERSATION_EVENTS.forEach(evt => socket.on(evt, handleNewConversation));
    socket.on('connect', syncConversations);

    // Cleanup on unmount
    return () => {
      MESSAGE_EVENTS.forEach(evt => socket.off(evt, handleMessage));
      CONVERSATION_EVENTS.forEach(evt => socket.off(evt, handleNewConversation));
      socket.off('connect', syncConversations);
    };

  }, [token, dispatch]);

  // ============================================
  // Effect 2: Join New Conversations
  // ============================================
  
  useEffect(() => {
    if (!token || !convData?.data?.length) return;

    const convIds = convData.data.map(c => c.id);
    const newConvs = convIds.filter(
      id => !joinedConvsRef.current.includes(id) && !isRoomJoined(id)
    );

    if (newConvs.length > 0) {
      joinRooms(newConvs);
      joinedConvsRef.current = [...joinedConvsRef.current, ...newConvs];
    }
  }, [convData, token]);

}

// ============================================
// Helper Functions
// ============================================

/**
 * Extract and normalize message data from socket payload
 */
function extractMessageData(payload: unknown): {
  conversationId: string;
  senderId: string;
  messageId: string;
  body: string;
  timestamp: string;
  senderName: string;
  senderAvatar: string;
} {
  const data = (payload as SocketPayload) || {};
  const msg = (data?.data as SocketPayload) || data;
  const sender = (msg?.sender as SocketPayload) || (data?.sender as SocketPayload) || {};
  const conv = (msg?.conversation as SocketPayload) || (data?.conversation as SocketPayload) || {};

  return {
    conversationId: (msg?.conversation_id || msg?.conversationId || conv?.id || data?.conversation_id || data?.conversationId || '') as string,
    senderId: (msg?.from || msg?.sender_id || msg?.senderId || sender?.id || data?.sender_id || '') as string,
    messageId: (msg?.message_id || msg?.id || '') as string,
    body: (msg?.body_text || msg?.message || msg?.text || msg?.content || 'New message') as string,
    timestamp: (msg?.created_at || msg?.createdAt || new Date().toISOString()) as string,
    senderName: (sender?.name || msg?.sender_name || 'User') as string,
    senderAvatar: (sender?.avatar_url || sender?.avatar || '') as string,
  };
}

/**
 * Create Message object for Redux store
 */
function createMessageObject(data: ReturnType<typeof extractMessageData>): Message {
  const currentUser = store.getState().auth.user;

  return {
    id: data.messageId,
    message: data.body,
    created_at: data.timestamp,
    sender: {
      id: data.senderId,
      name: data.senderName,
      avatar_url: data.senderAvatar,
    },
    receiver: {
      id: data.senderId === currentUser?.id ? '' : (currentUser?.id ?? ''),
      name: '',
      avatar_url: '',
    },
    status: 'SENT',
    attachments: [],
  };
}

/**
 * Update messages cache in Redux
 */
function updateMessagesCache(
  dispatch: AppDispatch,
  conversationId: string,
  newMessage: Message
): void {
  const queryArgs = { conversationId, limit: 20 };
  const currentUser = store.getState().auth.user;

  dispatch(
    chatApi.util.updateQueryData('getMessages', queryArgs, draft => {
      if (!draft?.data) draft.data = [];

      // Remove temp messages from current user
      if (newMessage.sender.id === currentUser?.id) {
        draft.data = draft.data.filter(m => !m.id?.startsWith('temp_'));
      }

      // Update or add message
      const idx = draft.data.findIndex(m => m.id === newMessage.id);
      if (idx > -1) {
        draft.data[idx] = { ...draft.data[idx], ...newMessage };
      } else {
        draft.data.push(newMessage);
      }
    })
  );
}

/**
 * Update conversation list in Redux
 */
function updateConversationList(
  dispatch: AppDispatch,
  conversationId: string,
  newMessage: Message
): void {
  dispatch(
    chatApi.util.updateQueryData('getConversations', undefined, draft => {
      if (!draft?.data) return;

      const convIdx = draft.data.findIndex(c => c.id === conversationId);
      if (convIdx > -1) {
        const conv = draft.data[convIdx];
        conv.messages = [{
          id: newMessage.id,
          message: newMessage.message || '',
          created_at: newMessage.created_at,
        }];
        conv.updated_at = newMessage.created_at;
        
        // Move to top of list
        draft.data.splice(convIdx, 1);
        draft.data.unshift(conv);
      }
    })
  );
}

/**
 * Show notification for new message
 */
function showMessageNotification(
  dispatch: AppDispatch,
  message: Message,
  data: ReturnType<typeof extractMessageData>
): void {
  dispatch(
    addNotification({
      id: message.id,
      type: 'conversation',
      message: message.message || 'New message',
      timestamp: data.timestamp,
      isRead: false,
      isNew: true,
      user: {
        name: data.senderName,
        avatar: data.senderAvatar,
        initials: data.senderName.slice(0, 2).toUpperCase(),
      },
      senderId: data.senderId,
      conversationId: data.conversationId,
      messageId: message.id,
    })
  );

  toast.info('New message received');
}

/**
 * Get current user ID
 */
function getCurrentUserId(): string {
  return store.getState().auth.user?.id || '';
}

// ============================================
// Public Export
// ============================================

/**
 * Join a specific conversation room
 */
export const joinConversation = (conversationId: string) => {
  joinRoom(conversationId);
};