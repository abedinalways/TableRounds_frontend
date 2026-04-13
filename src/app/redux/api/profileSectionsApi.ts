import { baseApi } from './baseApi';

/* ================= TYPES ================= */

export interface CreateEducationPayload {
  degree: string;
  description?: string;
  institute: string;
  year: string;
}

export interface CreateExperiencePayload {
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string;
}

export interface CreatePublicationPayload {
  topic: string;
  title: string;
  link: string;
  year: string;
}
export interface CreateSkillPayload {
  name: string;
}

/* ================= RESPONSES ================= */

export interface CreateEducationResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    degree: string;
    description: string;
    institute: string;
    year: string;
  };
}

export interface CreateExperienceResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    company: string;
    position: string;
    location: string;
    start_date: string;
    end_date: string;
  };
}

export interface CreatePublicationResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    topic: string;
    title: string;
    link: string;
    year: string;
  };
}

export interface CreateSkillResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
  };
}

/* ================= API ================= */

export const profileSectionsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    /* ========= EDUCATION ========= */

    upsertEducation: builder.mutation<
      CreateEducationResponse,
      { id?: string; data: CreateEducationPayload }
    >({
      query: ({ id, data }) => ({
        url: '/profile/education',
        method: 'PUT',
        body: data,
        params: {
          education_id: id,
        },
        credentials: 'include',
      }),
      invalidatesTags: ['Profile'],
    }),

    /* ========= EXPERIENCE ========= */

    upsertExperience: builder.mutation<
      CreateExperienceResponse,
      { id?: string; data: CreateExperiencePayload }
    >({
      query: ({ id, data }) => ({
        url: '/profile/experience',
        method: 'PUT',
        body: data,
        params: {
          experience_id: id,
        },
        credentials: 'include',
      }),
      invalidatesTags: ['Profile'],
    }),

    /* ========= PUBLICATION ========= */

    upsertPublication: builder.mutation<
      CreatePublicationResponse,
      { id?: string; data: CreatePublicationPayload }
    >({
      query: ({ id, data }) => ({
        url: '/profile/publication',
        method: 'PUT',
        body: data,
        params: {
          publication_id: id,
        },
        credentials: 'include',
      }),
      invalidatesTags: ['Profile'],
    }),

    /* ========= SKILL ========= */

    upsertSkill: builder.mutation<
      CreateSkillResponse,
      { id?: string; data: CreateSkillPayload }
    >({
      query: ({ id, data }) => ({
        url: '/profile/skill',
        method: 'PUT',
        body: data,
        params: {
          skill_id: id,
        },
        credentials: 'include',
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const {
  useUpsertEducationMutation,
  useUpsertExperienceMutation,
  useUpsertPublicationMutation,
  useUpsertSkillMutation,
} = profileSectionsApi;
