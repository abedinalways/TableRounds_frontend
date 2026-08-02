import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  notificationApi,
  ApiNotificationItem,
} from '../app/redux/api/notificationApi';

export type NotificationType =
  | 'approved'
  | 'rejected'
  | 'follow'
  | 'conversation'
  | 'user-registered';

export interface AppNotification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string;
  isRead: boolean;
  isNew: boolean;
  user: {
    name: string;
    avatar: string;
    initials: string;
  };
  /** Sender identifier, used to locate a conversation when its ID is absent. */
  senderId?: string;
  conversationId?: string;
  /** Message identifier used to open the originating message in a conversation. */
  messageId?: string;
}

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const recalcUnread = (notifications: AppNotification[]) =>
  notifications.filter(n => !n.isRead).length;

const mergeApiNotifications = (
  state: NotificationState,
  payload: { data?: ApiNotificationItem[] },
) => {
  const raw = Array.isArray(payload?.data) ? payload.data : [];
  const apiItems = raw.map(mapApiNotification);
  const apiIds = new Set(apiItems.map(n => n.id));

  const socketOnly = state.notifications.filter(
    n => !apiIds.has(n.id) && !n.id.startsWith('temp_'),
  );

  const existingIds = new Set(state.notifications.map(n => n.id));
  const mergedItems = apiItems.map(item => {
    if (existingIds.has(item.id)) {
      const oldItem = state.notifications.find(n => n.id === item.id);
      return { ...item, isNew: oldItem?.isNew ?? false };
    }
    return item;
  });

  state.notifications = [...socketOnly, ...mergedItems];
  state.unreadCount = recalcUnread(state.notifications);
};

const mapApiNotification = (item: ApiNotificationItem): AppNotification => {
  const name = item.sender?.name ?? 'System';
  return {
    id: item.id,
    type: (item.notification_event?.type as any) || 'conversation',
    message: item.notification_event?.text || 'New notification',
    timestamp: item.created_at,
    isRead: item.is_read || false,
    isNew: false,
    user: {
      name,
      avatar: item.sender?.avatar_url || '/images/default-avatar.png',
      initials: getInitials(name),
    },
    senderId: item.sender_id ?? undefined,
    conversationId:
      item.notification_event?.type === 'conversation'
        ? item.entity_id ?? undefined
        : undefined,
  };
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<AppNotification>) => {
      const exists = state.notifications.find(n => n.id === action.payload.id);
      if (!exists) {
        state.notifications.unshift({ ...action.payload, isNew: true });
        state.unreadCount += 1;
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const n = state.notifications.find(n => n.id === action.payload);
      if (n) {
        n.isRead = true;
        n.isNew = false;
      }
      state.unreadCount = state.notifications.filter(n => !n.isRead).length;
    },
    clearNewFlag: (state, action: PayloadAction<string>) => {
      const n = state.notifications.find(n => n.id === action.payload);
      if (n) n.isNew = false;
    },
    markAllAsRead: state => {
      state.notifications.forEach(n => {
        n.isRead = true;
        n.isNew = false;
      });
      state.unreadCount = 0;
    },
    clearNotifications: state => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
  extraReducers: builder => {
    builder.addMatcher(
      notificationApi.endpoints.getUserNotifications.matchFulfilled,
      (state, { payload }) => mergeApiNotifications(state, payload),
    );

    builder.addMatcher(
      notificationApi.endpoints.getAdminNotifications.matchFulfilled,
      (state, { payload }) => mergeApiNotifications(state, payload),
    );
  },
});

export const {
  addNotification,
  markAllAsRead,
  clearNotifications,
  markAsRead,
  clearNewFlag,
} = notificationSlice.actions;
export default notificationSlice.reducer;
