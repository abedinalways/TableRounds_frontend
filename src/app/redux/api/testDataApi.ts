import { baseApi } from './baseApi';

export interface TestQuestionRoot {
  success: boolean;
  message: string;
  data: TestQuestionData;
}

export interface TestQuestionData {
  id: string;
  created_at: string;
  user_id: string;
  test_mode: string[];
  difficulty: string[];
  topic: string[];
  total_attempts: number;
  total_questions: number;
  score: number | null;
  is_completed: boolean;
  questions: TestQuestionItem[];
}

export interface TestQuestionItem {
  id: string;
  question_steam: string;
  answers: TestAnswerItem[];
}

export interface TestAnswerItem {
  id: string;
  option_text: string;
}

export const testDetailsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getTestQuestionsByTestId: builder.query<TestQuestionRoot, string>({
      query: testId => ({
        url: `/test/questions/${testId}`,
        method: 'GET',
        credentials: 'include',
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetTestQuestionsByTestIdQuery } = testDetailsApi;
