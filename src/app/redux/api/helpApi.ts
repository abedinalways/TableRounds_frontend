import { baseApi } from './baseApi';

/* ================= TYPES ================= */

export interface HelpData {
  id: string;
  privacy_policy: string;
  disclaimer: string;
  terms_of_conditions: string;
}

interface GetHelpResponse {
  success: boolean;
  message: string;
  data: HelpData[];
}

interface UpdateHelpResponse {
  success: boolean;
  message: string;
}

export const helpApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getHelp: builder.query<GetHelpResponse, void>({
      query: () => ({
        url: '/admin/help',
        method: 'GET',
      }),
      providesTags: ['help'],
    }),

    updateHelp: builder.mutation<UpdateHelpResponse, Partial<HelpData>>({
      query: body => ({
        url: '/admin/help',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['help'],
    }),
  }),
});

export const { useGetHelpQuery, useUpdateHelpMutation } = helpApi;
