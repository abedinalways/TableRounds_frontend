import { baseApi } from './baseApi';



export interface LeaderboardUser {
  id: string;
  name: string;
  institution: string;
  avatar: string;
}

export interface LeaderboardRow {
  rank: number;
  user: LeaderboardUser;
  tests_completed: number;
  accuracy: number;
  avg_score: number;
  trend: number[];
}

export interface LeaderboardResponse {
  success: boolean;
  data: {
    user_stats: unknown;
    leaderboard: LeaderboardRow[];
    meta: {
      page: number;
      limit: number;
    };
  };
}



export const leaderboardApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getLeaderboard: builder.query<LeaderboardResponse, void>({
      query: () => ({
        url: '/leaderboard', 
        method: 'GET',
        credentials: 'include',
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetLeaderboardQuery } = leaderboardApi;
