import { baseApi } from './baseApi';

export const specialtyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSpecialties: builder.query({
      query: () => '/specialties',
      providesTags: ['Specialty'],
    }),
    getSpecialtyByName: builder.query({
      query: (name: string) => `/specialties/${name}`,
      providesTags: ['Specialty'],
    }),
    createSpecialty: builder.mutation({
      query: (data) => ({
        url: '/specialties',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Specialty'],
    }),
    updateSpecialty: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/specialties/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Specialty'],
    }),
    deleteSpecialty: builder.mutation({
      query: (id) => ({
        url: `/specialties/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Specialty'],
    }),
  }),
});

export const {
  useGetAllSpecialtiesQuery,
  useGetSpecialtyByNameQuery,
  useCreateSpecialtyMutation,
  useUpdateSpecialtyMutation,
  useDeleteSpecialtyMutation,
} = specialtyApi;
