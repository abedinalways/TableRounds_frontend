/* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client';

// import { useEffect, useRef } from 'react';
// import { io, Socket } from 'socket.io-client';
// import { useDispatch } from 'react-redux';
// import Cookies from 'js-cookie';

// import { store, type AppDispatch } from '../../store';
// import { chatApi, useGetConversationsQuery } from './chatApi';
// import type { ChatAttachment, Message } from './chatApi';
// import { authApi } from '../authApi';
// import { addNotification } from '@/store/NotificationSlice';
// import { notificationApi } from '../notificationApi';

// // ─── Types ────────────────────────────────────────────────────────────────────

// export type SocketMessage = {
//   from: string;
//   data: {
//     message: {
//       id: string;
//       message_id: string;
//       body_text: string;
//       from: string;
//       conversation_id: string;
//       created_at: string;
//       attachments: ChatAttachment[];
//     };
//   };
// };

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// function getInitials(name: string): string {
//   return name
//     .split(' ')
//     .map(w => w[0])
//     .join('')
//     .slice(0, 2)
//     .toUpperCase();
// }

// function createSocketNotification(
//   type: 'conversation' | 'approved' | 'rejected' | 'follow' | 'user-registered',
//   rawData: unknown,
// ) {
//   const payload = rawData as any;
//   const data = payload?.data || payload;

//   const actor =
//     data?.sender ||
//     data?.from_user ||
//     data?.user ||
//     payload?.sender ||
//     payload?.user ||
//     (data?.name ? data : null);

//   const name = actor?.name || actor?.first_name || 'User';
//   const avatar =
//     actor?.avatar_url || actor?.avatar || actor?.profile_image || '/images/default-avatar.png';

//   let message: string =
//     data?.notification_event?.text ||
//     data?.message?.body_text ||
//     data?.text ||
//     (typeof data?.message === 'string' ? data.message : '') ||
//     payload?.text ||
//     (typeof payload?.message === 'string' ? payload.message : '');

//   if (!message) {
//     if (type === 'follow') message = 'Someone followed you';
//     else if (type === 'conversation') message = 'Sent you a message';
//     else if (type === 'approved') message = 'Your account has been approved';
//     else if (type === 'rejected') message = 'Your account has been rejected';
//     else if (type === 'user-registered') message = 'A new user registered';
//     else message = 'You have a new notification';
//   }

//   const id = data?.id || payload?.id || `temp_${crypto.randomUUID()}`;

//   return {
//     id,
//     type,
//     message,
//     timestamp: data?.created_at || payload?.created_at || new Date().toISOString(),
//     isRead: false,
//     isNew: true,
//     user: { name, avatar, initials: getInitials(name) },
//   };
// }

// // ─── Hook ─────────────────────────────────────────────────────────────────────

// export function useChatSocket() {
//   const socketRef = useRef<Socket | null>(null);
//   const dispatch = useDispatch<AppDispatch>();

//   // Keep a stable ref to convData so the socket connect handler can always read the latest value
//   const { data: convData } = useGetConversationsQuery();
//   const convDataRef = useRef(convData);
//   useEffect(() => {
//     convDataRef.current = convData;
//   }, [convData]);

//   // Whenever convData changes (e.g. a new conversation appears), join any new rooms
//   useEffect(() => {
//     const socket = socketRef.current;
//     if (!socket?.connected || !convData?.success || !Array.isArray(convData.data)) return;
//     convData.data.forEach(conv => socket.emit('joinRoom', { room_id: conv.id }));
//     console.log(`[useChatSocket] Joined ${convData.data.length} rooms on convData update.`);
//   }, [convData]);

//   // ── Main socket setup ─────────────────────────────────────────────────────
//   useEffect(() => {
//     const token = Cookies.get('token');

//     const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
//       extraHeaders: {
//         authorization: `Bearer ${token}`,
//       },
//     });

//     socketRef.current = socket;

//     const joinAllRooms = () => {
//       // Try store cache first (zero-latency)
//       const state = store.getState() as any;
//       const cached: any[] = chatApi.endpoints.getConversations.select()(state)?.data?.data || [];

//       if (cached.length > 0) {
//         cached.forEach(conv => socket.emit('joinRoom', { room_id: conv.id }));
//         console.log(`[useChatSocket] Joined ${cached.length} rooms from cache.`);
//       } else {
//         // Cache empty – fetch then join
//         dispatch(chatApi.endpoints.getConversations.initiate(undefined, { forceRefetch: false }))
//           .then((result: any) => {
//             const convs: any[] = result?.data?.data || [];
//             convs.forEach(conv => socket.emit('joinRoom', { room_id: conv.id }));
//             console.log(`[useChatSocket] Joined ${convs.length} rooms after fetch.`);
//           })
//           .catch(console.error);
//       }
//     };

//     socket.on('connect', () => {
//       console.log('[useChatSocket] Connected:', socket.id);
//       joinAllRooms();
//     });

//     socket.onAny((event, data) => {
//       console.log('[useChatSocket] EVENT:', event, data);
//     });

//     // ── Notification helper ────────────────────────────────────────────────
//     const handleNotification = (
//       type: 'conversation' | 'approved' | 'rejected' | 'follow' | 'user-registered',
//       rawData: unknown,
//       refetchFromApi = false,
//     ) => {
//       const state = store.getState() as any;
//       const existingIds = new Set<string>(
//         state.notifications?.notifications?.map((n: any) => n.id) || [],
//       );

//       const notification = createSocketNotification(type, rawData);

//       if (!existingIds.has(notification.id)) {
//         dispatch(addNotification(notification as any));
//       }

//       // Only refetch from API for events that are stored in the backend notification table
//       // (follow, approved, rejected, user-registered). Chat messages are NOT stored there,
//       // so invalidating would cause the message notification to disappear!
//       if (refetchFromApi) {
//         dispatch(notificationApi.util.invalidateTags(['notification', 'adminNotification'] as any));
//       }
//     };

//     // ── Global notification events ─────────────────────────────────────────
//     // Pass true = refetch from API to get the fully-populated sender name/avatar
//     socket.on('approved', d => handleNotification('approved', d, true));
//     socket.on('rejected', d => handleNotification('rejected', d, true));
//     socket.on('follow', d => handleNotification('follow', d, true));
//     socket.on('user-registered', d => handleNotification('user-registered', d, true));

//     socket.on('conversation', d => {
//       handleNotification('conversation', d);
//       const p = d as any;
//       const convId = p?.data?.id || p?.id;
//       if (convId) {
//         socket.emit('joinRoom', { room_id: convId });
//         dispatch(chatApi.util.invalidateTags(['Chat'] as any));
//         console.log(`[useChatSocket] Joined new conversation room: ${convId}`);
//       }
//     });

//     // ── Chat message event ─────────────────────────────────────────────────
//     socket.on('message', (payload: any) => {
//       const msg = payload?.data?.message;

//       // Not a structured chat message — treat as a global notification
//       if (!msg) {
//         handleNotification('conversation', payload);
//         dispatch(chatApi.util.invalidateTags(['Chat'] as any));
//         return;
//       }

//       const state = store.getState() as any;
//       const me = authApi.endpoints.me.select()(state)?.data;
//       const conversations =
//         chatApi.endpoints.getConversations.select()(state)?.data?.data || [];

//       const conv = conversations.find((c: any) => c.id === msg.conversation_id);

//       let senderName = 'User';
//       let senderAvatar = '/images/dashboard/message/doctor.png';

//       if (conv) {
//         const sender = conv.creator_id === msg.from ? conv.creator : conv.participant;
//         senderName = sender?.name || 'User';
//         senderAvatar =
//           sender?.avatar_url || sender?.avatar || '/images/dashboard/message/doctor.png';
//       }

//       const newMessage: Message = {
//         id: msg.message_id,
//         message: msg.body_text,
//         created_at: msg.created_at,
//         status: 'SENT',
//         attachments: msg.attachments,
//         sender: { id: msg.from, name: senderName, avatar_url: senderAvatar },
//         receiver: {
//           id: msg.from === me?.id ? '' : (me?.id ?? ''),
//           name: '',
//           avatar_url: '',
//         },
//       };

//       dispatch(
//         chatApi.util.updateQueryData(
//           'getMessages',
//           { conversationId: msg.conversation_id, limit: 20 },
//           draft => {
//             if (!draft?.data) draft.data = [];
//             const exists = draft.data.some(m => m.id === newMessage.id);
//             if (!exists) draft.data.push(newMessage);
//           },
//         ),
//       );

//       dispatch(
//         chatApi.util.updateQueryData('getConversations', undefined, draft => {
//           if (!draft?.data) return;
//           const c = draft.data.find(c => c.id === msg.conversation_id);
//           if (!c) return;
//           if (!c.messages) c.messages = [];
//           c.messages.push({ id: msg.message_id, message: msg.body_text, created_at: msg.created_at });
//           c.messages = c.messages.slice(-1);
//           c.updated_at = msg.created_at;
//         }),
//       );

//       if (me?.id !== msg.from) {
//         handleNotification('conversation', {
//           id: msg.message_id,
//           message: { body_text: msg.body_text, created_at: msg.created_at },
//           sender: { name: senderName, avatar: senderAvatar },
//         });
//       }
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [dispatch]);

//   const joinConversation = (conversationId: string) => {
//     socketRef.current?.emit('joinRoom', { room_id: conversationId });
//   };

//   return { joinConversation };
// }

'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';

import { store, type AppDispatch, type RootState } from '../../store';
import { chatApi, useGetConversationsQuery } from './chatApi';
import type { ChatAttachment, Message } from './chatApi';
import { authApi } from '../authApi';
import { notificationApi } from '../notificationApi';
import { addNotification } from '@/store/NotificationSlice';
import { toast } from 'sonner';

// Module-level socket ref shared across all usages — prevents duplicate connections
let sharedSocket: Socket | null = null;

export function joinConversation(conversationId: string) {
  sharedSocket?.emit('joinRoom', { room_id: conversationId });
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type SocketMessage = {
  from: string;
  data: {
    message: {
      id: string;
      message_id: string;
      body_text: string;
      from: string;
      conversation_id: string;
      created_at: string;
      attachments: ChatAttachment[];
    };
  };
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function createSocketNotification(
  type: 'conversation' | 'approved' | 'rejected' | 'follow' | 'user-registered',
  rawData: unknown,
) {
  const payload = rawData as any;
  const data = payload?.data || payload;

  const actor =
    data?.sender ||
    data?.from_user ||
    data?.user ||
    payload?.sender ||
    payload?.user ||
    (data?.name ? data : null);

  const name = actor?.name || actor?.first_name || 'User';
  const avatar =
    actor?.avatar_url ||
    actor?.avatar ||
    actor?.profile_image ||
    '/images/default-avatar.png';

  let message: string =
    data?.last_message ||
    payload?.last_message ||
    data?.notification_event?.text ||
    data?.message?.body_text ||
    data?.text ||
    (typeof data?.message === 'string' ? data.message : '') ||
    payload?.text ||
    (typeof payload?.message === 'string' ? payload.message : '');

  if (!message) {
    if (type === 'follow') message = 'Someone followed you';
    else if (type === 'conversation') message = 'Sent you a message';
    else if (type === 'approved') message = 'Your account has been approved';
    else if (type === 'rejected') message = 'Your account has been rejected';
    else if (type === 'user-registered') message = 'A new user registered';
    else message = 'You have a new notification';
  }

  const conversationId =
    data?.conversation_id ||
    data?.conversationId ||
    data?.room_id ||
    data?.message?.conversation_id ||
    data?.message?.conversationId ||
    payload?.conversation_id ||
    payload?.conversationId ||
    payload?.room_id ||
    payload?.data?.message?.conversation_id;

  const messageId =
    data?.message_id ||
    data?.messageId ||
    data?.message?.message_id ||
    data?.message?.messageId ||
    payload?.message_id ||
    payload?.messageId ||
    payload?.data?.message?.message_id;

  const id =
    data?.id || payload?.id || messageId || `temp_${crypto.randomUUID()}`;

  return {
    id,
    type,
    message,
    timestamp:
      data?.created_at ||
      data?.message?.created_at ||
      payload?.created_at ||
      new Date().toISOString(),
    isRead: false,
    isNew: true,
    user: { name, avatar, initials: getInitials(name) },
    conversationId,
    messageId,
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useChatSocket() {
  const socketRef = useRef<Socket | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  // Watch Redux token so socket reconnects on login without page reload
  const token = useSelector((state: RootState) => state.auth.auth.token);

  const { data: convData } = useGetConversationsQuery();

  const convDataRef = useRef(convData);

  useEffect(() => {
    convDataRef.current = convData;
  }, [convData]);

  useEffect(() => {
    const socket = socketRef.current;

    if (
      !socket?.connected ||
      !convData?.success ||
      !Array.isArray(convData.data)
    ) {
      return;
    }

    convData.data.forEach(conv =>
      socket.emit('joinRoom', { room_id: conv.id }),
    );

    console.log(
      `[useChatSocket] Joined ${convData.data.length} rooms on convData update.`,
    );
  }, [convData]);

  useEffect(() => {
    // Don't connect if not authenticated (token is null or false)
    if (!token) {
      return;
    }

    // Disconnect existing shared socket if it was created with a different token
    if (sharedSocket) {
      sharedSocket.disconnect();
      sharedSocket = null;
    }

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      extraHeaders: {
        authorization: `Bearer ${token}`,
      },
    });

    sharedSocket = socket;
    socketRef.current = socket;

    const joinAllRooms = () => {
      const state = store.getState() as any;

      const cached: any[] =
        chatApi.endpoints.getConversations.select()(state)?.data?.data || [];

      if (cached.length > 0) {
        cached.forEach(conv => socket.emit('joinRoom', { room_id: conv.id }));
        console.log(
          `[useChatSocket] Joined ${cached.length} rooms from cache.`,
        );
      } else {
        dispatch(
          chatApi.endpoints.getConversations.initiate(undefined, {
            forceRefetch: false,
          }),
        )
          .then((result: any) => {
            const convs: any[] = result?.data?.data || [];
            convs.forEach(conv =>
              socket.emit('joinRoom', { room_id: conv.id }),
            );
            console.log(
              `[useChatSocket] Joined ${convs.length} rooms after fetch.`,
            );
          })
          .catch(console.error);
      }
    };

    socket.on('connect', () => {
      console.log('[useChatSocket] Connected:', socket.id);
      joinAllRooms();
      // Fetch fresh notifications from the API immediately so users who just
      // logged in or reconnected see missed notifications without waiting for
      // the 30-second polling interval. This is safe now because
      // mergeApiNotifications (NotificationSlice.ts) deduplicates by messageId,
      // so the same notification won't appear twice even if the API database ID
      // differs from the socket-created notification ID.
      dispatch(notificationApi.util.invalidateTags(['notification', 'adminNotification'] as any));
      dispatch(chatApi.util.invalidateTags(['Chat'] as any));
    });

    socket.onAny((event, data) => {
      console.log('[useChatSocket] EVENT:', event, data);
    });

    /**
     * Handle a notification event from the socket.
     * 
     * This function ONLY dispatches to the Redux store directly.
     * It does NOT trigger an API refetch (no invalidateTags) because:
     * 1. The socket already has real-time data, so a refetch is redundant
     * 2. The refetch causes duplicate notifications (the API response is merged
     *    into the slice's state via extraReducers, creating a second copy)
     * 3. The pollingInterval on the notification query handles catching up
     *    on missed notifications when the user was offline
     */
    const handleNotification = (
      type:
        | 'conversation'
        | 'approved'
        | 'rejected'
        | 'follow'
        | 'user-registered',
      rawData: unknown,
    ) => {
      const state = store.getState() as any;

      const existingIds = new Set<string>(
        state.notifications?.notifications?.map((n: any) => n.id) || [],
      );

      const notification = createSocketNotification(type, rawData);

      if (!existingIds.has(notification.id)) {
        dispatch(addNotification(notification as any));

        // Show toast for real-time visual feedback
        const TYPE_LABEL: Record<string, string> = {
          approved: '✅ Approved',
          rejected: '❌ Rejected',
          follow: '👤 New Follower',
          conversation: '💬 New Message',
          'user-registered': '🎉 New User',
        };

        toast(TYPE_LABEL[type] || '🔔 Notification', {
          description: notification.message,
          duration: 4000,
        });
      }
    };

    socket.on('approved', d => handleNotification('approved', d));
    socket.on('rejected', d => handleNotification('rejected', d));
    socket.on('follow', d => handleNotification('follow', d));
    socket.on('user-registered', d =>
      handleNotification('user-registered', d),
    );

    // ⚠️ Do NOT call handleNotification for the 'conversation' event.
    // The backend also fires a 'message' event for the same message,
    // and that event's handleNotification call creates the notification.
    // Calling it here too would produce a SECOND notification (duplicate).
    socket.on('conversation', d => {
      const p = d as any;
      const convId = p?.data?.id || p?.id;

      if (convId) {
        socket.emit('joinRoom', { room_id: convId });
        dispatch(chatApi.util.invalidateTags(['Chat'] as any));
        console.log(`[useChatSocket] Joined new conversation room: ${convId}`);
      }
    });

    socket.on('message', (payload: any) => {
      const msg = payload?.data?.message;

      if (!msg) {
        // No structured message data — this might be a conversation-created event.
        // Only create a notification if we know its ID is unique.
        const notificationId = payload?.data?.id || payload?.id;
        if (notificationId && !notificationId.startsWith('temp_')) {
          handleNotification('conversation', payload);
        }
        dispatch(chatApi.util.invalidateTags(['Chat'] as any));
        return;
      }

      const state = store.getState() as any;
      const me = authApi.endpoints.me.select()(state)?.data;

      const conversations =
        chatApi.endpoints.getConversations.select()(state)?.data?.data || [];

      const conv = conversations.find((c: any) => c.id === msg.conversation_id);

      let senderName = 'User';
      let senderAvatar = '/images/dashboard/message/doctor.png';

      if (conv) {
        const sender =
          conv.creator_id === msg.from ? conv.creator : conv.participant;

        senderName = sender?.name || 'User';
        senderAvatar =
          sender?.avatar_url ||
          sender?.avatar ||
          '/images/dashboard/message/doctor.png';
      }

      const newMessage: Message = {
        id: msg.message_id,
        message: msg.body_text,
        created_at: msg.created_at,
        status: 'SENT',
        attachments: msg.attachments,
        sender: {
          id: msg.from,
          name: senderName,
          avatar_url: senderAvatar,
        },
        receiver: {
          id: msg.from === me?.id ? '' : (me?.id ?? ''),
          name: '',
          avatar_url: '',
        },
      };

      dispatch(
        chatApi.util.updateQueryData(
          'getMessages',
          { conversationId: msg.conversation_id, limit: 20 },
          draft => {
            if (!draft?.data) draft.data = [];

            const exists = draft.data.some(m => m.id === newMessage.id);

            if (!exists) {
              draft.data.push(newMessage);
            }
          },
        ),
      );

      dispatch(
        chatApi.util.updateQueryData('getConversations', undefined, draft => {
          if (!draft?.data) return;

          const c = draft.data.find(c => c.id === msg.conversation_id);

          if (!c) return;

          if (!c.messages) c.messages = [];

          c.messages.push({
            id: msg.message_id,
            message: msg.body_text,
            created_at: msg.created_at,
          });

          c.messages = c.messages.slice(-1);
          c.updated_at = msg.created_at;
        }),
      );

      if (me?.id !== msg.from) {
        handleNotification('conversation', {
          id: msg.message_id,
          message_id: msg.message_id,
          conversation_id: msg.conversation_id,
          last_message: payload?.data?.last_message || msg.body_text,
          message: {
            body_text: msg.body_text,
            created_at: msg.created_at,
          },
          sender: {
            name: senderName,
            avatar: senderAvatar,
          },
        });
      }
    });

    return () => {
      socket.disconnect();
      if (sharedSocket === socket) {
        sharedSocket = null;
      }
    };
  }, [dispatch, token]);

  return {};
}