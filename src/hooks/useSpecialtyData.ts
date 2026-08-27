import {
  useGetAllSpecialtiesQuery,
  useGetspecialityByIdQuery,
  useGetspecialityByNameQuery,
  useCreatespecialityMutation,
  useUpdatespecialityMutation,
  useDeletespecialityMutation,
  useAddTopicMutation,
  useUpdateTopicMutation,
  useDeleteTopicMutation,
} from '@/app/redux/api/specialityApi';
import { mockspecialityService } from '@/lib/mockSpecialtyData';
import type { speciality } from '@/types/specialty';
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

export function useAllSpecialties(
  params?: { page?: number; limit?: number; search?: string },
) {
  const realQuery = useGetAllSpecialtiesQuery(params, {
    skip: USE_MOCK,
  });

  if (USE_MOCK) {
    const result = mockspecialityService.getAll();
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

export function useSpecialityByName(name: string) {
  const realQuery = useGetspecialityByNameQuery(name, {
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
    const result = mockspecialityService.getByName(name);
    return {
      data: result.data as speciality | undefined,
      isLoading: false,
      isError: false,
      error: undefined,
    };
  }
  return realQuery;
}

export function useSpecialityById(id: string | null) {
  const realQuery = useGetspecialityByIdQuery(id ?? '', {
    skip: USE_MOCK || !id,
  });

  if (USE_MOCK || !id) {
    return {
      data: undefined,
      isLoading: false,
      isError: false,
      error: undefined,
      refetch: () => {},
    };
  }
  return realQuery;
}

interface specialityMutations {
  createspeciality: [
    MutationWithUnwrap<{
      name: string;
      speciality_banner_img?: string | File;
      brand_img?: string | File;
      topics: Array<{ name: string; topic_img?: string | File }>;
    }>,
    MutationMeta,
  ];
  updatespeciality: [
    MutationWithUnwrap<{
      id: string;
      name?: string;
      speciality_banner_img?: string | File;
      brand_img?: string | File;
      topics?: Array<{ name: string; topic_img?: string | File }>;
    }>,
    MutationMeta,
  ];
  deletespeciality: [MutationWithUnwrap<string>, MutationMeta];
  addTopic: [
    MutationWithUnwrap<{
      specialityId: string;
      data: { name: string; is_active: boolean; topic_image?: string | File };
    }>,
    MutationMeta,
  ];
  updateTopic: [
    MutationWithUnwrap<{
      topicId: string;
      data: { name?: string; is_active?: boolean; topic_image?: string | File };
    }>,
    MutationMeta,
  ];
  deleteTopic: [MutationWithUnwrap<string>, MutationMeta];
  refetch: () => void;
}

export function useSpecialityMutations(): specialityMutations {
  const [createReal, createMeta] = useCreatespecialityMutation();
  const [updateReal, updateMeta] = useUpdatespecialityMutation();
  const [deleteReal, deleteMeta] = useDeletespecialityMutation();
  const [addTopicReal, addTopicMeta] = useAddTopicMutation();
  const [updateTopicReal, updateTopicMeta] = useUpdateTopicMutation();
  const [deleteTopicReal, deleteTopicMeta] = useDeleteTopicMutation();
  const [mockLoading, setMockLoading] = useState(false);

  const mockCreate = useCallback(
    (data: {
      name: string;
      speciality_banner_img?: string | File;
      brand_img?: string | File;
      topics: Array<{ name: string; topic_img?: string | File }>;
    }) => {
      setMockLoading(true);
      const result = mockspecialityService.create(
        data as Parameters<typeof mockspecialityService.create>[0],
      );
      setMockLoading(false);
      return Object.assign(Promise.resolve({ data: result.data }), {
        unwrap: () => Promise.resolve(result.data),
      }) as Promise<unknown> & { unwrap: () => Promise<unknown> };
    },
    [],
  );

  const mockUpdate = useCallback(
    (args: {
      id: string;
      name?: string;
      speciality_banner_img?: string | File;
      brand_img?: string | File;
      topics?: Array<{ name: string; topic_img?: string | File }>;
    }) => {
      setMockLoading(true);
      const { id, ...data } = args;
      const result = mockspecialityService.update(
        id,
        data as Parameters<typeof mockspecialityService.update>[1],
      );
      setMockLoading(false);
      return Object.assign(Promise.resolve({ data: result.data }), {
        unwrap: () => Promise.resolve(result.data),
      }) as Promise<unknown> & { unwrap: () => Promise<unknown> };
    },
    [],
  );

  const mockDelete = useCallback((id: string) => {
    setMockLoading(true);
    const result = mockspecialityService.delete(id);
    setMockLoading(false);
    return Object.assign(Promise.resolve({ data: result.data }), {
      unwrap: () => Promise.resolve(result.data),
    }) as Promise<unknown> & { unwrap: () => Promise<unknown> };
  }, []);

  const mockAddTopic = useCallback(
    (args: {
      specialityId: string;
      data: { name: string; is_active: boolean; topic_image?: string | File };
    }) => {
      setMockLoading(true);
      const result = mockspecialityService.addTopic(
        args.specialityId,
        args.data as Parameters<typeof mockspecialityService.addTopic>[1],
      );
      setMockLoading(false);
      return Object.assign(Promise.resolve({ data: result.data }), {
        unwrap: () => Promise.resolve(result.data),
      }) as Promise<unknown> & { unwrap: () => Promise<unknown> };
    },
    [],
  );

  const mockUpdateTopic = useCallback(
    (args: {
      topicId: string;
      data: { name?: string; is_active?: boolean; topic_image?: string | File };
    }) => {
      setMockLoading(true);
      const result = mockspecialityService.updateTopic(
        args.topicId,
        args.data as Parameters<typeof mockspecialityService.updateTopic>[1],
      );
      setMockLoading(false);
      return Object.assign(Promise.resolve({ data: result.data }), {
        unwrap: () => Promise.resolve(result.data),
      }) as Promise<unknown> & { unwrap: () => Promise<unknown> };
    },
    [],
  );

  const mockDeleteTopic = useCallback((topicId: string) => {
    setMockLoading(true);
    const result = mockspecialityService.deleteTopic(topicId);
    setMockLoading(false);
    return Object.assign(Promise.resolve({ data: result.data }), {
      unwrap: () => Promise.resolve(result.data),
    }) as Promise<unknown> & { unwrap: () => Promise<unknown> };
  }, []);

  const mockMeta: MutationMeta = {
    isLoading: mockLoading,
    isError: false,
    isSuccess: true,
  };

  if (USE_MOCK) {
    return {
      createspeciality: [mockCreate, mockMeta],
      updatespeciality: [mockUpdate, mockMeta],
      deletespeciality: [mockDelete, mockMeta],
      addTopic: [mockAddTopic, mockMeta],
      updateTopic: [mockUpdateTopic, mockMeta],
      deleteTopic: [mockDeleteTopic, mockMeta],
      refetch: mockspecialityService.reset,
    };
  }

  return {
    createspeciality: [
      createReal as MutationWithUnwrap<{
        name: string;
        speciality_banner_img?: string | File;
        brand_img?: string | File;
        topics: Array<{ name: string; topic_img?: string | File }>;
      }>,
      { ...createMeta },
    ],
    updatespeciality: [
      updateReal as MutationWithUnwrap<{
        id: string;
        name?: string;
        speciality_banner_img?: string | File;
        brand_img?: string | File;
        topics?: Array<{ name: string; topic_img?: string | File }>;
      }>,
      { ...updateMeta },
    ],
    deletespeciality: [
      deleteReal as MutationWithUnwrap<string>,
      { ...deleteMeta },
    ],
    addTopic: [
      addTopicReal as MutationWithUnwrap<{
        specialityId: string;
        data: { name: string; is_active: boolean; topic_image?: string | File };
      }>,
      { ...addTopicMeta },
    ],
    updateTopic: [
      updateTopicReal as MutationWithUnwrap<{
        topicId: string;
        data: { name?: string; is_active?: boolean; topic_image?: string | File };
      }>,
      { ...updateTopicMeta },
    ],
    deleteTopic: [
      deleteTopicReal as MutationWithUnwrap<string>,
      { ...deleteTopicMeta },
    ],
    refetch: () => {},
  };
}
