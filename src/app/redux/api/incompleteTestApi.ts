// import { baseApi } from './baseApi';

// export interface IncompleteTestRoot {
//   success: boolean;
//   message: string;
//   data: IncompleteTestItem[];
//   metadata: IncompleteTestMetadata;
// }

// export interface IncompleteTestItem {
//   id: string;
//   created_at: string;
//   is_completed: boolean;
//   difficulty: string[];
//   topic: string[];
//   test_mode: string[];
//   total_questions: number;
// }

// export interface IncompleteTestMetadata {
//   page: number;
//   limit: number;
//   total: number;
// }

// export interface IncompleteTestQueryParams {
//   page?: number;
//   limit?: number;
// }

// export const incompleteTestApi = baseApi.injectEndpoints({
//   endpoints: builder => ({
//     getIncompleteTests: builder.query<
//       IncompleteTestRoot,
//       IncompleteTestQueryParams | void
//     >({
//       query: params => ({
//         url: '/test/ongoing',
//         method: 'GET',
//         params: {
//           page: params?.page ?? 1,
//           limit: params?.limit ?? 10,
//         },
//         credentials: 'include',
//       }),
//     }),
//   }),
//   overrideExisting: false,
// });

// export const { useGetIncompleteTestsQuery } = incompleteTestApi;

import { baseApi } from './baseApi';

export interface IncompleteTestRoot {
  success: boolean;
  message: string;
  data: IncompleteTestItem[];
  metadata: IncompleteTestMetadata;
}

export interface IncompleteTestItem {
  id: string;
  created_at: string;
  is_completed: boolean;
  difficulty: string[];
  topic: string[];
  test_mode: string[];
  total_questions: number;
}

export interface IncompleteTestMetadata {
  page: number;
  limit: number;
  total: number;
}

export interface IncompleteTestQueryParams {
  page?: number;
  limit?: number;
}

export const incompleteTestApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getIncompleteTests: builder.query<
      IncompleteTestRoot,
      IncompleteTestQueryParams | void
    >({
      query: params => ({
        url: '/test/ongoing',
        method: 'GET',
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
        },
        credentials: 'include',
      }),
      providesTags: [{ type: 'IncompleteTests', id: 'LIST' }],
      keepUnusedDataFor: 0,
    }),
  }),
  overrideExisting: false,
});

export const { useGetIncompleteTestsQuery } = incompleteTestApi;