'use client';

import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';

import Flag from '@/components/reusable/icons/Flag';
import Btn from '@/components/reusable/button/Btn';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MarkedQuestion } from '@/types/markedQuestion';

export default function MarkPage() {
  const router = useRouter();
  const [markedQuestions, setMarkedQuestions] = useState<MarkedQuestion[]>([]);
  
 
  useEffect(() => {
    const loadMarks = () => {
      const saved = localStorage.getItem('MARKED_QUESTIONS');
      if (!saved) return;

      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setMarkedQuestions(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    };

    loadMarks();
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

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[70vh]">
        {/* SIDEBAR */}
        <aside className="md:col-span-3 bg-[#01281e] rounded-xl p-3 overflow-y-auto custom-scroll">
          {markedQuestions.length === 0 ? (
            <div className="text-gray-400 text-center mt-4">No marks yet</div>
          ) : (
            markedQuestions.map(item => (
              <button
                key={item.index}
                onClick={() => {
                  document
                    .getElementById(`marked-${item.index}`)
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full flex items-center justify-between p-3 mb-2 rounded-md border
                   bg-[#01281e] border-[#084434] text-white hover:bg-[#014030]"
              >
                <span>Question {item.index}</span>
                <Flag className="size-4 text-yellow-400" />
              </button>
            ))
          )}
        </aside>

        {/* MAIN CONTENT QUESTIONS */}
        <main className="md:col-span-9 overflow-y-auto custom-scroll space-y-4 pr-2">
          {markedQuestions.length === 0 ? (
            <div className="text-center text-gray-300 mt-20">
              <Flag className="mx-auto mb-2 opacity-40" />
              No marked questions yet
            </div>
          ) : (
            markedQuestions.map(item => (
              <div
                key={item.index}
                id={`marked-${item.index}`}
                className="p-5 rounded-xl border bg-[#01281e] border-[#084434] text-white"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#b79e6b] flex items-center justify-center font-bold">
                    {item.index}
                  </div>
                  <h3 className="font-semibold">Question {item.index}</h3>
                </div>

                <p className="text-sm text-gray-200">{item.question}</p>
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
}
