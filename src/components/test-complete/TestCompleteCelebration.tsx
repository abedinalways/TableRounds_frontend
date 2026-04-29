'use client';

import { useEffect, useRef, useState } from 'react';

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type Shape = 'circle' | 'square' | 'strip' | 'star' | 'triangle';

type ConfettiItem = {
  id: number;
  left: number; // 0-100 (%)
  delay: number; // seconds
  duration: number; // seconds
  color: string;
  size: number; // px
  shape: Shape;
  rotate: number; // deg
  drift: number; // px — horizontal sine drift amplitude
  spin: number; // deg/s — rotation speed multiplier
  opacity: number;
};

type Burst = {
  id: number;
  x: string;
  y: string;
  color: string;
  delay: number;
};

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */
const COLORS = [
  '#01503b',
  '#b79e6b',
  '#22c55e',
  '#f59e0b',
  '#ffffff',
  '#34d399',
  '#fbbf24',
  '#6ee7b7',
];

const BURST_ORIGINS: Omit<Burst, 'id' | 'color' | 'delay'>[] = [
  { x: '10%', y: '90%' },
  { x: '90%', y: '90%' },
  { x: '15%', y: '60%' },
  { x: '85%', y: '60%' },
  { x: '50%', y: '95%' },
  { x: '30%', y: '80%' },
  { x: '70%', y: '80%' },
];

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/* ─────────────────────────────────────────────
   Inline keyframes injected once
───────────────────────────────────────────── */
const STYLE_ID = 'celebration-keyframes';

const CSS = `
@keyframes confettiFall {
  0%   { transform: translateY(-30px) rotate(var(--r0)) translateX(0px);   opacity: 1; }
  25%  { transform: translateY(25vh)  rotate(var(--r1)) translateX(var(--dx)); }
  50%  { transform: translateY(50vh)  rotate(var(--r2)) translateX(0px);   }
  75%  { transform: translateY(75vh)  rotate(var(--r3)) translateX(calc(-1 * var(--dx))); }
  100% { transform: translateY(105vh) rotate(var(--r4)) translateX(0px);   opacity: 0; }
}

@keyframes burstRing {
  0%   { transform: scale(0);   opacity: 0.9; }
  60%  { transform: scale(2.8); opacity: 0.5; }
  100% { transform: scale(4.5); opacity: 0; }
}

@keyframes burstDot {
  0%   { transform: translate(0, 0) scale(1);   opacity: 1; }
  100% { transform: translate(var(--bx), var(--by)) scale(0); opacity: 0; }
}

@keyframes glowPulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1);    opacity: 0.18; }
  50%       { transform: translate(-50%, -50%) scale(1.45); opacity: 0.32; }
}

@keyframes flashIn {
  0%   { opacity: 0.35; }
  40%  { opacity: 0.12; }
  100% { opacity: 0; }
}

@keyframes sparkle {
  0%, 100% { transform: scale(0) rotate(0deg);   opacity: 0; }
  50%       { transform: scale(1) rotate(180deg); opacity: 1; }
}

@keyframes ringExpand {
  0%   { transform: translate(-50%, -50%) scale(0); opacity: 0.7; }
  100% { transform: translate(-50%, -50%) scale(6); opacity: 0; }
}

@keyframes streakDown {
  0%   { transform: scaleY(0); opacity: 1; }
  60%  { transform: scaleY(1); opacity: 0.8; }
  100% { transform: scaleY(1); opacity: 0; }
}
`;

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = CSS;
  document.head.appendChild(el);
}

/* ─────────────────────────────────────────────
   Audio Engine (Web Audio API — no files needed)
───────────────────────────────────────────── */

function getAudioCtx(): AudioContext | null {
  try {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  } catch {
    return null;
  }
}

/** Short white-noise "pop" — like a party popper */
function playPop(ctx: AudioContext, delay: number, pitch = 800) {
  const len = Math.floor(ctx.sampleRate * 0.18);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;

  const src = ctx.createBufferSource();
  src.buffer = buf;

  const bpf = ctx.createBiquadFilter();
  bpf.type = 'bandpass';
  bpf.frequency.value = pitch;
  bpf.Q.value = 0.8;

  const gain = ctx.createGain();
  const t = ctx.currentTime + delay;
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.45, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

  src.connect(bpf);
  bpf.connect(gain);
  gain.connect(ctx.destination);
  src.start(t);
  src.stop(t + 0.25);
}

/** Bright sine-tone ping — sparkle / tinkle */
function playPing(ctx: AudioContext, delay: number, freq: number, vol = 0.12) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  const t = ctx.currentTime + delay;
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(vol, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.6);
}

