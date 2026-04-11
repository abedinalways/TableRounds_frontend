import { baseApi } from './baseApi';

export interface TestHistoryItem {
  id: string;
  created_at: string;
  test_mode: string[];
  difficulty: string;
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

export const previousTestHistoryApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getPreviousTestHistoryStats: builder.query<
      PreviousTestHistoryResponse,
      void
    >({
      query: () => ({
        url: '/test/histories',
        method: 'GET',
        credentials: 'include',
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetPreviousTestHistoryStatsQuery } = previousTestHistoryApi;
