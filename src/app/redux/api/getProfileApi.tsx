import { baseApi } from './baseApi';

/* ================= TYPES ================= */

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: ProfileData;
}

export interface ProfileData {
  id: string;
  name: string;
  email: string;
  avatar: string;
  credentials: string;
  training_practice: string;
  address: string;
  current_practice: string;
  bio: string;
  instagram: string;
  linkedin: string;
  twitter_x: string;
  facebook: string;
  type: string;
  cv: string | null;
  is_public: boolean;
  email_notification: boolean;
  website_notification: boolean;
  educations: Education[];
  experiences: Experience[];
  skills: Skill[];
  publications: Publication[];
  followings: number;
  followers: number;
  
}

/* ---------- Sub Types ---------- */

export interface Education {
  id: string;
  degree: string;
  description: string;
  institute: string;
  year: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string;
}

export interface Publication {
  id: string;
  title: string;
  topic: string;
  link: string;
  year: string;
}

export interface Skill {
  id: string;
  name: string;
}

/* ---------- Request Payload Types ---------- */

export type UpdateProfilePayload = Partial<
  Omit<
    ProfileData,
    | 'id'
    | 'educations'
    | 'experiences'
    | 'skills'
    | 'publications'
    | 'followers'
    | 'followings'
  >
>;

export type CreateEducationPayload = Omit<Education, 'id'>;
export type CreateExperiencePayload = Omit<Experience, 'id'>;
export type CreatePublicationPayload = Omit<Publication, 'id'>;
export type CreateSkillPayload = Omit<Skill, 'id'>;

/* ================= API ================= */

export const getProfileApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    /* ---------- GET PROFILE ---------- */
    getProfileData: builder.query<ProfileData, string>({
      query: userid => ({
        url: '/profile',
        // params: { user_id: userid },
        params: userid ? { user_id: userid } : {},
        method: 'GET',
        credentials: 'include',
      }),
      transformResponse: (response: ProfileResponse) => response.data,
      providesTags: ['Profile'],
    }),

    /* ---------- UPDATE PROFILE ---------- */
    updateProfile: builder.mutation<ProfileResponse, UpdateProfilePayload>({
      query: body => ({
        url: '/profile',
        method: 'PUT',
        body,
        credentials: 'include',
      }),
      invalidatesTags: ['Profile'],
    }),

    /* ---------- EDUCATION ---------- */
    createEducation: builder.mutation<Education, CreateEducationPayload>({
      query: body => ({
        url: '/profile/education',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),

    deleteEducation: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: id => ({
        url: `/profile/education/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Profile'],
    }),

    /* ---------- EXPERIENCE ---------- */
    createExperience: builder.mutation<Experience, CreateExperiencePayload>({
      query: body => ({
        url: '/profile/experience',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),

    deleteExperience: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: id => ({
        url: `/profile/experience/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Profile'],
    }),

    /* ---------- PUBLICATION ---------- */
    createPublication: builder.mutation<Publication, CreatePublicationPayload>({
      query: body => ({
        url: '/profile/publication',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),

    deletePublication: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: id => ({
        url: `/profile/publication/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Profile'],
    }),

    /* ---------- SKILL ---------- */
    createSkill: builder.mutation<Skill, CreateSkillPayload>({
      query: body => ({
        url: '/profile/skill',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),

    deleteSkill: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: id => ({
        url: `/profile/skill/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Profile'],
    }),

    /* ---------- UPDATE CV ---------- */
    updateCV: builder.mutation<{ success: boolean; message: string }, File>({
      query: file => {
        const formData = new FormData();
        formData.append('file', file);

        return {
          url: '/profile/cv',
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const {
  useGetProfileDataQuery,
  useUpdateProfileMutation,
  useCreateEducationMutation,
  useDeleteEducationMutation,
  useCreateExperienceMutation,
  useDeleteExperienceMutation,
  useCreatePublicationMutation,
  useDeletePublicationMutation,
  useCreateSkillMutation,
  useDeleteSkillMutation,
  useUpdateCVMutation,
} = getProfileApi;
