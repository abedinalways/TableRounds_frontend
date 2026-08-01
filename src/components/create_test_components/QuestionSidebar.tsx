import React from 'react';
import Flag from '../reusable/icons/Flag';
import { cn } from '@/lib/utils';
import { MarkedQuestion } from '@/types/markedQuestion';
import { QuizQuestionDataUI } from '@/types/test-session';
import CheckIcon from '../reusable/icons/CheckIcon';
import { X } from 'lucide-react';

interface QuestionSidebarProps {
  totalQuestions: number;
  currentQuestion: number;
  markedQuestions: MarkedQuestion[];
  questions?: QuizQuestionDataUI[];
  onJumpTo?: (index: number) => void;
}

const QuestionSidebar: React.FC<QuestionSidebarProps> = ({
  totalQuestions,
  currentQuestion,
  markedQuestions,
  questions = [],
  onJumpTo,
}) => {
  const getQuestionStatus = (index: number) => {
    const question = questions[index];

    const userAnswerId = question?.quizDetails?.userAnswerId;
    const correctAnswerId = question?.quizDetails?.correctAnswerId;

    if (!userAnswerId || !correctAnswerId) return 'unanswered';

    return String(userAnswerId) === String(correctAnswerId)
      ? 'correct'
      : 'wrong';
  };

  return (
    <div className="flex flex-row gap-2 rounded-md mt-2 md:mt-8 mb-2 md:mb-4 background p-3 lg:max-h-[700px]  overflow-x-auto lg:overflow-y-auto custom-scroll w-full  ">
      <aside className="flex  lg:flex-col gap-3 h-full w-full ">
        {Array.from({ length: totalQuestions }, (_, i) => {
          const qIndex = i + 1;
          const isCurrent = qIndex === currentQuestion;

          const isMarkedQuestion =
            markedQuestions.some(q => q.index === qIndex) ||
            Boolean((questions[i]?.quizDetails as any)?.is_marked);

          const status = getQuestionStatus(i);
          const isCorrect = status === 'correct';
          const isWrong = status === 'wrong';

          return (
            <button
              key={qIndex}
              onClick={() => onJumpTo && onJumpTo(qIndex)}
              className={cn(
                'flex items-center justify-between px-3 py-2 md:w-[70px] lg:w-[80px] w-full rounded-md border transition-all',
                isCurrent
                  ? 'bg-[#b79e6b] text-white border-[#b79e6b]'
                  : 'bg-[#01281e] text-white/80 border-[#084434]',
              )}
            >
              <div className="flex items-center gap-2 ">
                <div
                  className={cn(
                    'w-4 h-4 rounded-full border flex items-center justify-center transition-all',
                    isCorrect && 'bg-green-500 border-green-500 text-white',
                    isWrong && 'bg-red-500 border-red-500 text-white',
                    !isCorrect &&
                      !isWrong &&
                      isCurrent &&
                      'border-white bg-white',
                    !isCorrect && !isWrong && !isCurrent && 'border-white/50',
                  )}
                >
                  {isCorrect ? (
                    <CheckIcon className="w-3 h-3" strokeWidth={3} />
                  ) : isWrong ? (
                    <X className="w-3 h-3" strokeWidth={3} />
                  ) : (
                    isCurrent && (
                      <div className="w-2 h-2 rounded-full bg-[#b79e6b]" />
                    )
                  )}
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