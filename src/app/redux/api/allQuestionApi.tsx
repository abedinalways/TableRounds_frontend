import { baseApi } from './baseApi';

/* ================= TYPES ================= */

export type Difficulty = 'Intern' | 'Senior' | 'Boards';

export interface Question {
  id: string; // Mongo _id
  question_title: string;
  question_id: string; // Display ID
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
      { id: string; data: Partial<Question> }
    >({
      query: ({ id, data }) => ({
        url: `/admin/questions/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['allQuestions'],
    }),
  }),
});

export const {
  useGetQuestionsQuery,
  useDeleteQuestionMutation,
  useUpdateQuestionMutation,
} = allQuestionApi;
