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
      }),
      invalidatesTags: ['QuestionCount'],
    }),

    skipQuestion: builder.mutation({
      query: body => ({
        url: '/test/skip',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['QuestionCount'],
    }),

    toggleMark: builder.mutation({
      query: body => ({
        url: '/test/mark-toggle',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['MarkedQuestions', 'QuestionCount'],
    }),

    completeTest: builder.mutation({
      query: (testId: string) => ({
        url: '/test/complete',
        method: 'PATCH',
        params: { test_id: testId },
      }),
      invalidatesTags: ['QuestionCount'],
    }),

    getTestResult: builder.query({
      query: test_id => ({
        url: '/test/result',
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
      providesTags: ['QuestionCount'],
    }),

    getMarkedQuestions: builder.query<GetMarkedQuestionsResponse, void>({
      query: () => ({
        url: '/test/mark-questions',
        method: 'GET',
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
