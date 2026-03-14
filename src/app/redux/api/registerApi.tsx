import { baseApi } from './baseApi';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  credentials: string;
  training_practice: string;
  address: string;
  current_practice: string;
  bio: string;
  specialty: string;
  instagram?: string;
  linkedin?: string;
  twitter_x?: string;
  facebook?: string;
  avatar?: File | null;
  verification_doc?: File | null;
  type?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

export const registerApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    registerNewUser: builder.mutation<RegisterResponse, RegisterPayload>({
      query: body => {
        const formData = new FormData();

        Object.entries(body).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (value instanceof File) {
              formData.append(key, value);
            } else {
              formData.append(key, String(value));
            }
          }
        });

        return {
          url: '/auth/register',
          method: 'POST',
          body: formData,
        };
      },
    }),
  }),
});

export const { useRegisterNewUserMutation } = registerApi;
