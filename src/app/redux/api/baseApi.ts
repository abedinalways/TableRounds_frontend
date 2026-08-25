import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AuthState } from '../authSlice';
import { reportApiFailure, reportApiSuccess } from '@/lib/connectivity';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_ENDPOINT,

  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as { auth: AuthState }).auth.auth.token;

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Thin wrapper that feeds the connectivity banner from real RTK Query
// outcomes: FETCH_ERROR = the network round-trip itself failed (offline /
// DNS / timeout); any HTTP status means the server answered. The result
// object is passed through unchanged.
const baseQuery: typeof rawBaseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 'FETCH_ERROR') {
    reportApiFailure();
  } else if (!result.error) {
    reportApiSuccess();
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQuery,
  tagTypes: [
    'Auth',
    'profileStat',
    'DiscoverProfiles',
    'profileData',
    'Profile',
    'UserStatus',
    'UserReports',
    'Chat',
    'allQuestions',
    'SingleQuestion',
    'QuestionCount',
    'help',
    'notification',
    'adminNotification',
    'Connections',
    'MapData',
    'MarkedQuestions',
    'Test',
    'IncompleteTests',
    'FinancialStats',
    'SubscriptionPlansList',
    'BillingTransactions',
    'UserBillingTransactions',
    'UserSubscriptionPlans',
    'MyActiveSubscription',
    'TestHistory',
    'Leaderboard',
    'PreviousTestHistory',
    'Specialty',
  ],
  endpoints: () => ({}),
});
