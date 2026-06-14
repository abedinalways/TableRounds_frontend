// // 'use client';

// // import { useEffect } from 'react';
// // import { io, Socket } from 'socket.io-client';
// // import { useDispatch } from 'react-redux';
// // import Cookies from 'js-cookie';
// // import {
// //   addNotification,
// //   AppNotification,
// // } from '../../store/NotificationSlice';

// // function getInitials(name: string) {
// //   return name
// //     .split(' ')
// //     .map(word => word[0])
// //     .join('')
// //     .slice(0, 2)
// //     .toUpperCase();
// // }

// // function createSocketNotification(
// //   type: AppNotification['type'],
// //   rawData: unknown,
// // ): AppNotification {
// //   const data = rawData as {
// //     id?: string;
// //     created_at?: string;
// //     message?: {
// //       body_text?: string;
// //       created_at?: string;
// //     };
// //     notification_event?: {
// //       text?: string;
// //       type?: string;
// //     };
// //     sender?: {
// //       name?: string;
// //       avatar?: string;
// //       avatar_url?: string;
// //     };
// //     from_user?: {
// //       name?: string;
// //       avatar?: string;
// //       avatar_url?: string;
// //     };
// //   };

// //   const actor = data.sender || data.from_user || undefined;

// //   const name = actor?.name || 'User';
// //   const avatar =
// //     actor?.avatar_url || actor?.avatar || '/images/default-avatar.png';

// //   const message =
// //     data.notification_event?.text ||
// //     data.message?.body_text ||
// //     'You have a new notification';

// //   return {
// //     id: data.id || crypto.randomUUID(),
// //     type,
// //     message,
// //     timestamp:
// //       data.created_at || data.message?.created_at || new Date().toISOString(),
// //     isRead: false,
// //     user: {
// //       name,
// //       avatar,
// //       initials: getInitials(name),
// //     },
// //   };
// // }

// // export function useNotificationSocket() {
// //   const dispatch = useDispatch();

// //   useEffect(() => {
// //     const token = Cookies.get('token');

// //     console.log('Notification socket hook mounted');
// //     console.log('SOCKET TOKEN:', token);
// //     console.log('SOCKET URL:', process.env.NEXT_PUBLIC_SOCKET_URL);

// //     if (!token || !process.env.NEXT_PUBLIC_SOCKET_URL) {
// //       console.log('Socket skipped: token or URL missing');
// //       return;
// //     }

// //     const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
// //       extraHeaders: {
// //         authorization: `Bearer ${token}`,
// //       },
// //     });

// //     socket.on('connect', () => {
// //       console.log('SOCKET CONNECTED:', socket.id);
// //     });

// //     socket.on('connect_error', err => {
// //       console.log('SOCKET CONNECT ERROR:', err);
// //     });

// //     socket.onAny((event, data) => {
// //       console.log('SOCKET EVENT:=======================', event, data);
// //     });

// //     socket.on('message', data => {
// //       console.log('MESSAGE EVENT:', data);
// //       dispatch(addNotification(createSocketNotification('conversation', data)));
// //     });

// //     socket.on('approved', data => {
// //       console.log('APPROVED EVENT:', data);
// //       dispatch(addNotification(createSocketNotification('approved', data)));
// //     });

// //     socket.on('rejected', data => {
// //       console.log('REJECTED EVENT:', data);
// //       dispatch(addNotification(createSocketNotification('rejected', data)));
// //     });

// //     socket.on('follow', data => {
// //       console.log('FOLLOW EVENT:', data);
// //       dispatch(addNotification(createSocketNotification('follow', data)));
// //     });

// //     socket.on('conversation', data => {
// //       console.log('CONVERSATION EVENT:=====================', data);
// //       dispatch(addNotification(createSocketNotification('conversation', data)));
// //     });

// //     socket.on('user-registered', data => {
// //       console.log('USER REGISTERED EVENT:', data);
// //       dispatch(
// //         addNotification(createSocketNotification('user-registered', data)),
// //       );
// //     });

