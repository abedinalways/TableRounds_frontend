import {
  useGetAllSpecialtiesQuery,
  useGetSpecialtyByNameQuery,
  useCreateSpecialtyMutation,
  useUpdateSpecialtyMutation,
  useDeleteSpecialtyMutation,
} from '@/app/redux/api/specialtyApi';
import { mockSpecialtyService } from '@/lib/mockSpecialtyData';
import type { Specialty } from '@/types/specialty';
import { useCallback, useState } from 'react';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

interface MutationMeta {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  error?: unknown;
  data?: unknown;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MutationFn = (arg: any) => any;

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
      data: result.data ? { data: result.data as Specialty } : undefined,
      isLoading: false,
      isError: false,
      error: undefined,
    };
  }
  return realQuery;
}

export function useSpecialtyMutations(): {
  createSpecialty: [MutationFn, MutationMeta];
  updateSpecialty: [MutationFn, MutationMeta];
  deleteSpecialty: [MutationFn, MutationMeta];
  refetch: () => void;
} {
  const [createReal, createMeta] = useCreateSpecialtyMutation();
  const [updateReal, updateMeta] = useUpdateSpecialtyMutation();
  const [deleteReal, deleteMeta] = useDeleteSpecialtyMutation();
  const [mockLoading, setMockLoading] = useState(false);

  const mockCreate = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data: any) => {
      setMockLoading(true);
      const result = mockSpecialtyService.create(data);
      setMockLoading(false);
      return Object.assign(Promise.resolve({ data: result.data }), {
        unwrap: () => Promise.resolve(result.data),
      });
    },
    [],
  );

  const mockUpdate = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (args: any) => {
      setMockLoading(true);
      const { id, ...data } = args;
      const result = mockSpecialtyService.update(id, data);
      setMockLoading(false);
      return Object.assign(Promise.resolve({ data: result.data }), {
        unwrap: () => Promise.resolve(result.data),
      });
    },
    [],
  );

  const mockDelete = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (id: any) => {
      setMockLoading(true);
      const result = mockSpecialtyService.delete(id);
      setMockLoading(false);
      return Object.assign(Promise.resolve({ data: result.data }), {
        unwrap: () => Promise.resolve(result.data),
      });
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
      refetch: mockSpecialtyService.reset,
    };
  }

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createSpecialty: [createReal as any, { ...createMeta }],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateSpecialty: [updateReal as any, { ...updateMeta }],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    deleteSpecialty: [deleteReal as any, { ...deleteMeta }],
    refetch: () => {},
  };
}
