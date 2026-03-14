import { baseApi } from "./baseApi";
export interface DiscoverProfile {
  id: string;
  name: string;
  username?: string | null;
  avatar: string;
  bio?: string;
  training_practice?: string;
  current_practice?: string;
  suggestion_rank: number;
  search_rank: number;
  is_following: boolean;
}

export interface DiscoverProfileResponse {
  success: boolean;
  data: DiscoverProfile[];
  meta: {
    page: number;
    limit: number;
  };
}
export const discoverApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // 🔹 Discover profiles
    discoverProfiles: builder.query<
      DiscoverProfileResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: ({ page = 1, limit = 10, search = '' }) => ({
        url: `/profile/discover`,
        method: 'GET',
        params: {
          page,
          limit,
          search,
        },
        credentials: 'include',
      }),
      providesTags: ['DiscoverProfiles'],
    }),
  }),
});

export const { useDiscoverProfilesQuery } = discoverApi;
