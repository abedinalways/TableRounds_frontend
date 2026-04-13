import { baseApi } from './baseApi';

export interface TestHistoryItem {
  id: string;
  created_at: string;
  test_mode: string[];
  difficulty: string[];
  topic: string[];
  total_questions: number;
  score: number | null;
  is_completed: boolean;
}

export interface MetaData {
  page: number;
  limit: number;
  total: number;
}

export interface PreviousTestHistoryResponse {
  success: boolean;
  message: string;
  data: TestHistoryItem[];
  meta_data: MetaData;
}

export interface TestHistoryParams {
  page?: number;
  limit?: number;
}

export const previousTestHistoryApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getPreviousTestHistoryStats: builder.query<
      PreviousTestHistoryResponse,
      TestHistoryParams
    >({
      query: ({ page=1 , limit = 10 } = {}) => ({
        url: '/test/histories',
        method: 'GET',
        params: { page, limit },
        credentials: 'include',
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetPreviousTestHistoryStatsQuery } = previousTestHistoryApi;
