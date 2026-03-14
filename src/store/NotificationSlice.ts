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
  user: {
    name: string;
    avatar: string;
    initials: string;
  };
}

interface NotificationState {
  notifications: AppNotification[];
}

const initialState: NotificationState = {
  notifications: [],
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function normalizeType(type: string): NotificationType {
  if (type === 'approved') return 'approved';
  if (type === 'rejected') return 'rejected';
  if (type === 'follow' || type === 'Follow') return 'follow';
  if (type === 'conversation' || type === 'message') return 'conversation';
  if (type === 'user-registered' || type === 'user_registered')
    return 'user-registered';
  return 'conversation';
}

function mapApiNotification(item: ApiNotificationItem): AppNotification {
  const actor = item.sender;

  const name = actor?.name || 'System';
  const avatar =
    actor?.avatar_url || actor?.avatar || '/images/default-avatar.png';

  return {
    id: item.id,
    type: normalizeType(item.notification_event?.type || 'conversation'),
    message: item.notification_event?.text || 'You have a new notification',
    timestamp: item.created_at,
    isRead: false,
    user: {
      name,
      avatar,
      initials: getInitials(name),
    },
  };
}

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<AppNotification>) => {
      const exists = state.notifications.some(
        item => item.id === action.payload.id,
      );
      if (!exists) {
        state.notifications.unshift(action.payload);
      }
    },

    setNotifications: (state, action: PayloadAction<AppNotification[]>) => {
      state.notifications = action.payload;
    },

    markAllAsRead: state => {
      state.notifications = state.notifications.map(item => ({
        ...item,
        isRead: true,
      }));
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        item => item.id !== action.payload,
      );
    },

    clearNotifications: state => {
      state.notifications = [];
    },
  },
  extraReducers: builder => {
    builder.addMatcher(
      notificationApi.endpoints.getUserNotifications.matchFulfilled,
      (state, { payload }) => {
        state.notifications = payload.data.map(mapApiNotification);
      },
    );

    builder.addMatcher(
      notificationApi.endpoints.getAdminNotifications.matchFulfilled,
      (state, { payload }) => {
        state.notifications = payload.data.map(mapApiNotification);
      },
    );
  },
});

export const {
  addNotification,
  setNotifications,
  markAllAsRead,
  removeNotification,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
