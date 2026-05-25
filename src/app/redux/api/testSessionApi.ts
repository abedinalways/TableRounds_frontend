

import { baseApi } from './baseApi';

export interface TopicCount {
  name: string;
  count: number;
  ids: string[];
}

export interface DifficultyGroup {
  difficulty: 'Intern' | 'Senior' | 'Board';
  topic_wise_count: TopicCount[];
}

interface QuestionCountData {
  total_questions: number;
  used_questions: DifficultyGroup[];
  unused_questions: DifficultyGroup[];
  correct_count: DifficultyGroup[];
  incorrect_count: DifficultyGroup[];
  mark_count: DifficultyGroup[];
}

interface QuestionCountResponse {
  success: boolean;
  message: string;
  data: QuestionCountData;
}

interface MarkedQuestionOption {
  id: string;
  option_text: string;
}

interface MarkedQuestionItem {
  id: string;
  created_at: string;
  test_id: string;
  is_marked: boolean;
  question: {
    id: string;
    question_steam: string;
    answerOptions: MarkedQuestionOption[];
    question_id: string;
  };
}

interface GetMarkedQuestionsResponse {
  success: boolean;
  message: string;
  data: MarkedQuestionItem[];
}

export const testSessionApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    answerQuestion: builder.mutation({
      query: body => ({
        url: '/test/answer',
        method: 'POST',
        body,
        credentials: 'include',
      }),
      invalidatesTags: (_result, _error, body) => [
        { type: 'Test', id: body.test_id },
        { type: 'IncompleteTests', id: 'LIST' },
        'QuestionCount',
      ],
    }),

    skipQuestion: builder.mutation({
      query: body => ({
        url: '/test/skip',
        method: 'POST',
        body,
        credentials: 'include',
      }),
      invalidatesTags: (_result, _error, body) => [
        { type: 'Test', id: body.test_id },
        { type: 'IncompleteTests', id: 'LIST' },
        'QuestionCount',
      ],
    }),

    toggleMark: builder.mutation({
      query: body => ({
        url: '/test/mark-toggle',
        method: 'POST',
        body,
        credentials: 'include',
      }),
      invalidatesTags: (_result, _error, body) => [
        { type: 'Test', id: body.test_id },
        'MarkedQuestions',
        'QuestionCount',
      ],
    }),

    completeTest: builder.mutation({
      query: (testId: string) => ({
        url: '/test/complete',
        method: 'PATCH',
        params: { test_id: testId },
        credentials: 'include',
      }),
      invalidatesTags: (_result, _error, testId) => [
        { type: 'Test', id: testId },
        { type: 'IncompleteTests', id: 'LIST' },
        'QuestionCount',
      ],
    }),

    getTestResult: builder.query({
      query: test_id => ({
        url: '/test/result',
        method: 'GET',
        params: { test_id },
        credentials: 'include',
      }),
    }),

    getTestDetails: builder.query({
      query: test_id => ({
        url: `/test/details/${test_id}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: (_result, _error, testId) => [{ type: 'Test', id: testId }],
    }),

    getQuestionCount: builder.query<QuestionCountResponse, void>({
      query: () => ({
        url: '/test/question-count',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['QuestionCount'],
    }),

    getMarkedQuestions: builder.query<GetMarkedQuestionsResponse, void>({
      query: () => ({
        url: '/test/mark-questions',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['MarkedQuestions'],
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
  useGetMarkedQuestionsQuery,
} = testSessionApi;