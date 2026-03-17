'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '../ui/card';
import gsap from 'gsap';
import StatIcon from '../ui/StatIcon';

type Topic = 'Intern' | 'Senior' | 'Boards';

interface Props {
  result: any;
}

export default function DifficultyTopic({ result }: Props) {
  const [activeTopic] = useState<Topic>(result?.difficulty);

  const difficultyData = {
    Intern: result?.difficulty === 'Intern' ? result : null,
    Senior: result?.difficulty === 'Senior' ? result : null,
    Boards: result?.difficulty === 'Boards' ? result : null,
  };

  const current = difficultyData[activeTopic];

  const percentage = current?.score ?? 0;

  const barRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!barRef.current || !percentRef.current) return;

    gsap.fromTo(
      barRef.current,
      { width: '0%' },
      { width: `${percentage}%`, duration: 1, ease: 'power2.out' },
    );

    gsap.fromTo(
      percentRef.current,
      { innerText: 0 },
      {
        innerText: percentage,
        duration: 1,
        snap: { innerText: 1 },
      },
    );
  }, [percentage]);

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        {/* Difficulty Label */}
        <div className="flex items-center gap-2 text-[#01281E] font-semibold text-[18px]">
          <div className="w-6 h-6 flex items-center justify-center">
            <StatIcon />
          </div>
          {activeTopic}
        </div>

        {/* Progress Bar */}
        <div className="flex justify-between gap-[12px] items-center">
          <div className="h-[20px] w-full bg-[#f1f5f9] rounded-[100px]">
            <div
              ref={barRef}
              className="h-full percentage-bg rounded-[100px]"
            />
          </div>

          <div className="font-semibold">
            <span ref={percentRef}>0</span>%
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3 text-[18px]">
          <div className="flex items-center justify-between bg-[#ecfdf5] px-[24px] py-[12px] rounded-[8px]">
            <span className="text-gray-600">Total Questions</span>
            <span className="font-semibold text-green-700">
              {current?.total_questions ?? 0}
            </span>
          </div>

          <div className="flex items-center justify-between bg-[#f9f9f5] px-[24px] py-[12px] rounded-[8px]">
            <span className="text-gray-600">Correct</span>
            <span className="font-semibold text-green-600">
              {current?.total_correct ?? 0}
            </span>
          </div>

          <div className="flex items-center justify-between bg-[#fef2f2] px-[24px] py-[12px] rounded-[8px]">
            <span className="text-gray-600">Incorrect</span>
            <span className="font-semibold text-red-600">
              {current?.total_incorrect ?? 0}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
