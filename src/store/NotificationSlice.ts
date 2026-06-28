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
//   isNew: boolean;
//   user: {
//     name: string;
//     avatar: string;
//     avatar_url?: string;
//     initials: string;
//   };
// }

// interface NotificationState {
//   notifications: AppNotification[];
//   unreadCount: number;
// }

// const initialState: NotificationState = {
//   notifications: [],
//   unreadCount: 0,
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

// function normalizeType(type?: string): NotificationType {
//   switch (type) {
//     case 'approved':
//       return 'approved';
//     case 'rejected':
//       return 'rejected';
//     case 'follow':
//     case 'Follow':
//       return 'follow';
//     case 'user-registered':
//     case 'user_registered':
//       return 'user-registered';
//     case 'conversation':
//     case 'message':
//     default:
//       return 'conversation';
//   }
// }

// function mapApiNotification(item: ApiNotificationItem): AppNotification {
//   const actor = item.sender;
//   const name = actor?.name ?? 'System';
//   const avatar =
//     actor?.avatar_url ?? actor?.avatar ?? '/images/default-avatar.png';

//   const type = normalizeType(item.notification_event?.type);
//   let message = item.notification_event?.text;

//   // Generate a better fallback message if the backend didn't provide text
//   if (!message || message === 'You have a new notification') {
//     if (type === 'follow') message = `${name !== 'System' ? name : 'Someone'} followed you`;
//     else if (type === 'conversation') message = `${name !== 'System' ? name : 'Someone'} sent you a message`;
//     else if (type === 'approved') message = 'Your account has been approved';
//     else if (type === 'rejected') message = 'Your account has been rejected';
//     else if (type === 'user-registered') message = 'A new user registered';
//     else message = 'You have a new notification';
//   }

//   return {
//     id: item.id,
//     type,
//     message,
//     timestamp: item.created_at,
//     isRead: item.is_read ?? false,
//     isNew: true, // Mark true by default, will be adjusted in mergeApiNotifications if it already exists
//     user: { name, avatar, initials: getInitials(name) },
//   };
// }

// function recalcUnread(notifications: AppNotification[]): number {
//   return notifications.filter(n => !n.isRead).length;
// }

// // ─── Slice ────────────────────────────────────────────────────────────────────

// const notificationSlice = createSlice({
//   name: 'notifications',
//   initialState,
//   reducers: {
//     addNotification: (state, action: PayloadAction<AppNotification>) => {
//       const exists = state.notifications.some(n => n.id === action.payload.id);
//       if (!exists) {
//         state.notifications.unshift({ ...action.payload, isNew: true });
//         state.unreadCount = recalcUnread(state.notifications);
//       }
//     },

//     markAsRead: (state, action: PayloadAction<string>) => {
//       const n = state.notifications.find(n => n.id === action.payload);
//       if (n) {
//         n.isRead = true;
//         n.isNew = false;
//       }
//       state.unreadCount = recalcUnread(state.notifications);
//     },

//     markAllAsRead: state => {
//       state.notifications = state.notifications.map(n => ({
//         ...n,
//         isRead: true,
//         isNew: false,
//       }));
//       state.unreadCount = 0;
//     },

//     clearNewFlag: (state, action: PayloadAction<string>) => {
//       const n = state.notifications.find(n => n.id === action.payload);
//       if (n) n.isNew = false;
//     },

//     removeNotification: (state, action: PayloadAction<string>) => {
//       state.notifications = state.notifications.filter(
//         n => n.id !== action.payload,
//       );
//       state.unreadCount = recalcUnread(state.notifications);
//     },

//     clearNotifications: state => {
//       state.notifications = [];
//       state.unreadCount = 0;
//     },
//   },

//   extraReducers: builder => {
//     // ─── Fetch ───────────────────────────────────────────────────────────────

//     const mergeApiNotifications = (
//       state: NotificationState,
//       payload: { data: ApiNotificationItem[] },
//     ) => {
//       // ✅ Guard against unexpected payload shapes
//       const raw = Array.isArray(payload?.data) ? payload.data : [];
//       if (raw.length === 0) {
//         state.notifications = [];
//         state.unreadCount = 0;
//         return;
//       }

//       const apiItems = raw.map(mapApiNotification);
//       const apiIds = new Set(apiItems.map(n => n.id));

