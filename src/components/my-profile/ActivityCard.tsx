'use client';

import { Card } from '@/components/ui/card';
import BagIcon from '../reusable/icons/BagIcon';
import { statisticsItems } from '@/types/myProfile';

interface Props {
  data: statisticsItems;
}

const formatTopicName = (value?: string) => {
  if (!value) return 'N/A';

  return value.replace(/_/g, ' / ');
};

export default function QuestionBankSolved({ data }: Props) {
  const {
    complete_percentage = 0,
    correct_percentage = 0,
    ranking = 0,
    best_topic,
    question_bank_usage,
  } = data || {};

  const radius = 100;
  const size = 251;
  const center = size / 2;
  const strokeWidth = 24;

  const safeCorrectPercentage = Math.min(
    100,
    Math.max(0, Number(correct_percentage) || 0),
  );

  const safeCompletePercentage = Math.min(
    100,
    Math.max(0, Number(complete_percentage) || 0),
  );

  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safeCorrectPercentage / 100) * circumference;

  const gradientId = 'questionBankProgressGradient';

  return (
    <Card className="rounded-2xl border border-[#4444441A] p-4 font-[manrope] sm:p-5 lg:p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-emerald-100 p-2">
          <BagIcon />
        </div>

        <h3 className="text-[15px] font-bold text-[#01503b] md:text-[20px]">
          Question Bank Statistics
        </h3>
      </div>

      <div className="flex flex-col items-center gap-6 xl:flex-row">
        <div className="relative h-[210px] w-[210px] shrink-0 sm:h-[251px] sm:w-[251px]">
          <svg
            viewBox={`0 0 ${size} ${size}`}
            className="h-full w-full -rotate-90"
          >
            <defs>
              <linearGradient
                id={gradientId}
                gradientUnits="userSpaceOnUse"
                x1={center}
                y1="0"
                x2={center}
                y2={size}
              >
                <stop offset="0%" stopColor="#065f46" />
                <stop offset="50%" stopColor="#059669" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#D1E3DC"
              strokeWidth={strokeWidth}
              fill="none"
            />

            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke={`url(#${gradientId})`}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[28px] font-bold leading-[130%] text-[#01503b] sm:text-[40px]">
              {safeCorrectPercentage}%
            </span>

            <span className="text-sm text-[#01281e] sm:text-[20px]">
              Correct
            </span>
          </div>
        </div>

        <div className="w-full flex-1 space-y-3">
          <StatRow label="Ranking" value={ranking} />
          <StatRow label="Complete" value={`${question_bank_usage}%`} />
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
    <div className="flex items-center justify-between gap-4 rounded-lg bg-[#ecfdf5] px-4 py-3">
      <span className="text-sm font-medium text-[#01281e] md:text-[16px]">
        {label}
      </span>

      <span className="text-right text-sm font-medium text-[#01503b]">
        {value ?? 'N/A'}
      </span>
    </div>
  );
}
