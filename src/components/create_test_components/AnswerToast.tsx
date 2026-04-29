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
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const playSound = (success: boolean) => {
    try {
      const AudioContext =
        window.AudioContext || (window as any).webkitAudioContext;

      const ctx = new AudioContext();

      const playTone = (
        frequency: number,
        start: number,
        duration: number,
        type: OscillatorType = 'sine',
      ) => {
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();

        oscillator.type = type;
        oscillator.frequency.value = frequency;

        oscillator.connect(gain);
        gain.connect(ctx.destination);

        gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(
          0.16,
          ctx.currentTime + start + 0.015,
        );
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          ctx.currentTime + start + duration,
        );

        oscillator.start(ctx.currentTime + start);
        oscillator.stop(ctx.currentTime + start + duration);
      };

      if (success) {
        playTone(523.25, 0, 0.14);
        playTone(659.25, 0.09, 0.16);
        playTone(783.99, 0.18, 0.2);
      } else {
        playTone(260, 0, 0.18, 'triangle');
        playTone(180, 0.14, 0.22, 'triangle');
      }
    } catch {
      // Browser may block sound before user interaction.
    }
  };

  useEffect(() => {
    if (!show) return;

    playSound(isCorrect);

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      toastRef.current?.classList.add('animate-toast-out');
      setTimeout(onHide, 420);
    }, 3600);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [show, isCorrect, onHide]);

  const dismiss = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    toastRef.current?.classList.add('animate-toast-out');
    setTimeout(onHide, 420);
  };

  if (!show) return null;

  return (
    <div
      ref={toastRef}
      role="status"
      aria-live="polite"
      className={cn(
        'fixed top-5 right-5 z-50 w-[360px] overflow-hidden rounded-[24px]',
        'animate-toast-in shadow-[0_24px_80px_rgba(0,0,0,0.28)]',
        'border backdrop-blur-2xl',
        isCorrect
          ? 'bg-[linear-gradient(135deg,rgba(2,68,47,0.96),rgba(3,49,35,0.96),rgba(1,24,18,0.98))] border-emerald-300/20'
          : 'bg-[linear-gradient(135deg,rgba(76,5,25,0.96),rgba(52,4,18,0.96),rgba(25,2,9,0.98))] border-rose-300/20',
      )}
    >
      {/* animated background glow */}
      <div
        className={cn(
          'absolute inset-0 opacity-70',
          isCorrect ? 'animate-success-aurora' : 'animate-error-aurora',
        )}
      />

      {/* success burst */}
      {isCorrect && (
        <div className="absolute left-[28px] top-[28px] w-[56px] h-[56px] rounded-full animate-success-burst pointer-events-none" />
      )}

      {/* floating particles for correct answer */}
      {isCorrect && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className="absolute block rounded-full animate-floating-particle"
              style={{
                left: `${8 + i * 6.4}%`,
                top: `${18 + (i % 4) * 12}%`,
                width: `${4 + (i % 3) * 2}px`,
                height: `${4 + (i % 3) * 2}px`,
                background:
                  i % 3 === 0 ? '#facc15' : i % 3 === 1 ? '#86efac' : '#34d399',
                animationDelay: `${i * 0.06}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* shimmer */}
      <div
        className={cn(
          'absolute inset-0 pointer-events-none animate-premium-shimmer',
          isCorrect ? 'bg-shimmer-green' : 'bg-shimmer-red',
        )}
      />

      <div className="relative flex items-start gap-4 px-5 pt-5 pb-4">
        {/* icon */}
        <div
          className={cn(
            'relative w-[58px] h-[58px] rounded-2xl flex items-center justify-center shrink-0',
            'shadow-lg animate-icon-pop',
            isCorrect
              ? 'bg-emerald-400/15 border border-emerald-300/35 shadow-emerald-500/20'
              : 'bg-rose-400/15 border border-rose-300/35 shadow-rose-500/20',
          )}
        >
          {isCorrect && (
            <>
              <span className="absolute inset-[-6px] rounded-[22px] border border-emerald-300/25 animate-ping-soft" />
              <span className="absolute inset-[-12px] rounded-[28px] border border-emerald-300/10 animate-ping-soft-delay" />
            </>
          )}

          {isCorrect ? (
            <svg
              className="animate-check-draw"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M4.5 12.7L9.3 17.5L20 6.8"
                stroke="#86efac"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              className="animate-wrong-shake"
              width="27"
              height="27"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="#fda4af"
                strokeWidth="2.6"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>

        {/* content */}
        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-center gap-2 mb-1">
            <h4
              className={cn(
                'text-[15px] font-bold tracking-[0.2px] animate-text-slide-1',
                isCorrect ? 'text-emerald-100' : 'text-rose-100',
              )}
            >
              {isCorrect ? 'Excellent Work!' : 'Not Quite Right'}
            </h4>

            <span
              className={cn(
                'text-[10px] font-bold px-2.5 py-1 rounded-full border animate-badge-pop',
                isCorrect
                  ? 'bg-emerald-300/15 text-emerald-200 border-emerald-300/25'
                  : 'bg-rose-300/15 text-rose-200 border-rose-300/25',
              )}
            >
              {isCorrect ? '+1 POINT' : 'REVIEW'}
            </span>
          </div>

          <p className="text-[13px] leading-[160%] text-white/70 animate-text-slide-2">
            {isCorrect
              ? 'You selected the correct answer. Keep the momentum going.'
              : 'Review the explanation and learn from this attempt.'}
          </p>
        </div>

        <button
          type="button"
          onClick={dismiss}
          className="w-7 h-7 rounded-full bg-white/8 hover:bg-white/15 text-white/45 hover:text-white transition-all flex items-center justify-center text-[14px]"
        >
          ✕
        </button>
      </div>

      {/* footer */}
      <div className="relative px-5 pb-4">
        <div className="flex items-center justify-between rounded-[14px] bg-white/[0.055] border border-white/[0.07] px-3 py-2">
          <span className="text-[11px] text-white/45 animate-text-slide-3">
            {isCorrect
              ? 'Great progress — next question awaits'
              : 'Every mistake improves your score'}
          </span>

          {isCorrect && (
            <span className="text-[11px] text-emerald-200 font-semibold animate-pulse">
              Streak building
            </span>
          )}
        </div>
      </div>

      {/* progress */}
      <div
        className={cn(
          'h-[4px]',
          isCorrect ? 'bg-emerald-400/10' : 'bg-rose-400/10',
        )}
      >
        <div
          className={cn(
            'h-full animate-toast-progress origin-left',
            isCorrect
              ? 'bg-gradient-to-r from-emerald-400 via-lime-300 to-yellow-300'
              : 'bg-gradient-to-r from-rose-400 via-red-300 to-orange-300',
          )}
        />
      </div>
    </div>
  );
}
