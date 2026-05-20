'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent } from '../ui/card';
import gsap from 'gsap';
import StatIcon from '../ui/StatIcon';

type Result = {
  difficulty_wise_stats?: DifficultyItem[];
};

interface Props {
  result: Result;
}

type DifficultyItem = {
  difficulty: string;
  total_questions: number;
  answered: number;
  correct: number;
  incorrect: number;
  percentage: number;
};

const displayDifficultyLabel = (difficulty: string): string => {
  if (difficulty === 'Board') return 'Boards';
  return difficulty;
};

export default function DifficultyTopic({ result }: Props) {
  const difficultyStats: DifficultyItem[] = result?.difficulty_wise_stats ?? [];

  const [activeDifficulty, setActiveDifficulty] = useState('');

  useEffect(() => {
    if (difficultyStats.length > 0 && !activeDifficulty) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveDifficulty(difficultyStats[0].difficulty);
    }
  }, [difficultyStats, activeDifficulty]);

  const activeData = useMemo(() => {
    return difficultyStats.find(item => item.difficulty === activeDifficulty);
  }, [difficultyStats, activeDifficulty]);

  if (!difficultyStats.length) return null;

  return (
    <Card className="w-full rounded-[12px] border border-[#e5e7eb] shadow-sm">
      <CardContent className="space-y-5 p-4 sm:p-5 lg:p-6">
        {/* Tabs */}
        <div className="flex w-full gap-2 overflow-x-auto pb-1 sm:flex-wrap">
          {difficultyStats.map(item => {
            const isActive = activeDifficulty === item.difficulty;

            return (
              <button
                key={item.difficulty}
                type="button"
                onClick={() => setActiveDifficulty(item.difficulty)}
                className={`h-[40px] min-w-[110px] flex-shrink-0 rounded-[4px] px-4 text-[13px] font-medium transition-all sm:h-[42px] sm:min-w-[120px] sm:text-[14px] ${
                  isActive
                    ? 'bg-[#006837] text-white shadow-md cursor-pointer'
                    : item.percentage === 0
                      ? 'bg-[#fff1f2] text-[#5f6b6b] cursor-pointer'
                      : 'bg-[#fafafa] text-[#5f6b6b] cursor-pointer '
                }`}
              >
                {displayDifficultyLabel(item.difficulty)}
              </button>
            );
          })}
        </div>

        {activeData && <DifficultyDetails item={activeData} />}
      </CardContent>
    </Card>
  );
}

function DifficultyDetails({ item }: { item: DifficultyItem }) {
  const barRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);

  const percentage = item?.percentage ?? 0;

  useEffect(() => {
    if (!barRef.current || !percentRef.current) return;

    gsap.fromTo(
      barRef.current,
      { width: '0%' },
      { width: `${percentage}%`, duration: 0.8, ease: 'power2.out' },
    );

    gsap.fromTo(
      percentRef.current,
      { innerText: 0 },
      {
        innerText: percentage,
        duration: 0.8,
        snap: { innerText: 1 },
      },
    );
  }, [percentage, item.difficulty]);

  return (
    <div className="w-full space-y-5 rounded-[12px] border border-[#e5e7eb] bg-white p-4 shadow-sm sm:p-5 lg:p-6">
      <div className="flex items-center gap-3 text-[16px] font-semibold text-[#01281E] sm:text-[18px]">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center">
          <StatIcon />
        </div>
        <span className="break-words">{displayDifficultyLabel(item.difficulty)}</span>
      </div>

      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <div className="h-[16px] w-full overflow-hidden rounded-[100px] bg-[#f1f5f9] sm:h-[20px]">
          <div ref={barRef} className="h-full rounded-[100px] percentage-bg" />
        </div>

        <div className="text-right text-[14px] font-medium text-black sm:min-w-[45px] sm:text-[16px]">
          <span ref={percentRef}>0</span>%
        </div>
      </div>

      <div className="space-y-3 text-[15px] sm:text-[16px] lg:text-[18px]">
        <div className="flex items-center justify-between gap-4 rounded-[8px] bg-[#ecfdf5] px-4 py-3 sm:px-6">
          <span className="text-[#334155]">Total Questions</span>
          <span className="shrink-0 font-semibold text-black">
            {item.total_questions ?? 0}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-[8px] bg-[#fafaf8] px-4 py-3 sm:px-6">
          <span className="text-[#334155]">Correct</span>
          <span className="shrink-0 font-semibold text-black">
            {item.correct ?? 0}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-[8px] bg-[#fff1f2] px-4 py-3 sm:px-6">
          <span className="text-[#334155]">Incorrect</span>
          <span className="shrink-0 font-semibold text-black">
            {item.incorrect ?? 0}
          </span>
        </div>
      </div>
    </div>
  );
}
