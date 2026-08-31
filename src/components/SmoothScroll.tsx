// 'use client';
// import { useEffect } from 'react';
// import Lenis from 'lenis';
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

// if (typeof window !== 'undefined') {
//   gsap.registerPlugin(ScrollTrigger);
// }

// export default function SmoothScroll({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   useEffect(() => {
//     if (typeof window === 'undefined') return;

//     const previousScrollBehavior =
//       document.documentElement.style.scrollBehavior;
//     document.documentElement.style.scrollBehavior = 'auto';

//     const lenis = new Lenis({
//       duration: 1.2,
//       easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
//       orientation: 'vertical',
//       touchMultiplier: 2,
//     });

//     // Sync GSAP's ScrollTrigger with Lenis
//     lenis.on('scroll', ScrollTrigger.update);

//     let rafId: number | null = null;
//     const raf = (time: number) => {
//       lenis.raf(time);
//       rafId = window.requestAnimationFrame(raf);
//     };
//     rafId = window.requestAnimationFrame(raf);

//     // Avoid GSAP ticker conflicts
//     gsap.ticker.lagSmoothing(0);

//     return () => {
//       if (rafId !== null) window.cancelAnimationFrame(rafId);
//       lenis.destroy();
//       document.documentElement.style.scrollBehavior = previousScrollBehavior;
//     };
//   }, []);

//   return <>{children}</>;
// }


"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { features } from "@/lib/config";

const LENIS_OPTIONS = {
  duration: 1.6,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: "vertical" as const,
  gestureOrientation: "vertical" as const,
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
};

export function SmoothScroll({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  useEffect(() => {
    if (!features.smoothScroll) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const lenis = new Lenis(LENIS_OPTIONS);

    function raf(time: number): void {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    function handleAnchorClick(e: MouseEvent): void {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const element = document.querySelector(href);
      if (!element) return;

      e.preventDefault();
      lenis.scrollTo(element as HTMLElement, { offset: -100 });
    }

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
