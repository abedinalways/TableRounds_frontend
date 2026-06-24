import React, { useState, useEffect, useCallback } from 'react';
import BookIcon from '../reusable/icons/BookIcon';
import ExplainIcon from '../reusable/icons/ExplainIcon';
import CancelIcon from '../reusable/icons/CancelIcon';
import PimpingIcon from '../reusable/icons/PimpingIcon';
import MemoryIcon from '../reusable/icons/MemoryIcon';
import { X } from 'lucide-react';

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
  text-gray-700 text-[16px] md:text-[18px] leading-relaxed w-full
  [&_p]:mb-3
  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:mb-3
  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:mb-3
  [&_li]:pl-1
  [&_strong]:font-bold [&_strong]:text-[#01281e]
  [&_b]:font-bold [&_b]:text-[#01281e]
  [&_em]:italic
`;

const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  quizDetails,
  isQuestionHidden,
  onShowQuestion,
}) => {
  const explanation = quizDetails?.explanation;
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setViewerOpen(false);
        setSelectedImage(null);
      }
    };

    if (viewerOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [viewerOpen]);

  const openViewer = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    requestAnimationFrame(() => {
      setViewerOpen(true);
    });
  };

  const closeViewer = () => {
    setViewerOpen(false);
    setTimeout(() => setSelectedImage(null), 300);
  };

  const handleContentClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      const imgEl = target.tagName === 'IMG' ? target : target.closest('img');
      if (imgEl) {
        const src = imgEl.getAttribute('src');
        if (src) {
          e.preventDefault();
          openViewer(src);
        }
      }
    },
    [],
  );

  return (
    <div className="p-4 md:p-6 md:my-[32px] bg-[#f9f9f5] shadow-lg rounded-[16px] border font-[manrope] overflow-x-hidden custom-scrollbar">
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

      {/* Explanation */}
      <div
        className={`${richTextClass} cursor-default`}
        onClick={handleContentClick}
        dangerouslySetInnerHTML={{
          __html: explanation?.main || '',
        }}
      />

      {/* Why the Other Options Are Incorrect */}
      <h3 className="text-lg md:text-2xl font-semibold text-[#01281e] mt-6 mb-2 flex items-center gap-2">
        <CancelIcon /> Why the Other Options Are Incorrect:
      </h3>

      <div className="space-y-3 w-full" onClick={handleContentClick}>
        {explanation?.whyIncorrect?.map((item, index) => (
          <div key={index} className={richTextClass}>
            {item.option && (
              <strong className="text-[#01281e]">{item.option}: </strong>
            )}

            <div
              dangerouslySetInnerHTML={{
                __html: item.text || '',
              }}
            />
          </div>
        ))}
      </div>

      {/* Pimping Point */}
      <h3 className="text-lg md:text-2xl font-semibold text-[#01281e] mt-6 mb-1 flex items-center gap-2">
        <PimpingIcon /> Pimping Point:
      </h3>

      <div
        className={`
          ${richTextClass}
          text-[#01503b]
          [&_strong]:text-[#01503b]
          [&_b]:text-[#01503b]
        `}
        onClick={handleContentClick}
        dangerouslySetInnerHTML={{
          __html: explanation?.pinningPoint || '',
        }}
      />

      {/* Memory Trick */}
      <h3 className="text-lg md:text-2xl font-semibold text-[#01281e] mt-6 mb-1 flex items-center gap-2">
        <MemoryIcon /> Memory trick:
      </h3>

      <div
        className={`
          ${richTextClass}
          text-[#01281e] font-semibold
          [&_strong]:text-[#01281e]
          [&_b]:text-[#01281e]
        `}
        onClick={handleContentClick}
        dangerouslySetInnerHTML={{
          __html: explanation?.memoryTrick || '',
        }}
      />

      {/* References */}
      <h3 className="text-lg md:text-2xl font-semibold text-[#01281e] mt-6 mb-1 flex items-center gap-2">
        <BookIcon /> References:
      </h3>

      <div className="space-y-2" onClick={handleContentClick}>
        {explanation?.referance?.map((ref: string, index: number) => (
          <div
            key={index}
            className={`
              ${richTextClass}
              text-[#01281e] font-semibold
              [&_strong]:text-[#01281e]
              [&_b]:text-[#01281e]
            `}
            dangerouslySetInnerHTML={{
              __html: ref || '',
            }}
          />
        ))}
      </div>

      {/* Image Viewer Modal */}
      {selectedImage && (
        <div
          className={`fixed inset-0 z-[999999] flex items-center justify-center p-6 transition-all duration-300 ${
            viewerOpen
              ? 'bg-black/80 opacity-100'
              : 'bg-black/0 opacity-0 pointer-events-none'
          }`}
          onClick={closeViewer}
        >
          <button
            type="button"
            onClick={closeViewer}
            className={`absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition ${
              viewerOpen ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}
          >
            <X size={22} />
          </button>

          <div
            className={`flex items-center justify-center transition-all duration-300 ease-out ${
              viewerOpen
                ? 'scale-100 translate-y-0 opacity-100'
                : 'scale-75 translate-y-8 opacity-0'
            }`}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 'calc(100vw - 48px)',
              maxHeight: 'calc(100vh - 48px)',
            }}
          >
            <img
              src={selectedImage}
              alt="Preview"
              className="rounded-xl shadow-2xl"
              draggable={false}
              style={{
                maxWidth: 'calc(100vw - 48px)',
                maxHeight: 'calc(100vh - 48px)',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExplanationPanel;