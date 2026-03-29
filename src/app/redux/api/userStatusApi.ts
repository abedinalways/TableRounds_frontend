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
  avatar_url?: string | null;
  verifiy_document_url?: string | null;
  verifiy_document?: string | null;
}

export interface AdminUserResponse {
 
  success: boolean;
  data: AdminUser[];
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface ReportUserInfo {
  id: string;
  name: string;
  email: string;
  avatar_url?: string | null;
}

export interface ReportedUserItem {
  id: string;
  reporter: ReportUserInfo;
  reported: ReportUserInfo;
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
      { status: 'pending' | 'approved' | 'rejected' , page: number , limit: number }
    >({
      query: ({ status, page= 1, limit=10 }) => ({
        url: '/admin/user',
        method: 'GET',
        params: { status, page, limit },
      }),
      providesTags: ['UserStatus'],
    }),

    /* ---------- GET REPORTED USERS ---------- */
    getReportedUsers: builder.query<ReportedUserResponse, void>({
      query: () => ({
        url: '/admin/user/reports',
        method: 'GET',
      }),
      providesTags: ['UserReports'],
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
