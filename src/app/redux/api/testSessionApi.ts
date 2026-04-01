
import { baseApi } from './baseApi';

interface QuestionCountData {
  total_questions: number;
  used_questions: number;
  unused_questions: number;
  correct_count: number;
  incorrect_count: number;
  mark_count: number;
  difficulty_wise_count: { name: string; count: number }[]; 
  topic_wise_count: { name: string; count: number }[]; 
}

interface QuestionCountResponse {
  success: boolean;
  message: string;
  data: QuestionCountData;
}

export const testSessionApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    answerQuestion: builder.mutation({
      query: body => ({
        url: '/test/answer',
        method: 'POST',
        body,
      }),
    }),

    skipQuestion: builder.mutation({
      query: body => ({
        url: '/test/skip',
        method: 'POST',
        body,
      }),
    }),

    toggleMark: builder.mutation({
      query: body => ({
        url: '/test/mark-toggle',
        method: 'POST',
        body,
      }),
    }),

    completeTest: builder.mutation({
      query: (testId: string) => ({
        url: `/test/complete`,
        method: 'PATCH',
        params: { test_id: testId },
      }),
    }),

    getTestResult: builder.query({
      query: test_id => ({
        url: `/test/result`,
        method: 'GET',
        params: { test_id },
      }),
    }),

    getTestDetails: builder.query({
      query: test_id => ({
        url: `/test/details/${test_id}`,
        method: 'GET',
      }),
    }),

    getQuestionCount: builder.query<QuestionCountResponse, void>({
      query: () => ({
        url: '/test/question-count',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useAnswerQuestionMutation,
  useSkipQuestionMutation,
  useToggleMarkMutation,
  useCompleteTestMutation,
  useGetTestResultQuery,
  useGetTestDetailsQuery,
  useGetQuestionCountQuery,
} = testSessionApi;