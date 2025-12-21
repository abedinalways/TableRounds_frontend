'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export function VerticalProgress({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative h-full w-3 bg-white/60 overflow-hidden rounded-full ',
        className
      )}
    >
      <div
        className="absolute top-0 w-full bg-[#b79e6b]  transition-all duration-300"
        style={{ height: `${value}%` }}
      />
    </div>
  );
}
