import React from 'react';
import Image from 'next/image';
import BookIcon from '../reusable/icons/BookIcon';
import ExplainIcon from '../reusable/icons/ExplainIcon';
import CancelIcon from '../reusable/icons/CancelIcon';
import PimpingIcon from '../reusable/icons/PimpingIcon';
import MemoryIcon from '../reusable/icons/MemoryIcon';

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

  return (
    <div className="p-4 md:p-6 md:my-[32px] bg-[#f9f9f5] shadow-lg rounded-[16px] border font-[manrope] md:max-h-[1521px] overflow-x-hidden custom-scrollbar">
      <div className="flex items-center justify-between mb-4 gap-4">
        <h2 className="text-lg font-bold text-[#01281e] flex items-center gap-2">
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
        className={richTextClass}
        dangerouslySetInnerHTML={{
          __html: explanation?.main || '',
        }}
      />

      {/* Explanation Image */}
      {explanation?.image && (
        <div className="my-4">
          <Image
            src={
              explanation.image.startsWith('http')
                ? explanation.image
                : `/images/${explanation.image}`
            }
            alt="Explanation"
            width={500}
            height={500}
            className="rounded-md w-full max-w-[500px] h-auto object-contain"
            unoptimized
          />
        </div>
      )}

      {/* Why the Other Options Are Incorrect */}
      <h3 className="text-[18px] md:text-[20px] font-semibold text-[#01281e] mt-6 mb-2 flex items-center gap-2">
        <CancelIcon /> Why the Other Options Are Incorrect:
      </h3>

      <div className="space-y-3 w-full">
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
      <h3 className="text-[18px] font-semibold text-[#01281e] mt-6 mb-1 flex items-center gap-2">
        <PimpingIcon /> Pimping Point:
      </h3>

      <div
        className={`
          ${richTextClass}
          text-[#01503b]
          [&_strong]:text-[#01503b]
          [&_b]:text-[#01503b]
        `}
        dangerouslySetInnerHTML={{
          __html: explanation?.pinningPoint || '',
        }}
      />

      {/* Memory Trick */}
      <h3 className="text-[18px] font-semibold text-[#01281e] mt-6 mb-1 flex items-center gap-2">
        <MemoryIcon /> Memory trick:
      </h3>

      <div
        className={`
          ${richTextClass}
          text-[#01281e] font-semibold
          [&_strong]:text-[#01281e]
          [&_b]:text-[#01281e]
        `}
        dangerouslySetInnerHTML={{
          __html: explanation?.memoryTrick || '',
        }}
      />

      {/* References */}
      <h3 className="text-[18px] font-semibold text-[#01281e] mt-6 mb-1 flex items-center gap-2">
        <BookIcon /> References:
      </h3>

      <div className="space-y-2">
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
    </div>
  );
};

export default ExplanationPanel;