//       // Preserve socket-only notifications not yet in the API response
//       // Also filter out any temporary socket notifications (those without a real ID)
//       const socketOnly = state.notifications.filter(n => !apiIds.has(n.id) && !n.id.startsWith('temp_'));

//       // Check which API items are truly new
//       const existingIds = new Set(state.notifications.map(n => n.id));

//       const mergedItems = apiItems.map(item => {
//         // If it already existed in state, preserve its isNew flag from the previous state
//         // Otherwise, it is truly new, so keep isNew: true
//         if (existingIds.has(item.id)) {
//           const oldItem = state.notifications.find(n => n.id === item.id);
//           return { ...item, isNew: oldItem?.isNew ?? false };
//         }
//         return item;
//       });

//       state.notifications = [...socketOnly, ...mergedItems];
//       state.unreadCount = recalcUnread(state.notifications);
//     };

//     builder.addMatcher(
//       notificationApi.endpoints.getUserNotifications.matchFulfilled,
//       (state, { payload }) => mergeApiNotifications(state, payload),
//     );

//     builder.addMatcher(
//       notificationApi.endpoints.getAdminNotifications.matchFulfilled,
//       (state, { payload }) => mergeApiNotifications(state, payload),
//     );

//     // ─── Delete single ────────────────────────────────────────────────────────

//     builder.addMatcher(
//       notificationApi.endpoints.deleteUserNotification.matchFulfilled,
//       (state, { meta }) => {
//         const id = meta.arg.originalArgs as string;
//         state.notifications = state.notifications.filter(n => n.id !== id);
//         state.unreadCount = recalcUnread(state.notifications);
//       },
//     );

//     builder.addMatcher(
//       notificationApi.endpoints.deleteAdminNotification.matchFulfilled,
//       (state, { meta }) => {
//         const id = meta.arg.originalArgs as string;
//         state.notifications = state.notifications.filter(n => n.id !== id);
//         state.unreadCount = recalcUnread(state.notifications);
//       },
//     );

//     // ─── Delete all ───────────────────────────────────────────────────────────

//     builder.addMatcher(
//       notificationApi.endpoints.deleteAllUserNotifications.matchFulfilled,
//       state => {
//         state.notifications = [];
//         state.unreadCount = 0;
//       },
//     );

//     builder.addMatcher(
//       notificationApi.endpoints.deleteAllAdminNotifications.matchFulfilled,
//       state => {
//         state.notifications = [];
//         state.unreadCount = 0;
//       },
//     );
//   },
// });