/** Triumphant ascending fanfare — C major arpeggio with a top flourish */
function playFanfare(ctx: AudioContext) {
  // Base arpeggio: C4 E4 G4 C5 E5
  const arp: [number, number][] = [
    [261.63, 0.0],
    [329.63, 0.1],
    [392.0, 0.2],
    [523.25, 0.3],
    [659.25, 0.42],
  ];

  arp.forEach(([freq, delay]) => {
    // fundamental
    playPing(ctx, delay, freq, 0.14);
    // faint octave harmonic for warmth
    playPing(ctx, delay + 0.01, freq * 2, 0.04);
  });

  // Sustain chord at the peak (C major: C5 E5 G5)
  [
    [523.25, 0.62],
    [659.25, 0.62],
    [783.99, 0.62],
  ].forEach(([f, d]) => {
    playPing(ctx, d, f, 0.09);
  });
}

/** Staggered firework pops synced to the burst origins */
function playFireworks(ctx: AudioContext) {
  const pitches = [600, 900, 750, 1100, 500, 800, 1000];
  pitches.forEach((pitch, i) => {
    playPop(ctx, i * 0.18, pitch);
  });
}

/** Random high-pitched sparkle tinkles */
function playSparkles(ctx: AudioContext) {
  const sparkleNotes = [1046.5, 1318.5, 1567.98, 2093, 1760, 2349.32, 1975.53];
  sparkleNotes.forEach((freq, i) => {
    playPing(ctx, 0.5 + i * 0.13, freq, 0.06);
  });
}

function playCelebrationAudio() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  // Resume in case browser suspended it
  ctx.resume().then(() => {
    playFireworks(ctx);
    playFanfare(ctx);
    playSparkles(ctx);
  });
}

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

/** SVG star shape */
function StarShape({ size, color }: { size: number; color: string }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 20 20" style={{ display: 'block' }}>
      <polygon
        points="10,1 12.9,7 19.5,7.6 14.5,12 16.2,18.5 10,15 3.8,18.5 5.5,12 0.5,7.6 7.1,7"
        fill={color}
      />
    </svg>
  );
}

/** Single confetti piece */
function ConfettoPiece({ item }: { item: ConfettiItem }) {
  const rotations = Array.from(
    { length: 5 },
    (_, i) => `${item.rotate + item.spin * i * 90}deg`,
  );

  const style: React.CSSProperties & Record<string, string | number> = {
    position: 'absolute',
    top: -30,
    left: `${item.left}%`,
    animationName: 'confettiFall',
    animationDuration: `${item.duration}s`,
    animationDelay: `${item.delay}s`,
    animationTimingFunction: 'linear',
    animationFillMode: 'both',
    '--r0': rotations[0],
    '--r1': rotations[1],
    '--r2': rotations[2],
    '--r3': rotations[3],
    '--r4': rotations[4],
    '--dx': `${item.drift}px`,
    opacity: item.opacity,
  };

  if (item.shape === 'star') {
    return (
      <span style={style}>
        <StarShape size={item.size} color={item.color} />
      </span>
    );
  }

  if (item.shape === 'triangle') {
    return (
      <span style={style}>
        <svg
          width={item.size}
          height={item.size}
          viewBox="0 0 10 10"
          style={{ display: 'block' }}
        >
          <polygon points="5,0 10,10 0,10" fill={item.color} />
        </svg>
      </span>
    );
  }

  const shapeStyle: React.CSSProperties = {
    width: item.shape === 'strip' ? 4 : item.size,
    height: item.shape === 'strip' ? item.size * 2.5 : item.size,
    backgroundColor: item.color,
    borderRadius:
      item.shape === 'circle' ? '50%' : item.shape === 'strip' ? 2 : 3,
  };

  return <span style={{ ...style, ...shapeStyle }} />;
}

