import { baseApi } from './baseApi';
import type {
  AnswerPayload,
  MarkPayload,
  SkipPayload,
  TestResultResponse,
} from '@/types/test-session';

export const testSessionApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    answerQuestion: builder.mutation<
      { success: boolean; message: string },
      AnswerPayload
    >({
      query: body => ({
        url: '/test/answer',
        method: 'POST',
        body,
        credentials: 'include',
      }),
    }),

    toggleMark: builder.mutation<
      { success: boolean; message: string },
      MarkPayload
    >({
      query: body => ({
        url: '/test/mark-toggle',
        method: 'POST',
        body,
        credentials: 'include',
      }),
    }),

    skipQuestion: builder.mutation<
      { success: boolean; message: string },
      SkipPayload
    >({
      query: body => ({
        url: '/test/skip',
        method: 'POST',
        body,
        credentials: 'include',
      }),
    }),

    completeTest: builder.mutation<
      { success: boolean; message: string },
      { test_id: string }
    >({
      query: body => ({
        url: '/test/complete',
        method: 'PATCH',
        body,
        credentials: 'include',
      }),
    }),

    getTestResult: builder.query<
      TestResultResponse,
      { test_id: string; question_id: string }
    >({
      query: ({ test_id, question_id }) => ({
        url: '/test/result',
        method: 'GET',
        params: { test_id, question_id },
        credentials: 'include',
      }),
    }),
  }),
});

export const {
  useAnswerQuestionMutation,
  useToggleMarkMutation,
  useSkipQuestionMutation,
  useLazyGetTestResultQuery,
  useCompleteTestMutation,
} = testSessionApi;
