import { baseApi } from './baseApi';
import { AuthorizationResponse, AuthUser, setAuth } from '../authSlice';

interface LoginPayload {
  email: string;
  password: string;
}

interface ForgotPasswordPayload {
  email: string;
}

interface ForgotPasswordResponse {
  message: string;
  success: boolean;
}

interface ResetPasswordPayload {
  email: string;
  token: string;
  password: string;
}

interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

interface VerifyEmailPayload {
  email: string;
  
}

interface VerifyEmailResponse {
  message: string;
  success: boolean;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // 🔹 login
    login: builder.mutation<AuthorizationResponse, LoginPayload>({
      query: body => ({
        url: '/auth/login',
        method: 'POST',
        body,
        credentials: 'include',
      }),
      invalidatesTags: ['Auth'],
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          const {
            authorization: { access_token },
            type: role,
          } = data;

          dispatch(setAuth({ token: access_token, role }));
        } catch (error) {
          console.error('Login mutation error:', error);
        }
      },
    }),

    // forgot password
    forgotPassword: builder.mutation<
      ForgotPasswordResponse,
      ForgotPasswordPayload
    >({
      query: body => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),

    // 🔹 verify email
    resendVerificationEmail: builder.mutation<
      VerifyEmailResponse,
      VerifyEmailPayload
    >({
      query: body => ({
        url: '/auth/resend-verification-email',
        method: 'POST',
        body,
      }),
    }),

    // 🔹 reset password
    resetPassword: builder.mutation<
      ResetPasswordResponse,
      ResetPasswordPayload
    >({
      query: body => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),

    // 🔹 update profile / password
    updateUser: builder.mutation<
      { success: boolean; message: string },
      FormData
    >({
      query: body => ({
        url: '/auth/update',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),

    // 🔹 get logged-in user
    me: builder.query<AuthUser, void>({
      query: () => ({
        url: '/profile',
        method: 'GET',
      }),
      transformResponse: (res: { data: AuthUser }) => res.data,
    }),

    // 🔹 logout
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
        credentials: 'include',
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const {
  useLoginMutation,
  useResendVerificationEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdateUserMutation,
  useMeQuery,
  useLogoutMutation,
} = authApi;
