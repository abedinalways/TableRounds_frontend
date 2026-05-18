import { baseApi } from './baseApi';

export interface LeaderboardUser {
  id: string;
  name: string;
  institution: string;
  avatar: string;
  practice?: string;
  country?: string;
  state?: string;
  address?: string;
  city?: string;
}

export interface LeaderboardRow {
  rank: number;
  user: LeaderboardUser;
  tests_completed: number;
  accuracy: number;
  avg_score: number;
  country: string;
  completion_percentage: number;
  trend: number[];
}

export interface LeaderboardQueryParams {
  period?: 'week' | 'month' | 'quarter' | 'year' | 'all';
  page?: number;
  limit?: number;
  filter?: 'high_accuracy' | 'top_10' | 'active_users';
  search?: string;
}

export interface LeaderboardResponse {
  success: boolean;
  data: {
    user_stats: {
      rank: number;
      tests_completed: number;
      accuracy: number;
      current_streak: number;
      completion_percentage:number
      trend: number[];
    };
    leaderboard: LeaderboardRow[];
    meta: {
      page: number;
      limit: number;
    };
  };
}

export const leaderboardApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getLeaderboard: builder.query<LeaderboardResponse, LeaderboardQueryParams>({
      query: params => ({
        url: '/leaderboard',
        method: 'GET',
        credentials: 'include',
        params,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetLeaderboardQuery } = leaderboardApi;
