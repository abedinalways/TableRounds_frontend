import {
  useGetAllSpecialtiesQuery,
  useGetSpecialtyByNameQuery,
  useCreateSpecialtyMutation,
  useUpdateSpecialtyMutation,
  useDeleteSpecialtyMutation,
  useAddTopicMutation,
  useUpdateTopicMutation,
  useDeleteTopicMutation,
} from '@/app/redux/api/specialtyApi';
import { mockSpecialtyService } from '@/lib/mockSpecialtyData';
import type { Specialty, SpecialtyTopic } from '@/types/specialty';
import { useCallback, useState } from 'react';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

interface MutationMeta {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  error?: unknown;
  data?: unknown;
}

interface MutationWithUnwrap<T> {
  (arg: T): Promise<unknown> & { unwrap: () => Promise<unknown> };
}

export function useAllSpecialties() {
  const realQuery = useGetAllSpecialtiesQuery(undefined, {
    skip: USE_MOCK,
  });

  if (USE_MOCK) {
    const result = mockSpecialtyService.getAll();
    return {
      data: result.data,
      isLoading: false,
      isError: false,
      error: undefined,
      refetch: () => Promise.resolve(result),
    };
  }
  return realQuery;
}

export function useSpecialtyByName(name: string) {
  const realQuery = useGetSpecialtyByNameQuery(name, {
    skip: USE_MOCK || !name,
  });

  if (USE_MOCK) {
    if (!name) {
      return {
        data: undefined,
        isLoading: false,
        isError: false,
        error: undefined,
      };
    }
    const result = mockSpecialtyService.getByName(name);
    return {
      data: result.data as Specialty | undefined,
      isLoading: false,
      isError: false,
      error: undefined,
    };
  }
  return realQuery;
}

interface SpecialtyMutations {
  createSpecialty: [MutationWithUnwrap<{ specialty_name: string; specialty_banner_img: string; brand_img?: string; topics: SpecialtyTopic[] }>, MutationMeta];
  updateSpecialty: [MutationWithUnwrap<{ id: string; specialty_name?: string; specialty_banner_img?: string; brand_img?: string; topics?: SpecialtyTopic[] }>, MutationMeta];
  deleteSpecialty: [MutationWithUnwrap<string>, MutationMeta];
  addTopic: [MutationWithUnwrap<{ specialtyId: string; data: { name: string; is_active: boolean; topic_image?: string } }>, MutationMeta];
  updateTopic: [MutationWithUnwrap<{ topicId: string; data: { name?: string; is_active?: boolean; topic_image?: string } }>, MutationMeta];
  deleteTopic: [MutationWithUnwrap<string>, MutationMeta];
  refetch: () => void;
}