// //     return () => {
// //       socket.disconnect();
// //       console.log('SOCKET DISCONNECTED');
// //     };
// //   }, [dispatch]);
// // }

// 'use client';

// import { useEffect } from 'react';
// import { io, Socket } from 'socket.io-client';
// import { useDispatch } from 'react-redux';
// import Cookies from 'js-cookie';
// import {
//   addNotification,
//   AppNotification,
// } from '../../store/NotificationSlice';

// function getInitials(name: string) {
//   return name
//     .split(' ')
//     .map(word => word[0])
//     .join('')
//     .slice(0, 2)
//     .toUpperCase();
// }

// function createSocketNotification(
//   type: AppNotification['type'],
//   rawData: unknown,
// ): AppNotification {
//   const data = rawData as {
//     id?: string;
//     created_at?: string;
//     message?: {
//       body_text?: string;
//       created_at?: string;
//     };
//     notification_event?: {
//       text?: string;
//       type?: string;
//     };
//     sender?: {
//       name?: string;
//       avatar?: string;
//       avatar_url?: string;
//     };
//     from_user?: {
//       name?: string;
//       avatar?: string;
//       avatar_url?: string;
//     };
//   };

//   const actor = data.sender || data.from_user || undefined;

//   const name = actor?.name || 'User';
//   const avatar =
//     actor?.avatar_url || actor?.avatar || '/images/default-avatar.png';

//   const message =
//     data.notification_event?.text ||
//     data.message?.body_text ||
//     'You have a new notification';

//   return {
//     id: data.id || crypto.randomUUID(),
//     type,
//     message,
//     timestamp:
//       data.created_at || data.message?.created_at || new Date().toISOString(),
//     isRead: false,
//     user: {
//       name,
//       avatar,
//       initials: getInitials(name),
//     },
//   };
// }

// export function useNotificationSocket() {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const token = Cookies.get('token');
//     const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;

//     console.log('Notification socket hook mounted');
//     console.log('SOCKET TOKEN:', token);
//     console.log('SOCKET URL:', socketUrl);

//     if (!token || !socketUrl) {
//       console.log('Socket skipped: token or URL missing');
//       return;
//     }

//     const socket: Socket = io(socketUrl, {
//       transports: ['websocket'],
//       auth: {
//         token: `Bearer ${token}`,
//       },
//     });

//     socket.on('connect', () => {
//       console.log('SOCKET CONNECTED:', socket.id);
//     });

//     socket.on('disconnect', reason => {
//       console.log('SOCKET DISCONNECTED:', reason);
//     });

//     socket.on('connect_error', err => {
//       console.log('SOCKET CONNECT ERROR:', err);
//     });

//     socket.onAny((event, data) => {
//       console.log('SOCKET EVENT:=======================', event, data);
//     });

//     socket.on('message', data => {
//       console.log('MESSAGE EVENT:', data);
//       dispatch(addNotification(createSocketNotification('conversation', data)));
//     });

//     socket.on('approved', data => {
//       console.log('APPROVED EVENT:', data);
//       dispatch(addNotification(createSocketNotification('approved', data)));
//     });

//     socket.on('rejected', data => {
//       console.log('REJECTED EVENT:', data);
//       dispatch(addNotification(createSocketNotification('rejected', data)));
//     });

//     socket.on('follow', data => {
//       console.log('FOLLOW EVENT:', data);
//       dispatch(addNotification(createSocketNotification('follow', data)));
//     });

//     socket.on('conversation', data => {
//       console.log('CONVERSATION EVENT:', data);
//       dispatch(addNotification(createSocketNotification('conversation', data)));
//     });

//     socket.on('user-registered', data => {
//       console.log('USER REGISTERED EVENT:', data);
//       dispatch(
//         addNotification(createSocketNotification('user-registered', data)),
//       );
//     });

//     return () => {
//       socket.off('message');
//       socket.off('approved');
//       socket.off('rejected');
//       socket.off('follow');
//       socket.off('conversation');
//       socket.off('user-registered');
//       socket.disconnect();
//       console.log('SOCKET CLEANUP DONE');
//     };
//   }, [dispatch]);
// }


