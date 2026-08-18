'use client';

import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  useAllSpecialties,
  useSpecialtyMutations,
} from '@/hooks/useSpecialtyData';
import { Loader2, Plus, Trash2, Edit2, X, ChevronDown, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface TopicInput {
  topic_name: string;
  topic_img: string;
}

interface SpecialtyForm {
  specialty_name: string;
  specialty_banner_img: string;
  brand_img?: string;
  topics: TopicInput[];
}

interface Specialty {
  id?: string;
  _id?: string;
  specialty_name: string;
  specialty_banner_img: string;
  brand_img?: string;
  topics?: TopicInput[];
}

export default function SpecialtiesAdminPage() {
  const { data: specialtiesData, isLoading, refetch } = useAllSpecialties();
  const { createSpecialty, updateSpecialty, deleteSpecialty } = useSpecialtyMutations();
  const [createSpecialtyMut, createMeta] = createSpecialty;
  const [updateSpecialtyMut, updateMeta] = updateSpecialty;
  const [deleteSpecialtyMut] = deleteSpecialty;

  const isCreating = createMeta.isLoading;
  const isUpdating = updateMeta.isLoading;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const router = useRouter();

  const { register, control, handleSubmit, reset } = useForm<SpecialtyForm>({
    defaultValues: {
      specialty_name: '',
      specialty_banner_img: '',
      brand_img: '',
      topics: [{ topic_name: '', topic_img: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'topics',
  });

  useEffect(() => {
    if (editingSpecialty) {
      const existingTopics = editingSpecialty.topics && editingSpecialty.topics.length > 0
        ? editingSpecialty.topics
        : [{ topic_name: '', topic_img: '' }];
      reset({
        specialty_name: editingSpecialty.specialty_name,
        specialty_banner_img: editingSpecialty.specialty_banner_img,
        brand_img: editingSpecialty.brand_img || '',
        topics: existingTopics,
      });
    }
  }, [editingSpecialty, reset]);

  const onSubmit = async (data: SpecialtyForm) => {
    if (editingSpecialty) {
      try {
        await updateSpecialtyMut({
          id: editingSpecialty.id || editingSpecialty._id,
          ...data,
        }).unwrap();
        toast.success('Specialty updated successfully!');
        setEditingSpecialty(null);
        setIsFormOpen(false);
        reset();
        refetch();
      } catch {
        toast.error('Failed to update specialty');
      }
    } else {
      try {
        await createSpecialtyMut(data).unwrap();
        toast.success('Specialty created successfully!');
        setIsFormOpen(false);
        reset();
        refetch();
      } catch {
        toast.error('Failed to create specialty');
      }
    }
  };

  const handleDelete = async (id: string) => {
    toast.custom(
      (t) => (
        <div className="bg-white shadow-lg rounded-lg p-4 w-[350px] space-y-4 font-[manrope]">
          <p className="text-sm font-medium text-[#01281e]">
            Are you sure you want to delete this specialty?
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
                  await deleteSpecialtyMut(id).unwrap();
                  toast.success('Specialty deleted successfully');
                  refetch();
                } catch {
                  toast.error('Failed to delete specialty');
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

  const handleEdit = (specialty: Specialty) => {
    setEditingSpecialty(specialty);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingSpecialty(null);
    reset();
  };

  const specialties = specialtiesData?.data || [];

  return (
    <div className="p-6 font-[manrope]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[#01281e] text-2xl font-bold">Specialties Management</h1>
        <button
          onClick={() => !editingSpecialty && setIsFormOpen(!isFormOpen)}
          className="bg-[#01503b] text-white px-4 py-2 rounded-[8px] flex items-center gap-2 hover:bg-[#01281e] transition"
        >
          {isFormOpen && !editingSpecialty ? (
            <X size={18} />
          ) : (
            <Plus size={18} />
          )}
          <span>{isFormOpen && !editingSpecialty ? 'Close' : 'Add New Specialty'}</span>
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto py-8">
          <div className="bg-white p-6 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#01281e]">
                {editingSpecialty ? 'Edit Specialty' : 'Create New Specialty'}
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
                    Specialty Name
                  </label>
                  <input
                    {...register('specialty_name', { required: true })}
                    placeholder="e.g. OMS, Dentistry"
                    className="w-full border border-gray-300 rounded-[8px] p-2 focus:outline-none focus:ring-2 focus:ring-[#01503b]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Banner Image URL
                  </label>
                  <input
                    {...register('specialty_banner_img', { required: true })}
                    placeholder="https://..."
                    className="w-full border border-gray-300 rounded-[8px] p-2 focus:outline-none focus:ring-2 focus:ring-[#01503b]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand Image URL
                  </label>
                  <input
                    {...register('brand_img')}
                    placeholder="https://... or /images/..."
                    className="w-full border border-gray-300 rounded-[8px] p-2 focus:outline-none focus:ring-2 focus:ring-[#01503b]"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Topics / Categories
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
                      <div className="flex-1">
                        <input
                          {...register(`topics.${index}.topic_name`, { required: true })}
                          placeholder="Topic Name (e.g. Cancer)"
                          className="w-full border border-gray-300 rounded-[8px] p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-[#01503b]"
                        />
                        <input
                          {...register(`topics.${index}.topic_img`, { required: true })}
                          placeholder="Topic Image URL"
                          className="w-full border border-gray-300 rounded-[8px] p-2 focus:outline-none focus:ring-2 focus:ring-[#01503b]"
                        />
                      </div>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
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
                  {(isCreating || isUpdating) ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : editingSpecialty ? 'Update Specialty' : 'Save Specialty'}
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
                  value={selectedSpecialty ? selectedSpecialty.specialty_name : ''}
                  onChange={(e) => {
                    const found = specialties.find(
                      (s: Specialty) => s.specialty_name === e.target.value
                    );
                    setSelectedSpecialty(found || null);
                  }}
                  className="w-full border border-gray-300 rounded-[8px] p-3 pr-10 text-[#01281e] focus:outline-none focus:ring-2 focus:ring-[#01503b] appearance-none cursor-pointer"
                >
                  <option value="" disabled className="text-gray-500">
                    Select a specialty...
                  </option>
                  {specialties.map((specialty: Specialty) => (
                    <option key={specialty.id || specialty._id} value={specialty.specialty_name}>
                      {specialty.specialty_name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>

              {selectedSpecialty && (
                <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-[#01281e]">
                        {selectedSpecialty.specialty_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {selectedSpecialty.topics?.length || 0} topics
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => router.push(`/oms/${selectedSpecialty.specialty_name.toLowerCase().replace(/\s+/g, '-')}`)}
                        className="p-2 text-[#01503b] hover:bg-gray-50 rounded cursor-pointer"
                        title="View on OMS page"
                      >
                        <ExternalLink size={18} />
                      </button>
                      <button
                        onClick={() => setSelectedSpecialty(null)}
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
                  {selectedSpecialty.specialty_banner_img && (
                    <img
                      src={selectedSpecialty.specialty_banner_img}
                      alt="banner"
                      className="h-16 w-40 object-cover rounded border"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Brand Image
                  </label>
                  {selectedSpecialty.brand_img && (
                    <img
                      src={selectedSpecialty.brand_img}
                      alt="brand"
                      className="h-16 w-40 object-cover rounded border"
                    />
                  )}
                  {(!selectedSpecialty.brand_img) && (
                    <span className="text-xs text-gray-400">No brand image set</span>
                  )}
                </div>


                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Topics
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedSpecialty.topics?.map((topic, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 bg-gray-50 rounded px-3 py-2"
                        >
                          <span className="text-sm text-[#01281e]">{topic.topic_name}</span>
                          {topic.topic_img && (
                            <img
                              src={topic.topic_img}
                              alt={topic.topic_name}
                              className="h-6 w-6 object-cover rounded"
                            />
                          )}
                        </div>
                      ))}
                      {(!selectedSpecialty.topics || selectedSpecialty.topics.length === 0) && (
                        <span className="text-xs text-gray-400">No topics</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleEdit(selectedSpecialty)}
                      className="px-4 py-2 border border-[#01503b] text-[#01503b] rounded-[8px] hover:bg-[#01503b]/10 transition flex items-center gap-2"
                    >
                      <Edit2 size={16} />
                      Edit Specialty
                    </button>
                    <button
                      onClick={() => handleDelete(selectedSpecialty.id || selectedSpecialty._id!)}
                      className="px-4 py-2 border border-red-600 text-red-600 rounded-[8px] hover:bg-red-50 transition flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete Specialty
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
