'use client';

import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import {
  addNotification,
  AppNotification,
} from '../../store/NotificationSlice';

function getInitials(name: string) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function createSocketNotification(
  type: AppNotification['type'],
  rawData: unknown,
): AppNotification {
  const data = rawData as {
    id?: string;
    created_at?: string;
    message?: {
      body_text?: string;
      created_at?: string;
    };
    notification_event?: {
      text?: string;
      type?: string;
    };
    sender?: {
      name?: string;
      avatar?: string;
      avatar_url?: string;
    };
    from_user?: {
      name?: string;
      avatar?: string;
      avatar_url?: string;
    };
  };

  const actor = data.sender || data.from_user || undefined;

  const name = actor?.name || 'User';
  const avatar =
    actor?.avatar_url || actor?.avatar || '/images/default-avatar.png';

  const message =
    data.notification_event?.text ||
    data.message?.body_text ||
    'You have a new notification';

  return {
    id: data.id || crypto.randomUUID(),
    type,
    message,
    timestamp:
      data.created_at || data.message?.created_at || new Date().toISOString(),
    isRead: false,
    user: {
      name,
      avatar,
      initials: getInitials(name),
    },
  };
}

export function useNotificationSocket() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = Cookies.get('token');

    console.log('Notification socket hook mounted');
    console.log('SOCKET TOKEN:', token);
    console.log('SOCKET URL:', process.env.NEXT_PUBLIC_SOCKET_URL);

    if (!token || !process.env.NEXT_PUBLIC_SOCKET_URL) {
      console.log('Socket skipped: token or URL missing');
      return;
    }

    const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      extraHeaders: {
        authorization: `Bearer ${token}`,
      },
    });

    socket.on('connect', () => {
      console.log('SOCKET CONNECTED:', socket.id);
    });

    socket.on('connect_error', err => {
      console.log('SOCKET CONNECT ERROR:', err);
    });

    socket.onAny((event, data) => {
      console.log('SOCKET EVENT:=======================', event, data);
    });

    socket.on('message', data => {
      console.log('MESSAGE EVENT:', data);
      dispatch(addNotification(createSocketNotification('conversation', data)));
    });

    socket.on('approved', data => {
      console.log('APPROVED EVENT:', data);
      dispatch(addNotification(createSocketNotification('approved', data)));
    });

    socket.on('rejected', data => {
      console.log('REJECTED EVENT:', data);
      dispatch(addNotification(createSocketNotification('rejected', data)));
    });

    socket.on('follow', data => {
      console.log('FOLLOW EVENT:', data);
      dispatch(addNotification(createSocketNotification('follow', data)));
    });

    socket.on('conversation', data => {
      console.log('CONVERSATION EVENT:', data);
      dispatch(addNotification(createSocketNotification('conversation', data)));
    });

    socket.on('user-registered', data => {
      console.log('USER REGISTERED EVENT:', data);
      dispatch(
        addNotification(createSocketNotification('user-registered', data)),
      );
    });

    return () => {
      socket.disconnect();
      console.log('SOCKET DISCONNECTED');
    };
  }, [dispatch]);
}
