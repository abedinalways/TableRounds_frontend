import { baseApi } from './baseApi';

export interface MapUserLocation {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
}

export interface MapDataResponse {
  success: boolean;
  message: string;
  data: MapUserLocation[];
}

export const mapApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getMapData: builder.query<MapDataResponse, void>({
      query: () => ({
        url: '/leaderboard/map-data',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['MapData'],
    }),
  }),
});

export const { useGetMapDataQuery } = mapApi;
