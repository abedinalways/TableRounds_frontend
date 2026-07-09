'use client';

import { useId } from 'react';
import { Card } from '@/components/ui/card';
import BagIcon from '../reusable/icons/BagIcon';
import { statisticsItems } from '@/types/profile';

interface Props {
  data: statisticsItems;
}

function formatTopicName(name: string | undefined): string {
  if (!name) return '';
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' / ');
}

export default function QuestionBankSolved({ data }: Props) {
  const {
    complete_percentage,
    correct_percentage,
    ranking,
    best_topic,
    question_bank_usage,
  } = data || {};

  const safeCorrectPercentage = Math.min(
    Math.max(Number(correct_percentage) || 0, 0),
    100,
  );

  const radius = 110;
  const size = 251;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  const offset = circumference - (safeCorrectPercentage / 100) * circumference;

  const uniqueId = useId().replace(/:/g, '');
  const gradientId = `progressGradient-${uniqueId}`;

  return (
    <Card className="p-6 rounded-2xl border border-[#4444441A] font-[manrope]">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-emerald-100 p-2 rounded-lg">
          <BagIcon />
        </div>

        <h3 className="font-bold text-[15px] md:text-[20px] text-[#01503b]">
          Question Bank Statistics
        </h3>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative w-[251px] h-[251px]">
          <svg
            viewBox={`0 0 ${size} ${size}`}
            className="w-full h-full -rotate-90"
          >
            <defs>
              <linearGradient
                id={gradientId}
                x1="0"
                y1={center}
                x2={size}
                y2={center}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#023729" />
                <stop offset="50%" stopColor="#028964" />
                <stop offset="100%" stopColor="#02ae80" />
              </linearGradient>
            </defs>

            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#D1E3DC"
              strokeWidth="24"
              fill="none"
            />

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

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm md:text-[36px] leading-[130%] font-bold text-[#01503b]">
              {safeCorrectPercentage}%
            </span>

            <span className="text-sm md:text-[20px] text-[#01281e]">
              Correct
            </span>
          </div>
        </div>

        <div className="flex-1 w-full space-y-3">
          <StatRow label="Ranking" value={ranking} />
          <StatRow label="Complete" value={`${question_bank_usage || 0}%`} />
          <StatRow
            label="Best Topic"
            value={formatTopicName(best_topic?.name)}
          />
        </div>
      </div>
    </Card>
  );
}

function StatRow({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined;
}) {
  return (
    <div className="flex justify-between items-center bg-[#ecfdf5] px-4 py-3 rounded-lg">
      <span className="text-sm md:text-[16px] text-[#01281e] font-medium">
        {label}
      </span>

      <span className="text-md text-[#01503b] font-medium">{value || '-'}</span>
    </div>
  );
}
