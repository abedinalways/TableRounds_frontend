import React from 'react';
import Image from 'next/image';
import BookIcon from '../reusable/icons/BookIcon';
import ExplainIcon from '../reusable/icons/ExplainIcon';
import CancelIcon from '../reusable/icons/CancelIcon';
import PimpingIcon from '../reusable/icons/PimpingIcon';
import MemoryIcon from '../reusable/icons/MemoryIcon';

// Function to convert HTML to plain text
const htmlToPlainText = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

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

const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  quizDetails,
  isQuestionHidden,
  onShowQuestion,
}) => {
  return (
    <div className="p-6 md:my-[32px] bg-[#f9f9f5] shadow-lg rounded-[16px] border font-[manrope] md:max-h-[1521px] overflow-x-hidden custom-scrollbar">
      <div className="flex items-center justify-between mb-4">
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
      {/* <p className="text-gray-700 md:text-[18px] leading-relaxed whitespace-pre-line w-full">
        {htmlToPlainText(quizDetails.explanation.main || '')}
      </p> */}

      <div
        className="text-gray-700 md:text-[18px] leading-relaxed whitespace-pre-line w-full"
        dangerouslySetInnerHTML={{
          __html: quizDetails.explanation.main || '',
        }}
      />

      {/* Explanation Image */}
      {quizDetails.explanation.image && (
        <div className="my-4">
          <Image
            src={
              quizDetails?.explanation?.image.startsWith('http')
                ? quizDetails.explanation.image
                : `/images/${quizDetails.explanation.image}`
            }
            alt="Explanation Image"
            width={500}
            height={500}
            className="rounded-md"
          />
        </div>
      )}

      {/* Why the Other Options Are Incorrect */}
      <h3 className="text-[20px] font-semibold text-[#01281e] mt-6 mb-2 flex items-center gap-2">
        <CancelIcon /> Why the Other Options Are Incorrect:
      </h3>

      <div className="space-y-3 whitespace-pre-line w-full">
        {quizDetails?.explanation?.whyIncorrect &&
          quizDetails.explanation.whyIncorrect.map((item, index) => (
            <div
              key={index}
              className="text-[18px] text-gray-700 whitespace-pre-line"
            >
              <strong>{item.option}: </strong>
              {htmlToPlainText(item.text || '')}
            </div>
          ))}
      </div>

      {/* Pimping Point */}
      <h3 className="text-md font-semibold text-[#01281e] mt-6 mb-1 flex items-center gap-2 text-[18px]">
        <PimpingIcon /> Pimping Point:
      </h3>
      <p className="text-[#01503b] text-[18px] whitespace-pre-line">
        {htmlToPlainText(quizDetails.explanation.pinningPoint || '')}
      </p>

      {/* Memory Trick */}
      <h3 className="text-md font-semibold text-[#01281e] mt-6 mb-1 flex items-center gap-2 text-[18px]">
        <MemoryIcon /> Memory trick:
      </h3>
      <p className="text-[#01281e] font-semibold leading-[150%] text-[18px]">
        {htmlToPlainText(quizDetails.explanation.memoryTrick || '')}
      </p>

      {/* References */}
      <h3 className="text-md font-semibold text-[#01281e] mt-6 mb-1 flex items-center gap-2 text-[18px]">
        <BookIcon /> Referances:
      </h3>
      <ul className="list-none pl-6 text-[#01281e] text-[18px] font-semibold space-y-1">
        {quizDetails.explanation.referance.map((ref: string, index: number) => (
          <li key={index}>{htmlToPlainText(ref || '')}</li>
        ))}
      </ul>
    </div>
  );
};

export default ExplanationPanel;
