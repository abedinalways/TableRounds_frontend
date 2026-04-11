import { baseApi } from "./baseApi";

export interface Root {
  success: boolean;
  message: string;
  data: Data;
}

export interface Data {
  total_users: number;
  pending_user_verification: number;
  total_questions: number;
  total_tests: number;
}
export const overviewStatsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getStats: builder.query<Root, void>({
      query: () => ({
        url: '/admin/overview/stats',
        method: 'GET',
       
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetStatsQuery } = overviewStatsApi;