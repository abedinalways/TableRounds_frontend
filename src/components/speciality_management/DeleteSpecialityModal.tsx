'use client';

import { Loader2, Trash2 } from 'lucide-react';

interface DeleteSpecialityModalProps {
  open: boolean;
  specialityName: string;
  isDeleting: boolean;

  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteSpecialityModal({
  open,
  specialityName,
  isDeleting,
  onCancel,
  onConfirm,
}: DeleteSpecialityModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-[60]  flex items-center justify-center p-4"
      onClick={isDeleting ? undefined : onCancel}
    >
      <div
        className="modal-pop bg-white w-[420px] max-w-full rounded-2xl shadow-2xl p-6 font-[manrope]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center gap-4">
          {/* Warning icon */}
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
            <Trash2 className="text-red-600" size={24} />
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-[#01281e]">
              Delete Speciality
            </h3>

            <p className="text-sm text-gray-500 leading-relaxed">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-[#01281e]">
                {specialityName}
              </span>
              ? This action cannot be undone.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 w-full pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-[8px] text-sm font-medium text-[#01281e] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 bg-red-600 cursor-pointer rounded-[8px] text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}