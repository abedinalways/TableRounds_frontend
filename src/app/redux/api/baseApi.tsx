import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AuthState } from '../authSlice';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_ENDPOINT,

    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as { auth: AuthState }).auth.auth.token;

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    'Auth',
    'profileStat',
    'DiscoverProfiles',
    'profileData',
    'Profile',
    'UserStatus',
    'Chat',
    'allQuestions',
    'help',
    'notification',
  ],
  endpoints: () => ({}),
});