/** Firework burst at a given origin */
function FireworkBurst({ burst }: { burst: Burst }) {
  const DOT_COUNT = 10;
  const dots = Array.from({ length: DOT_COUNT }, (_, i) => {
    const angle = (360 / DOT_COUNT) * i;
    const dist = rand(55, 110);
    const bx = Math.cos((angle * Math.PI) / 180) * dist;
    const by = Math.sin((angle * Math.PI) / 180) * dist;
    return { angle, bx, by, id: i };
  });

  const origin: React.CSSProperties = {
    position: 'absolute',
    left: burst.x,
    top: burst.y,
    width: 0,
    height: 0,
    animationDelay: `${burst.delay}s`,
  };

  return (
    <div style={origin}>
      {/* expanding ring */}
      <span
        style={{
          position: 'absolute',
          width: 24,
          height: 24,
          borderRadius: '50%',
          border: `3px solid ${burst.color}`,
          left: -12,
          top: -12,
          animationName: 'burstRing',
          animationDuration: '0.7s',
          animationDelay: `${burst.delay}s`,
          animationFillMode: 'both',
          animationTimingFunction: 'ease-out',
        }}
      />
      {/* radial dots */}
      {dots.map(d => (
        <span
          key={d.id}
          style={
            {
              position: 'absolute',
              width: rand(5, 9),
              height: rand(5, 9),
              borderRadius: '50%',
              backgroundColor: burst.color,
              left: -4,
              top: -4,
              animationName: 'burstDot',
              animationDuration: `${rand(0.55, 0.9)}s`,
              animationDelay: `${burst.delay + rand(0, 0.08)}s`,
              animationFillMode: 'both',
              animationTimingFunction: 'ease-out',
              '--bx': `${d.bx}px`,
              '--by': `${d.by}px`,
            } as React.CSSProperties & Record<string, string | number>
          }
        />
      ))}
    </div>
  );
}

/** Sparkle dots scattered around */
function Sparkles() {
  const sparkles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${rand(5, 95)}%`,
    top: `${rand(5, 85)}%`,
    size: rand(6, 14),
    delay: rand(0, 1.2),
    duration: rand(0.6, 1.1),
    color: COLORS[i % COLORS.length],
  }));

  return (
    <>
      {sparkles.map(s => (
        <span
          key={s.id}
          style={{
            position: 'absolute',
            left: s.left,
            top: s.top,
            animationName: 'sparkle',
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
            animationFillMode: 'both',
          }}
        >
          <StarShape size={s.size} color={s.color} />
        </span>
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
export function TestCompleteCelebration() {
  const [confetti, setConfetti] = useState<ConfettiItem[]>([]);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const injectedRef = useRef(false);

  useEffect(() => {
    if (!injectedRef.current) {
      injectStyles();
      injectedRef.current = true;
    }

    const shapes: Shape[] = ['circle', 'square', 'strip', 'star', 'triangle'];

    const generated: ConfettiItem[] = Array.from({ length: 180 }, (_, i) => ({
      id: i,
      left: rand(0, 100),
      delay: rand(0, 1.4),
      duration: rand(2.8, 5.2),
      color: COLORS[i % COLORS.length],
      size: rand(6, 14),
      shape: shapes[i % shapes.length],
      rotate: rand(0, 360),
      drift: rand(30, 90) * (Math.random() > 0.5 ? 1 : -1),
      spin: rand(0.5, 2.5),
      opacity: rand(0.75, 1),
    }));

    setConfetti(generated);

    const generatedBursts: Burst[] = BURST_ORIGINS.map((o, i) => ({
      ...o,
      id: i,
      color: COLORS[i % COLORS.length],
      delay: i * 0.18,
    }));
    setBursts(generatedBursts);

    playCelebrationAudio();
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      aria-hidden="true"
    >
      {/* ── Screen flash ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(255,255,255,0.22)',
          animationName: 'flashIn',
          animationDuration: '0.9s',
          animationFillMode: 'forwards',
        }}
      />

      {/* ── Expanding ring from center ── */}
      <span
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 80,
          height: 80,
          borderRadius: '50%',
          border: '3px solid rgba(1,80,59,0.55)',
          animationName: 'ringExpand',
          animationDuration: '1s',
          animationDelay: '0.05s',
          animationFillMode: 'both',
          animationTimingFunction: 'ease-out',
        }}
      />
      <span
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 80,
          height: 80,
          borderRadius: '50%',
          border: '3px solid rgba(183,158,107,0.5)',
          animationName: 'ringExpand',
          animationDuration: '1s',
          animationDelay: '0.22s',
          animationFillMode: 'both',
          animationTimingFunction: 'ease-out',
        }}
      />

      {/* ── Ambient glow ── */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 280,
          height: 280,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(1,80,59,0.22) 0%, transparent 70%)',
          animationName: 'glowPulse',
          animationDuration: '1.8s',
          animationIterationCount: '2',
          animationTimingFunction: 'ease-in-out',
          filter: 'blur(28px)',
        }}
      />

      {/* ── Firework bursts ── */}
      {bursts.map(b => (
        <FireworkBurst key={b.id} burst={b} />
      ))}

      {/* ── Sparkles ── */}
      <Sparkles />

      {/* ── Confetti rain ── */}
      {confetti.map(item => (
        <ConfettoPiece key={item.id} item={item} />
      ))}
    </div>
  );
}
