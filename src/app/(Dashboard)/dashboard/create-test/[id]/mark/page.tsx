'use client';

import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import Flag from '@/components/reusable/icons/Flag';
import Btn from '@/components/reusable/button/Btn';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MarkPage() {
  const router = useRouter();
  const [markedQuestions, setMarkedQuestions] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('markedQuestions');
    if (saved) setMarkedQuestions(JSON.parse(saved));
  }, []);

  return (
    <div className="min-h-screen background p-4 font-[manrope]">
      {/* TOP BAR */}
      <div className="flex items-center justify-between rounded-[12px] border question-bg p-4 mb-4">
        <div className="flex items-center gap-3 text-white">
          <Flag className="size-6 text-yellow-400" />
          <h2 className="text-lg md:text-xl font-bold">
            Marked Questions ({markedQuestions.length})
          </h2>
        </div>

        <Btn
          onClick={() => router.back()}
          className="bg-[#b79e6b] text-white px-4 py-2"
        >
          <ArrowLeft size={16} /> Back to Test
        </Btn>
      </div>

      {/* PROGRESS */}
      <div className="mb-4">
        <Progress
          value={(markedQuestions.length / 100) * 100}
          className="h-2 bg-white/60"
        />
      </div>

      {/* MARKED LIST */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 max-h-[70vh] overflow-y-auto custom-scroll p-2">
        {markedQuestions.length === 0 ? (
          <div className="col-span-full text-center text-gray-300 mt-20">
            <Flag className="mx-auto mb-2 opacity-40" />
            No marked questions yet
          </div>
        ) : (
          markedQuestions.map(q => (
            <button
              key={q}
              onClick={() => router.push(`/dashboard/create-test/${q}`)}
              className={cn(
                'flex items-center justify-between p-4 rounded-xl border',
                'bg-[#01281e] border-[#084434] text-white',
                'hover:bg-[#014030] transition-all'
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#b79e6b] flex items-center justify-center font-bold">
                  {q}
                </div>
                <span className="text-sm md:text-base">Question {q}</span>
              </div>

              <Flag className="size-5 text-yellow-400" />
            </button>
          ))
        )}
      </div>
    </div>
  );
}
