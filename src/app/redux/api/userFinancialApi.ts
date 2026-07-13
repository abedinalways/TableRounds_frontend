import { baseApi } from './baseApi';

/* ================= TYPES BASED ON SCREENSHOTS ================= */

export interface ActiveSubscriptionData {
  id: string;
  user_id: string;
  plan_id: string;
  status: string; 
  stripe_subscription_id?: string;
  current_period_start?: string;
  current_period_end?: string;
  created_at: string;
  updated_at: string;
}

export interface BackendPlanData {
  id: string;
  name: string;
  type: string;
  price: string;
  billing_period: string;
  benefits: string[];
  is_popular?: boolean; // Admin can set this to mark a plan as "Most popular"
  created_at: string;
  updated_at: string;
}

export interface TransactionItem {
  id: string;
  plan_id: string;
  user_id: string;
  status: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
}

export interface GenericUserResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/* ================= API INJECTION ================= */

export const userFinancialApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getUserSubscriptionPlans: builder.query<BackendPlanData[], void>({
      query: () => ({
        url: '/subscriptions',
        method: 'GET',
      }),
      transformResponse: (response: GenericUserResponse<BackendPlanData[]>) =>
        response.data,
      providesTags: ['UserSubscriptionPlans'],
    }),

    getSinglePlan: builder.query<BackendPlanData, string>({
      query: id => ({
        url: `/subscriptions/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: GenericUserResponse<BackendPlanData>) =>
        response.data,
    }),

    getMyActiveSubscription: builder.query<ActiveSubscriptionData, void>({
      query: () => ({
        url: '/subscriptions/my-subscription',
        method: 'GET',
      }),
      transformResponse: (
        response: GenericUserResponse<ActiveSubscriptionData>,
      ) => response.data,
      providesTags: ['MyActiveSubscription'],
    }),

    getUserBillingTransactions: builder.query<TransactionItem[], void>({
      query: () => ({
        url: '/subscriptions/biling/history',
        method: 'GET',
      }),
      transformResponse: (response: GenericUserResponse<TransactionItem[]>) =>
        response.data,
      providesTags: ['UserBillingTransactions'],
    }),

    buySubscription: builder.mutation<
      GenericUserResponse<{ url: string }>,
      { planId: string; callbackUrl: string }
    >({
      query: ({ planId, callbackUrl }) => ({
        url: `/subscriptions/${planId}`,
        method: 'POST',
        body: { callbackUrl },
      }),
    }),
  }),
});

export const {
  useGetUserSubscriptionPlansQuery,
  useGetSinglePlanQuery,
  useGetMyActiveSubscriptionQuery,
  useGetUserBillingTransactionsQuery,
  useBuySubscriptionMutation,
} = userFinancialApi;