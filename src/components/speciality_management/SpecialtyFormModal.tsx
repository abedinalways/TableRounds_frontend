'use client';

import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Loader2, Plus, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

import ImageUpload from '@/components/reusable/ImageUpload';
import { getApiErrorMessage } from '@/utils/apiError';


export interface TopicInput {
  name: string;
  topic_img: string;
}

export interface SpecialtyFormValues {
  name: string;
  speciality_banner_img: string;
  brand_img?: string;
  topics: TopicInput[];
}

export interface Specialty {
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

interface SpecialtyFormModalProps {
  open: boolean;
  editingSpecialty: Specialty | null;
  isCreating: boolean;
  isUpdating: boolean;

  onClose: () => void;

  onCreate: (data: {
    name: string;
    speciality_banner_img?: string | File;
    brand_img?: string | File;
    topics: {
      name: string;
      topic_img?: string | File;
    }[];
  }) => Promise<void>;

  onUpdate: (
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
  ) => Promise<void>;
}

const EMPTY_TOPIC: TopicInput = {
  name: '',
  topic_img: '',
};

const DEFAULT_VALUES: SpecialtyFormValues = {
  name: '',
  speciality_banner_img: '',
  brand_img: '',
  topics: [EMPTY_TOPIC],
};

export default function SpecialtyFormModal({
  open,
  editingSpecialty,
  isCreating,
  isUpdating,
  onClose,
  onCreate,
  onUpdate,
}: SpecialtyFormModalProps) {
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [brandFile, setBrandFile] = useState<File | null>(null);
  const [topicFiles, setTopicFiles] = useState<(File | null)[]>([]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SpecialtyFormValues>({
    defaultValues: DEFAULT_VALUES,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'topics',
  });

  const watchedBanner = watch('speciality_banner_img');
  const watchedBrand = watch('brand_img');
  const watchedTopics = watch('topics');

  const isSubmitting = isCreating || isUpdating;
  const isEditMode = Boolean(editingSpecialty);

  useEffect(() => {
    if (!open) return;

    if (editingSpecialty) {
      const topics =
        editingSpecialty.topics && editingSpecialty.topics.length > 0
          ? editingSpecialty.topics
          : [EMPTY_TOPIC];

      reset({
        name: editingSpecialty.name,
        speciality_banner_img: editingSpecialty.speciality_banner_img || '',
        brand_img: editingSpecialty.brand_img || '',
        topics,
      });
    } else {
      reset(DEFAULT_VALUES);
    }

    setBannerFile(null);
    setBrandFile(null);
    setTopicFiles([]);
  }, [open, editingSpecialty, reset]);

  const handleModalClose = () => {
    reset(DEFAULT_VALUES);
    setBannerFile(null);
    setBrandFile(null);
    setTopicFiles([]);
    onClose();
  };

  const handleAddTopic = () => {
    append(EMPTY_TOPIC);
    setTopicFiles(prev => [...prev, null]);
  };

  const handleRemoveTopic = (index: number) => {
    remove(index);

    setTopicFiles(prev => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  };

  const handleTopicFileChange = (index: number, file: File | null) => {
    setTopicFiles(prev => {
      const next = [...prev];
      next[index] = file;
      return next;
    });
  };

  const buildTopics = (topics: TopicInput[]) => {
    return topics.map((topic, index) => ({
      name: topic.name,
      topic_img: (topicFiles[index] ?? topic.topic_img) || undefined,
    }));
  };

  const onSubmit = async (data: SpecialtyFormValues) => {
    // Create validation
    if (!isEditMode) {
      if (!bannerFile && !data.speciality_banner_img) {
        toast.error('Speciality image is required');
        return;
      }

      const missingTopicIndex = data.topics.findIndex(
        (topic, index) => !topicFiles[index] && !topic.topic_img,
      );

      if (missingTopicIndex !== -1) {
        const topicName = data.topics[missingTopicIndex]?.name?.trim();

        toast.error(
          `Image for topic "${
            topicName || `Topic ${missingTopicIndex + 1}`
          }" is required`,
        );

        return;
      }
    }

    try {
      const topics = buildTopics(data.topics);

      if (editingSpecialty) {
        const specialtyId = editingSpecialty.id || editingSpecialty._id;

        if (!specialtyId) {
          toast.error('Speciality ID is missing');
          return;
        }

        await onUpdate(specialtyId, {
          name: data.name,
          speciality_banner_img:
            (bannerFile ?? data.speciality_banner_img) || undefined,
          brand_img: (brandFile ?? data.brand_img) || undefined,
          topics,
        });

        toast.success('Speciality updated successfully');
      } else {
        await onCreate({
          name: data.name,
          speciality_banner_img:
            (bannerFile ?? data.speciality_banner_img) || undefined,
          brand_img: (brandFile ?? data.brand_img) || undefined,
          topics,
        });

        toast.success('Speciality created successfully');
      }

      handleModalClose();
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(
          error,
          isEditMode
            ? 'Failed to update speciality'
            : 'Failed to create speciality',
        ),
      );
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto py-8">
      <div className="bg-white p-6 rounded-lg w-[700px] max-h-[90vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#01281e]">
            {isEditMode ? 'Edit speciality' : 'Create New speciality'}
          </h2>

          <button
            type="button"
            onClick={handleModalClose}
            className="p-1 rounded hover:bg-gray-300 transition cursor-pointer text-[#01281e]"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Speciality Name <span className="text-red-500">*</span>
              </label>

              <input
                {...register('name', {
                  required: 'Speciality name is required',
                })}
                placeholder="e.g. OMS, Dentistry"
                className="w-full border border-gray-300 rounded-[8px] p-2 focus:outline-none focus:ring-2 focus:ring-[#01503b]"
              />

              {errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Banner */}
            <div>
              <ImageUpload
                value={watchedBanner}
                onChange={url =>
                  setValue('speciality_banner_img', url, {
                    shouldDirty: true,
                  })
                }
                onFileChange={setBannerFile}
                label="Banner Image"
                description="Drag & drop or click to upload banner"
              />
            </div>

            {/* Brand */}
            <div className="md:col-span-2">
              <ImageUpload
                value={watchedBrand}
                onChange={url =>
                  setValue('brand_img', url, {
                    shouldDirty: true,
                  })
                }
                onFileChange={setBrandFile}
                label="Brand Image"
                description="Drag & drop or click to upload brand logo"
              />
            </div>
          </div>

          {/* Topics */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Topics / Categories <span className="text-red-500">*</span>
              </label>

              <button
                type="button"
                onClick={handleAddTopic}
                className="text-sm text-[#01503b] hover:text-[#01281e] flex items-center gap-1"
              >
                <Plus size={16} />
                Add Topic
              </button>
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-start">
                  <div className="flex-1 space-y-2">
                    <input
                      {...register(`topics.${index}.name`, {
                        required: 'Topic name is required',
                      })}
                      placeholder="Topic Name (e.g. Cancer)"
                      className="w-full border border-gray-300 rounded-[8px] p-2 focus:outline-none focus:ring-2 focus:ring-[#01503b]"
                    />

                    {errors.topics?.[index]?.name && (
                      <p className="text-xs text-red-500">
                        {errors.topics[index]?.name?.message}
                      </p>
                    )}

                    <ImageUpload
                      value={watchedTopics[index]?.topic_img}
                      onChange={url =>
                        setValue(`topics.${index}.topic_img`, url, {
                          shouldDirty: true,
                        })
                      }
                      onFileChange={file => handleTopicFileChange(index, file)}
                      label={`Topic ${index + 1} Image`}
                      description="Drag & drop or click to upload topic image"
                      className="max-w-[300px]"
                    />
                  </div>

                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTopic(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded mt-1"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleModalClose}
              className="px-4 py-2 border rounded text-[#01281e] hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#01503b] text-white px-6 py-2 rounded-[8px] hover:bg-[#01281e] transition flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  {isEditMode ? 'Updating...' : 'Saving...'}
                </>
              ) : isEditMode ? (
                'Update speciality'
              ) : (
                'Save speciality'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
