import { Conversation } from './chat/chatApi';
import { baseApi } from './baseApi';

/* ================= TYPES ================= */

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone_number: string | null;
  address: string;
  country?: string;
  state?: string;
  type: string;
  approved_at: string | null;
  approved: boolean;
  rejected: boolean;
  facebook: string;
  linkedin: string;
  twitter_x: string;
  instagram: string;
  created_at: string;
  updated_at: string;
  avatar_url?: string | null;
  verifiy_document_url?: string | null;
  verifiy_document?: string | null;
}

export interface AdminUserResponse {
  success: boolean;
  data: AdminUser[];
  meta_data?: {
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
  conversation_id: string;
}

export interface ReportedUserResponse {
  success: boolean;
  data: ReportedUserItem[];
  conversation_id: string;
  
}


export const userStatusApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    /* ---------- GET USERS ---------- */
    getUserStatus: builder.query<
      AdminUserResponse,
      {
        status: 'pending' | 'approved' | 'rejected';
        page: number;
        limit: number;
        search?: string;
      }
    >({
      query: ({ status, page = 1, limit = 10, search }) => ({
        url: '/admin/user',
        method: 'GET',
        params: { status, page, limit, search: search || undefined }, 
      }),
      providesTags: ['UserStatus'],
    }),

    getAllUsers: builder.query<AdminUserResponse, void>({
      query: () => ({
        url: '/admin/user',
        method: 'GET',
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
  useGetAllUsersQuery,
  useGetReportedUsersQuery,
  useApproveUserMutation,
  useRejectUserMutation,
  useDeleteUserMutation,
} = userStatusApi;