'use client';

import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { addNotification, AppNotification } from '@/store/NotificationSlice';
import { RootState } from '../redux/store';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

type RawSocketData = {
  id?: string;
  created_at?: string;
  message?: { body_text?: string; created_at?: string };
  notification_event?: { text?: string; type?: string };
  sender?: { name?: string; avatar?: string; avatar_url?: string };
  from_user?: { name?: string; avatar?: string; avatar_url?: string };
};

function createSocketNotification(
  type: AppNotification['type'],
  rawData: unknown,
): AppNotification {
  const payload = rawData as any;
  const data = payload?.data || payload;
  const actor = data?.sender ?? data?.from_user;

  const name = actor?.name ?? 'User';
  const avatar = actor?.avatar_url ?? actor?.avatar ?? '/images/default-avatar.png';
  const message =
    data?.notification_event?.text ??
    data?.message?.body_text ??
    'You have a new notification';

  return {
    id: data.id ?? crypto.randomUUID(),
    type,
    message,
    timestamp: data.created_at ?? data.message?.created_at ?? new Date().toISOString(),
    isRead: false,
    isNew: true,
    user: { name, avatar, initials: getInitials(name) },
  };
}

const TYPE_LABEL: Record<AppNotification['type'], string> = {
  approved: '✅ Approved',
  rejected: '❌ Rejected',
  follow: '👤 New Follower',
  conversation: '💬 New Message',
  'user-registered': '🎉 New User',
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useNotificationSocket() {
  const dispatch = useDispatch();
  const socketRef = useRef<Socket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttempts = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;

  // Access existing IDs so we never dispatch a duplicate
  const existingIds = useSelector((state: RootState) =>
    new Set(state.notifications.notifications.map(n => n.id)),
  );
  const existingIdsRef = useRef(existingIds);
  existingIdsRef.current = existingIds;

  const handleNotification = useCallback(
    (type: AppNotification['type'], data: unknown) => {
      const notification = createSocketNotification(type, data);

      // Skip if we already have this notification (e.g., race with API fetch)
      if (existingIdsRef.current.has(notification.id)) return;

      dispatch(addNotification(notification));

      // Show a toast for real-time feedback
      toast(TYPE_LABEL[type], {
        description: notification.message,
        duration: 4000,
      });
    },
    [dispatch],
  );

  const connect = useCallback(() => {
    const token = Cookies.get('token');
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;

    if (!token || !socketUrl) return;

    // Prevent duplicate connections
    if (socketRef.current?.connected) return;

    const socket: Socket = io(socketUrl, {
      extraHeaders: {
        authorization: `Bearer ${token}`,
      },
      reconnection: false, // we manage reconnection manually for more control
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      reconnectAttempts.current = 0;
    });

    socket.on('disconnect', reason => {
      
      if (reason === 'io server disconnect' || reason === 'io client disconnect') return;
      scheduleReconnect();
    });

    socket.on('connect_error', () => {
      scheduleReconnect();
    });

    // ── Event listeners ───────────────────────────────────────────────────
    socket.on('message',          d => handleNotification('conversation', d));
    socket.on('conversation',     d => handleNotification('conversation', d));
    socket.on('approved',         d => handleNotification('approved', d));
    socket.on('rejected',         d => handleNotification('rejected', d));
    socket.on('follow',           d => handleNotification('follow', d));
    socket.on('user-registered',  d => handleNotification('user-registered', d));
  }, [handleNotification]);

  const scheduleReconnect = useCallback(() => {
    if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) return;

    const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30_000);
    reconnectAttempts.current += 1;

    reconnectTimeoutRef.current = setTimeout(() => {
      socketRef.current?.disconnect();
      socketRef.current = null;
      connect();
    }, delay);
  }, [connect]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);

      if (socketRef.current) {
        socketRef.current.off('message');
        socketRef.current.off('conversation');
        socketRef.current.off('approved');
        socketRef.current.off('rejected');
        socketRef.current.off('follow');
        socketRef.current.off('user-registered');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [connect]);
}