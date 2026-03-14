import { baseApi } from './baseApi';

export interface ApiNotificationReceiver {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  avatar_url?: string;
}

export interface ApiNotificationEvent {
  id: string;
  type:
    | 'approved'
    | 'rejected'
    | 'follow'
    | 'conversation'
    | 'user-registered'
    | string;
  text: string;
}

export interface ApiNotificationItem {
  id: string;
  sender_id: string | null;
  receiver_id: string | null;
  entity_id: string | null;
  created_at: string;
  sender: ApiNotificationReceiver | null;
  receiver: ApiNotificationReceiver | null;
  notification_event: ApiNotificationEvent;
}

export interface GetNotificationsResponse {
  success: boolean;
  data: ApiNotificationItem[];
}

export const notificationApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getUserNotifications: builder.query<GetNotificationsResponse, void>({
      query: () => '/user/notification',
      providesTags: ['notification'],
    }),

    getAdminNotifications: builder.query<GetNotificationsResponse, void>({
      query: () => '/admin/notification',
      providesTags: ['notification'],
    }),

    deleteUserNotification: builder.mutation<{ success: boolean }, string>({
      query: id => ({
        url: `/user/notification/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['notification'],
    }),

    deleteAllUserNotifications: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/user/notification',
        method: 'DELETE',
      }),
      invalidatesTags: ['notification'],
    }),

    deleteAdminNotification: builder.mutation<{ success: boolean }, string>({
      query: id => ({
        url: `/admin/notification/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['notification'],
    }),

    deleteAllAdminNotifications: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/admin/notification',
        method: 'DELETE',
      }),
      invalidatesTags: ['notification'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUserNotificationsQuery,
  useGetAdminNotificationsQuery,
  useDeleteUserNotificationMutation,
  useDeleteAllUserNotificationsMutation,
  useDeleteAdminNotificationMutation,
  useDeleteAllAdminNotificationsMutation,
} = notificationApi;
