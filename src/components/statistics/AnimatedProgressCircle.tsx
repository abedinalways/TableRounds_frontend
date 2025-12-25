'use client'
import React, { useEffect, useState } from 'react';


export type PerformanceData = {
  categories: string[];
  performance: {
    correctPercent: number;
    totalCorrect: number;
    totalIncorrect: number;
    totalOmitted: number;
  };
  questionBank: {
    usedPercent: number;
    used: number;
    unused: number;
    total: number;
  };
};

function AnimatedProgressCircle({
  value,
  color = 'green',
  size = 251,
}: {
  value: number;
  color?: 'green' | 'brown';
  size?: number;
}) {
  const strokeWidth = size * 0.08; // 8% of size
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const progressOffset = circumference - (value / 100) * circumference;
    const t = setTimeout(() => setOffset(progressOffset), 100);
    return () => clearTimeout(t);
  }, [value, circumference]);

  const gradientId = color === 'green' ? 'gradGreen' : 'gradBrown';
  const center = size / 2;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="gradGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#023729" />
            <stop offset="100%" stopColor="#02ae80" />
          </linearGradient>
          <linearGradient id="gradBrown" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B6F47" />
            <stop offset="100%" stopColor="#C4A574" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="font-bold">
            {color === 'green' ? (
              <h2 className="font-semibold text-[48px] text-[#01503b]">
                {value}%
              </h2>
            ) : (
              <h2 className="font-semibold text-[48px] text-[#b79e6b]">
                {value}%
              </h2>
            )}
          </div>
          <div className=" ">
            {color === 'green' ? (
              <h2 className="font-semibold text-[20px] text-[#01281e]">
                Correct
              </h2>
            ) : (
              <h2 className="font-semibold text-[20px] text-[#01281e]">Used</h2>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default AnimatedProgressCircle;