// export const {
//   addNotification,
//   markAsRead,
//   markAllAsRead,
//   clearNewFlag,
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

  /**
   * Used for message notification click navigation.
   * This does not affect the design.
   */
  conversationId?: string;
  messageId?: string;
  senderId?: string;
}

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawItem = item as any;

  const actor = item.sender;
  const name = actor?.name ?? 'System';

  const avatar =
    actor?.avatar_url ?? actor?.avatar ?? '/images/default-avatar.png';

  const type = normalizeType(item.notification_event?.type);

  let message = item.notification_event?.text;

  if (!message || message === 'You have a new notification') {
    if (type === 'follow') {
      message = `${name !== 'System' ? name : 'Someone'} followed you`;
    } else if (type === 'conversation') {
      message = `${name !== 'System' ? name : 'Someone'} sent you a message`;
    } else if (type === 'approved') {
      message = 'Your account has been approved';
    } else if (type === 'rejected') {
      message = 'Your account has been rejected';
    } else if (type === 'user-registered') {
      message = 'A new user registered';
    } else {
      message = 'You have a new notification';
    }
  }

  // For conversation-type notifications, entity_id is likely the conversation_id
  const entityId = type === 'conversation' ? rawItem?.entity_id : undefined;

  const conversationId =
    rawItem?.conversation_id ||
    rawItem?.conversationId ||
    rawItem?.room_id ||
    rawItem?.message?.conversation_id ||
    rawItem?.message?.conversationId ||
    rawItem?.notification_event?.conversation_id ||
    rawItem?.notification_event?.conversationId ||
    rawItem?.data?.conversation_id ||
    rawItem?.data?.conversationId ||
    rawItem?.data?.message?.conversation_id ||
    rawItem?.data?.message?.conversationId ||
    entityId ||
    rawItem?.data?.id; // Fallback: sometimes the notification data itself contains the conversation id

  // For message notifications, try to extract messageId from multiple sources
  // The API might store it in entity_id or data fields
  const messageId =
    rawItem?.message_id ||
    rawItem?.messageId ||
    rawItem?.notification_event?.message_id ||
    rawItem?.notification_event?.messageId ||
    rawItem?.data?.message_id ||
    rawItem?.data?.messageId ||
    // For conversation notifications, entity_id might be the message_id
    (type === 'conversation' ? rawItem?.entity_id : undefined);

  const senderId = item.sender_id || actor?.id;

  return {
    id: item.id,
    type,
    message,
    timestamp: item.created_at,
    isRead: item.is_read ?? false,
    isNew: true,
    user: {
      name,
      avatar,
      initials: getInitials(name),
    },
    conversationId,
    messageId,
    senderId,
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
      const payload = action.payload;

      // Find if we already have this notification by:
      // 1. exact notification ID
      // 2. exact messageId
      // 3. conversationId (if type is conversation)
      const existingIndex = state.notifications.findIndex(n => {
        if (n.id === payload.id) return true;
        if (payload.messageId && n.messageId === payload.messageId) return true;
        if (
          payload.type === 'conversation' &&
          payload.conversationId &&
          n.type === 'conversation' &&
          n.conversationId === payload.conversationId
        ) {
          return true;
        }
        return false;
      });

      if (existingIndex > -1) {
        // Update the existing notification with the latest message and timestamp
        const existing = state.notifications[existingIndex];
        
        const merged = {
          ...existing,
          ...payload,
          conversationId: payload.conversationId || existing.conversationId,
          messageId: payload.messageId || existing.messageId,
          senderId: payload.senderId || existing.senderId,
          isRead: payload.isRead !== undefined ? payload.isRead : false,
          isNew: true,
        };

        // Remove from current position and move to the top
        state.notifications.splice(existingIndex, 1);
        state.notifications.unshift(merged);
      } else {
        // Add as a new notification
        state.notifications.unshift({
          ...payload,
          isNew: true,
        });
      }

      state.unreadCount = recalcUnread(state.notifications);
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

    clearNewFlag: (state, action: PayloadAction<string>) => {
      const n = state.notifications.find(n => n.id === action.payload);

      if (n) {
        n.isNew = false;
      }
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
      const raw = Array.isArray(payload?.data) ? payload.data : [];

      if (raw.length === 0) {
        // Keep conversation-type notifications that came from socket
        state.notifications = state.notifications.filter(
          n => n.type === 'conversation' && Boolean(n.conversationId),
        );
        state.unreadCount = recalcUnread(state.notifications);
        return;
      }

      const apiItems = raw.map(mapApiNotification);

      // Copy the current notifications to a working array
      const currentNotifications = [...state.notifications];

      apiItems.forEach(apiItem => {
        const matchIndex = currentNotifications.findIndex(n => {
          if (n.id === apiItem.id) return true;
          if (apiItem.messageId && n.messageId === apiItem.messageId) return true;
          if (
            apiItem.type === 'conversation' &&
            apiItem.conversationId &&
            n.type === 'conversation' &&
            n.conversationId === apiItem.conversationId
          ) {
            return true;
          }
          return false;
        });

        if (matchIndex > -1) {
          const existing = currentNotifications[matchIndex];
          // Merge them, preserving the existing isNew flag
          const merged = {
            ...existing,
            ...apiItem,
            conversationId: apiItem.conversationId || existing.conversationId,
            messageId: apiItem.messageId || existing.messageId,
            senderId: apiItem.senderId || existing.senderId,
            isNew: existing.isNew,
          };
          currentNotifications[matchIndex] = merged;
        } else {
          // Add as new
          currentNotifications.push({
            ...apiItem,
            isNew: !apiItem.isRead,
          });
        }
      });

      // Filter out duplicate conversations/IDs and sort by timestamp descending
      const uniqueNotifications: AppNotification[] = [];
      const seenIds = new Set<string>();
      const seenConvIds = new Set<string>();

      const sorted = currentNotifications.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      sorted.forEach(n => {
        if (n.type === 'conversation' && n.conversationId) {
          if (seenConvIds.has(n.conversationId)) return;
          seenConvIds.add(n.conversationId);
        }
        if (seenIds.has(n.id)) return;
        seenIds.add(n.id);
        uniqueNotifications.push(n);
      });

      state.notifications = uniqueNotifications;
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