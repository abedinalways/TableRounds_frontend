// import { baseApi } from './baseApi';
// import { discoverApi, DiscoverProfileResponse } from './discoverApi';

// export interface FollowResponse {
//   success: boolean;
//   message: string;
// }

// type DiscoverQueryArgs = {
//   page: number;
//   limit: number;
//   search: string;
// };

// export const followApi = baseApi.injectEndpoints({
//   endpoints: builder => ({
//     toggleFollow: builder.mutation<
//       FollowResponse,
//       {
//         userId: string;
//         queryArgs?: DiscoverQueryArgs;
//       }
//     >({
//       query: ({ userId }) => ({
//         url: `/profile/follow-toggle/${userId}`,
//         method: 'PUT',
//         credentials: 'include',
//       }),

//       async onQueryStarted(
//         { userId, queryArgs },
//         { dispatch, queryFulfilled },
//       ) {
//         let patchResult: { undo: () => void } | undefined;

//         if (queryArgs) {
//           patchResult = dispatch(
//             discoverApi.util.updateQueryData(
//               'discoverProfiles',
//               queryArgs,
//               (draft: DiscoverProfileResponse) => {
//                 const colleague = draft.data?.find(c => c.id === userId);
//                 if (colleague) {
//                   colleague.is_following = !colleague.is_following;
//                 }
//               },
//             ),
//           );
//         }

//         try {
//           await queryFulfilled;
//         } catch {
//           patchResult?.undo();
//         }
//       },
//     }),
//   }),
//   overrideExisting: false,
// });

// export const { useToggleFollowMutation } = followApi;

import { baseApi } from './baseApi';
import { discoverApi, DiscoverProfileResponse } from './discoverApi';
import { authApi } from './authApi';
import { AuthUser } from '../authSlice';

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
        isFollowing: boolean;
        queryArgs?: DiscoverQueryArgs;
      }
    >({
      query: ({ userId }) => ({
        url: `/profile/follow-toggle/${userId}`,
        method: 'PUT',
        credentials: 'include',
      }),

      async onQueryStarted(
  { userId, isFollowing, queryArgs },
  { dispatch, queryFulfilled },
) {
  let discoverPatch: { undo: () => void } | undefined;

  if (queryArgs) {
    discoverPatch = dispatch(
      discoverApi.util.updateQueryData(
        'discoverProfiles',
        queryArgs,
        (draft: DiscoverProfileResponse) => {
          const colleague = draft.data?.find(c => c.id === userId);
          if (colleague) {
            colleague.is_following = !isFollowing;
          }
        },
      ),
    );
  }

  const mePatch = dispatch(
    authApi.util.updateQueryData('me', undefined, (draft: AuthUser) => {
      if (!draft) return;

      if (isFollowing) {
        draft.followings = Math.max((draft.followings ?? 0) - 1, 0);
      } else {
        draft.followings = (draft.followings ?? 0) + 1;
      }
    }),
  );

  try {
    await queryFulfilled;
  } catch {
    discoverPatch?.undo();
    mePatch.undo();
  }
},
invalidatesTags: ['Auth'],
    }),
  }),
  overrideExisting: false,
});

export const { useToggleFollowMutation } = followApi;