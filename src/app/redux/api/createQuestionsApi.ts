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

/* ================= HELPERS ================= */

/**
 * The backend sometimes wraps paginated list payloads in an extra object
 * layer (e.g. `{ data: { data: [...], meta } }`), so list endpoints must
 * normalise the payload defensively instead of trusting the declared type.
 */
function extractArrayField<T>(payload: unknown, keys: string[]): T[] {
  if (Array.isArray(payload)) return payload as T[];

  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    for (const key of keys) {
      if (Array.isArray(record[key])) return record[key] as T[];
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      '[createQuestionsApi] Expected an array but received a different shape:',
      payload,
    );
  }

  return [];
}

function defaultMeta(count: number): QuestionSpecialityListMeta {
  return {
    total: count,
    page: 1,
    limit: count || 1,
    totalPage: count ? 1 : 0,
    next: null,
    previous: null,
  };
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
      // Normalise the payload: `data` may arrive as an array directly or
      // nested inside an object (e.g. `{ data: { data: [...], meta } }`).
      transformResponse: (response: unknown): QuestionSpecialityListResponse => {
        const res = (response ?? {}) as Record<string, unknown>;

        const nestedData =
          res.data && typeof res.data === 'object' && !Array.isArray(res.data)
            ? (res.data as Record<string, unknown>)
            : undefined;

        const data = extractArrayField<QuestionSpeciality>(res.data, [
          'data',
          'specialities',
          'items',
        ]);

        return {
          success: Boolean(res.success),
          message: typeof res.message === 'string' ? res.message : '',
          data,
          meta:
            (res.meta as QuestionSpecialityListMeta | undefined) ??
            (nestedData?.meta as QuestionSpecialityListMeta | undefined) ??
            defaultMeta(data.length),
        };
      },
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
      // Guarantee `data` is always `{ id, name, topics: [...] }` so consumers
      // never hit `.topics` on a non-object payload.
      transformResponse: (
        response: unknown,
      ): QuestionSpecialityDetailResponse => {
        const res = (response ?? {}) as Record<string, unknown>;
        const detail = (res.data ?? {}) as Record<string, unknown>;

        return {
          success: Boolean(res.success),
          message: typeof res.message === 'string' ? res.message : '',
          data: {
            id: String(detail.id ?? ''),
            name: String(detail.name ?? ''),
            topics: extractArrayField<QuestionTopic>(detail.topics, [
              'data',
              'topics',
              'items',
            ]),
          },
        };
      },
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
