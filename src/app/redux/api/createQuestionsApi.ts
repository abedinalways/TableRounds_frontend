import { baseApi } from './baseApi';

/* ================= TYPES ================= */

export interface CreateQuestionResponse {
  success: boolean;
  message: string;
}

export interface QuestionSpeciality {
  id: string;
  name: string;
}

export interface QuestionTopic {
  id: string;
  name: string;
}

export interface QuestionSpecialityListMeta {
  total: number;
  page: number;
  limit: number;
  totalPage: number;
  next: string | null;
  previous: string | null;
}

export interface QuestionSpecialityListResponse {
  success: boolean;
  message: string;
  data: QuestionSpeciality[];
  meta: QuestionSpecialityListMeta;
}

export interface QuestionSpecialityDetail {
  id: string;
  name: string;
  topics: QuestionTopic[];
}

export interface QuestionSpecialityDetailResponse {
  success: boolean;
  message: string;
  data: QuestionSpecialityDetail;
}

/* ================= ENDPOINTS ================= */

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

    getQuestionSpecialities: builder.query<
      QuestionSpecialityListResponse,
      { page?: number; limit?: number } | void
    >({
      query: params => ({
        url: '/admin/questions/specialities',
        method: 'GET',
        params:
          params && (params.page || params.limit)
            ? {
                ...(params.page ? { page: params.page } : {}),
                ...(params.limit ? { limit: params.limit } : {}),
              }
            : undefined,
      }),
      providesTags: ['QuestionSpeciality'],
    }),

    getQuestionSpecialityTopics: builder.query<
      QuestionSpecialityDetailResponse,
      string
    >({
      query: id => ({
        url: `/admin/questions/speciality/${encodeURIComponent(id)}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [
        { type: 'QuestionSpeciality', id },
      ],
    }),
  }),
});

export const {
  useCreateQuestionMutation,
  useGetQuestionSpecialitiesQuery,
  useGetQuestionSpecialityTopicsQuery,
} = createQuestionsApi;
