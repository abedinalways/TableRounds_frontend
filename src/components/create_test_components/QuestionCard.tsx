

'use client';
import React, { useCallback, useState } from 'react';
import { CardContent, CardHeader } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { QuizDetailsUI } from '@/types/test-session';
import Btn from '../reusable/button/Btn';
import { cn } from '@/lib/utils';
import { CircularProgress } from '../progress-10';
import CorrectIcon from '../reusable/icons/CorrectIcon';
import WrongIcon from '../reusable/icons/WrongIcon';
import { useCompleteTestMutation } from '@/app/redux/api/testSessionApi';
import { useRouter } from 'next/navigation';
import { AnswerToast } from './AnswerToast';
import { Loader2 } from 'lucide-react';

interface QuestionCardProps {
  testId: string;
  quizDetails: QuizDetailsUI;
  selectedAnswerId: string | null;
  showExplanation: boolean;
  isUserCorrect: boolean;
  onAnswerChange: (value: string) => void;
  onSubmit: () => Promise<boolean>;
  onToggleHide: () => void;
  isQuestionHidden: boolean;
  hideActions?: boolean;
  hideToggleButton?: boolean;
  hideResult?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  testId,
  quizDetails,
  selectedAnswerId,
  showExplanation,
  isUserCorrect,
  onAnswerChange,
  onSubmit,
  onToggleHide,
  isQuestionHidden,
  hideActions = false,
  hideToggleButton = false,
  hideResult = false,
}) => {
  const [completeTest] = useCompleteTestMutation();
  const router = useRouter();

  const [showToast, setShowToast] = useState(false);
  const [toastCorrect, setToastCorrect] = useState(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [isSubmittingTest, setIsSubmittingTest] = useState(false);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);

  const hideToast = useCallback(() => setShowToast(false), []);

  const answerOptions = quizDetails?.answerOptions ?? [];

  const answeredOptionId = quizDetails.userAnswerId
    ? String(quizDetails.userAnswerId)
    : null;

  const activeSelectedAnswerId = selectedAnswerId
    ? String(selectedAnswerId)
    : answeredOptionId;

  const correctAnswerId = quizDetails.correctAnswerId
    ? String(quizDetails.correctAnswerId)
    : null;

  const isAlreadyAnswered = Boolean(answeredOptionId);
  const isLocked = isAlreadyAnswered || showExplanation;

  const handleAnswerChange = useCallback(
    (value: string) => {
      if (isLocked) return;

      onAnswerChange(String(value));
    },
    [isLocked, onAnswerChange],
  );

  return (
    <div className="w-full bg-[#f9f9f5] md:my-8 md:p-[32px] rounded-[16px]">
      <AnswerToast
        show={showToast}
        isCorrect={toastCorrect}
        onHide={hideToast}
      />

      {showExplanation && !hideToggleButton && (
        <div className="mb-4">
          <Btn
            text={isQuestionHidden ? 'Show Question' : 'Hide Question'}
            onClick={onToggleHide}
            className="bg-[#b79e6b] text-white px-6 py-2 text-sm font-semibold cursor-pointer"
          />
        </div>
      )}

      <CardHeader>
        {quizDetails?.question_title && (
          <h2 className="text-lg md:text-2xl font-bold text-[#01281e] mb-3 ">
            {quizDetails.question_title}
          </h2>
        )}

        <div
          className="prose prose-sm md:prose-base max-w-none text-gray-700 mb-5 text-lg md:text-xl"
          dangerouslySetInnerHTML={{
            __html: quizDetails?.question_steam || '',
          }}
        />
      </CardHeader>

      <CardContent className="space-y-4">
        <RadioGroup
          value={activeSelectedAnswerId ?? ''}
          onValueChange={handleAnswerChange}
          className="space-y-4"
        >
          {answerOptions.map((option, index) => {
            const optionId = String(option.id);

            const isCorrect =
              Boolean(correctAnswerId) && optionId === correctAnswerId;

            const isSelected =
              Boolean(activeSelectedAnswerId) &&
              optionId === activeSelectedAnswerId;

            const isWrongSelected = isLocked && isSelected && !isCorrect;

            return (
              <div
                key={optionId}
                className={cn(
                  'relative flex items-center justify-between p-3 rounded-xl border border-[#00000026] transition-all',
                  isLocked && isCorrect && 'bg-green-100 border-green-500',
                  isWrongSelected && 'bg-red-100 border-red-500',
                  !isLocked && 'bg-gray-50 hover:bg-gray-100',
                )}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem
                    variant="default"
                    value={optionId}
                    id={`option-${optionId}`}
                    disabled={isLocked}
                  />

                  <Label
                    htmlFor={`option-${optionId}`}
                    className={cn(
                      'cursor-pointer text-base md:text-lg',
                      isLocked && 'cursor-not-allowed',
                      isCorrect && 'text-black',
                      isSelected && !isCorrect && 'text-black',
                    )}
                  >
                    <span className="font-bold mr-2">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option.option_text}
                  </Label>
                </div>

                {isLocked && (
                  <CircularProgress
                    showLabel
                    value={option.percentage ?? 0}
                    className="text-sm md:text-md font-semibold text-gray-600"
                  />
                )}
              </div>
            );
          })}
        </RadioGroup>

        {isLocked && !hideResult && correctAnswerId && (
          <div
            className={cn(
              'mt-6 border-l-[4px] p-[16px] rounded-[12px]',
              isUserCorrect
                ? 'border-green-500 bg-green-50'
                : 'border-red-500 bg-red-50',
            )}
          >
            <CardContent className="flex items-center justify-between">
              <div className="font-bold text-lg">
                {isUserCorrect ? (
                  <h4 className="text-[#20AC19] flex items-center gap-2 text-xs md:text-sm">
                    <CorrectIcon /> Correct
                  </h4>
                ) : (
                  <h4 className="text-red-600 flex gap-2 items-center text-xs md:text-sm">
                    <WrongIcon /> Wrong Answer
                  </h4>
                )}
              </div>

              {!isUserCorrect && (
                <div className="text-xs md:text-sm text-gray-600">
                  <p className="flex items-center gap-2 font-semibold text-[#20AC19]">
                    <CorrectIcon /> Correct Answer:{' '}
                    {(() => {
                      const idx = answerOptions.findIndex(
                        option => String(option.id) === correctAnswerId,
                      );

                      return idx >= 0 ? String.fromCharCode(65 + idx) : '—';
                    })()}
                  </p>
                </div>
              )}
            </CardContent>
          </div>
        )}

        {!hideActions && (
          <div className="md:flex justify-between items-center space-y-2 md:space-y-0">
            <button
              type="button"
              onClick={async () => {
                if (isSubmittingAnswer || isLocked) return;

                try {
                  setIsSubmittingAnswer(true);

                  const isCorrect = await onSubmit();
                  setToastCorrect(isCorrect);
                  setShowToast(true);
                } finally {
                  setIsSubmittingAnswer(false);
                }
              }}
              disabled={
                !activeSelectedAnswerId || isLocked || isSubmittingAnswer
              }
              className={cn(
                'w-full md:w-[164px] h-[50px] rounded-md text-md font-semibold transition-all duration-200 flex items-center justify-center gap-2',
                isLocked
                  ? 'bg-green-800 text-white cursor-not-allowed'
                  : 'bg-[#01281e] text-white',
                !activeSelectedAnswerId || isSubmittingAnswer || isLocked
                  ? 'cursor-not-allowed opacity-60'
                  : 'cursor-pointer hover:bg-[#014432] hover:shadow-md active:scale-[0.98]',
              )}
            >
              {isSubmittingAnswer && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {isSubmittingAnswer
                ? 'Submitting...'
                : isAlreadyAnswered
                  ? 'Submitted Answer'
                  : showExplanation
                    ? 'Submitted'
                    : 'Submit Answer'}
            </button>

            {/* <button
              type="button"
              onClick={async () => {
                if (isSubmittingTest || isTestSubmitted) return;

                try {
                  setIsSubmittingTest(true);

                  await completeTest(testId).unwrap();

                  setIsTestSubmitted(true);

                  setTimeout(() => {
                    router.push(`/dashboard/user/test-complete/${testId}`);
                  }, 800);
                } catch (err) {
                  console.error('Submit test failed', err);
                } finally {
                  setIsSubmittingTest(false);
                }
              }}
              disabled={isSubmittingTest || isTestSubmitted}
              className={cn(
                'w-full md:w-[164px] h-[50px] rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200',
                isTestSubmitted
                  ? 'bg-yellow-600 text-white cursor-not-allowed'
                  : 'bg-[#b79e6b] text-white',
                isSubmittingTest || isTestSubmitted
                  ? 'opacity-60 cursor-not-allowed'
                  : 'cursor-pointer hover:shadow-md active:scale-[0.98]',
              )}
            >
              {isSubmittingTest && <Loader2 className="h-4 w-4 animate-spin" />}

              {isSubmittingTest
                ? 'Submitting...'
                : isTestSubmitted
                  ? 'Submitted'
                  : 'Submit Test'}
            </button> */}
          </div>
        )}
      </CardContent>
    </div>
  );
};

export default QuestionCard;