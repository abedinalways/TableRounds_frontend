'use client';

import React, { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Loader2, SkipForward } from 'lucide-react';
import { TopbarCheckbox } from '../topbarCheckbox';

import Flag from '../reusable/icons/Flag';
import ChatBubble from '../reusable/icons/ChatBubble';
import ZoomInIcon from '../reusable/icons/ZoomInIcon';
import ZoomOutIcon from '../reusable/icons/ZoomOutIcon';

import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { QuizDetailsUI } from '@/types/test-session';
import { useCompleteTestMutation } from '@/app/redux/api/testSessionApi';
import { toast } from 'sonner';

interface QuizTopbarProps {
  progressValue: number;
  currentQuestion: number;
  quizDetails: QuizDetailsUI;
  totalQuestions: number;
  questionID: string;
  isMarked: boolean;
  testId: string;
  onToggleMark: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onSkip: () => void;
}

const QuizTopbar: React.FC<QuizTopbarProps> = ({
  progressValue,
  currentQuestion,
  totalQuestions,
  isMarked,
  quizDetails,
  onToggleMark,
  onNext,
  onPrevious,
  onZoomIn,
  testId,
  onZoomOut,
}) => {
  const router = useRouter();

  const [completeTest] = useCompleteTestMutation();
  const [isSubmittingTest, setIsSubmittingTest] = useState(false);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);

  const isLastQuestion = currentQuestion === totalQuestions;

  const skipTest = () => {
    router.push(`/dashboard/user/incomplete-test`);
  };

  const handleConfirmSubmitTest = async () => {
    if (isSubmittingTest || isTestSubmitted) return;

    try {
      setIsSubmittingTest(true);

      toast.loading('Submitting test...', {
        id: 'submit-test-status',
      });

      await completeTest(testId).unwrap();

      setIsTestSubmitted(true);

      toast.success('Test submitted successfully.', {
        id: 'submit-test-status',
      });

      setTimeout(() => {
        router.push(`/dashboard/user/test-complete/${testId}`);
      }, 800);
    } catch (err) {
      console.error('Submit test failed', err);

      toast.error('Failed to submit test. Please try again.', {
        id: 'submit-test-status',
      });
    } finally {
      setIsSubmittingTest(false);
    }
  };

  const handleSubmitTestClick = () => {
    if (isSubmittingTest || isTestSubmitted) return;

    toast('Are you sure you want to submit?', {
      id: 'submit-test-confirmation',
      description:
        'Once submitted, you will be redirected to the test result page.',
      action: {
        label: 'Yes, Submit',
        onClick: () => {
          toast.dismiss('submit-test-confirmation');
          void handleConfirmSubmitTest();
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {
          toast.dismiss('submit-test-confirmation');
        },
      },
    });
  };

  return (
    <div className="md:flex items-center md:justify-between gap-4 rounded-[12px] xl:text-[18px] md:text-sm text-xs border question-bg py-4 md:h-30">
      <div className="md:flex items-center space-y-2">
        <div className="md:px-2 px-1 flex flex-col justify-between">
          <Progress value={progressValue} className="md:h-5 h-2 bg-white/60" />
        </div>

        <div className="space-x-5 flex flex-col justify-center items-center  gap-5 mx-5 ">
          <div className="text-sm md:text-[18px] text-white font-bold flex items-center">
            {String(currentQuestion).padStart(2, '0')} / {totalQuestions}
          </div>
          <div className="md:text-[14px] flex justify-center text-xs text-white">
            <div className="text-xs">
              Question ID:{' '}
              <span className="text-xs">{quizDetails?.question_id}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap md:flex-nowrap items-center gap-3 md:gap-3 xl:gap-3 md:text-[14px] text-xs">
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
                  'cursor-pointer text-yellow-400',
                )}
                onClick={() =>
                  router.push(`/dashboard/user/create-test/mark/${testId}`)
                }
              />
            </span>
            <div className="text-white flex items-center justify-center">
              Mark
            </div>
          </div>

          <button className="flex items-center justify-center p-4">
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=contact@tablerounds.ai"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Send email via Gmail"
              className="group  text-sm font-medium text-gray-600 hover:text-[#1e5a4f] transition-all duration-200"
            >
              <div className="flex flex-col items-center justify-center my-8">
                <ChatBubble className="md:size-8 size-4 flex items-center justify-center mt-1" />
                <span className="text-white cursor-pointer flex flex-col items-center mt-1">
                  Feedback
                </span>
              </div>
            </a>
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

          <button
            onClick={skipTest}
            className="text-white cursor-pointer p-2 gap-2 flex flex-col items-center"
          >
            <SkipForward className="md:size-8 size-4" />
           Pause Test
          </button>
        </div>
      </div>

      <div className="flex gap-3 mx-2">
        <button
          onClick={onPrevious}
          disabled={currentQuestion === 1}
          className={cn(
            'bg-[#b79e6b] text-white cursor-pointer rounded-md text-center text-[16px] px-3 py-3',
            currentQuestion === 1 && 'opacity-50 cursor-not-allowed',
          )}
        >
          <span className="flex items-center">Previous</span>
        </button>

        {isLastQuestion ? (
          <button
            type="button"
            onClick={handleSubmitTestClick}
            disabled={isSubmittingTest || isTestSubmitted}
            className={cn(
              'bg-[#b79e6b] cursor-pointer text-white rounded-md text-center text-[16px] px-3 py-3 flex items-center justify-center gap-2',
              (isSubmittingTest || isTestSubmitted) &&
                'opacity-60 cursor-not-allowed',
            )}
          >
            {isSubmittingTest && <Loader2 className="h-4 w-4 animate-spin" />}

            {isSubmittingTest
              ? 'Submitting...'
              : isTestSubmitted
                ? 'Submitted'
                : 'Submit Test'}
          </button>
        ) : (
          <button
            onClick={onNext}
            className="bg-[#b79e6b] cursor-pointer text-white rounded-md text-center text-[16px] px-3 py-3"
          >
            <span className="flex items-center">
              Next <ArrowRight size="18px" />
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizTopbar;
