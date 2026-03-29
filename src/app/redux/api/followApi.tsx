import { baseApi } from './baseApi';
import { discoverApi, DiscoverProfileResponse } from './discoverApi';

export interface FollowResponse {
  success: boolean;
  message: string;
}

type DiscoverQueryArgs = {
  page: number;
  limit: number;
  search: string;
};

export const followApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    toggleFollow: builder.mutation<
      FollowResponse,
      {
        userId: string;
        queryArgs?: DiscoverQueryArgs;
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
        let patchResult: { undo: () => void } | undefined;

        if (queryArgs) {
          patchResult = dispatch(
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
        }

        try {
          await queryFulfilled;
        } catch {
          patchResult?.undo();
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useToggleFollowMutation } = followApi;
