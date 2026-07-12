import { baseApi } from './baseApi';

/* ================= TYPES ================= */

export enum PlanType {
  MONTHLY = 'MONTHLY',
  PAY_AS_YOU_GO = 'PAY_AS_YOU_GO',
}

export interface BackendPlanData {
  id: string;
  name: string;
  type: PlanType;
  price: string | number;
  billing_period: string;
  credits: number;
  benefits: string[];
  isPopular?: boolean; 
  stripe_product_id?: string;
  stripe_price_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FinancialStatsData {
  totalRevenue: number;
  yearlyPlansRevenue: number;
  monthlyPlansRevenue: number;
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

/* ---------- API Response Wrappers ---------- */
export interface StatsResponse {
  success: boolean;
  message: string;
  data: FinancialStatsData;
}

export interface PlansListResponse {
  success: boolean;
  message: string;
  data: BackendPlanData[];
}

export interface SinglePlanResponse {
  success: boolean;
  message: string;
  data: BackendPlanData;
}

export interface BillingHistoryResponse {
  success: boolean;
  message: string;
  data: TransactionItem[];
}

/* ---------- Request Payload Types ---------- */
export interface CreateUpdatePlanPayload {
  name: string;
  type: PlanType;
  price: number;
  billing_period: string;
  benefits: string[];
  isPopular?: boolean;
}

/* ================= API INJECTION ================= */

export const financialApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getFinancialStats: builder.query<FinancialStatsData, void>({
      query: () => ({
        url: '/admin/get-stats',
        method: 'GET',
      }),
      transformResponse: (response: StatsResponse) => response.data,
      providesTags: ['FinancialStats'],
    }),

    getSubscriptionPlans: builder.query<BackendPlanData[], void>({
      query: () => ({
        url: '/admin/subscription-plan',
        method: 'GET',
      }),
      transformResponse: (response: PlansListResponse) => response.data,
      providesTags: ['SubscriptionPlansList'],
    }),

    getSubscriptionPlanById: builder.query<BackendPlanData, string>({
      query: id => ({
        url: `/admin/subscription-plan/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: SinglePlanResponse) => response.data,
      providesTags: (result, error, id) => [
        { type: 'SubscriptionPlansList', id },
      ],
    }),

    createSubscriptionPlan: builder.mutation<
      SinglePlanResponse,
      CreateUpdatePlanPayload
    >({
      query: body => ({
        url: '/admin/subscription-plan',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['SubscriptionPlansList', 'FinancialStats'],
    }),

    updateSubscriptionPlan: builder.mutation<
      SinglePlanResponse,
      { id: string; body: Partial<CreateUpdatePlanPayload> }
    >({
      query: ({ id, body }) => ({
        url: `/admin/subscription-plan/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['SubscriptionPlansList', 'FinancialStats'],
    }),

    getBillingTransactions: builder.query<TransactionItem[], void>({
      query: () => ({
        url: '/admin/subscription-plan/billing-history',
        method: 'GET',
      }),
      transformResponse: (response: BillingHistoryResponse) => response.data,
      providesTags: ['BillingTransactions'],
    }),
  }),
});

export const {
  useGetFinancialStatsQuery,
  useGetSubscriptionPlansQuery,
  useGetSubscriptionPlanByIdQuery,
  useCreateSubscriptionPlanMutation,
  useUpdateSubscriptionPlanMutation,
  useGetBillingTransactionsQuery,
} = financialApi;
