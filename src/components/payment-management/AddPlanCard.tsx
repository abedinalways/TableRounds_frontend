'use client';

import React from 'react';
import { Plus } from 'lucide-react';

interface AddPlanCardProps {
  onOpenCreate: () => void;
}

export default function AddPlanCard({ onOpenCreate }: AddPlanCardProps) {
  return (
    <div className="flex flex-col justify-between bg-[#f4f9f1] border-2 border-dashed border-[#dcebd4] rounded-2xl p-6 min-h-[450px] w-full max-w-[340px] text-center font-[manrope]">
      <p className="text-sm font-semibold text-gray-700 mt-3">
        Add New Plan Here
      </p>

      <div className="flex justify-center items-center">
        <button
          onClick={onOpenCreate}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-[#cbdcc3] hover:bg-[#b9d0b0] text-[#56634d] transition-all cursor-pointer"
        >
          <Plus className="w-7 h-7" strokeWidth={2.5} />
        </button>
      </div>

      <button
        onClick={onOpenCreate}
        className="w-full gradient-bg hover:bg-[#000000] text-white text-sm font-medium py-3 rounded-lg transition-colors cursor-pointer"
      >
        Select
      </button>
    </div>
  );
}
