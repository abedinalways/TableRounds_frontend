import { baseApi } from './baseApi';

/* ================= TYPES ================= */

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone_number: string | null;
  address: string;
  type: string;
  approved_at: string | null;
  approved: boolean;
  rejected: boolean;
  created_at: string;
  updated_at: string;
  avatar?: string | null;
  verification_doc?: string | null;
}

export interface AdminUserResponse {
  success: boolean;
  data: AdminUser[];
}

export interface ReportUserInfo {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
}

export interface ReportedUserItem {
  id: string;
  reporting_user: ReportUserInfo;
  reported_user: ReportUserInfo;
}

export interface ReportedUserResponse {
  success: boolean;
  data: ReportedUserItem[];
}


export const userStatusApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    /* ---------- GET USERS ---------- */
    getUserStatus: builder.query<
      AdminUserResponse,
      { status: 'pending' | 'approved' | 'rejected' }
    >({
      query: ({ status }) => ({
        url: '/admin/user',
        method: 'GET',
        params: { status },
      }),
      providesTags: ['UserStatus'],
    }),

    /* ---------- GET REPORTED USERS ---------- */
    getReportedUsers: builder.query<ReportedUserResponse, void>({
      query: () => ({
        url: '/admin/user/reports',
        method: 'GET',
      }),
      providesTags: ['UserStatus'],
    }),

    /* ---------- APPROVE ---------- */
    approveUser: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: id => ({
        url: `/admin/user/${id}/approve`,
        method: 'POST',
      }),
      invalidatesTags: ['UserStatus'],
    }),

    /* ---------- REJECT ---------- */
    rejectUser: builder.mutation<{ success: boolean; message: string }, string>(
      {
        query: id => ({
          url: `/admin/user/${id}/reject`,
          method: 'POST',
        }),
        invalidatesTags: ['UserStatus'],
      },
    ),

    /* ---------- DELETE USER ---------- */
    deleteUser: builder.mutation<{ success: boolean; message: string }, string>(
      {
        query: id => ({
          url: `/admin/user/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['UserStatus'],
      },
    ),
  }),
});

export const {
  useGetUserStatusQuery,
  useGetReportedUsersQuery,
  useApproveUserMutation,
  useRejectUserMutation,
  useDeleteUserMutation,
} = userStatusApi;
