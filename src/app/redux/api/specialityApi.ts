import { baseApi } from './baseApi';

/* ================= TYPES ================= */

export interface specialityTopic {
  topic_name: string;
  topic_img: string;
}

export interface speciality {
  id: string;
  _id?: string;
  speciality_name: string;
  speciality_banner_img: string;
  brand_img?: string;
  topics?: specialityTopic[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface specialityListResponse {
  success: boolean;
  message: string;
  data: speciality[];
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

export interface CreatespecialityPayload {
  speciality_name: string;
  speciality_banner_img?: string | File;
  brand_img?: string | File;
  topics: Array<{
    topic_name: string;
    topic_img?: string | File;
  }>;
}

export interface UpdatespecialityPayload {
  id: string;
  speciality_name?: string;
  speciality_banner_img?: string | File;
  brand_img?: string | File;
  topics?: Array<{
    topic_name: string;
    topic_img?: string | File;
  }>;
}

export interface AddTopicPayload {
  name: string;
  is_active: boolean;
  topic_image?: string | File;
}

export interface UpdateTopicPayload {
  name?: string;
  is_active?: boolean;
  topic_image?: string | File;
}

/* ================= HELPERS ================= */

function toFormValue(value?: string | File): string | Blob | null {
  if (value == null || value === '') return null;
  return value as string | Blob;
}

function toFrontendspeciality(data: Record<string, unknown>): speciality {
  const topics = Array.isArray(data.topics)
    ? (data.topics as Array<{ name: string; is_active: boolean }>).map(
        (topic, index) => ({
          topic_name: String(topic.name ?? ''),
          topic_img: String(data[`topic_image_${index}`] ?? ''),
        }),
      )
    : [];

  return {
    id: String(data.id ?? data._id ?? ''),
    _id: data._id ? String(data._id) : undefined,
    speciality_name: String(data.name ?? ''),
    speciality_banner_img: String(data.banner ?? ''),
    brand_img: data.image ? String(data.image) : undefined,
    is_active: typeof data.is_active === 'boolean' ? data.is_active : false,
    topics,
    created_at: data.created_at ? String(data.created_at) : undefined,
    updated_at: data.updated_at ? String(data.updated_at) : undefined,
  };
}

function buildspecialityFormData(payload: {
  speciality_name: string;
  speciality_banner_img?: string | File;
  brand_img?: string | File;
  topics: Array<{ topic_name: string; topic_img?: string | File }>;
}) {
  const form = new FormData();
  form.append('name', payload.speciality_name);
  form.append('is_active', 'true');

  const banner = toFormValue(payload.speciality_banner_img);
  if (banner) {
    form.append('banner', banner);
  }

  const image = toFormValue(payload.brand_img);
  if (image) {
    form.append('image', image);
  }

  payload.topics.forEach((topic, index) => {
    form.append(`topics[${index}][name]`, topic.topic_name);
    form.append(`topics[${index}][is_active]`, 'true');
    const topicImg = toFormValue(topic.topic_img);
    if (topicImg instanceof File) {
      form.append('topic_images', topicImg);
    } else if (typeof topicImg === 'string') {
      form.append(`topic_image_${index}`, topicImg);
    }
  });

  return form;
}

function buildTopicFormData(payload: {
  name?: string;
  is_active?: boolean;
  topic_image?: string | File;
}) {
  const form = new FormData();
  if (payload.name) {
    form.append('name', payload.name);
  }
  form.append('is_active', String(payload.is_active ?? true));
  const topicImage = toFormValue(payload.topic_image);
  if (topicImage) {
    form.append('topic_image', topicImage);
  }
  return form;
}

/* ================= API ================= */

export const specialityApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getAllSpecialties: builder.query<specialityListResponse, void>({
      query: () => ({
        url: '/admin/speciality',
        method: 'GET',
      }),
      transformResponse: (response: Record<string, unknown>) => {
        const rawData = response.data;
        const data = (Array.isArray(rawData) ? rawData : []).map(item =>
          toFrontendspeciality(item as Record<string, unknown>),
        );
        return {
          success: Boolean(response.success),
          message: typeof response.message === 'string' ? response.message : '',
          data,
          meta: (response.meta as specialityListResponse['meta']) ?? {
            total: data.length,
            page: 1,
            limit: data.length || 1,
            totalPage: data.length ? 1 : 0,
            next: null,
            previous: null,
          },
        };
      },
      providesTags: ['speciality'],
    }),

    getspecialityById: builder.query<speciality, string>({
      query: id => ({
        url: `/admin/speciality/${encodeURIComponent(id)}`,
        method: 'GET',
      }),
      transformResponse: (response: Record<string, unknown>) =>
        toFrontendspeciality(response),
      providesTags: (result, error, id) => [{ type: 'speciality', id }],
    }),

    getspecialityByName: builder.query<speciality, string>({
      query: name => ({
        url: `/admin/speciality/${encodeURIComponent(name)}`,
        method: 'GET',
      }),
      transformResponse: (response: Record<string, unknown>) =>
        toFrontendspeciality(response),
      providesTags: (result, error, name) => [{ type: 'speciality', id: name }],
    }),

    createspeciality: builder.mutation<
      { success: boolean; message: string },
      CreatespecialityPayload
    >({
      query: data => ({
        url: '/admin/speciality',
        method: 'POST',
        body: buildspecialityFormData(data),
      }),
      invalidatesTags: ['speciality'],
    }),

    updatespeciality: builder.mutation<speciality, UpdatespecialityPayload>({
      query: ({ id, ...data }) => ({
        url: `/admin/speciality/${encodeURIComponent(id)}`,
        method: 'PATCH',
        body: buildspecialityFormData({
          speciality_name: data.speciality_name ?? '',
          speciality_banner_img: data.speciality_banner_img ?? '',
          brand_img: data.brand_img,
          topics: data.topics ?? [],
        }),
      }),
      transformResponse: (response: Record<string, unknown>) =>
        toFrontendspeciality(response),
      invalidatesTags: (result, error, { id }) => [
        'speciality',
        { type: 'speciality', id },
      ],
    }),

    deletespeciality: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: id => ({
        url: `/admin/speciality/${encodeURIComponent(id)}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['speciality'],
    }),

    addTopic: builder.mutation<
      TopicResponse,
      { specialityId: string; data: AddTopicPayload }
    >({
      query: ({ specialityId, data }) => ({
        url: `/admin/speciality/${encodeURIComponent(specialityId)}/topic`,
        method: 'POST',
        body: buildTopicFormData(data),
      }),
      invalidatesTags: (result, error, { specialityId }) => [
        'speciality',
        { type: 'speciality', id: specialityId },
      ],
    }),

    updateTopic: builder.mutation<
      TopicResponse,
      { topicId: string; data: UpdateTopicPayload }
    >({
      query: ({ topicId, data }) => ({
        url: `/admin/speciality/topic/${encodeURIComponent(topicId)}`,
        method: 'PATCH',
        body: buildTopicFormData(data),
      }),
      invalidatesTags: ['speciality'],
    }),

    deleteTopic: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: topicId => ({
        url: `/admin/speciality/topic/${encodeURIComponent(topicId)}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['speciality'],
    }),
  }),
});

export const {
  useGetAllSpecialtiesQuery,
  useGetspecialityByIdQuery,
  useGetspecialityByNameQuery,
  useCreatespecialityMutation,
  useUpdatespecialityMutation,
  useDeletespecialityMutation,
  useAddTopicMutation,
  useUpdateTopicMutation,
  useDeleteTopicMutation,
} = specialityApi;
