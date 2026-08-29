
'use client';

import { useEffect, useState } from 'react';
import { Loader2, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

import {
  useAllSpecialties,
  useSpecialityById,
  useSpecialityMutations,
} from '@/hooks/useSpecialtyData';

import SpecialtyFormModal, { Specialty } from '@/components/speciality_management/SpecialtyFormModal';
import { getApiErrorMessage } from '@/utils/apiError';
import SpecialtyTable from '@/components/speciality_management/SpecialtyTable';
import SpecialtyDetailsModal from '@/components/speciality_management/SpecialtyDetailsModal';

export default function SpecialtiesAdminPage() {
  /* =========================================================
     TABLE / FILTER STATE
  ========================================================= */

  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive'
  >('all');

  const [page, setPage] = useState(1);
  const limit = 10;

  /* =========================================================
     MODAL STATE
  ========================================================= */

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [editingSpecialty, setEditingSpecialty] =
    useState<Specialty | null>(null);

  const [viewingId, setViewingId] = useState<string | null>(
    null,
  );

  const [deletingId, setDeletingId] = useState<string | null>(
    null,
  );

  /* =========================================================
     GET SPECIALTIES
  ========================================================= */

  const {
    data: specialtiesData,
    isLoading,
    refetch,
  } = useAllSpecialties({
    page,
    limit,
    search: debouncedSearch || undefined,
  });

  /* =========================================================
     MUTATIONS
  ========================================================= */

  const {
    createspeciality,
    updatespeciality,
    deletespeciality,
  } = useSpecialityMutations();

  const [createSpeciality, createMeta] =
    createspeciality;

  const [updateSpeciality, updateMeta] =
    updatespeciality;

  const [deleteSpeciality, deleteMeta] =
    deletespeciality;

  /* =========================================================
     VIEW SPECIALTY
  ========================================================= */

  const {
    data: viewingSpecialty,
    isLoading: isViewing,
  } = useSpecialityById(viewingId);

  /* =========================================================
     LOADING STATES
  ========================================================= */

  const isCreating = createMeta.isLoading;
  const isUpdating = updateMeta.isLoading;
  const isDeleting = deleteMeta.isLoading;

  const isSubmitting = isCreating || isUpdating;

  /* =========================================================
     SEARCH DEBOUNCE
  ========================================================= */

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
      setPage(1);
    }, 350);

    return () => {
      clearTimeout(timer);
    };
  }, [searchText]);

  /* =========================================================
     NORMALIZE API DATA
  ========================================================= */

  const specialties: Specialty[] =
    specialtiesData?.data ?? [];

  const meta = specialtiesData?.meta;

  const currentPage =
    meta && 'page' in meta
      ? meta.page ?? page
      : page;

  const currentLimit =
    meta && 'limit' in meta
      ? meta.limit ?? limit
      : limit;

  const totalCount =
    meta?.total ?? specialties.length;

  const totalPage =
    meta && 'totalPage' in meta
      ? meta.totalPage ??
        Math.ceil(totalCount / currentLimit)
      : Math.ceil(totalCount / currentLimit);

  /* =========================================================
     FORM MODAL
  ========================================================= */

  const handleOpenCreate = () => {
    setEditingSpecialty(null);
    setIsFormOpen(true);
  };

  const handleEdit = (specialty: Specialty) => {
    setEditingSpecialty(specialty);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingSpecialty(null);
  };

  /* =========================================================
     CREATE SPECIALTY
  ========================================================= */

  const handleCreate = async (data: {
    name: string;
    speciality_banner_img?: string | File;
    brand_img?: string | File;
    topics: {
      name: string;
      topic_img?: string | File;
    }[];
  }) => {
    await createSpeciality(data).unwrap();

    await refetch();
  };

  /* =========================================================
     UPDATE SPECIALTY
  ========================================================= */

  const handleUpdate = async (
    id: string,
    data: {
      name: string;
      speciality_banner_img?: string | File;
      brand_img?: string | File;
      topics: {
        name: string;
        topic_img?: string | File;
      }[];
    },
  ) => {
    await updateSpeciality({
      id,
      ...data,
    }).unwrap();

    await refetch();
  };

  /* =========================================================
     VIEW SPECIALTY
  ========================================================= */

  const handleView = (specialty: Specialty) => {
    const id = specialty.id || specialty._id;

    if (!id) {
      toast.error('Speciality ID is missing');
      return;
    }

    setViewingId(id);
  };

  const handleCloseDetails = () => {
    setViewingId(null);
  };

  /* =========================================================
     DELETE SPECIALTY
  ========================================================= */

  const handleDelete = (id: string) => {
    if (!id) {
      toast.error('Speciality ID is missing');
      return;
    }

    toast.custom(
      toastId => (
        <div className="bg-white shadow-lg rounded-lg p-4 w-[350px] space-y-4 font-[manrope]">
          <p className="text-sm font-medium text-[#01281e]">
            Are you sure you want to delete this speciality?
          </p>

          <div className="flex justify-end gap-3">
            {/* Cancel */}
            <button
              type="button"
              onClick={() => {
                toast.dismiss(toastId);
              }}
              className="px-3 py-1 border rounded text-[#01281e] hover:bg-gray-50"
            >
              Cancel
            </button>

            {/* Delete */}
            <button
              type="button"
              disabled={isDeleting}
              onClick={async () => {
                setDeletingId(id);

                try {
                  await deleteSpeciality(id).unwrap();

                  toast.dismiss(toastId);

                  toast.success(
                    'Speciality deleted successfully',
                  );

                  setViewingId(null);

                  await refetch();
                } catch (error: unknown) {
                  toast.dismiss(toastId);

                  toast.error(
                    getApiErrorMessage(
                      error,
                      'Failed to delete speciality',
                    ),
                  );
                } finally {
                  setDeletingId(null);
                }
              }}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2
                    className="animate-spin"
                    size={14}
                  />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      ),
      {
        duration: 10000,
      },
    );
  };

  /* =========================================================
     PAGINATION
  ========================================================= */

  const handlePreviousPage = () => {
    setPage(current =>
      Math.max(current - 1, 1),
    );
  };

  const handleNextPage = () => {
    setPage(current =>
      Math.min(current + 1, totalPage),
    );
  };

  /* =========================================================
     STATUS FILTER
  ========================================================= */

  const handleStatusChange = (
    value: 'all' | 'active' | 'inactive',
  ) => {
    setStatusFilter(value);
    setPage(1);
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="p-6 font-[manrope]">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[#01281e] text-2xl font-bold">
          Specialties Management
        </h1>

        <button
          type="button"
          onClick={handleOpenCreate}
          disabled={isSubmitting}
          className="bg-[#01503b] text-white px-4 py-2 rounded-[8px] flex items-center gap-2 hover:bg-[#01281e] transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isFormOpen && !editingSpecialty ? (
            <X size={18} />
          ) : (
            <Plus size={18} />
          )}

          <span>
            {isFormOpen && !editingSpecialty
              ? 'Close'
              : 'Add New speciality'}
          </span>
        </button>
      </div>

      {/* =====================================================
          CREATE / EDIT FORM MODAL
      ===================================================== */}

      <SpecialtyFormModal
        open={isFormOpen}
        editingSpecialty={editingSpecialty}
        isCreating={isCreating}
        isUpdating={isUpdating}
        onClose={handleCloseForm}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />

      {/* =====================================================
          SPECIALTY TABLE
      ===================================================== */}

      {isLoading && specialties.length === 0 ? (
        <div className="flex justify-center p-10">
          <Loader2
            className="animate-spin text-gray-400"
            size={32}
          />
        </div>
      ) : (
        <SpecialtyTable
          specialties={specialties}
          isLoading={isLoading}
          searchText={searchText}
          statusFilter={statusFilter}
          totalCount={totalCount}
          currentPage={currentPage}
          totalPage={totalPage}
          deletingId={deletingId}
          onSearchChange={setSearchText}
          onStatusChange={handleStatusChange}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
        />
      )}

      {/* =====================================================
          DETAILS MODAL
      ===================================================== */}

      {viewingId && (
        <SpecialtyDetailsModal
          specialty={viewingSpecialty ?? null}
          loading={isViewing}
          onClose={handleCloseDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

