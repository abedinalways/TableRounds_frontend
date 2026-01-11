'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Image from 'next/image';

export interface StatisticsBaseProps {
  title: string;
  total: number;
  correct: number;
  icon: string;
}

export function StatisticsBase({
  title,
  total,
  correct,
  icon,
}: StatisticsBaseProps) {
  const percentage = Math.round((correct / total) * 100);
  const barRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!barRef.current || !percentRef.current) return;

    gsap.fromTo(
      barRef.current,
      { width: '0%' },
      { width: `${percentage}%`, duration: 1, ease: 'power2.out' }
    );

    gsap.fromTo(
      percentRef.current,
      { textContent: '0' },
      {
        textContent: `${percentage}`,
        duration: 1,
        ease: 'power2.out',
      }
    );
  }, [percentage]);

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 font-medium">
          <Image src={icon} width={28} height={28} alt="" />
          {title}
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3">
          <div className="h-[20px] w-full bg-[#f1f5f9] rounded-full">
            <div ref={barRef} className="h-full percentage-bg rounded-full" />
          </div>
          <span>
            <span ref={percentRef}>0</span>%
          </span>
        </div>

        {/* Stats */}
        <div className="space-y-3 text-[18px]">
          <StatRow label="Total Questions" value={total} bg="bg-[#ecfdf5]" />
          <StatRow label="Correct" value={correct} bg="bg-[#f9f9f5]" />
          <StatRow
            label="Incorrect"
            value={total - correct}
            bg="bg-[#fef2f2]"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function StatRow({
  label,
  value,
  bg,
}: {
  label: string;
  value: number;
  bg: string;
}) {
  return (
    <div className={`flex justify-between px-6 py-3 rounded-lg ${bg}`}>
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
