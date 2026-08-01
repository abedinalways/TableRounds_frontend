

'use client';

import React, { useState } from 'react';
import { Progress } from '@/components/ui/progress';

import { TopbarCheckbox } from '../topbarCheckbox';

import Flag from '../reusable/icons/Flag';
import ChatBubble from '../reusable/icons/ChatBubble';
import ZoomInIcon from '../reusable/icons/ZoomInIcon';
import ZoomOutIcon from '../reusable/icons/ZoomOutIcon';
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  SkipForward,
  XCircle,
} from 'lucide-react';
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
  isReviewMode?: boolean;
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
  onSkip,
  isReviewMode = false,
}) => {
  const router = useRouter();

  const [completeTest] = useCompleteTestMutation();
  const [isSubmittingTest, setIsSubmittingTest] = useState(false);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);

  const isLastQuestion = currentQuestion === totalQuestions;

  const showSubmitStatusToast = (
    type: 'loading' | 'success' | 'error',
    title: string,
    description?: string,
  ) => {
    toast.custom(
      t => (
        <div className="w-full max-w-[calc(100vw-32px)] overflow-hidden rounded-2xl border border-[#b79e6b]/40 bg-[#01281e] text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div className="h-1 w-full bg-[#b79e6b]" />

          <div className="flex items-start gap-3 p-4">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#b79e6b]/20 text-[#b79e6b]">
              {type === 'loading' && (
                <Loader2 className="h-5 w-5 animate-spin" />
              )}
              {type === 'success' && <CheckCircle2 className="h-5 w-5" />}
              {type === 'error' && <XCircle className="h-5 w-5" />}
            </div>

            <div className="flex-1">
              <h4 className="text-[15px] font-semibold leading-5 text-white">
                {title}
              </h4>

              {description && (
                <p className="mt-1 text-[13px] leading-5 text-white/75">
                  {description}
                </p>
              )}
            </div>

            {type !== 'loading' && (
              <button
                type="button"
                onClick={() => toast.dismiss(t)}
                className="rounded-full p-1 text-white/60 transition hover:bg-white/10 hover:text-white"
                aria-label="Close toast"
              >
                ×
              </button>
            )}
          </div>
        </div>
      ),
      {
        id: 'submit-test-status',
        duration: type === 'loading' ? 100000 : 3000,
      },
    );
  };

  const skipTest = () => {
    router.push(`/dashboard/user/incomplete-test`);
  };

  const handleConfirmSubmitTest = async () => {
    if (isSubmittingTest || isTestSubmitted) return;

    try {
      setIsSubmittingTest(true);

      showSubmitStatusToast(
        'loading',
        'Submitting your test...',
        'Please wait while we securely save your answers.',
      );

      await completeTest(testId).unwrap();

      setIsTestSubmitted(true);

      showSubmitStatusToast(
        'success',
        'Test submitted successfully',
        'You will be redirected to the result page shortly.',
      );

      setTimeout(() => {
        router.push(`/dashboard/user/test-complete/${testId}`);
      }, 800);
    } catch (err) {
      console.error('Submit test failed', err);

      showSubmitStatusToast(
        'error',
        'Submission failed',
        'Something went wrong. Please try again.',
      );
    } finally {
      setIsSubmittingTest(false);
    }
  };

  const handleSubmitTestClick = () => {
    if (isSubmittingTest || isTestSubmitted) return;

    toast.custom(
      t => (
        <div className="w-[390px] max-w-[calc(100vw-32px)] overflow-hidden rounded-2xl border border-[#b79e6b]/45 bg-[#01281e] text-white shadow-[0_24px_70px_rgba(0,0,0,0.38)]">
          <div className="h-1 w-full bg-[#b79e6b]" />

          <div className="p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#b79e6b]/20 text-[#b79e6b]">
                <CheckCircle2 className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <h3 className="text-[16px] font-semibold leading-6 text-white">
                  Submit your test?
                </h3>

                <p className="mt-1 text-[13px] leading-5 text-white/75">
                  Once submitted, your answers will be finalized and you will be
                  redirected to the result page.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => toast.dismiss(t)}
                className="rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/85 transition hover:bg-white/15 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  toast.dismiss(t);
                  void handleConfirmSubmitTest();
                }}
                className="rounded-lg bg-[#b79e6b] px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-[#a58d5e]"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      ),
      {
        id: 'submit-test-confirmation',
        duration: 12000,
      },
    );
  };

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-4 rounded-[12px] xl:text-[18px] md:text-sm text-xs border question-bg py-4">
      <div className="flex flex-col lg:flex-row items-center gap-4 w-full lg:w-auto overflow-x-auto scrollbar-hide">
        <div className="md:px-2 px-1 flex flex-col justify-between">
          <Progress value={progressValue} className="md:h-5 h-2 bg-white/60" />
        </div>

        <div className="space-x-5 flex flex-col justify-center items-center gap-5 mx-5">
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
          {!isReviewMode && (
            <div>
              <span className="flex items-center gap-2">
                <button
                  type="button"
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
          )}

          <button className="flex items-center justify-center p-4">
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=contact@tablerounds.ai"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Send email via Gmail"
              className="group text-sm font-medium text-gray-600 hover:text-[#1e5a4f] transition-all duration-200"
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

          {!isReviewMode && (
            <button
              onClick={onSkip}
              className="text-white cursor-pointer p-2 gap-2 flex flex-col items-center"
            >
              <SkipForward className="md:size-8 size-4" />
              Pause Test
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-3 mx-2 w-full lg:w-auto justify-center lg:justify-end shrink-0">
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

        {!isReviewMode && isLastQuestion ? (
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
