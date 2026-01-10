import React from 'react';
import Image from 'next/image';

import OptionIcon from '../reusable/icons/OpotionIcon';
import BookIcon from '../reusable/icons/BookIcon';
import ExplainIcon from '../reusable/icons/ExplainIcon';
import CancelIcon from '../reusable/icons/CancelIcon';
import PimpingIcon from '../reusable/icons/PimpingIcon';
import MemoryIcon from '../reusable/icons/MemoryIcon';

interface Explanation {
  main: string;
  image?: string | null;
  whyIncorrect: { option: string; text: string }[];
  pinningPoint?: string;
  memoryTrick?: string;
  references: string[];
}

interface ExplanationPanelProps {
  quizDetails: { explanation: Explanation };
  isQuestionHidden: boolean;
  onShowQuestion: () => void;
}

const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  quizDetails,
  isQuestionHidden,
  onShowQuestion,
}) => {
  return (
    <div className="p-6 md:my-[32px] bg-[#f9f9f5] shadow-lg rounded-[16px] border font-[manrope] md:max-h-[1521px] overflow-x-hidden custom-scrollbar">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#01281e] flex items-center gap-2">
          <ExplainIcon/> Explanation:
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

      <p className="text-gray-700 md:text-[18px] leading-relaxed  whitespace-pre-line w-full">
        {quizDetails.explanation.main}
      </p>

      {quizDetails.explanation.image && (
        <div className="my-4">
          <Image
            src={quizDetails.explanation.image}
            width={556}
            height={318}
            alt="Explanation Image"
            className="rounded-md"
          />
        </div>
      )}

      <h3 className="text-[20px] font-semibold text-[#01281e] mt-6 mb-2 flex items-center gap-2">
        <CancelIcon/> Why the Other Options Are Incorrect:
      </h3>

      <div className="space-y-3 whitespace-pre-line w-full">
        {quizDetails.explanation.whyIncorrect.map(
          (item: { option: string; text: string }, idx: number) => (
            <div key={idx} className="text-[18px] text-gray-700">
              <span className="font-semibold text-[#01503b]">
                {item.option}:
              </span>{' '}
              <span className="leading-relaxed whitespace-pre-line">
                {item.text}
              </span>
            </div>
          )
        )}
      </div>

      <h3 className="text-md font-semibold text-[#01281e] mt-6 mb-1 flex items-center gap-2 text-[18px]">
        <PimpingIcon/> Pimping Point:
      </h3>
      <p className="text-[#01503b] text-[18px] whitespace-pre-line">
        {quizDetails.explanation.pinningPoint}
      </p>

      <h3 className="text-md font-semibold text-[#01281e] mt-6 mb-1 flex items-center gap-2 text-[18px]">
        <MemoryIcon /> Memory trick:
      </h3>
      <p className="text-[#01281e] font-semibold leading-[150%] text-[18px]">
        {quizDetails.explanation.memoryTrick}
      </p>

      <h3 className="text-md font-semibold text-[#01281e] mt-6 mb-1 flex items-center gap-2 text-[18px]">
        <BookIcon /> References:
      </h3>
      <ul className="list-none pl-6 text-[#01281e] text-[18px] font-semibold space-y-1">
        {quizDetails.explanation.references.map(
          (ref: string, index: number) => (
            <li key={index}>{ref}</li>
          )
        )}
      </ul>
    </div>
  );
};

export default ExplanationPanel;