export function useSpecialtyMutations(): SpecialtyMutations {
  const [createReal, createMeta] = useCreateSpecialtyMutation();
  const [updateReal, updateMeta] = useUpdateSpecialtyMutation();
  const [deleteReal, deleteMeta] = useDeleteSpecialtyMutation();
  const [addTopicReal, addTopicMeta] = useAddTopicMutation();
  const [updateTopicReal, updateTopicMeta] = useUpdateTopicMutation();
  const [deleteTopicReal, deleteTopicMeta] = useDeleteTopicMutation();
  const [mockLoading, setMockLoading] = useState(false);

  const mockCreate = useCallback(
    (data: { specialty_name: string; specialty_banner_img: string; brand_img?: string; topics: SpecialtyTopic[] }) => {
      setMockLoading(true);
      const result = mockSpecialtyService.create(data);
      setMockLoading(false);
      return Object.assign(Promise.resolve({ data: result.data }), {
        unwrap: () => Promise.resolve(result.data),
      }) as Promise<unknown> & { unwrap: () => Promise<unknown> };
    },
    [],
  );

  const mockUpdate = useCallback(
    (args: { id: string; specialty_name?: string; specialty_banner_img?: string; brand_img?: string; topics?: SpecialtyTopic[] }) => {
      setMockLoading(true);
      const { id, ...data } = args;
      const result = mockSpecialtyService.update(id, data);
      setMockLoading(false);
      return Object.assign(Promise.resolve({ data: result.data }), {
        unwrap: () => Promise.resolve(result.data),
      }) as Promise<unknown> & { unwrap: () => Promise<unknown> };
    },
    [],
  );

  const mockDelete = useCallback(
    (id: string) => {
      setMockLoading(true);
      const result = mockSpecialtyService.delete(id);
      setMockLoading(false);
      return Object.assign(Promise.resolve({ data: result.data }), {
        unwrap: () => Promise.resolve(result.data),
      }) as Promise<unknown> & { unwrap: () => Promise<unknown> };
    },
    [],
  );

  const mockAddTopic = useCallback(
    (args: { specialtyId: string; data: { name: string; is_active: boolean; topic_image?: string } }) => {
      setMockLoading(true);
      const result = mockSpecialtyService.addTopic(args.specialtyId, args.data);
      setMockLoading(false);
      return Object.assign(Promise.resolve({ data: result.data }), {
        unwrap: () => Promise.resolve(result.data),
      }) as Promise<unknown> & { unwrap: () => Promise<unknown> };
    },
    [],
  );

  const mockUpdateTopic = useCallback(
    (args: { topicId: string; data: { name?: string; is_active?: boolean; topic_image?: string } }) => {
      setMockLoading(true);
      const result = mockSpecialtyService.updateTopic(args.topicId, args.data);
      setMockLoading(false);
      return Object.assign(Promise.resolve({ data: result.data }), {
        unwrap: () => Promise.resolve(result.data),
      }) as Promise<unknown> & { unwrap: () => Promise<unknown> };
    },
    [],
  );

  const mockDeleteTopic = useCallback(
    (topicId: string) => {
      setMockLoading(true);
      const result = mockSpecialtyService.deleteTopic(topicId);
      setMockLoading(false);
      return Object.assign(Promise.resolve({ data: result.data }), {
        unwrap: () => Promise.resolve(result.data),
      }) as Promise<unknown> & { unwrap: () => Promise<unknown> };
    },
    [],
  );

  const mockMeta: MutationMeta = {
    isLoading: mockLoading,
    isError: false,
    isSuccess: true,
  };

  if (USE_MOCK) {
    return {
      createSpecialty: [mockCreate, mockMeta],
      updateSpecialty: [mockUpdate, mockMeta],
      deleteSpecialty: [mockDelete, mockMeta],
      addTopic: [mockAddTopic, mockMeta],
      updateTopic: [mockUpdateTopic, mockMeta],
      deleteTopic: [mockDeleteTopic, mockMeta],
      refetch: mockSpecialtyService.reset,
    };
  }

  return {
    createSpecialty: [createReal as MutationWithUnwrap<{ specialty_name: string; specialty_banner_img: string; brand_img?: string; topics: SpecialtyTopic[] }>, { ...createMeta }],
    updateSpecialty: [updateReal as MutationWithUnwrap<{ id: string; specialty_name?: string; specialty_banner_img?: string; brand_img?: string; topics?: SpecialtyTopic[] }>, { ...updateMeta }],
    deleteSpecialty: [deleteReal as MutationWithUnwrap<string>, { ...deleteMeta }],
    addTopic: [addTopicReal as MutationWithUnwrap<{ specialtyId: string; data: { name: string; is_active: boolean; topic_image?: string } }>, { ...addTopicMeta }],
    updateTopic: [updateTopicReal as MutationWithUnwrap<{ topicId: string; data: { name?: string; is_active?: boolean; topic_image?: string } }>, { ...updateTopicMeta }],
    deleteTopic: [deleteTopicReal as MutationWithUnwrap<string>, { ...deleteTopicMeta }],
    refetch: () => {},
  };
}
