import { baseApi } from './baseApi';

type ContactPayload = {
  name: string;
  email: string;
  subject?: string | undefined;
  message: string;
};

export const contactApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    postContactMessage: builder.mutation<
      { success: boolean; message: string },
      ContactPayload
    >({
      query: data => ({
        url: '/contact', 
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { usePostContactMessageMutation } = contactApi;
