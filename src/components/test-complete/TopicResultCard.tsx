'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import GraphIcon from '../reusable/icons/GraphIcon';
import Image from 'next/image';

interface TopicResultCardProps {
  title: string;
  total: number;
  correct: number;
  icon: string;
}

export function TopicResultCard({
  title,
  total,
  correct,
  icon
}: TopicResultCardProps) {
  const percentage = Math.round((correct / total) * 100);
  const barRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    gsap.fromTo(
      barRef.current,
      { width: '0%' },
      { width: `${percentage}%`, duration: 1, ease: 'power2.out' }
    );

    gsap.fromTo(
      percentRef.current,
      { innerText: 0 },
      {
        innerText: percentage,
        duration: 1,
        snap: { innerText: 1 },
      }
    );
  }, [percentage]);

  return (
    <>
      <Card>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm font-medium">
            <span className="flex items-center gap-2">
              <span>
              <Image src={icon} width={28} height={28} alt=''/>
              </span>{' '}
              {title}{' '}
            </span>
          </div>

          <div className="flex justify-between gap-[12px]">
            <div className="h-[20px] w-full bg-[#f1f5f9] rounded-[100px] ">
              <div
                ref={barRef}
                className="h-full percentage-bg md:w-[353px] md:h-[20px] rounded-[100px]"
              />
            </div>
            <div>
              <span ref={percentRef}>0</span>%
            </div>
          </div>

          <div className="space-y-3 text-[20px] flex-1 items-center ">
            <div className="flex items-center justify-between bg-[#ecfdf5] px-[24px] py-[12px] rounded-[8px]">
              <span className="text-gray-600">Total Question</span>
              <span className="font-semibold text-green-700">{total}</span>
            </div>
            <div className="flex items-center justify-between  bg-[#f9f9f5] px-[24px] py-[12px] rounded-[8px]">
              <span className="text-gray-600">Correct</span>
              <span className="font-semibold text-red-600">{correct}</span>
            </div>
            <div className="flex items-center justify-between bg-[#fef2f2] px-[24px] py-[12px] rounded-[8px]">
              <span className="text-gray-600">Incorrect</span>
              <span className="font-semibold text-gray-700">
                {total - correct}
              </span>
            </div>
          </div>
          {/*  */}
        </CardContent>
      </Card>
    </>
  );
}
