import { baseApi } from './baseApi';

export interface ConnectionUser {
  id: string;
  name: string;
  avatar: string;
  current_practice?: string;
  training_practice?: string;
}

export interface ConnectionsResponse {
  success: boolean;
  data: ConnectionUser[];
  meta_data: {
    page: number;
    limit: number;
    total: number;
    type: 'follower' | 'following';
    user_id: string;
  };
}

export const connectionsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getConnections: builder.query<
      ConnectionsResponse,
      {
        type: 'follower' | 'following';
        page?: number;
        limit?: number;
        search?: string;
        user_id?: string;
      }
    >({
      query: ({ type, page = 1, limit = 10, search = '', user_id}) => ({
        url: `/profile/connections`,
        method: 'GET',
        params: {
          type,
          page,
          limit,
          search,
          user_id,
        },
        credentials: 'include',
      }),
      providesTags: ['Connections', 'Auth', ],
    }),
  }),
});

export const { useGetConnectionsQuery } = connectionsApi;
