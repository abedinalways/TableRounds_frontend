import { baseApi } from './baseApi';

export interface Root {
  success: boolean;
  message: string;
  data: Data;
}

export interface Data {
  performance: Performance;
  question_bank: QuestionBank;
  tests: Tests;
  performance_by_topic: PerformanceByTopic[];
}

export interface Performance {
  correct_percentage_avg: number;
  total_correct: number;
  total_incorrect: number;
  total_omitted: number;
}

export interface QuestionBank {
  total_questions: number;
  used_questions: number;
  unused_questions: number;
  progress_percentage: number;
}

export interface Tests {
  total: number;
  completed: number;
  incomplete: number;
}

export interface PerformanceByTopic {
  topic: string;
  correct_percentage: number;
  total_correct: number;
  percentile_rank: number;
  question_bank_progress: number;
}

export const statisTicsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getStatistics: builder.query<Root, void>({
      query: () => ({
        url: '/statistic',
        method: 'GET',
        credentials: 'include',
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetStatisticsQuery } = statisTicsApi;
