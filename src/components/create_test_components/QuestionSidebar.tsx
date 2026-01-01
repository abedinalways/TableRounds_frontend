import React from 'react';
import Flag from '../reusable/icons/Flag';
import { cn } from '@/lib/utils';
import { MarkedQuestion } from '@/types/markedQuestion';

interface QuestionSidebarProps {
  totalQuestions: number;
  currentQuestion: number;
  markedQuestions: MarkedQuestion[];
  onJumpTo?: (index: number) => void;
}

const QuestionSidebar: React.FC<QuestionSidebarProps> = ({
  totalQuestions,
  currentQuestion,
  markedQuestions,
  onJumpTo,
}) => {
  return (
    <div className="lex md:col-span-1 md:flex-col flex-row gap-2 rounded-md mt-2 md:mt-4 mb-2 md:mb-4 background p-2 md:max-h-[700px] overflow-x-auto md:overflow-y-auto custom-scroll">
      <aside className="flex md:flex-col gap-3 h-full">
        {Array.from({ length: totalQuestions }, (_, i) => {
          const qIndex = i + 1;
          const isCurrent = qIndex === currentQuestion;
          const isMarkedQuestion = markedQuestions.some(q => q.index === qIndex);

          return (
            <button
              key={qIndex}
              onClick={() => onJumpTo && onJumpTo(qIndex)}
              className={cn(
                'flex items-center justify-between px-3 py-2 md:w-[80px] w-[120px] rounded-md border transition-all',
                isCurrent
                  ? 'bg-[#b79e6b] text-white border-[#b79e6b]'
                  : 'bg-[#01281e] text-white/80 border-[#084434]'
              )}
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'w-4 h-4 rounded-full border flex items-center justify-center',
                    isCurrent ? 'border-white bg-white' : 'border-white/50'
                  )}
                >
                  {isCurrent && <div className="w-2 h-2 rounded-full bg-[#b79e6b]" />}
                </div>

                <span className="text-sm">{qIndex}</span>
              </div>

              {isMarkedQuestion && (
                <Flag className="size-4 text-yellow-400 shrink-0" />
              )}
            </button>
          );
        })}
      </aside>
    </div>
  );
};

export default QuestionSidebar;
