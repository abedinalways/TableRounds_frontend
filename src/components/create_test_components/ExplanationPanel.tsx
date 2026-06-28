import React, { useState, useEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';

import { X, ZoomIn, ZoomOut, RotateCcw, Loader2 } from 'lucide-react';
import CancelIcon from '../reusable/icons/CancelIcon';
import PimpingIcon from '../reusable/icons/PimpingIcon';
import MemoryIcon from '../reusable/icons/MemoryIcon';
import BookIcon from '../reusable/icons/BookIcon';
import ExplainIcon from '../reusable/icons/ExplainIcon';

interface Explanation {
  main: string;
  image?: string | null;
  whyIncorrect?: { option: string; text: string }[];
  pinningPoint?: string;
  memoryTrick?: string;
  referance: string[];
}

interface ExplanationPanelProps {
  quizDetails: { explanation: Explanation };
  isQuestionHidden: boolean;
  onShowQuestion: () => void;
}

const richTextClass = `
  text-gray-700 text-[16px] md:text-[18px] leading-relaxed w-full relative
  [&_p]:mb-3
  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:mb-3
  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:mb-3
  [&_li]:pl-1
  [&_strong]:font-bold [&_strong]:text-[#01281e]
  [&_b]:font-bold [&_b]:text-[#01281e]
  [&_em]:italic
  [&_img]:cursor-zoom-in [&_img]:transition-shadow [&_img]:hover:shadow-md
`;

const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  quizDetails,
  isQuestionHidden,
  onShowQuestion,
}) => {
  const explanation = quizDetails?.explanation;

  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  // পপআপকে মেইন ইমেজের ওপরে পজিশন করার জন্য কোঅর্ডিনেটস স্টেট
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});

  const containerRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const dragState = useRef({ startY: 0, dragging: false, currentY: 0 });

  /* ─── zoom helpers ─── */
  const zoomIn = useCallback(() => {
    setZoomLevel(z => Math.min(+(z + 0.25).toFixed(2), 3));
  }, []);
  const zoomOut = useCallback(() => {
    setZoomLevel(z => Math.max(+(z - 0.25).toFixed(2), 0.5));
  }, []);
  const resetZoom = useCallback(() => setZoomLevel(1), []);

  const handleImageDoubleClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!imageRef.current || !scrollContainerRef.current) return;

    if (zoomLevel === 1) {
      const newZoom = 1.5;
      const rect = imageRef.current.getBoundingClientRect();
      const containerRect = scrollContainerRef.current.getBoundingClientRect();

      const mouseXImage = e.clientX - rect.left;
      const mouseYImage = e.clientY - rect.top;
      const mouseXContainer = e.clientX - containerRect.left;
      const mouseYContainer = e.clientY - containerRect.top;

      const targetX = mouseXImage * newZoom - mouseXContainer;
      const targetY = mouseYImage * newZoom - mouseYContainer;

      setZoomLevel(newZoom);
      requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo(targetX, targetY);
        }
      });
    } else {
      resetZoom();
    }
  };

  const cleanupViewerState = useCallback(() => {
    setViewerOpen(false);
    setSelectedImage(null);
    setImageLoaded(false);
    setZoomLevel(1);
    dragState.current = { startY: 0, dragging: false, currentY: 0 };
  }, []);

  const closeViewer = useCallback(() => {
    const overlay = overlayRef.current;
    const modal = modalRef.current;

    if (!overlay || !modal) {
      cleanupViewerState();
      return;
    }

    gsap
      .timeline({ onComplete: cleanupViewerState })
      .to(modal, {
        y: 15,
        scale: 0.97,
        opacity: 0,
        duration: 0.15,
        ease: 'power2.in',
      })
      .to(overlay, { opacity: 0, duration: 0.15 }, '<');
  }, [cleanupViewerState]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!viewerOpen) return;
      if (e.key === 'Escape') closeViewer();
      if (e.key === '+' || e.key === '=') zoomIn();
      if (e.key === '-') zoomOut();
      if (e.key === '0') resetZoom();
    };

    if (viewerOpen) {
      window.addEventListener('keydown', onKey);
    }
    return () => window.removeEventListener('keydown', onKey);
  }, [viewerOpen, closeViewer, zoomIn, zoomOut, resetZoom]);

  /* ─── open animation ─── */
  useEffect(() => {
    if (!viewerOpen || !overlayRef.current || !modalRef.current) return;

    const tl = gsap.timeline();
    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.2 },
    ).fromTo(
      modalRef.current,
      { scale: 0.95, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.25, ease: 'power3.out' },
      '-=0.1',
    );

    return () => {
      tl.kill();
    };
  }, [viewerOpen]);

  /* ─── click inside HTML content to open image (Dynamic Position tracking) ─── */
  const handleContentClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      const imgEl =
        target.tagName === 'IMG'
          ? (target as HTMLImageElement)
          : target.closest('img');

      if (imgEl) {
        const src = imgEl.getAttribute('src');
        if (src) {
          e.preventDefault();
          e.stopPropagation();

          // মেইন ইমেজের পজিশন ও সাইজ বের করা
          const imgRect = imgEl.getBoundingClientRect();
          const panelRect = containerRef.current?.getBoundingClientRect();

          if (panelRect) {
            // মেইন ইমেজের ঠিক উপরে বসানোর জন্য টপ ও লেফট ক্যালকুলেশন
            const relativeTop = imgRect.top - panelRect.top;
            const relativeLeft = imgRect.left - panelRect.left;

            setPopupStyle({
              position: 'absolute',
              top: `${relativeTop}px`,
              left: `${relativeLeft}px`,
              width: `${imgRect.width}px`,
              height: `${imgRect.height}px`,
              minWidth: '380px',
              minHeight: '340px',
              zIndex: 50,
              transform: 'translateY(-12px)', 
              boxShadow:
                '0 25px 50px -12px rgba(0, 0, 0, 0.45), 0 15px 30px -15px rgba(0, 0, 0, 0.5)', 
              transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
            });
          }

          setSelectedImage(src);
          setImageLoaded(false);
          setZoomLevel(1);
          setViewerOpen(true);
        }
      }
    },
    [],
  );

  /* ─── drag-to-dismiss ─── */
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (zoomLevel > 1) return;
    if ((e.target as HTMLElement).closest('button')) return;

    dragState.current = { startY: e.clientY, currentY: 0, dragging: true };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.dragging || zoomLevel > 1) return;
    const diff = Math.max(0, e.clientY - dragState.current.startY);
    dragState.current.currentY = diff;

    if (modalRef.current) {
      gsap.to(modalRef.current, {
        y: diff,
        scale: Math.max(0.97, 1 - diff / 2000),
        duration: 0.01,
      });
    }
  };

  const handlePointerUp = () => {
    if (!dragState.current.dragging) return;
    dragState.current.dragging = false;

    if (dragState.current.currentY > 100) {
      closeViewer();
      return;
    }

    if (modalRef.current) {
      gsap.to(modalRef.current, {
        y: 0,
        scale: 1,
        duration: 0.2,
        ease: 'power3.out',
      });
    }
  };

  const handleImageLoad = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    setImageLoaded(true);
    setImageSize({
      width: e.currentTarget.naturalWidth,
      height: e.currentTarget.naturalHeight,
    });
  };

  const handleNewTab = () => {
    if (selectedImage) {
      window.open(selectedImage, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      ref={containerRef}
      className="p-4 md:p-6 md:my-[32px] bg-[#f9f9f5] shadow-lg rounded-[16px] border font-[manrope] relative"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-4 gap-4">
        <h2 className="text-lg md:text-2xl font-bold text-[#01281e] flex items-center gap-2">
          <ExplainIcon /> Explanation:
        </h2>
        {isQuestionHidden && (
          <button
            onClick={onShowQuestion}
            className="bg-[#b79e6b] text-white px-4 py-2 rounded-md text-sm font-semibold cursor-pointer hover:opacity-90 transition"
          >
            Show Question
          </button>
        )}
      </div>

      {/* ── Main explanation ── */}
      <div
        className={`${richTextClass} cursor-default`}
        onClick={handleContentClick}
        dangerouslySetInnerHTML={{ __html: explanation?.main || '' }}
      />

      {/* ── Why incorrect ── */}
      <h3 className="text-lg md:text-2xl font-semibold text-[#01281e] mt-6 mb-2 flex items-center gap-2">
        <CancelIcon /> Why the Other Options Are Incorrect:
      </h3>
      <div className="space-y-3 w-full" onClick={handleContentClick}>
        {explanation?.whyIncorrect?.map((item, index) => (
          <div key={index} className={richTextClass}>
            {item.option && (
              <strong className="text-[#01281e]">{item.option}: </strong>
            )}
            <div dangerouslySetInnerHTML={{ __html: item.text || '' }} />
          </div>
        ))}
      </div>

      {/* ── Pimping point ── */}
      <h3 className="text-lg md:text-2xl font-semibold text-[#01281e] mt-6 mb-1 flex items-center gap-2">
        <PimpingIcon /> Pimping Point:
      </h3>
      <div
        className={`${richTextClass} text-[#01503b] [&_strong]:text-[#01503b] [&_b]:text-[#01503b]`}
        onClick={handleContentClick}
        dangerouslySetInnerHTML={{ __html: explanation?.pinningPoint || '' }}
      />

      {/* ── Memory trick ── */}
      <h3 className="text-lg md:text-2xl font-semibold text-[#01281e] mt-6 mb-1 flex items-center gap-2">
        <MemoryIcon /> Memory trick:
      </h3>
      <div
        className={`${richTextClass} text-[#01281e] font-semibold [&_strong]:text-[#01281e] [&_b]:text-[#01281e]`}
        onClick={handleContentClick}
        dangerouslySetInnerHTML={{ __html: explanation?.memoryTrick || '' }}
      />

      {/* ── References ── */}
      <h3 className="text-lg md:text-2xl font-semibold text-[#01281e] mt-6 mb-1 flex items-center gap-2">
        <BookIcon /> References:
      </h3>
      <div className="space-y-2" onClick={handleContentClick}>
        {explanation?.referance?.map((ref: string, index: number) => (
          <div
            key={index}
            className={`${richTextClass} text-[#01281e] font-semibold [&_strong]:text-[#01281e] [&_b]:text-[#01281e]`}
            dangerouslySetInnerHTML={{ __html: ref || '' }}
          />
        ))}
      </div>

      {/* ── EXACT POSITION POPUP VIEWER ── */}
      {selectedImage && viewerOpen && (
        <div
          ref={overlayRef}
          className="absolute inset-0 z-40 bg-black/15 pointer-events-auto rounded-[16px]"
          onClick={closeViewer}
        >
          <div
            ref={modalRef}
            className="flex flex-col bg-white rounded-md overflow-hidden"
            style={popupStyle}
            onClick={e => e.stopPropagation()}
          >
            {/* Window Header Bar */}
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="flex items-center justify-between px-3 h-[34px] flex-shrink-0 select-none bg-gray-100 border-b border-gray-200 cursor-grab active:cursor-grabbing"
            >
              <span className="text-[12px] font-medium text-gray-700">
                Exhibit Display
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={closeViewer}
                  className="w-5 h-5 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded text-[10px]"
                >
                  ─
                </button>
                <button
                  onClick={handleNewTab}
                  className="w-5 h-5 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded text-[9px]"
                >
                  ❏
                </button>
                <button
                  onClick={closeViewer}
                  className="w-5 h-5 flex items-center justify-center text-gray-500 hover:bg-red-500 hover:text-white rounded transition"
                >
                  <X size={12} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Scrollable Canvas area (Anti-cut structure) */}
            <div
              ref={scrollContainerRef}
              className="relative flex-1 overflow-auto bg-white flex items-start justify-center p-2"
            >
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-white z-15">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                </div>
              )}
              <div className="relative w-full h-full flex items-start justify-center">
                <img
                  ref={imageRef}
                  src={selectedImage}
                  alt="Exhibit popup"
                  draggable={false}
                  onLoad={handleImageLoad}
                  onError={() => setImageLoaded(true)}
                  onDoubleClick={handleImageDoubleClick}
                  className={`object-contain max-w-full max-h-full transition-opacity duration-150 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  } ${zoomLevel > 1 ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                  style={{
                    width:
                      zoomLevel > 1
                        ? `${imageSize.width * zoomLevel}px`
                        : '100%',
                    height:
                      zoomLevel > 1
                        ? `${imageSize.height * zoomLevel}px`
                        : '100%',
                    maxWidth: zoomLevel > 1 ? 'none' : '100%',
                    maxHeight: zoomLevel > 1 ? 'none' : '100%',
                  }}
                />
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center gap-3 px-3 h-[34px] flex-shrink-0 select-none bg-gray-50 border-t border-gray-200 text-gray-500 text-[11px]">
              <button
                onClick={zoomIn}
                disabled={zoomLevel >= 3}
                className="hover:text-gray-900 disabled:opacity-30 cursor-pointer flex items-center gap-1"
              >
                <ZoomIn size={12} /> Zoom In
              </button>
              <button
                onClick={zoomOut}
                disabled={zoomLevel <= 0.5}
                className="hover:text-gray-900 disabled:opacity-30 cursor-pointer flex items-center gap-1"
              >
                <ZoomOut size={12} /> Zoom Out
              </button>
              <button
                onClick={resetZoom}
                disabled={zoomLevel === 1}
                className="hover:text-gray-900 disabled:opacity-30 cursor-pointer flex items-center gap-1"
              >
                <RotateCcw size={11} /> Reset
              </button>
              <div className="flex-1" />
              <span className="font-mono text-[10px] bg-gray-100 px-1 py-0.5 rounded border">
                {Math.round(zoomLevel * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExplanationPanel;

// ============================
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import gsap from 'gsap';

// import {
//   X,
//   ZoomIn,
//   ZoomOut,
//   RotateCcw,
//   ExternalLink,
//   Loader2,
// } from 'lucide-react';
// import CancelIcon from '../reusable/icons/CancelIcon';
// import PimpingIcon from '../reusable/icons/PimpingIcon';
// import MemoryIcon from '../reusable/icons/MemoryIcon';
// import BookIcon from '../reusable/icons/BookIcon';
// import ExplainIcon from '../reusable/icons/ExplainIcon';

// interface Explanation {
//   main: string;
//   image?: string | null;
//   whyIncorrect?: { option: string; text: string }[];
//   pinningPoint?: string;
//   memoryTrick?: string;
//   referance: string[];
// }

// interface ExplanationPanelProps {
//   quizDetails: { explanation: Explanation };
//   isQuestionHidden: boolean;
//   onShowQuestion: () => void;
// }

// const richTextClass = `
//   text-gray-700 text-[16px] md:text-[18px] leading-relaxed w-full
//   [&_p]:mb-3
//   [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:mb-3
//   [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:mb-3
//   [&_li]:pl-1
//   [&_strong]:font-bold [&_strong]:text-[#01281e]
//   [&_b]:font-bold [&_b]:text-[#01281e]
//   [&_em]:italic
// `;

// const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
//   quizDetails,
//   isQuestionHidden,
//   onShowQuestion,
// }) => {
//   const explanation = quizDetails?.explanation;

//   const [viewerOpen, setViewerOpen] = useState(false);
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [imageLoaded, setImageLoaded] = useState(false);
//   const [zoomLevel, setZoomLevel] = useState(1);
//   const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

//   const overlayRef = useRef<HTMLDivElement | null>(null);
//   const modalRef = useRef<HTMLDivElement | null>(null);
//   const imageRef = useRef<HTMLImageElement | null>(null);
//   const scrollContainerRef = useRef<HTMLDivElement | null>(null);

//   const dragState = useRef({ startY: 0, dragging: false, currentY: 0 });

//   /* ─── zoom helpers ─── */
//   const zoomIn = useCallback(() => {
//     setZoomLevel(z => Math.min(+(z + 0.25).toFixed(2), 3));
//   }, []);
//   const zoomOut = useCallback(() => {
//     setZoomLevel(z => Math.max(+(z - 0.25).toFixed(2), 0.5));
//   }, []);
//   const resetZoom = useCallback(() => setZoomLevel(1), []);

//   /* ─── double-click toggles zoom to cursor location ─── */
//   const handleImageDoubleClick = (e: React.MouseEvent<HTMLImageElement>) => {
//     if (!imageRef.current || !scrollContainerRef.current) return;

//     if (zoomLevel === 1) {
//       const newZoom = 1.75;
//       const rect = imageRef.current.getBoundingClientRect();
//       const containerRect = scrollContainerRef.current.getBoundingClientRect();

//       const mouseXImage = e.clientX - rect.left;
//       const mouseYImage = e.clientY - rect.top;

//       const mouseXContainer = e.clientX - containerRect.left;
//       const mouseYContainer = e.clientY - containerRect.top;

//       const targetX = mouseXImage * newZoom - mouseXContainer;
//       const targetY = mouseYImage * newZoom - mouseYContainer;

//       setZoomLevel(newZoom);
//       requestAnimationFrame(() => {
//         if (scrollContainerRef.current) {
//           scrollContainerRef.current.scrollTo(targetX, targetY);
//         }
//       });
//     } else {
//       resetZoom();
//     }
//   };

//   /* ─── cleanup ─── */
//   const cleanupViewerState = useCallback(() => {
//     setViewerOpen(false);
//     setSelectedImage(null);
//     setImageLoaded(false);
//     setZoomLevel(1);
//     dragState.current = { startY: 0, dragging: false, currentY: 0 };
//   }, []);

//   /* ─── close with animation ─── */
//   const closeViewer = useCallback(() => {
//     const overlay = overlayRef.current;
//     const modal = modalRef.current;

//     if (!overlay || !modal) {
//       cleanupViewerState();
//       return;
//     }

//     gsap
//       .timeline({ onComplete: cleanupViewerState })
//       .to(modal, {
//         y: 20,
//         scale: 0.96,
//         opacity: 0,
//         duration: 0.2,
//         ease: 'power2.in',
//       })
//       .to(overlay, { opacity: 0, duration: 0.2, ease: 'power2.in' }, '<');
//   }, [cleanupViewerState]);

//   /* ─── keyboard shortcuts ─── */
//   useEffect(() => {
//     const onKey = (e: KeyboardEvent) => {
//       if (!viewerOpen) return;
//       if (e.key === 'Escape') closeViewer();
//       if (e.key === '+' || e.key === '=') zoomIn();
//       if (e.key === '-') zoomOut();
//       if (e.key === '0') resetZoom();
//     };

//     if (viewerOpen) {
//       window.addEventListener('keydown', onKey);
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = '';
//     }

//     return () => {
//       window.removeEventListener('keydown', onKey);
//       document.body.style.overflow = '';
//     };
//   }, [viewerOpen, closeViewer, zoomIn, zoomOut, resetZoom]);

//   /* ─── open animation ─── */
//   useEffect(() => {
//     if (!viewerOpen || !overlayRef.current || !modalRef.current) return;

//     const tl = gsap.timeline();
//     tl.fromTo(
//       overlayRef.current,
//       { opacity: 0 },
//       { opacity: 1, duration: 0.25, ease: 'power2.out' },
//     ).fromTo(
//       modalRef.current,
//       { y: 30, scale: 0.95, opacity: 0 },
//       { y: 0, scale: 1, opacity: 1, duration: 0.35, ease: 'power3.out' },
//       '-=0.15',
//     );

//     return () => {
//       tl.kill();
//     };
//   }, [viewerOpen]);

//   /* ─── open viewer ─── */
//   const openViewer = useCallback((imageUrl: string) => {
//     setSelectedImage(imageUrl);
//     setImageLoaded(false);
//     setZoomLevel(1);
//     requestAnimationFrame(() => setViewerOpen(true));
//   }, []);

//   /* ─── click inside HTML content to open image ─── */
//   const handleContentClick = useCallback(
//     (e: React.MouseEvent<HTMLDivElement>) => {
//       const target = e.target as HTMLElement;
//       const imgEl = target.tagName === 'IMG' ? target : target.closest('img');
//       if (imgEl) {
//         const src = imgEl.getAttribute('src');
//         if (src) {
//           e.preventDefault();
//           e.stopPropagation();
//           openViewer(src);
//         }
//       }
//     },
//     [openViewer],
//   );

//   /* ─── drag-to-dismiss (Only triggered on the Title Bar) ─── */
//   const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
//     if (zoomLevel > 1) return;

//     // Buttons বা বাটন ইন্টারফেস এলিমেন্ট হলে ড্র্যাগ ইগনোর করবে
//     if ((e.target as HTMLElement).closest('button')) return;

//     dragState.current = { startY: e.clientY, currentY: 0, dragging: true };
//     try {
//       e.currentTarget.setPointerCapture(e.pointerId);
//     } catch {
//       /* ignore */
//     }
//   };

//   const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
//     if (!dragState.current.dragging || zoomLevel > 1) return;
//     const diff = Math.max(0, e.clientY - dragState.current.startY);
//     dragState.current.currentY = diff;

//     if (modalRef.current)
//       gsap.to(modalRef.current, {
//         y: diff,
//         scale: Math.max(0.96, 1 - diff / 3000),
//         duration: 0.02,
//         ease: 'none',
//       });
//     if (overlayRef.current)
//       gsap.to(overlayRef.current, {
//         opacity: Math.max(0.2, 1 - diff / 1200),
//         duration: 0.02,
//         ease: 'none',
//       });
//   };

//   const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
//     if (!dragState.current.dragging) return;
//     dragState.current.dragging = false;

//     if (dragState.current.currentY > 140) {
//       closeViewer();
//       return;
//     }

//     if (modalRef.current)
//       gsap.to(modalRef.current, {
//         y: 0,
//         scale: 1,
//         opacity: 1,
//         duration: 0.25,
//         ease: 'power3.out',
//       });
//     if (overlayRef.current)
//       gsap.to(overlayRef.current, {
//         opacity: 1,
//         duration: 0.2,
//         ease: 'power2.out',
//       });
//   };

//   const handleImageLoad = (
//     e: React.SyntheticEvent<HTMLImageElement, Event>,
//   ) => {
//     setImageLoaded(true);
//     setImageSize({
//       width: e.currentTarget.naturalWidth,
//       height: e.currentTarget.naturalHeight,
//     });
//   };

//   const handleNewTab = () => {
//     if (selectedImage) {
//       window.open(selectedImage, '_blank', 'noopener,noreferrer');
//     }
//   };

//   return (
//     <div className="p-4 md:p-6 md:my-[32px] bg-[#f9f9f5] shadow-lg rounded-[16px] border font-[manrope] overflow-x-hidden relative">
//       {/* ── Header ── */}
//       <div className="flex items-center justify-between mb-4 gap-4">
//         <h2 className="text-lg md:text-2xl font-bold text-[#01281e] flex items-center gap-2">
//           <ExplainIcon /> Explanation:
//         </h2>
//         {isQuestionHidden && (
//           <button
//             onClick={onShowQuestion}
//             className="bg-[#b79e6b] text-white px-4 py-2 rounded-md text-sm font-semibold cursor-pointer hover:opacity-90 transition"
//           >
//             Show Question
//           </button>
//         )}
//       </div>

//       {/* ── Main explanation ── */}
//       <div
//         className={`${richTextClass} cursor-default`}
//         onClick={handleContentClick}
//         dangerouslySetInnerHTML={{ __html: explanation?.main || '' }}
//       />

//       {/* ── Why incorrect ── */}
//       <h3 className="text-lg md:text-2xl font-semibold text-[#01281e] mt-6 mb-2 flex items-center gap-2">
//         <CancelIcon /> Why the Other Options Are Incorrect:
//       </h3>
//       <div className="space-y-3 w-full" onClick={handleContentClick}>
//         {explanation?.whyIncorrect?.map((item, index) => (
//           <div key={index} className={richTextClass}>
//             {item.option && (
//               <strong className="text-[#01281e]">{item.option}: </strong>
//             )}
//             <div dangerouslySetInnerHTML={{ __html: item.text || '' }} />
//           </div>
//         ))}
//       </div>

//       {/* ── Pimping point ── */}
//       <h3 className="text-lg md:text-2xl font-semibold text-[#01281e] mt-6 mb-1 flex items-center gap-2">
//         <PimpingIcon /> Pimping Point:
//       </h3>
//       <div
//         className={`${richTextClass} text-[#01503b] [&_strong]:text-[#01503b] [&_b]:text-[#01503b]`}
//         onClick={handleContentClick}
//         dangerouslySetInnerHTML={{ __html: explanation?.pinningPoint || '' }}
//       />

//       {/* ── Memory trick ── */}
//       <h3 className="text-lg md:text-2xl font-semibold text-[#01281e] mt-6 mb-1 flex items-center gap-2">
//         <MemoryIcon /> Memory trick:
//       </h3>
//       <div
//         className={`${richTextClass} text-[#01281e] font-semibold [&_strong]:text-[#01281e] [&_b]:text-[#01281e]`}
//         onClick={handleContentClick}
//         dangerouslySetInnerHTML={{ __html: explanation?.memoryTrick || '' }}
//       />

//       {/* ── References ── */}
//       <h3 className="text-lg md:text-2xl font-semibold text-[#01281e] mt-6 mb-1 flex items-center gap-2">
//         <BookIcon /> References:
//       </h3>
//       <div className="space-y-2" onClick={handleContentClick}>
//         {explanation?.referance?.map((ref: string, index: number) => (
//           <div
//             key={index}
//             className={`${richTextClass} text-[#01281e] font-semibold [&_strong]:text-[#01281e] [&_b]:text-[#01281e]`}
//             dangerouslySetInnerHTML={{ __html: ref || '' }}
//           />
//         ))}
//       </div>

//       {selectedImage && (
//         <div
//           ref={overlayRef}
//           className={`fixed top-100 right-0 insert-0 z-[999999] flex items-center-safe justify-center p-4 pt-10 md:pt-10 `}
//           onClick={closeViewer}
//           aria-hidden={!viewerOpen}

//         >
//           {/* ── Window shell ── */}
//           <div
//             ref={modalRef}
//             className="flex flex-col overflow-hidden rounded-xl bg-white shadow-2xl border border-gray-200/80 transition-transform"
//             style={{
//               width: 'min(760px, 95vw)',
//               maxHeight:
//                 '88vh' ,
//               transformOrigin: 'center center',
//             }}
//             onClick={e => e.stopPropagation()}
//           >
//             {/* ── Title bar (Drag handles separated here) ── */}
//             <div
//               onPointerDown={handlePointerDown}
//               onPointerMove={handlePointerMove}
//               onPointerUp={handlePointerUp}
//               onPointerCancel={handlePointerUp}
//               className="flex items-center justify-between px-4 h-[44px] flex-shrink-0 select-none bg-gradient-to-b from-[#f9fafb] to-[#f3f4f6] border-b border-gray-200 cursor-grab active:cursor-grabbing"
//             >
//               {/* Left: traffic-light dots + title */}
//               <div className="flex items-center gap-3">
//                 <div className="flex items-center gap-1.5">
//                   {/* <button
//                     onClick={closeViewer}
//                     aria-label="Close"
//                     className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e] transition hover:brightness-90 cursor-pointer"
//                   /> */}

//                 </div>
//                 {/* <span className="text-[13px] font-semibold text-gray-500 tracking-wide">
//                   Exhibit Display
//                 </span> */}
//               </div>

//               {/* Right: zoom % + close icon button */}
//               <div className="flex items-center gap-2">
//                 <span className="text-[11px] font-mono text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-md border border-gray-200">
//                   {Math.round(zoomLevel * 100)}%
//                 </span>
//                 <button
//                   onClick={closeViewer}
//                   aria-label="Close exhibit"
//                   className="flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:bg-gray-200/70 hover:text-gray-700 transition"
//                 >
//                   <X size={16} strokeWidth={2.5} />
//                 </button>
//               </div>
//             </div>

//             {/* ── Image canvas/scroll container ── */}
//             <div
//               ref={scrollContainerRef}
//               className="relative flex-1 flex items-center justify-center overflow-auto bg-[#fafafa]"
//               style={{
//                 minHeight: '280px',
//                 maxHeight: 'calc(88vh - 88px)',
//               }}
//             >
//               {/* Dot-grid background matching look of screenshot */}
//               <div
//                 className="absolute inset-0 pointer-events-none"
//                 style={{
//                   backgroundImage:
//                     'radial-gradient(circle, #e5e7eb 1.2px, transparent 1.2px)',
//                   backgroundSize: '24px 24px',
//                 }}
//               />

//               {/* Loader */}
//               {!imageLoaded && (
//                 <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#fafafa]">
//                   <Loader2 className="h-8 w-8 animate-spin text-[#b79e6b]" />
//                   <span className="mt-2 text-xs text-gray-400">
//                     Loading exhibit…
//                   </span>
//                 </div>
//               )}

//               {/* Image box with conditional max-width scaling */}
//               <div className="relative z-10 flex items-center justify-center p-6 w-full h-full">
//                 <img
//                   ref={imageRef}
//                   src={selectedImage}
//                   alt="Exhibit"
//                   draggable={false}
//                   onLoad={handleImageLoad}
//                   onError={() => setImageLoaded(true)}
//                   onDoubleClick={handleImageDoubleClick}
//                   className={`rounded border border-gray-100 shadow-sm transition-opacity duration-300 select-none bg-white ${
//                     imageLoaded ? 'opacity-100' : 'opacity-0'
//                   } ${zoomLevel > 1 ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
//                   style={{
//                     maxWidth: zoomLevel > 1 ? 'none' : '100%',
//                     maxHeight: zoomLevel > 1 ? 'none' : 'calc(88vh - 160px)',
//                     width:
//                       zoomLevel > 1
//                         ? `${imageSize.width * zoomLevel}px`
//                         : 'auto',
//                     height:
//                       zoomLevel > 1
//                         ? `${imageSize.height * zoomLevel}px`
//                         : 'auto',
//                     willChange: 'width, height',
//                   }}
//                 />
//               </div>
//             </div>

//             {/* ── Bottom toolbar ── */}
//             <div className="flex items-center gap-1 px-3 h-[44px] flex-shrink-0 select-none bg-gray-50 border-t border-gray-200">
//               <ToolbarButton
//                 onClick={zoomIn}
//                 disabled={zoomLevel >= 3}
//                 icon={<ZoomIn size={14} />}
//                 label="Zoom In"
//               />

//               <ToolbarDivider />

//               <ToolbarButton
//                 onClick={zoomOut}
//                 disabled={zoomLevel <= 0.5}
//                 icon={<ZoomOut size={14} />}
//                 label="Zoom Out"
//               />

//               <ToolbarDivider />

//               <ToolbarButton
//                 onClick={resetZoom}
//                 disabled={zoomLevel === 1}
//                 icon={<RotateCcw size={13} />}
//                 label="Actual Size"
//               />

//               <ToolbarDivider />

//               <ToolbarButton
//                 onClick={handleNewTab}
//                 icon={<ExternalLink size={13} />}
//                 label="New Tab"
//               />

//               <div className="flex-1" />

//               <span className="text-[11px] text-gray-400 hidden sm:block">
//                 Double-click to Zoom · Drag bar down to Dismiss · Esc
//               </span>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// /* ── Toolbar Button ── */
// interface ToolbarButtonProps {
//   onClick: () => void;
//   icon: React.ReactNode;
//   label: string;
//   disabled?: boolean;
// }

// const ToolbarButton: React.FC<ToolbarButtonProps> = ({
//   onClick,
//   icon,
//   label,
//   disabled = false,
// }) => (
//   <button
//     onClick={onClick}
//     disabled={disabled}
//     className={`
//       flex items-center gap-1.5 px-3 h-[30px] rounded-md text-[12px] font-medium
//       transition duration-100 cursor-pointer select-none
//       ${
//         disabled
//           ? 'text-gray-300 cursor-not-allowed pointer-events-none'
//           : 'text-gray-600 hover:bg-gray-200/60 hover:text-gray-900 active:bg-gray-200'
//       }
//     `}
//   >
//     {icon}
//     <span>{label}</span>
//   </button>
// );

// /* ── Toolbar divider ── */
// const ToolbarDivider: React.FC = () => (
//   <div className="w-px h-4 bg-gray-300 mx-1 flex-shrink-0" />
// );

// export default ExplanationPanel;
