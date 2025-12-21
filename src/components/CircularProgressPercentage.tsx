'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface CircularProgressProps {
  value: number;
  renderLabel?: (progress: number) => number | string;
  size?: number;
  strokeWidth?: number;
  circleStrokeWidth?: number;
  progressStrokeWidth?: number;
  shape?: 'square' | 'round';
  className?: string;
  progressClassName?: string;
  labelClassName?: string;
  showLabel?: boolean;
}

export const CircularProgressPercentage = ({
  value,
  renderLabel,
  className,
  progressClassName,
  labelClassName,
  showLabel = false,
  shape = 'round',
  size = 48,
  strokeWidth,
  circleStrokeWidth = 3,
  progressStrokeWidth = 3,
}: CircularProgressProps) => {
  const radius = size / 2 - Math.max(circleStrokeWidth, progressStrokeWidth);
  const circumference = 2 * Math.PI * radius;

  const dashOffset = circumference - (value / 100) * circumference;

  const viewBox = `0 0 ${size} ${size}`;

  return (
    <div className="relative flex items-center justify-start ">
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
        className="block"
      >
        {/* Base Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          strokeWidth={strokeWidth ?? circleStrokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={0}
          className={cn('stroke-primary/25', className)}
        />

        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          strokeWidth={strokeWidth ?? progressStrokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap={shape}
          className={cn('stroke-primary', progressClassName)}
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
          }}
        />
      </svg>

      {showLabel && (
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-start font-normal text-xs ml-3 leading-none',
            labelClassName
          )}
        >
          {renderLabel ? renderLabel(value) : `${value}%`}
        </div>
      )}
    </div>
  );
};
