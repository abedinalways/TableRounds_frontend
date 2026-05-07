import { baseApi } from './baseApi';

/* ================= TYPES ================= */

export type Difficulty = 'Intern' | 'Senior' | 'Board' | 'Boards';

export interface Question {
  id: string;
  question_title: string;
  question_id: string;
  difficulty: Difficulty;
  topic: string[];
  total_attempts: number;
  correct_percentage: number;
}

export interface QuestionMeta {
  total: number;
  page: number;
  limit: number;
  totalPage: number;
  next: number | null;
  previous: number | null;
}

export interface GetQuestionsResponse {
  success: boolean;
  message: string;
  data: Question[];
  meta: QuestionMeta;
}

export interface GetQuestionsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface AnswerOption {
  id: string;
  option_text: string;
  is_correct: boolean;
}

export interface SingleQuestionResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    question_id: string;
    question_steam: string;
    question_title: string;
    difficulty: Difficulty;
    topic: string[];
    answerOptions: AnswerOption[];
    explanation: string;
    explanation_image: string | null;
    why_incorrect: string;
    pimping_point: string;
    memory_trick: string;
    referance: string;
    explanation_image_url: string | null;
  };
}

export interface UpdateQuestionData {
  question_steam?: string;
  difficulty?: Difficulty;
  topic?: string[];
  answerOptions?: AnswerOption[];
  explanation?: string;
  why_incorrect?: string;
  pimping_point?: string;
  memory_trick?: string;
  referance?: string;
}

/* ================= API ================= */

export const allQuestionApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getQuestions: builder.query<
      GetQuestionsResponse,
      GetQuestionsParams | undefined
    >({
      query: params => ({
        url: '/admin/questions',
        method: 'GET',
        params,
      }),
      providesTags: ['allQuestions'],
    }),

    getSingleQuestion: builder.query<SingleQuestionResponse, string>({
      query: id => ({
        url: `/admin/questions/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'SingleQuestion', id }],
    }),

    deleteQuestion: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: id => ({
        url: `/admin/questions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['allQuestions'],
    }),

    updateQuestion: builder.mutation<
      { success: boolean; message: string },
      { id: string; data: UpdateQuestionData | FormData }
    >({
      query: ({ id, data }) => ({
        url: `/admin/questions/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        'allQuestions',
        { type: 'SingleQuestion', id },
      ],
    }),
  }),
});

export const {
  useGetQuestionsQuery,
  useGetSingleQuestionQuery,
  useDeleteQuestionMutation,
  useUpdateQuestionMutation,
} = allQuestionApi;
