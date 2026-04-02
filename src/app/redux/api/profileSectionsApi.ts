import { baseApi } from './baseApi';

export interface CreateEducationPayload {
  degree: string;
  description: string;
  institute: string;
  year: string;
}

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

export interface CreateExperiencePayload {
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string;
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

export interface CreatePublicationPayload {
  title: string;
  topic: string;
  link: string;
  year: string;
}

export interface CreatePublicationResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    topic: string;
    link: string;
    year: string;
  };
}

export interface CreateSkillPayload {
  name: string;
}

export interface CreateSkillResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
  };
}

export const profileSectionsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    createEducation: builder.mutation<
      CreateEducationResponse,
      CreateEducationPayload
    >({
      query: body => ({
        url: '/profile/education',
        method: 'POST',
        body,
        credentials: 'include',
      }),
      invalidatesTags: ['Profile'],
    }),

    createExperience: builder.mutation<
      CreateExperienceResponse,
      CreateExperiencePayload
    >({
      query: body => ({
        url: '/profile/experience',
        method: 'POST',
        body,
        credentials: 'include',
      }),
      invalidatesTags: ['Profile'],
    }),

    createPublication: builder.mutation<
      CreatePublicationResponse,
      CreatePublicationPayload
    >({
      query: body => ({
        url: '/profile/publication',
        method: 'POST',
        body,
        credentials: 'include',
      }),
      invalidatesTags: ['Profile'],
    }),

    createSkill: builder.mutation<CreateSkillResponse, CreateSkillPayload>({
      query: body => ({
        url: '/profile/skill',
        method: 'POST',
        body,
        credentials: 'include',
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateEducationMutation,
  useCreateExperienceMutation,
  useCreatePublicationMutation,
  useCreateSkillMutation,
} = profileSectionsApi;
