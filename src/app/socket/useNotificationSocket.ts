'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { addNotification, AppNotification } from '@/store/NotificationSlice';
import { store, RootState } from '../redux/store';
import { notificationApi } from '../redux/api/notificationApi';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function createSocketNotification(
  type: AppNotification['type'],
  rawData: unknown,
): AppNotification {
  const payload = rawData as any;
  const data = payload?.data || payload;

  const lastMsg = data?.last_message ?? payload?.last_message;
  const msgObj = data?.message ?? payload?.message;
  const actor = data?.sender ?? data?.from_user ?? lastMsg?.sender ?? msgObj?.sender;

  const name = actor?.name ?? 'User';
  const avatar = actor?.avatar_url ?? actor?.avatar ?? '/images/default-avatar.png';

  const message =
    data?.notification_event?.text ??
    lastMsg?.body_text ??
    msgObj?.body_text ??
    'You have a new notification';

  const conversationId =
    data?.conversation_id ??
    data?.conversationId ??
    data?.room_id ??
    lastMsg?.conversation_id ??
    lastMsg?.conversationId ??
    msgObj?.conversation_id ??
    msgObj?.conversationId ??
    payload?.conversation_id ??
    payload?.conversationId ??
    payload?.room_id;

  const messageId =
    data?.message_id ??
    data?.messageId ??
    data?.id ??
    lastMsg?.id ??
    lastMsg?.message_id ??
    lastMsg?.messageId ??
    msgObj?.id ??
    msgObj?.message_id ??
    msgObj?.messageId ??
    payload?.message_id ??
    payload?.messageId ??
    payload?.id;

  return {
    id: data.id ?? messageId ?? crypto.randomUUID(),
    type,
    message,
    timestamp: data.created_at ?? lastMsg?.created_at ?? msgObj?.created_at ?? new Date().toISOString(),
    isRead: false,
    isNew: true,
    user: { name, avatar, initials: getInitials(name) },
    conversationId,
    messageId,
  };
}

const TYPE_LABEL: Record<AppNotification['type'], string> = {
  approved: '✅ Approved',
  message: '💬 New Message',
  rejected: '❌ Rejected',
  follow: '👤 New Follower',
  conversation: '💬 New Message',
  'user-registered': '🎉 New User',
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useNotificationSocket() {
  const dispatch = useDispatch();
  const socketRef = useRef<Socket | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  // Get token once on mount to avoid reconnect loops
  const token = Cookies.get('token');
  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;

  useEffect(() => {
    // Don't connect until we have both token AND user ID
    if (!token || !socketUrl || !user?.id) return;

    const socket = io(socketUrl, {
      extraHeaders: {
        authorization: `Bearer ${token}`,
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    const handleNotification = (type: AppNotification['type'], data: unknown) => {
      const notification = createSocketNotification(type, data);

      const state = store.getState() as RootState;
      const existingIds = new Set(state.notifications.notifications.map(n => n.id));

      // Skip if we already have this notification (e.g., race with API fetch)
      if (existingIds.has(notification.id)) return;

      // Skip if the notification was sent by ourselves
      const payload = data as any;
      const innerData = payload?.data ?? payload;
      const lastMsg = innerData?.last_message ?? payload?.last_message;
      const msgObj = innerData?.message ?? payload?.message;
      const senderId =
        innerData?.sender_id ??
        innerData?.sender?.id ??
        innerData?.from_user?.id ??
        lastMsg?.from ??
        lastMsg?.sender_id ??
        lastMsg?.sender?.id ??
        msgObj?.from ??
        msgObj?.sender_id ??
        msgObj?.sender?.id;

      const me = state.auth.user;
      if (me?.id && senderId && String(me.id) === String(senderId)) {
        return;
      }

      dispatch(addNotification(notification));

      // Show a toast for real-time feedback
      toast(TYPE_LABEL[type], {
        description: notification.message,
        duration: 4000,
      });

      // Refetch notifications from API to sync the official state (delay to avoid race)
      setTimeout(() => {
        dispatch(
          notificationApi.util.invalidateTags(['notification', 'adminNotification'] as any),
        );
      }, 500);
    };

    socket.on('connect', () => {
      console.log('[useNotificationSocket] Connected:', socket.id);
      // Join user-specific room for notifications
      socket.emit('joinRoom', { room_id: `user_${user.id}` });
      console.log('[useNotificationSocket] Joined user room:', `user_${user.id}`);
    });

    socket.on('disconnect', reason => {
      console.log('[useNotificationSocket] Disconnected:', reason);
    });

    socket.on('reconnect', attempt => {
      console.log('[useNotificationSocket] Reconnected after', attempt, 'attempts');
      // Re-join user room on reconnect
      if (socketRef.current?.connected) {
        socketRef.current.emit('joinRoom', { room_id: `user_${user.id}` });
        console.log('[useNotificationSocket] Re-joined user room:', `user_${user.id}`);
      }
    });

    socket.on('connect_error', err => {
      console.error('[useNotificationSocket] Connection error:', err);
    });

    socket.onAny((event, data) => {
      console.log('[useNotificationSocket] EVENT RECEIVED:', event, data);
    });

    socket.on('message', d => handleNotification('conversation', d));
    socket.on('message-create', d => handleNotification('message', d));
    socket.on('conversation', d => handleNotification('conversation', d));
    socket.on('approved', d => handleNotification('approved', d));
    socket.on('rejected', d => handleNotification('rejected', d));
    socket.on('follow', d => handleNotification('follow', d));
    socket.on('user-registered', d => handleNotification('user-registered', d));

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [dispatch, user?.id, token, socketUrl]);
}