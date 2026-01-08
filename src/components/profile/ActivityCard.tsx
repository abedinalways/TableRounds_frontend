'use client';

import { Card } from '@/components/ui/card';
import { ProfileData } from '@/types/profile';
import { Trophy } from 'lucide-react';
import BagIcon from '../reusable/icons/BagIcon';

interface Props {
  data: ProfileData['questionBank'];
}

export default function QuestionBankSolved({ data }: Props) {
  const { completion, ranking, correctRate, bestTopic } = data;

  const radius = 110;
  const size = 251;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (completion / 100) * circumference;

  // ✅ unique gradient id (important if component renders multiple times)
  const gradientId = `progressGradient-${completion}`;

  return (
    <Card className="p-6 rounded-2xl border border-[#4444441A] font-[manrope]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-emerald-100 p-2 rounded-lg">
          <BagIcon />
        </div>
        <h3 className="font-bold text-[15px] md:text-[20px] text-[#01503b]">
          Question Bank Statistics
        </h3>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Circular Progress */}
        <div className="relative w-[251px] h-[251px]">
          <svg
            viewBox={`0 0 ${size} ${size}`}
            className="w-full h-full -rotate-90"
          >
            <defs>
              <linearGradient
                id={gradientId}
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="0"
                x2={size}
                y2={size}
                gradientTransform={`rotate(160 ${center} ${center})`}
              >
                <stop offset="0%" stopColor="#023729" />
                <stop offset="100%" stopColor="#02ae80" />
              </linearGradient>
            </defs>

            {/* Background Circle */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#D1E3DC"
              strokeWidth="24"
              fill="none"
            />

            {/* Gradient Progress Circle */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke={`url(#${gradientId})`}
              strokeWidth="24"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[32px] md:text-[48px] leading-[130%] font-bold text-[#01503b]">
              {completion}%
            </span>
            <span className="text-sm md:text-[20px]  text-[#01281e]">
              Complete
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 w-full space-y-3">
          <StatRow label="Ranking" value={ranking} />
          <StatRow label="Correct" value={`${correctRate}%`} />
          <StatRow label="Best Topic" value={bestTopic} />
        </div>
      </div>
    </Card>
  );
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center bg-[#ecfdf5] px-4 py-3 rounded-lg">
      <span className="text-sm md:text-[16px] text-[#01281e] font-[500px]">
        {label}
      </span>
      <span className="text-md md:text-[20px] text-[#01503b] font-[500px]">
        {value}
      </span>
    </div>
  );
}
