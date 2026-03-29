import { baseApi } from './baseApi';

type ReportPayload = {
  reason: string;
  message?: string;
};

export const reportApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    reportUser: builder.mutation<
      { success: boolean; message: string },
      { userId: string; data: ReportPayload }
    >({
      query: ({ userId, data }) => ({
        url: `/profile/report/${userId}`,
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
    }),
  }),
});

export const { useReportUserMutation } = reportApi;
