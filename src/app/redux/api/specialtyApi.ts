import { baseApi } from './baseApi';

/* ================= TYPES ================= */

export interface SpecialtyTopic {
  topic_name: string;
  topic_img: string;
}

export interface Specialty {
  id: string;
  _id?: string;
  specialty_name: string;
  specialty_banner_img: string;
  brand_img?: string;
  topics?: SpecialtyTopic[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SpecialtyListResponse {
  success: boolean;
  message: string;
  data: Specialty[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
    next: string | null;
    previous: string | null;
  };
}

export interface TopicResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    is_active: boolean;
    topic_image: string;
    created_at: string;
    updated_at: string;
  };
}

export interface CreateSpecialtyPayload {
  specialty_name: string;
  specialty_banner_img: string;
  brand_img?: string;
  topics: Array<{
    topic_name: string;
    topic_img: string;
  }>;
}

export interface UpdateSpecialtyPayload {
  id: string;
  specialty_name?: string;
  specialty_banner_img?: string;
  brand_img?: string;
  topics?: Array<{
    topic_name: string;
    topic_img: string;
  }>;
}

export interface AddTopicPayload {
  name: string;
  is_active: boolean;
  topic_image?: string;
}

export interface UpdateTopicPayload {
  name?: string;
  is_active?: boolean;
  topic_image?: string;
}

/* ================= HELPERS ================= */

function toFrontendSpecialty(data: Record<string, unknown>): Specialty {
  const topics = Array.isArray(data.topics)
    ? (data.topics as Array<{ name: string; is_active: boolean }>).map((topic, index) => ({
        topic_name: String(topic.name ?? ''),
        topic_img: String(data[`topic_image_${index}`] ?? ''),
      }))
    : [];

  return {
    id: String(data.id ?? data._id ?? ''),
    _id: data._id ? String(data._id) : undefined,
    specialty_name: String(data.name ?? ''),
    specialty_banner_img: String(data.banner ?? ''),
    brand_img: data.image ? String(data.image) : undefined,
    is_active: typeof data.is_active === 'boolean' ? data.is_active : false,
    topics,
    created_at: data.created_at ? String(data.created_at) : undefined,
    updated_at: data.updated_at ? String(data.updated_at) : undefined,
  };
}

function buildSpecialtyFormData(payload: {
  specialty_name: string;
  specialty_banner_img: string;
  brand_img?: string;
  topics: Array<{ topic_name: string; topic_img: string }>;
}) {
  const form = new FormData();
  form.append('name', payload.specialty_name);
  form.append('banner', payload.specialty_banner_img);
  form.append('is_active', 'true');

  if (payload.brand_img) {
    form.append('image', payload.brand_img);
  }

  payload.topics.forEach((topic, index) => {
    form.append(`topics[${index}][name]`, topic.topic_name);
    form.append(`topics[${index}][is_active]`, 'true');
    if (topic.topic_img) {
      form.append(`topic_image_${index}`, topic.topic_img);
    }
  });

  return form;
}

function buildTopicFormData(payload: { name?: string; is_active?: boolean; topic_image?: string }) {
  const form = new FormData();
  if (payload.name) {
    form.append('name', payload.name);
  }
  form.append('is_active', String(payload.is_active ?? true));
  if (payload.topic_image) {
    form.append('topic_image', payload.topic_image);
  }
  return form;
}

/* ================= API ================= */

export const specialtyApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getAllSpecialties: builder.query<SpecialtyListResponse, void>({
      query: () => ({
        url: '/admin/specialty',
        method: 'GET',
      }),
      providesTags: ['Specialty'],
    }),

    getSpecialtyById: builder.query<Specialty, string>({
      query: id => ({
        url: `/admin/specialty/${encodeURIComponent(id)}`,
        method: 'GET',
      }),
      transformResponse: (response: Record<string, unknown>) => toFrontendSpecialty(response),
      providesTags: (result, error, id) => [{ type: 'Specialty', id }],
    }),

    getSpecialtyByName: builder.query<Specialty, string>({
      query: name => ({
        url: `/admin/specialty/${encodeURIComponent(name)}`,
        method: 'GET',
      }),
      transformResponse: (response: Record<string, unknown>) => toFrontendSpecialty(response),
      providesTags: (result, error, name) => [{ type: 'Specialty', id: name }],
    }),

    createSpecialty: builder.mutation<
      { success: boolean; message: string },
      CreateSpecialtyPayload
    >({
      query: data => ({
        url: '/admin/specialty',
        method: 'POST',
        body: buildSpecialtyFormData(data),
      }),
      invalidatesTags: ['Specialty'],
    }),

    updateSpecialty: builder.mutation<Specialty, UpdateSpecialtyPayload>({
      query: ({ id, ...data }) => ({
        url: `/admin/specialty/${encodeURIComponent(id)}`,
        method: 'PATCH',
        body: buildSpecialtyFormData({
          specialty_name: data.specialty_name ?? '',
          specialty_banner_img: data.specialty_banner_img ?? '',
          brand_img: data.brand_img,
          topics: data.topics ?? [],
        }),
      }),
      transformResponse: (response: Record<string, unknown>) => toFrontendSpecialty(response),
      invalidatesTags: (result, error, { id }) => [
        'Specialty',
        { type: 'Specialty', id },
      ],
    }),

    deleteSpecialty: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: id => ({
        url: `/admin/specialty/${encodeURIComponent(id)}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Specialty'],
    }),

    addTopic: builder.mutation<TopicResponse, { specialtyId: string; data: AddTopicPayload }>({
      query: ({ specialtyId, data }) => ({
        url: `/admin/specialty/${encodeURIComponent(specialtyId)}/topic`,
        method: 'POST',
        body: buildTopicFormData(data),
      }),
      invalidatesTags: (result, error, { specialtyId }) => [
        'Specialty',
        { type: 'Specialty', id: specialtyId },
      ],
    }),

    updateTopic: builder.mutation<TopicResponse, { topicId: string; data: UpdateTopicPayload }>({
      query: ({ topicId, data }) => ({
        url: `/admin/specialty/topic/${encodeURIComponent(topicId)}`,
        method: 'PATCH',
        body: buildTopicFormData(data),
      }),
      invalidatesTags: ['Specialty'],
    }),

    deleteTopic: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: topicId => ({
        url: `/admin/specialty/topic/${encodeURIComponent(topicId)}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Specialty'],
    }),
  }),
});

export const {
  useGetAllSpecialtiesQuery,
  useGetSpecialtyByIdQuery,
  useGetSpecialtyByNameQuery,
  useCreateSpecialtyMutation,
  useUpdateSpecialtyMutation,
  useDeleteSpecialtyMutation,
  useAddTopicMutation,
  useUpdateTopicMutation,
  useDeleteTopicMutation,
} = specialtyApi;
