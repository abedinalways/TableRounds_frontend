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
//       lerp: 0.1, // Higher = faster/snappier, Lower = slower/smoother (0.1 is standard professional)
//       duration: 1.5,
//       easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
//       orientation: 'vertical',
//       gestureOrientation: 'vertical',
//       smoothWheel: true,
//       wheelMultiplier: 1,
//       touchMultiplier: 1.5,
//       infinite: false,
//     });

//     // Sync GSAP's ScrollTrigger with Lenis
//     lenis.on('scroll', ScrollTrigger.update);

//     // Use GSAP ticker to drive Lenis (Much more stable than manual RAF)
//     const updateLenis = (time: number) => {
//       lenis.raf(time * 1000);
//     };

//     gsap.ticker.add(updateLenis);

//     // Avoid GSAP ticker conflicts
//     gsap.ticker.lagSmoothing(0);

//     return () => {
//       lenis.destroy();
//       gsap.ticker.remove(updateLenis);
//       document.documentElement.style.scrollBehavior = previousScrollBehavior;
//     };
//   }, []);

//   return <>{children}</>;
// }
'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      lerp: 0.1,
      wheelMultiplier: 1,
      autoResize: true,
    });
    lenisRef.current = lenis;

    const handleResize = () => {
      lenis.resize();
    };

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      lenisRef.current?.resize();
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [pathname]);

  return <>{children}</>;
}