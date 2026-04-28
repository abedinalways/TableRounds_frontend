'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface AnswerFeedbackProps {
  isVisible: boolean;
  isCorrect: boolean;
  correctAnswerLabel?: string; 
  userPercentage?: number;
}

export function AnswerFeedback({
  isVisible,
  isCorrect,
  correctAnswerLabel,
  userPercentage = 68,
}: AnswerFeedbackProps) {
  const [mounted, setMounted] = useState(false);

  // Re-trigger animation every time isVisible flips to true
  useEffect(() => {
    if (isVisible) {
      setMounted(false);
      const t = setTimeout(() => setMounted(true), 10);
      return () => clearTimeout(t);
    }
  }, [isVisible]);

  if (!isVisible || !mounted) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-[14px] p-[18px_20px] mt-6',
        'border-l-4',
        isCorrect
          ? 'bg-green-50 border-l-green-600 border-t border-r border-b border-green-200'
          : 'bg-red-50 border-l-red-600 border-t border-r border-b border-red-200',
        'animate-slide-up',
        !isCorrect && 'animate-shake',
      )}
    >
      {/* Icon circle */}
      <div
        className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center shrink-0',
          'animate-icon-pop',
          isCorrect ? 'bg-green-600' : 'bg-red-600',
        )}
      >
        {isCorrect ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>

      {/* Text + bar */}
      <div className="flex-1">
        <p
          className={cn(
            'text-[16px] font-semibold m-0 mb-0.5',
            isCorrect ? 'text-green-700' : 'text-red-700',
          )}
        >
          {isCorrect ? 'Correct!' : 'Wrong answer'}
        </p>
        <p
          className={cn(
            'text-[13px] m-0 opacity-85',
            isCorrect ? 'text-green-800' : 'text-red-800',
          )}
        >
          {isCorrect ? (
            `${userPercentage}% of users also got this right.`
          ) : (
            <>
              The correct answer was <strong>{correctAnswerLabel}</strong>.
              Review the explanation below.
            </>
          )}
        </p>

        {/* Progress bar */}
        <div
          className={cn(
            'mt-2.5 h-[5px] rounded-full overflow-hidden',
            isCorrect ? 'bg-green-200' : 'bg-red-200',
          )}
        >
          <div
            className={cn(
              'h-full rounded-full animate-bar-fill',
              isCorrect ? 'bg-green-600' : 'bg-red-600',
            )}
          />
        </div>

        <p
          className={cn(
            'text-[11px] mt-1 animate-fade-label',
            isCorrect ? 'text-green-700' : 'text-red-700',
          )}
        >
          {isCorrect
            ? 'Your score +1'
            : `${100 - userPercentage}% of users got this wrong`}
        </p>
      </div>
    </div>
  );
}
