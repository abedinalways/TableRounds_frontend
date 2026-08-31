'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Shared singleton so other components (Banner, Elevate, ...) can scroll via
// the same Lenis instance. Mixing raw `window.scrollTo` / gsap `scrollTo`
// native scrolling with Lenis smooth scroll desyncs Lenis's internal position
// and makes the page freeze / get stuck mid-scroll.
let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      autoResize: true,
      allowNestedScroll: true,
    });

    lenisRef.current = lenisInstance = lenis;

    // Keep GSAP ScrollTrigger (used e.g. on the home page) in sync with Lenis.
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis through GSAP's ticker so the whole page shares a single
    // animation loop instead of two competing rAF loops.
    const updateLenis = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    const handleLoad = () => lenis.resize();
    window.addEventListener('load', handleLoad);

    // `html, body { height: 100% }` means ResizeObserver never fires when the
    // content grows (lazy images, async route data), so Lenis's internal
    // scroll `limit` goes stale and scrolling gets stuck mid-page. Refresh the
    // dimensions periodically to keep the limit accurate.
    const keepLimitsFresh = window.setInterval(() => {
      if (lenis.isScrolling === 'smooth') return;
      lenis.resize();
    }, 2000);

    return () => {
      window.removeEventListener('load', handleLoad);
      window.clearInterval(keepLimitsFresh);
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      lenisInstance = null;
      lenisRef.current = null;
    };
  }, []);

  // On route change: cancel any in-flight smooth animation, recalculate the
  // scroll limits and snap back to the top of the newly rendered page.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    lenis.stop();
    requestAnimationFrame(() => {
      lenis.resize();
      lenis.scrollTo(0, { immediate: true, force: true });
      lenis.start();
    });
  }, [pathname]);

  return <>{children}</>;
}
