'use client';

import Image from 'next/image';
import { Edit2, ExternalLink, Loader2, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

import type { Specialty } from './SpecialtyFormModal';

interface SpecialtyDetailsModalProps {
  specialty: Specialty | null;
  loading: boolean;

  onClose: () => void;
  onEdit: (specialty: Specialty) => void;
  onDelete: (id: string) => void;
}

export default function SpecialtyDetailsModal({
  specialty,
  loading,
  onClose,
  onEdit,
  onDelete,
}: SpecialtyDetailsModalProps) {
  const router = useRouter();

  if (!specialty && !loading) {
    return null;
  }

  const specialtyId = specialty?.id || specialty?._id;

  const handleEdit = () => {
    if (!specialty) return;

    onEdit(specialty);
    onClose();
  };

  const handleDelete = () => {
    if (!specialtyId) return;

    onDelete(specialtyId);
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="modal-pop bg-white w-[720px] max-w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6 space-y-5"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-[#01281e]">
              {specialty?.name || 'Speciality Details'}
            </h3>

            <p className="text-sm text-gray-500 mt-0.5">
              {loading
                ? 'Loading details...'
                : `${specialty?.topics?.length || 0} topics`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {specialty && (
              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/${specialty.name.toLowerCase().replace(/\s+/g, '-')}`,
                  )
                }
                className="p-2 text-[#01503b] hover:bg-[#01503b]/10 rounded-lg cursor-pointer transition"
                title="View on page"
              >
                <ExternalLink size={18} />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg cursor-pointer transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <Loader2 className="animate-spin text-[#01503b]" size={32} />

            <p className="text-sm text-gray-500">
              Fetching speciality details...
            </p>
          </div>
        ) : (
          specialty && (
            <>
              {/* Banner */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Banner Image
                </label>

                {specialty.speciality_banner_img ? (
                  <div className="relative w-full max-w-[420px] aspect-video rounded-xl overflow-hidden border">
                    <Image
                      src={specialty.speciality_banner_img}
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

              {/* Brand */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Brand Image
                </label>

                {specialty.brand_img ? (
                  <div className="relative w-full max-w-[220px] aspect-video rounded-xl overflow-hidden border">
                    <Image
                      src={specialty.brand_img}
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

              {/* Topics */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Topics
                </label>

                <div className="flex flex-wrap gap-2">
                  {specialty.topics?.map((topic, index) => (
                    <div
                      key={`${topic.name}-${index}`}
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

                  {(!specialty.topics || specialty.topics.length === 0) && (
                    <span className="text-xs text-gray-400">No topics</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleEdit}
                  className="px-4 py-2 border border-[#01503b] text-[#01503b] rounded-[8px] hover:bg-[#01503b]/10 transition flex items-center gap-2"
                >
                  <Edit2 size={16} />
                  Edit speciality
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
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
  );
}
