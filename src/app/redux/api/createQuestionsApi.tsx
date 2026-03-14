import { baseApi } from './baseApi';

export interface CreateQuestionResponse {
  success: boolean;
  message: string;
}

export const createQuestionsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    createQuestion: builder.mutation<CreateQuestionResponse, FormData>({
      query: formData => ({
        url: '/admin/questions',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['allQuestions'],
    }),
  }),
});

export const { useCreateQuestionMutation } = createQuestionsApi;
