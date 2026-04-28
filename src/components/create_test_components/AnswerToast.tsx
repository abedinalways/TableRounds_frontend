'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnswerToastProps {
  show: boolean;
  isCorrect: boolean;
  onHide: () => void;
}

export function AnswerToast({ show, isCorrect, onHide }: AnswerToastProps) {
  const toastRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>({} as ReturnType<typeof setTimeout>);

  useEffect(() => {
    if (!show) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      toastRef.current?.classList.add('animate-toast-out');
      setTimeout(onHide, 400);
    }, 3200);
    return () => clearTimeout(timerRef.current);
  }, [show, onHide]);

  const dismiss = () => {
    clearTimeout(timerRef.current);
    toastRef.current?.classList.add('animate-toast-out');
    setTimeout(onHide, 400);
  };

  if (!show) return null;

  return (
    <div
      ref={toastRef}
      className={cn(
        'fixed top-5 right-5 z-50 w-[340px] rounded-[18px] overflow-hidden animate-toast-in',
        isCorrect
          ? 'bg-gradient-to-br from-[#064e2e] to-[#022c1a] border border-green-400/20'
          : 'bg-gradient-to-br from-[#4c0519] to-[#2d0210] border border-red-400/20',
      )}
    >
      {/* Shimmer sweep */}
      <div
        className={cn(
          'absolute inset-0 pointer-events-none animate-shimmer-sweep',
          isCorrect ? 'bg-shimmer-green' : 'bg-shimmer-red',
        )}
      />

      {/* Glow blob */}
      <div
        className={cn(
          'absolute -top-10 -right-10 w-[120px] h-[120px] rounded-full pointer-events-none animate-glow-pulse',
          isCorrect
            ? 'bg-[radial-gradient(circle,rgba(74,222,128,0.15)_0%,transparent_70%)]'
            : 'bg-[radial-gradient(circle,rgba(248,113,113,0.15)_0%,transparent_70%)]',
        )}
      />

      {/* Confetti — correct only */}
      {isCorrect && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            '#4ade80',
            '#86efac',
            '#fbbf24',
            '#a3e635',
            '#bbf7d0',
            '#34d399',
          ].map((color, i) => (
            <div
              key={i}
              className="absolute w-[7px] h-[7px] rounded-sm animate-confetti"
              style={{
                left: `${10 + i * 15}%`,
                top: `${5 + (i % 3) * 12}%`,
                background: color,
                animationDelay: `${i * 0.07}s`,
                animationDuration: `${0.6 + (i % 3) * 0.2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Body */}
      <div className="flex items-center gap-3.5 px-[18px] pt-4 pb-3 relative">
        {/* Icon */}
        <div
          className={cn(
            'w-[46px] h-[46px] rounded-full flex items-center justify-center shrink-0',
            'animate-icon-ring',
            isCorrect
              ? 'bg-green-400/[0.18] border border-green-400/40'
              : 'bg-red-400/[0.18] border border-red-400/40',
          )}
        >
          <div className="animate-icon-bounce">
            {isCorrect ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 13l5 5L20 7"
                  stroke="#4ade80"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="#f87171"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </div>
        </div>

        {/* Text */}
        <div className="flex-1">
          <p
            className={cn(
              'text-[13px] font-semibold tracking-[0.4px] mb-0.5 animate-text-up-1',
              isCorrect ? 'text-green-400' : 'text-red-400',
            )}
          >
            {isCorrect ? 'Excellent!' : 'Incorrect'}
            <span
              className={cn(
                'ml-2 inline-block text-[10px] font-semibold tracking-[0.6px] px-2 py-0.5 rounded-full border animate-text-up-3',
                isCorrect
                  ? 'bg-green-400/15 text-green-400 border-green-400/30'
                  : 'bg-red-400/15 text-red-400 border-red-400/30',
              )}
            >
              {isCorrect ? '+1 POINT' : 'REVIEW'}
            </span>
          </p>
          <p className="text-[12px] text-white/60 m-0 animate-text-up-2">
            {isCorrect
              ? 'You nailed the correct answer.'
              : 'Check the explanation to learn more.'}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/[0.06] mx-[18px]" />

      {/* Footer */}
      <div className="flex items-center justify-between px-[18px] py-2.5">
        <span className="text-[11px] text-white/35 animate-text-up-3">
          {isCorrect
            ? 'Keep it up — next question awaits'
            : 'Correct answer is highlighted below'}
        </span>
        <button
          onClick={dismiss}
          className="w-[22px] h-[22px] rounded-full bg-white/[0.08] border-none flex items-center justify-center text-white/40 text-[13px] cursor-pointer hover:bg-white/[0.15] hover:text-white transition-all animate-text-up-3"
        >
          ✕
        </button>
      </div>

      {/* Auto-dismiss progress bar */}
      <div
        className={cn(
          'h-[3px]',
          isCorrect ? 'bg-green-400/[0.12]' : 'bg-red-400/[0.12]',
        )}
      >
        <div
          className={cn(
            'h-full animate-toast-progress origin-left',
            isCorrect
              ? 'bg-gradient-to-r from-green-400 to-green-300'
              : 'bg-gradient-to-r from-red-400 to-red-300',
          )}
        />
      </div>
    </div>
  );
}
