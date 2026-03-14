// import { baseApi } from './baseApi';

// export interface FollowResponse {
//   success: boolean;
//   message: string;
// }

// export const followApi = baseApi.injectEndpoints({
//   endpoints: builder => ({
//     toggleFollow: builder.mutation<FollowResponse, string>({
//       query: userId => ({
//         url: `/profile/follow-toggle/${userId}`,
//         method: 'PUT',
//         credentials: 'include',
//       }),

//       invalidatesTags: ['DiscoverProfiles'],
//     }),
//   }),

//   overrideExisting: false,
// });

// export const { useToggleFollowMutation } = followApi;

import { baseApi } from './baseApi';
import { discoverApi, DiscoverProfileResponse } from './discoverApi';

export interface FollowResponse {
  success: boolean;
  message: string;
}

export const followApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    toggleFollow: builder.mutation<
      FollowResponse,
      {
        userId: string;
        queryArgs: { page: number; limit: number; search: string };
      }
    >({
      query: ({ userId }) => ({
        url: `/profile/follow-toggle/${userId}`,
        method: 'PUT',
        credentials: 'include',
      }),
     
      async onQueryStarted(
        { userId, queryArgs },
        { dispatch, queryFulfilled },
      ) {
        // Optimistically update the cache
        const patchResult = dispatch(
          discoverApi.util.updateQueryData(
            'discoverProfiles',
            queryArgs,
            (draft: DiscoverProfileResponse) => {
              const colleague = draft.data?.find(c => c.id === userId);
              if (colleague) {
                colleague.is_following = !colleague.is_following;
              }
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useToggleFollowMutation } = followApi;

