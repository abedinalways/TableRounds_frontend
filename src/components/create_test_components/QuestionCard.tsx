import React from 'react';
import Image from 'next/image';
import { CardContent, CardHeader } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { QuizQuestionData, Option } from '@/types/quiz';
import Btn from '../reusable/button/Btn';
import { cn } from '@/lib/utils';
import { CircularProgress } from '../progress-10';
import CorrectIcon from '../reusable/icons/CorrectIcon';
import WrongIcon from '../reusable/icons/WrongIcon';

interface QuestionCardProps {
  quizDetails: QuizQuestionData['quizDetails'];
  selectedAnswerId: string | null;
  showExplanation: boolean;
  isUserCorrect: boolean;
  onAnswerChange: (value: string) => void;
  onSubmit: () => void;
  onToggleHide: () => void;
  isQuestionHidden: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  quizDetails,
  selectedAnswerId,
  showExplanation,
  isUserCorrect,
  onAnswerChange,
  onSubmit,
  isQuestionHidden,
  onToggleHide
}) => {
  return (
    <div className="w-full bg-[#f9f9f5] md:my-8  md:p-[32px] rounded-[16px]">
      <div>
        {showExplanation && (
          <Btn
            text={isQuestionHidden ? 'Show Question' : 'Hide Question'}
            onClick={onToggleHide}
            className="bg-[#b79e6b] text-white px-6 py-2 text-sm font-semibold cursor-pointer"
          />
        )}
      </div>
      <CardHeader className="">
        <p className="text-sm md:text-[20px] text-gray-700 leading-relaxed font-normal">
          {quizDetails.title} {quizDetails.question}
        </p>
        <span></span>
      </CardHeader>

      <CardContent className=" space-y-4">
        {/* <span className="font-normal text-sm md:text-[20px] text-[#01281e] flex items-center  ">
          <Image
            src="/images/dashboard/main_dashboard/qns.png"
            width={28}
            height={28}
            alt=""
            className="mr-3"
          />
        </span> */}

        <RadioGroup
          onValueChange={onAnswerChange}
          value={selectedAnswerId || undefined}
          className="space-y-4"
        >
          {quizDetails.options.map((option: Option) => {
            const isCorrectOption = option.id === quizDetails.correctAnswerId;
            const isUserWrongOption =
              option.id === selectedAnswerId && !isCorrectOption;

            const isOtherOption =
              showExplanation &&
              option.id !== selectedAnswerId &&
              !isCorrectOption;

            return (
              <div
                key={option.id}
                className={cn(
                  'relative flex items-center justify-between p-2 rounded-xl border border-[#00000026] transition-all',
                  showExplanation &&
                    isCorrectOption &&
                    'bg-green-100 border-green-500',
                  showExplanation &&
                    isUserWrongOption &&
                    'bg-red-100 border-red-500',
                  !showExplanation && 'bg-gray-50 hover:bg-gray-100'
                )}
              >
                <div className="flex items-center gap-3">
                  {showExplanation ? (
                    <RadioGroupItem
                      value="foo"
                      checked={
                        selectedAnswerId === option.id || isCorrectOption
                      }
                      varient={isCorrectOption ? 'default' : 'destructive'}
                      disabled={showExplanation}
                    />
                  ) : (
                    <RadioGroupItem
                      varient="default"
                      value={option.id}
                      id={`option-${option.id}`}
                      disabled={showExplanation}
                    />
                  )}

                  <Label
                    htmlFor={`option-${option.id}`}
                    className={`${
                      isUserCorrect &&
                      isOtherOption &&
                      'opacity-60 line-through'
                    } cursor-pointer text-xs md:text-base`}
                  >
                    <span className="font-bold mr-2">{option.id}.</span>
                    {option.text}
                  </Label>
                </div>

                {showExplanation && (
                  <CircularProgress
                    showLabel
                    value={option?.percentage ?? 0}
                    className="text-sm md:text-md font-semibold text-gray-600"
                  />
                )}
              </div>
            );
          })}

          {showExplanation && (
            <div
              className={cn(
                'mt-6 border-l-[4px] border-[#20ac19] p-[16px] rounded-[12px]',
                isUserCorrect
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-500 bg-red-50'
              )}
            >
              <CardContent className="flex items-center justify-between">
                <div className="font-bold text-lg">
                  {isUserCorrect ? (
                    <h4 className="text-[#20AC19] flex items-center gap-2 text-xs md:text-sm">
                      <CorrectIcon /> Correct ({quizDetails.correctAnswerId})
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
                      {quizDetails.correctAnswerId}
                    </p>
                  </div>
                )}

                {/* <div className="text-right flex gap-2 items-start">
                  <div className="flex items-center justify-center">
                    <Image
                      src="/images/dashboard/statistics.png"
                      width={32}
                      height={32}
                      alt=""
                    />
                  </div>

                  {isUserCorrect ? (
                    <div className="flex flex-col">
                      <h2>68%</h2>
                      <p className="text-xs text-gray-600">
                        Answered Correctly
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <h2>6%</h2>
                      <p className="text-xs text-gray-600 font-semibold">
                        Answered {selectedAnswerId}
                      </p>
                    </div>
                  )}
                </div> */}
              </CardContent>
            </div>
          )}
        </RadioGroup>

        <div className="md:flex justify-between  items-center space-y-2 md:space-y-0 mb-6 md:mb-0">
          <Btn
            text="Submit Answer"
            onClick={onSubmit}
            disabled={!selectedAnswerId || showExplanation}
            className={cn(
              'bg-[#01281e] text-white w-full md:w-[164px] h-[50px] text-md font-semibold',
              showExplanation
                ? 'cursor-not-allowed opacity-60'
                : 'cursor-pointer'
            )}
          />
          <Btn
            className="bg-[#b79e6b]  text-sm w-full md:w-[164px] h-[50px] text-white font-semibold rounded-sm! mb-2 mds:mb-0"
            href="/dashboard/test-complete"
            text="Submit Test"
          />
        </div>
      </CardContent>
    </div>
  );
};

export default QuestionCard;
