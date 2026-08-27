'use client';

import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  useAllSpecialties,
  useSpecialityById,
  useSpecialityMutations,
} from '@/hooks/useSpecialtyData';
import {
  Loader2,
  Plus,
  Trash2,
  Edit2,
  X,
  Eye,
  ExternalLink,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/reusable/ImageUpload';

interface TopicInput {
  name: string;
  topic_img: string;
}

interface specialityForm {
  name: string;
  speciality_banner_img: string;
  brand_img?: string;
  topics: TopicInput[];
}

interface speciality {
  id?: string;
  _id?: string;
  name: string;
  speciality_banner_img: string;
  brand_img?: string;
  topics?: TopicInput[];
  total_topics?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export default function SpecialtiesAdminPage() {
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>(
    'all',
  );
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: specialtiesData, isLoading, refetch } = useAllSpecialties({
    page,
    limit,
    search: debouncedSearch || undefined,
  });
  const { createspeciality, updatespeciality, deletespeciality } =
    useSpecialityMutations();
  const [createspecialityMut, createMeta] = createspeciality;
  const [updatespecialityMut, updateMeta] = updatespeciality;
  const [deletespecialityMut] = deletespeciality;

  const isCreating = createMeta.isLoading;
  const isUpdating = updateMeta.isLoading;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingspeciality, setEditingspeciality] = useState<speciality | null>(
    null,
  );
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { data: viewingSpeciality, isLoading: isViewing } =
    useSpecialityById(viewingId);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [brandFile, setBrandFile] = useState<File | null>(null);
  const [topicFiles, setTopicFiles] = useState<(File | null)[]>([]);
  const router = useRouter();

  // Debounce the search input before hitting the API.
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchText);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [searchText]);

  const { register, control, handleSubmit, reset, setValue, watch } =
    useForm<specialityForm>({
      defaultValues: {
        name: '',
        speciality_banner_img: '',
        brand_img: '',
        topics: [{ name: '', topic_img: '' }],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'topics',
  });

  const watchedBanner = watch('speciality_banner_img');
  const watchedBrand = watch('brand_img');
  const watchedTopics = watch('topics');

  useEffect(() => {
    if (editingspeciality) {
      const existingTopics =
        editingspeciality.topics && editingspeciality.topics.length > 0
          ? editingspeciality.topics
          : [{ name: '', topic_img: '' }];
      reset({
        name: editingspeciality.name,
        speciality_banner_img: editingspeciality.speciality_banner_img,
        brand_img: editingspeciality.brand_img || '',
        topics: existingTopics,
      });
    }
  }, [editingspeciality, reset]);

  const onSubmit = async (data: specialityForm) => {
    if (editingspeciality) {
      const specialityId = editingspeciality.id || editingspeciality._id;
      if (!specialityId) {
        toast.error('speciality ID is missing');
        return;
      }
      try {
        const topics = data.topics.map((topic, index) => ({
          name: topic.name,
          topic_img: topicFiles[index]
            ? topicFiles[index]!
            : topic.topic_img || undefined,
        }));
        await updatespecialityMut({
          id: specialityId,
          ...data,
          speciality_banner_img:
            bannerFile ?? (data.speciality_banner_img || undefined),
          brand_img: brandFile ?? (data.brand_img || undefined),
          topics,
        }).unwrap();
        toast.success('speciality updated successfully!');
        setEditingspeciality(null);
        setIsFormOpen(false);
        reset();
        setBannerFile(null);
        setBrandFile(null);
        setTopicFiles([]);
        refetch();
      } catch {
        toast.error('Failed to update speciality');
      }
    } else {
      if (!brandFile && !data.brand_img) {
        toast.error('Speciality image is required');
        return;
      }
      const missingTopicIndex = data.topics.findIndex(
        (topic, index) => !topicFiles[index] && !topic.topic_img,
      );
      if (missingTopicIndex !== -1) {
        toast.error(`Image for topic "${data.topics[missingTopicIndex].name}" is required`);
        return;
      }
      try {
        const topics = data.topics.map((topic, index) => ({
          name: topic.name,
          topic_img: topicFiles[index]
            ? topicFiles[index]!
            : topic.topic_img || undefined,
        }));
        await createspecialityMut({
          name: data.name,
          speciality_banner_img:
            bannerFile ?? (data.speciality_banner_img || undefined),
          brand_img: brandFile ?? (data.brand_img || undefined),
          topics,
        }).unwrap();
        toast.success('speciality created successfully!');
        setIsFormOpen(false);
        reset();
        setBannerFile(null);
        setBrandFile(null);
        setTopicFiles([]);
        refetch();
      } catch {
        toast.error('Failed to create speciality');
      }
    }
  };

  const handleDelete = async (id: string) => {
    toast.custom(
      t => (
        <div className="bg-white shadow-lg rounded-lg p-4 w-[350px] space-y-4 font-[manrope]">
          <p className="text-sm font-medium text-[#01281e]">
            Are you sure you want to delete this speciality?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => toast.dismiss(t)}
              className="px-3 py-1 border rounded text-[#01281e] hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              disabled={deletingId === id}
              onClick={async () => {
                setDeletingId(id);
                try {
                  await deletespecialityMut(id).unwrap();
                  toast.success('speciality deleted successfully');
                  refetch();
                } catch {
                  toast.error('Failed to delete speciality');
                } finally {
                  setDeletingId(null);
                  toast.dismiss(t);
                }
              }}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {deletingId === id ? (
                <>
                  <Loader2 className="animate-spin" size={14} /> Deleting...
                </>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      ),
      { duration: 10000 },
    );
  };

  const handleEdit = (speciality: speciality) => {
    setEditingspeciality(speciality);
    setIsFormOpen(true);
    setBannerFile(null);
    setBrandFile(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingspeciality(null);
    reset();
    setBannerFile(null);
    setBrandFile(null);
  };

    const specialties = specialtiesData?.data || [];
  const meta = specialtiesData?.meta;
  const normalizedMeta = {
    total: meta?.total ?? 0,
    page: (meta && 'page' in meta ? meta.page : page) ?? page,
    limit: (meta && 'limit' in meta ? meta.limit : limit) ?? limit,
    totalPage:
      (meta && 'totalPage' in meta ? meta.totalPage : undefined) ??
      (meta?.total ? Math.ceil(meta.total / ((meta && 'limit' in meta ? meta.limit : limit) ?? limit)) : 0),
  };
  const totalPage = normalizedMeta.totalPage;
  const totalCount = normalizedMeta.total ?? specialties.length;
  const currentPage = normalizedMeta.page;

  // Apply the status filter client-side on the current page of data.
  const filteredSpecialties = specialties.filter(s => {
    if (statusFilter === 'active') return s.is_active !== false;
    if (statusFilter === 'inactive') return s.is_active === false;
    return true;
  });

  return (
    <div className="p-6 font-[manrope]">
      <style>{`
        @keyframes rowFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .row-fade-in { animation: rowFadeIn 0.4s ease-out both; }
        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .modal-pop { animation: modalPop 0.25s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
      `}</style>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[#01281e] text-2xl font-bold">
          Specialties Management
        </h1>
        <button
          onClick={() => !editingspeciality && setIsFormOpen(!isFormOpen)}
          className="bg-[#01503b] text-white px-4 py-2 rounded-[8px] flex items-center gap-2 hover:bg-[#01281e] transition"
        >
          {isFormOpen && !editingspeciality ? (
            <X size={18} />
          ) : (
            <Plus size={18} />
          )}
          <span>
            {isFormOpen && !editingspeciality ? 'Close' : 'Add New speciality'}
          </span>
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto py-8">
          <div className="bg-white p-6 rounded-lg w-[700px] max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#01281e]">
                {editingspeciality
                  ? 'Edit speciality'
                  : 'Create New speciality'}
              </h2>
              <button
                onClick={handleCloseForm}
                className="p-1 rounded hover:bg-gray-300 transition cursor-pointer text-[#01281e]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    speciality Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('name', { required: true })}
                    placeholder="e.g. OMS, Dentistry"
                    className="w-full border border-gray-300 rounded-[8px] p-2 focus:outline-none focus:ring-2 focus:ring-[#01503b]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {/* Banner Image <span className="text-red-500">*</span> */}
                  </label>
                  <ImageUpload
                    value={watchedBanner}
                    onChange={url => setValue('speciality_banner_img', url)}
                    onFileChange={file => setBannerFile(file)}
                    label="Banner Image"
                    description="Drag & drop or click to upload banner"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {/* Brand Image */}
                  </label>
                  <ImageUpload
                    value={watchedBrand}
                    onChange={url => setValue('brand_img', url)}
                    onFileChange={file => setBrandFile(file)}
                    label="Brand Image"
                    description="Drag & drop or click to upload brand logo"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Topics / Categories <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => append({ name: '', topic_img: '' })}
                    className="text-sm text-[#01503b] hover:text-[#01281e] flex items-center gap-1"
                  >
                    <Plus size={16} /> Add Topic
                  </button>
                </div>
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-4 items-start">
                      <div className="flex-1 space-y-2">
                        <input
                          {...register(`topics.${index}.name`, {
                            required: true,
                          })}
                          placeholder="Topic Name (e.g. Cancer)"
                          className="w-full border border-gray-300 rounded-[8px] p-2 focus:outline-none focus:ring-2 focus:ring-[#01503b]"
                        />
                        <ImageUpload
                          value={watchedTopics[index]?.topic_img}
                          onChange={url =>
                            setValue(`topics.${index}.topic_img`, url)
                          }
                          onFileChange={file => {
                            setTopicFiles(prev => {
                              const next = [...prev];
                              next[index] = file;
                              return next;
                            });
                          }}
                          label={`Topic ${index + 1} Image`}
                          description="Drag & drop or click to upload topic image"
                          className="max-w-[300px]"
                        />
                      </div>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            remove(index);
                            setTopicFiles(prev => {
                              const next = [...prev];
                              next.splice(index, 1);
                              return next;
                            });
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded mt-1"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2 border rounded text-[#01281e] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="bg-[#01503b] text-white px-6 py-2 rounded-[8px] hover:bg-[#01281e] transition flex items-center gap-2"
                >
                  {isCreating || isUpdating ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : editingspeciality ? (
                    'Update speciality'
                  ) : (
                    'Save speciality'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center p-10">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      ) : (
        <div className="bg-white rounded-2xl ring-1 ring-gray-100 shadow-sm overflow-hidden">
          {specialties.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No specialties found.
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {/* Filter bar */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="relative w-full md:w-72">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    placeholder="Search specialties..."
                    className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#01503b]/30 focus:border-[#01503b]"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={statusFilter}
                    onChange={e =>
                      setStatusFilter(
                        e.target.value as 'all' | 'active' | 'inactive',
                      )
                    }
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#01503b]/30 focus:border-[#01503b] bg-white cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {totalCount} total
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[#01281e]">
                        Name
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[#01281e]">
                        Topics
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[#01281e]">
                        Status
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-[#01281e] text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredSpecialties.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-10 text-center text-gray-500"
                        >
                          {isLoading
                            ? 'Loading specialties...'
                            : 'No specialties found'}
                        </td>
                      </tr>
                    ) : null}
                    {filteredSpecialties.map((speciality: speciality) => (
                      <tr
                        key={speciality.id || speciality._id}
                        className="hover:bg-[#fbfcfb] transition-colors row-fade-in"
                      >
                        <td className="px-6 py-4 font-medium text-[#01281e]">
                          {speciality.name}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {speciality?.total_topics
                            ? `${speciality.total_topics} Topic${Number(speciality.total_topics) > 1 ? 's' : ''}`
                            : `${speciality?.topics?.length || 0} Topic${Number(speciality?.topics?.length || 0) > 1 ? 's' : ''}`}
                        </td>
                        <td className="px-6 py-4">
                          {speciality.is_active !== false ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#01503b]/10 text-[#01503b] text-xs font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#01503b]" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end items-center gap-1">
                            <button
                              onClick={() =>
                                setViewingId(speciality.id || speciality._id!)
                              }
                              className="p-2 rounded-lg text-[#01503b] hover:bg-[#01503b]/10 transition cursor-pointer"
                              title="View details"
                            >
                              <Eye size={17} />
                            </button>
                            <button
                              onClick={() => handleEdit(speciality)}
                              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 size={17} />
                            </button>
                            <button
                              disabled={
                                deletingId === (speciality.id || speciality._id)
                              }
                              onClick={() =>
                                handleDelete(speciality.id || speciality._id!)
                              }
                              className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                              title="Delete"
                            >
                              {deletingId ===
                              (speciality.id || speciality._id) ? (
                                <Loader2 className="animate-spin" size={17} />
                              ) : (
                                <Trash2 size={17} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPage > 1 && (
                <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    Page {currentPage} of {totalPage} • {totalCount} total
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage(p => Math.max(p - 1, 1))}
                      disabled={currentPage <= 1 || isLoading}
                      className="p-2 rounded-lg text-[#01503b] hover:bg-[#01503b]/10 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center cursor-pointer"
                      title="Previous page"
                    >
                      <ChevronLeft size={17} />
                    </button>
                    <span className="px-2 py-1 text-xs font-medium text-[#01281e]">
                      {currentPage}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(p + 1, totalPage))}
                      disabled={currentPage >= totalPage || isLoading}
                      className="p-2 rounded-lg text-[#01503b] hover:bg-[#01503b]/10 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center cursor-pointer"
                      title="Next page"
                    >
                      <ChevronRight size={17} />
                    </button>
                  </div>
                </div>
              )}

              {viewingId && (
                <div
                  className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto"
                  onClick={() => setViewingId(null)}
                >
                  <div
                    className="modal-pop bg-white w-[720px] max-w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6 space-y-5"
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-[#01281e]">
                          {viewingSpeciality?.name ||
                            'Speciality Details'}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {isViewing
                            ? 'Loading details...'
                            : `${viewingSpeciality?.topics?.length || 0} topics`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {viewingSpeciality && (
                          <button
                            onClick={() =>
                              router.push(
                                `/${viewingSpeciality.name
                                  .toLowerCase()
                                  .replace(/\s+/g, '-')}`,
                              )
                            }
                            className="p-2 text-[#01503b] hover:bg-[#01503b]/10 rounded-lg cursor-pointer transition"
                            title="View on page"
                          >
                            <ExternalLink size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => setViewingId(null)}
                          className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg cursor-pointer transition"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>

                    {isViewing ? (
                      <div className="flex flex-col items-center justify-center py-16 space-y-3">
                        <Loader2
                          className="animate-spin text-[#01503b]"
                          size={32}
                        />
                        <p className="text-sm text-gray-500">
                          Fetching speciality details...
                        </p>
                      </div>
                    ) : (
                      viewingSpeciality && (
                        <>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Banner Image
                            </label>
                            {viewingSpeciality.speciality_banner_img ? (
                              <div className="relative w-full max-w-[420px] aspect-video rounded-xl overflow-hidden border">
                                <Image
                                  src={viewingSpeciality.speciality_banner_img}
                                  alt="banner"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">
                                No banner image set
                              </span>
                            )}
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Brand Image
                            </label>
                            {viewingSpeciality.brand_img ? (
                              <div className="relative w-full max-w-[220px] aspect-video rounded-xl overflow-hidden border">
                                <Image
                                  src={viewingSpeciality.brand_img}
                                  alt="brand"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">
                                No brand image set
                              </span>
                            )}
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Topics
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {viewingSpeciality.topics?.map((topic, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100"
                                >
                                  <span className="text-sm text-[#01281e]">
                                    {topic.name}
                                  </span>
                                  {topic.topic_img && (
                                    <div className="relative w-8 h-8 rounded overflow-hidden">
                                      <Image
                                        src={topic.topic_img}
                                        alt={topic.name}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                  )}
                                </div>
                              ))}
                              {(!viewingSpeciality.topics ||
                                viewingSpeciality.topics.length === 0) && (
                                <span className="text-xs text-gray-400">
                                  No topics
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={() => {
                                handleEdit(viewingSpeciality);
                                setViewingId(null);
                              }}
                              className="px-4 py-2 border border-[#01503b] text-[#01503b] rounded-[8px] hover:bg-[#01503b]/10 transition flex items-center gap-2"
                            >
                              <Edit2 size={16} />
                              Edit speciality
                            </button>
                            <button
                              onClick={() =>
                                handleDelete(
                                  viewingSpeciality.id ||
                                    viewingSpeciality._id!,
                                )
                              }
                              className="px-4 py-2 border border-red-600 text-red-600 rounded-[8px] hover:bg-red-50 transition flex items-center gap-2"
                            >
                              <Trash2 size={16} />
                              Delete speciality
                            </button>
                          </div>
                        </>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
