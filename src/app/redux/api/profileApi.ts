import { baseApi } from "./baseApi";

export interface profileStat {
  total_test: number;
  total_completed_test: number;
  correct_percentage: number;
  completed_percentage: number;
}
export const profileApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getProfile: builder.query<profileStat, void>({
      query: () => ({
        url: '/profile/stats',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['profileStat'],
    }),
  }),
});

export const { useGetProfileQuery } = profileApi;