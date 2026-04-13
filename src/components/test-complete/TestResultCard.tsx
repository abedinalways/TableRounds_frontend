'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Link from 'next/link';

interface TestResultCardProps {
  questions: number;
  difficulty: string;
  topic: string;
  percent: number;
  percentile: number;
  time: string;
}

export default function TestResultCard({
  questions,
  difficulty,
  topic,
  percent,
  percentile,
  
}: TestResultCardProps) {
  const progressRef = useRef<SVGCircleElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const offset = circumference - (percent / 100) * circumference;

    gsap.to(progressRef.current, {
      strokeDashoffset: offset,
      duration: 1.2,
      ease: 'power2.out',
    });

    gsap.fromTo(
      textRef.current,
      { innerText: 0 },
      {
        innerText: percent,
        duration: 1.2,
        snap: { innerText: 1 },
      },
    );
  }, [percent]);

  return (
    <Card className="w-[320px] shadow-lg rounded-xl bg-white border">
      <CardContent className="p-4 space-y-4">
        <div className="gradient-bg text-white rounded-lg p-3">
          <p className="text-lg font-semibold">{questions} Questions</p>

          <p className="text-sm opacity-80">Difficulty: {difficulty}</p>
        </div>

        <div className="flex items-center gap-2 text-md font-semibold text-[#01281E]">
          <span className="text-green-700">◆</span>
          {topic}
        </div>

        <div className="flex justify-center">
          <div className="relative w-[150px] h-[150px]">
            <svg
              className="w-full h-full rotate-[-90deg]"
              viewBox="0 0 150 150"
            >
              <circle
                cx="75"
                cy="75"
                r={radius}
                stroke="#E5E7EB"
                strokeWidth="12"
                fill="transparent"
              />

              <circle
                ref={progressRef}
                cx="75"
                cy="75"
                r={radius}
                stroke="#0F766E"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={circumference}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-lg font-bold text-gray-500">Score</div>
              <div ref={textRef} className="text-xl font-bold text-[#01281E]">
                {percent} /100
              </div>

            </div>
          </div>
        </div>

        <div className="flex justify-center items-center text-sm text-gray-600">
          <div className='flex'>
            <p>Percentile : </p>
            <p className="font-semibold text-[#01281E]">{percentile} %</p>

          </div>

          <div>
            {/* <p className="font-semibold text-[#01281E]">{time}</p>

            <p>Time</p> */}
          </div>
        </div>

        <Link href="/dashboard/user/create-test">
          <Button className="w-full cursor-pointer bg-[#b79e6b] hover:bg-[#a68d5c] text-white">
            Take This Test
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
