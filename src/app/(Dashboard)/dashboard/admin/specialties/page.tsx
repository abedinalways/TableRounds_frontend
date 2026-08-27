'use client';

import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  useAllSpecialties,
  useSpecialityMutations,
} from '@/hooks/useSpecialtyData';
import {
  Loader2,
  Plus,
  Trash2,
  Edit2,
  X,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/reusable/ImageUpload';

interface TopicInput {
  topic_name: string;
  topic_img: string;
}

interface specialityForm {
  speciality_name: string;
  speciality_banner_img: string;
  brand_img?: string;
  topics: TopicInput[];
}

interface speciality {
  id?: string;
  _id?: string;
  speciality_name: string;
  speciality_banner_img: string;
  brand_img?: string;
  topics?: TopicInput[];
}

export default function SpecialtiesAdminPage() {
  const { data: specialtiesData, isLoading, refetch } = useAllSpecialties();
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
  const [selectedspeciality, setSelectedspeciality] =
    useState<speciality | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [brandFile, setBrandFile] = useState<File | null>(null);
  const [topicFiles, setTopicFiles] = useState<(File | null)[]>([]);
  const router = useRouter();

  const { register, control, handleSubmit, reset, setValue, watch } =
    useForm<specialityForm>({
      defaultValues: {
        speciality_name: '',
        speciality_banner_img: '',
        brand_img: '',
        topics: [{ topic_name: '', topic_img: '' }],
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
          : [{ topic_name: '', topic_img: '' }];
      reset({
        speciality_name: editingspeciality.speciality_name,
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
          topic_name: topic.topic_name,
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
        toast.error(`Image for topic "${data.topics[missingTopicIndex].topic_name}" is required`);
        return;
      }
      try {
        const topics = data.topics.map((topic, index) => ({
          topic_name: topic.topic_name,
          topic_img: topicFiles[index]
            ? topicFiles[index]!
            : topic.topic_img || undefined,
        }));
        await createspecialityMut({
          speciality_name: data.speciality_name,
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
              onClick={async () => {
                try {
                  await deletespecialityMut(id).unwrap();
                  toast.success('speciality deleted successfully');
                  refetch();
                } catch {
                  toast.error('Failed to delete speciality');
                } finally {
                  toast.dismiss(t);
                }
              }}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Delete
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

  return (
    <div className="p-6 font-[manrope]">
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
                    {...register('speciality_name', { required: true })}
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
                    onClick={() => append({ topic_name: '', topic_img: '' })}
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
                          {...register(`topics.${index}.topic_name`, {
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
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {specialties.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No specialties found.
            </div>
          ) : (
            <div className="p-6 space-y-4">
              <div className="relative">
                <select
                  value={
                    selectedspeciality ? selectedspeciality.speciality_name : ''
                  }
                  onChange={e => {
                    const found = specialties.find(
                      (s: speciality) => s.speciality_name === e.target.value,
                    );
                    setSelectedspeciality(found || null);
                  }}
                  className="w-full border border-gray-300 rounded-[8px] p-3 pr-10 text-[#01281e] focus:outline-none focus:ring-2 focus:ring-[#01503b] appearance-none cursor-pointer"
                >
                  <option value="" disabled className="text-gray-500">
                    Select a speciality...
                  </option>
                  {specialties.map((speciality: speciality) => (
                    <option
                      key={speciality.id || speciality._id}
                      value={speciality.speciality_name}
                    >
                      {speciality.speciality_name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={20}
                />
              </div>

              {selectedspeciality && (
                <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-[#01281e]">
                        {selectedspeciality.speciality_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {selectedspeciality.topics?.length || 0} topics
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          router.push(
                            `/oms/${selectedspeciality.speciality_name.toLowerCase().replace(/\s+/g, '-')}`,
                          )
                        }
                        className="p-2 text-[#01503b] hover:bg-gray-50 rounded cursor-pointer"
                        title="View on OMS page"
                      >
                        <ExternalLink size={18} />
                      </button>
                      <button
                        onClick={() => setSelectedspeciality(null)}
                        className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Banner Image
                    </label>
                    {selectedspeciality.speciality_banner_img ? (
                      <div className="relative w-full max-w-[200px] aspect-video">
                        <Image
                          src={selectedspeciality.speciality_banner_img}
                          alt="banner"
                          fill
                          className="object-cover rounded border"
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
                    {selectedspeciality.brand_img ? (
                      <div className="relative w-full max-w-[200px] aspect-video">
                        <Image
                          src={selectedspeciality.brand_img}
                          alt="brand"
                          fill
                          className="object-cover rounded border"
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
                      {selectedspeciality.topics?.map((topic, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 bg-gray-50 rounded px-3 py-2"
                        >
                          <span className="text-sm text-[#01281e]">
                            {topic.topic_name}
                          </span>
                          {topic.topic_img && (
                            <div className="relative w-8 h-8">
                              <Image
                                src={topic.topic_img}
                                alt={topic.topic_name}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                      {(!selectedspeciality.topics ||
                        selectedspeciality.topics.length === 0) && (
                        <span className="text-xs text-gray-400">No topics</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleEdit(selectedspeciality)}
                      className="px-4 py-2 border border-[#01503b] text-[#01503b] rounded-[8px] hover:bg-[#01503b]/10 transition flex items-center gap-2"
                    >
                      <Edit2 size={16} />
                      Edit speciality
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(
                          selectedspeciality.id || selectedspeciality._id!,
                        )
                      }
                      className="px-4 py-2 border border-red-600 text-red-600 rounded-[8px] hover:bg-red-50 transition flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete speciality
                    </button>
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
