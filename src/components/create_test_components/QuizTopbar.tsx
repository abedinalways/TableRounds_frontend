import React from 'react';
import { Progress } from '@/components/ui/progress';
import { ArrowRight } from 'lucide-react';
import { TopbarCheckbox } from '../topbarCheckbox';
import Btn from '../reusable/button/Btn';
import Flag from '../reusable/icons/Flag';
import ChatBubble from '../reusable/icons/ChatBubble';
import ZoomInIcon from '../reusable/icons/ZoomInIcon';
import ZoomOutIcon from '../reusable/icons/ZoomOutIcon';
import PauseIcon from '../reusable/icons/PauseIcon';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface QuizTopbarProps {
  progressValue: number;
  currentQuestion: number;
  totalQuestions: number;
  questionID: string;
  isMarked: boolean;
  onToggleMark: () => void;
  onNext: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const QuizTopbar: React.FC<QuizTopbarProps> = ({
  progressValue,
  currentQuestion,
  totalQuestions,
  questionID,
  isMarked,
  onToggleMark,
  onNext,
  onZoomIn,
  onZoomOut,
}) => {
  const router = useRouter();

  return (
    <div className="md:flex items-center md:justify-between gap-4 rounded-[12px] xl:text-[18px] md:text-sm text-xs border question-bg py-4">
      <div className="md:flex items-center space-y-2">
        <div className="md:px-2 px-1">
          <Progress value={progressValue} className="md:h-5 h-2 bg-white/60" />
        </div>

        <div className="space-x-2 flex flex-col gap-4 md:items-start mx-4 md:mx-0">
          <div className="text-sm md:text-[20px] text-white font-bold">
            {String(currentQuestion).padStart(2, '0')} / {totalQuestions}
          </div>
          <div className="md:text-[18px] text-sm text-white">
            Question ID: {questionID}
          </div>
        </div>

        <div className="flex flex-wrap md:flex-nowrap items-center gap-3 md:gap-6 xl:gap-10 md:text-[18px] text-xs">
          <div>
            <span className="flex items-center gap-2">
              <button
                onClick={onToggleMark}
                className="text-white cursor-pointer p-2 gap-2 flex flex-col"
              >
                <TopbarCheckbox
                  checked={isMarked}
                  className="md:size-6 size-4"
                />
              </button>

              <Flag
                className={cn(
                  'size-4 md:size-8',
                  'cursor-pointer text-yellow-400'
                )}
                onClick={() => router.push('/dashboard/create-test/mark')}
              />
            </span>
            <div className="text-white flex items-center justify-center">
              Mark
            </div>
          </div>

          <button className="text-white cursor-pointer p-2 gap-2 flex flex-col items-center">
            <ChatBubble className="md:size-8 size-4" /> Feedback
          </button>

          <button
            onClick={onZoomIn}
            className="text-white cursor-pointer p-2 gap-2 flex flex-col items-center"
          >
            <ZoomInIcon className="md:size-8 size-4" />
            Zoom In
          </button>

          <button
            onClick={onZoomOut}
            className="text-white cursor-pointer p-2 gap-2 flex flex-col items-center"
          >
            <ZoomOutIcon className="md:size-8 size-4" />
            Zoom Out
          </button>

          <button className="text-white cursor-pointer p-2 gap-2 flex flex-col items-center">
            <PauseIcon className="md:size-8 size-4" /> Pause Test
          </button>
        </div>
      </div>

      <Btn
        onClick={onNext}
        className="bg-[#b79e6b] text-white transition-colors md:w-[97px] w-[67px] h-[53px] md:mx-10 mx-4"
      >
        <span className="flex items-center">
          Next <ArrowRight size="18px" />
        </span>
      </Btn>
    </div>
  );
};

export default QuizTopbar;
