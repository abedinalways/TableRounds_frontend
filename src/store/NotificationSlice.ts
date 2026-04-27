// import { is } from 'zod/v4/locales';
// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import {
//   notificationApi,
//   ApiNotificationItem,
// } from '../app/redux/api/notificationApi';

// export type NotificationType =
//   | 'approved'
//   | 'rejected'
//   | 'follow'
//   | 'conversation'
//   | 'user-registered';

// export interface AppNotification {
//   id: string;
//   type: NotificationType;
//   message: string;
//   timestamp: string;
//   isRead: boolean;
//   isNew?: boolean; // For client-side only, indicates if the notification was received in the current session
//   user: {
//     name: string;
//     avatar: string;
//     initials: string;
//   };
// }

// interface NotificationState {
//   notifications: AppNotification[];
// }

// const initialState: NotificationState = {
//   notifications: [],
// };

// function getInitials(name: string) {
//   return name
//     .split(' ')
//     .map(word => word[0])
//     .join('')
//     .slice(0, 2)
//     .toUpperCase();
// }

// function normalizeType(type: string): NotificationType {
//   if (type === 'approved') return 'approved';
//   if (type === 'rejected') return 'rejected';
//   if (type === 'follow' || type === 'Follow') return 'follow';
//   if (type === 'conversation' || type === 'message') return 'conversation';
//   if (type === 'user-registered' || type === 'user_registered')
//     return 'user-registered';
//   return 'conversation';
// }

// function mapApiNotification(item: ApiNotificationItem): AppNotification {
//   const actor = item.sender;

//   const name = actor?.name || 'System';
//   const avatar =
//     actor?.avatar_url || actor?.avatar || '/images/default-avatar.png';

//   return {
//     id: item.id,
//     type: normalizeType(item.notification_event?.type || 'conversation'),
//     message: item.notification_event?.text || 'You have a new notification',
//     timestamp: item.created_at,
//     isRead: false,
//     user: {
//       name,
//       avatar,
//       initials: getInitials(name),
//     },
//   };
// }

// const notificationSlice = createSlice({
//   name: 'notifications',
//   initialState,
//   reducers: {
//     addNotification: (state, action: PayloadAction<AppNotification>) => {
//       const exists = state.notifications.some(
//         item => item.id === action.payload.id,
//       );
//       if (!exists) {
//         state.notifications.unshift(action.payload);
//       }
//     },

//     setNotifications: (state, action: PayloadAction<AppNotification[]>) => {
//       state.notifications = action.payload;
//     },

//     markAllAsRead: state => {
//       state.notifications = state.notifications.map(item => ({
//         ...item,
//         isRead: true,
//       }));
//     },

//     removeNotification: (state, action: PayloadAction<string>) => {
//       state.notifications = state.notifications.filter(
//         item => item.id !== action.payload,
//       );
//     },

//     clearNotifications: state => {
//       state.notifications = [];
//     },
//   },
//   extraReducers: builder => {
//     builder.addMatcher(
//       notificationApi.endpoints.getUserNotifications.matchFulfilled,
//       (state, { payload }) => {
//         state.notifications = payload.data.map(mapApiNotification);
//       },
//     );

//     builder.addMatcher(
//       notificationApi.endpoints.getAdminNotifications.matchFulfilled,
//       (state, { payload }) => {
//         state.notifications = payload.data.map(mapApiNotification);
//       },
//     );
//   },
// });

// export const {
//   addNotification,
//   setNotifications,
//   markAllAsRead,
//   removeNotification,
//   clearNotifications,
// } = notificationSlice.actions;

// export default notificationSlice.reducer;

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
    avatar_url?: string;
    initials: string;
  };
}

// ✅ unreadCount is declared in the interface
interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function normalizeType(type?: string): NotificationType {
  switch (type) {
    case 'approved':
      return 'approved';
    case 'rejected':
      return 'rejected';
    case 'follow':
    case 'Follow':
      return 'follow';
    case 'user-registered':
    case 'user_registered':
      return 'user-registered';
    case 'conversation':
    case 'message':
    default:
      return 'conversation';
  }
}

