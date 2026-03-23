import React from 'react';
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

interface QuestionCardProps {
  testId: string;
  quizDetails: QuizDetailsUI;
  selectedAnswerId: string | null;
  showExplanation: boolean;
  isUserCorrect: boolean;
  onAnswerChange: (value: string) => void;
  onSubmit: () => void;
  onToggleHide: () => void;
  isQuestionHidden: boolean;
  hideActions?: boolean; // Submit buttons hide
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

  const handleSubmitTest = async () => {
    try {
      await completeTest(testId ).unwrap();
      router.push(`/dashboard/user/test-complete/${testId}`);
    } catch (err) {
      console.error('Submit test failed', err);
    }
  };

  return (
    <div className="w-full bg-[#f9f9f5] md:my-8 md:p-[32px] rounded-[16px]">
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
          <h2 className="text-lg md:text-2xl font-bold text-[#01281e] mb-3">
            {quizDetails.question_title}
          </h2>
        )}

        <div
          className="prose prose-sm md:prose-base max-w-none text-gray-700"
          dangerouslySetInnerHTML={{
            __html: quizDetails?.question_steam || '',
          }}
        />
      </CardHeader>

      <CardContent className="space-y-4">
        <RadioGroup
          value={selectedAnswerId ?? ''}
          onValueChange={onAnswerChange}
          className="space-y-4"
        >
          {quizDetails.answerOptions.map((option, index) => {
            const isCorrect = option.id === quizDetails.correctAnswerId;
            const isSelected = option.id === selectedAnswerId;
            const isWrongSelected = showExplanation && isSelected && !isCorrect;

            return (
              <div
                key={option.id}
                className={cn(
                  'relative flex items-center justify-between p-3 rounded-xl border border-[#00000026] transition-all',
                  showExplanation &&
                    isCorrect &&
                    'bg-green-100 border-green-500',
                  isWrongSelected && 'bg-red-100 border-red-500',
                  !showExplanation && 'bg-gray-50 hover:bg-gray-100',
                )}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem
                    varient="default"
                    value={option.id}
                    id={`option-${option.id}`}
                    disabled={showExplanation}
                  />

                  <Label
                    htmlFor={`option-${option.id}`}
                    className={cn(
                      'cursor-pointer text-xs md:text-base',
                      showExplanation && '',
                      isCorrect && !isSelected && 'opacity-100 ',
                      isSelected && !isCorrect && ' text-black',
                      isCorrect && ' text-black ',
                      // !isCorrect && 'line-through',
                      isCorrect && isSelected && 'text-black',
                      // !isCorrect  && 'line-through',
                    )}
                  >
                    <span className="font-bold mr-2">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option.option_text}
                  </Label>
                </div>

                {showExplanation && (
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

        {showExplanation && !hideResult && (
          <div
            className={cn(
              'mt-6 border-l-[4px] p-[16px] rounded-[12px]',
              isUserCorrect
                ? 'border-green-500 bg-green-50'
                : 'border-red-500 bg-red-50',
            )}
          >
            <CardContent className="flex items-center justify-between">
              <div className="font-bold text-lg ">
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
                    {String.fromCharCode(
                      65 +
                        quizDetails.answerOptions.findIndex(
                          o => o.id === quizDetails.correctAnswerId,
                        ),
                    )}
                  </p>
                </div>
              )}
            </CardContent>
          </div>
        )}
        {!hideActions && (
          <div className="md:flex justify-between items-center space-y-2 md:space-y-0">
            <Btn
              text="Submit Answer"
              onClick={onSubmit}
              disabled={!selectedAnswerId || showExplanation}
              className={cn(
                'bg-[#01281e] text-white w-full md:w-[164px] h-[50px] text-md font-semibold',
                showExplanation
                  ? 'cursor-not-allowed opacity-60'
                  : 'cursor-pointer',
              )}
            />

            <button
              onClick={handleSubmitTest}
              className="bg-[#b79e6b] cursor-pointer text-sm w-full md:w-[164px] h-[50px] text-white font-semibold rounded-md"
            >
              Submit Test
            </button>
          </div>
        )}
      </CardContent>
    </div>
  );
};

export default QuestionCard;
