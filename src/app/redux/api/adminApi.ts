import { baseApi } from './baseApi';
import { VerificationUser, Activity } from '@/types/admin';

export const adminApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getPendingUsers: builder.query<VerificationUser[], void>({
      query: () => '/admin/pending-users',
    }),
    getRecentActivities: builder.query<Activity[], void>({
      query: () => '/admin/recent-activities',
    }),
  }),
});

export const { useGetPendingUsersQuery, useGetRecentActivitiesQuery } =adminApi;
