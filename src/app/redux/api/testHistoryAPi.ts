import { baseApi } from './baseApi';

export interface TestHistoryStatsResponse {
  success: boolean;
  message: string;
  data: {
    total_tests: number;
    completed_tests: number;
    average_score: number;
    best_score: number;
    comparison_score: number;
    total_questions: number;
  };
}

export const testHistoryApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getTestHistoryStats: builder.query<TestHistoryStatsResponse, void>({
      query: () => ({
        url: '/test/histories-stats',
        method: 'GET',
        credentials: 'include',
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetTestHistoryStatsQuery } = testHistoryApi;