function mapApiNotification(item: ApiNotificationItem): AppNotification {
  const actor = item.sender;
  const name = actor?.name ?? 'System';
  const avatar =
    actor?.avatar_url ?? actor?.avatar ?? '/images/default-avatar.png';

  return {
    id: item.id,
    type: normalizeType(item.notification_event?.type),
    message: item.notification_event?.text ?? 'You have a new notification',
    timestamp: item.created_at,
    isRead: false,
    isNew: false,
    user: { name, avatar, initials: getInitials(name) },
  };
}

function recalcUnread(notifications: AppNotification[]): number {
  return notifications.filter(n => !n.isRead).length;
}

// ─── Slice ────────────────────────────────────────────────────────────────────

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<AppNotification>) => {
      const exists = state.notifications.some(n => n.id === action.payload.id);
      if (!exists) {
        state.notifications.unshift({ ...action.payload, isNew: true });
        state.unreadCount = recalcUnread(state.notifications);
      }
    },

    markAsRead: (state, action: PayloadAction<string>) => {
      const n = state.notifications.find(n => n.id === action.payload);
      if (n) {
        n.isRead = true;
        n.isNew = false;
      }
      state.unreadCount = recalcUnread(state.notifications);
    },

    markAllAsRead: state => {
      state.notifications = state.notifications.map(n => ({
        ...n,
        isRead: true,
        isNew: false,
      }));
      state.unreadCount = 0;
    },

    // ✅ defined here so it can be exported
    clearNewFlag: (state, action: PayloadAction<string>) => {
      const n = state.notifications.find(n => n.id === action.payload);
      if (n) n.isNew = false;
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        n => n.id !== action.payload,
      );
      state.unreadCount = recalcUnread(state.notifications);
    },

    clearNotifications: state => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },

  extraReducers: builder => {
    const mergeApiNotifications = (
      state: NotificationState,
      payload: { data: ApiNotificationItem[] },
    ) => {
      const apiItems = payload.data.map(mapApiNotification);
      const apiIds = new Set(apiItems.map(n => n.id));

      // Preserve read state already tracked in the store
      const readIds = new Set(
        state.notifications.filter(n => n.isRead).map(n => n.id),
      );

      const merged = apiItems.map(n => ({
        ...n,
        isRead: readIds.has(n.id) || n.isRead,
      }));

      // Prepend socket-only notifications the API hasn't returned yet
      const socketOnly = state.notifications.filter(n => !apiIds.has(n.id));

      state.notifications = [...socketOnly, ...merged];
      state.unreadCount = recalcUnread(state.notifications);
    };

    builder.addMatcher(
      notificationApi.endpoints.getUserNotifications.matchFulfilled,
      (state, { payload }) => mergeApiNotifications(state, payload),
    );
    builder.addMatcher(
      notificationApi.endpoints.getAdminNotifications.matchFulfilled,
      (state, { payload }) => mergeApiNotifications(state, payload),
    );

    builder.addMatcher(
      notificationApi.endpoints.deleteUserNotification.matchFulfilled,
      (state, { meta }) => {
        const id = meta.arg.originalArgs as string;
        state.notifications = state.notifications.filter(n => n.id !== id);
        state.unreadCount = recalcUnread(state.notifications);
      },
    );
    builder.addMatcher(
      notificationApi.endpoints.deleteAdminNotification.matchFulfilled,
      (state, { meta }) => {
        const id = meta.arg.originalArgs as string;
        state.notifications = state.notifications.filter(n => n.id !== id);
        state.unreadCount = recalcUnread(state.notifications);
      },
    );

    builder.addMatcher(
      notificationApi.endpoints.deleteAllUserNotifications.matchFulfilled,
      state => {
        state.notifications = [];
        state.unreadCount = 0;
      },
    );
    builder.addMatcher(
      notificationApi.endpoints.deleteAllAdminNotifications.matchFulfilled,
      state => {
        state.notifications = [];
        state.unreadCount = 0;
      },
    );
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  clearNewFlag, 
  removeNotification,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;