'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { QuizQuestionData, Option } from '@/types/quiz';
import { ArrowRight } from 'lucide-react';
import { TopbarCheckbox } from '../topbarCheckbox';
import Btn from '../reusable/button/Btn';
import Image from 'next/image';
import { CircularProgress } from '../progress-10';
import { cn } from '@/lib/utils';
import ChatBubble from '../reusable/icons/ChatBubble';
import Flag from '../reusable/icons/Flag';
import ZoomInIcon from '../reusable/icons/ZoomInIcon';
import ZoomOutIcon from '../reusable/icons/ZoomOutIcon';
import ShareIcon from '../reusable/icons/ShareIcon';
import PauseIcon from '../reusable/icons/PauseIcon';
import { VerticalProgress } from '../verticalPorgress';
import CorrectIcon from '../reusable/icons/CorrectIcon';
import WrongIcon from '../reusable/icons/WrongIcon';
import ExplainIcon from '../reusable/icons/ExpalinIcon';
import OptionIcon from '../reusable/icons/OpotionIcon';
import BookIcon from '../reusable/icons/BookIcon';

interface QuizQuestionViewProps {
  data: QuizQuestionData;
  onNext?: () => void;
  onPrev?: () => void;
  onJumpTo?: (index: number) => void;
  onSubmitAnswer?: (questionId: string, answerId: string) => void;
}

export const QuizQuestionView: React.FC<QuizQuestionViewProps> = ({
  data,
  onNext,
  onJumpTo,
}) => {
  const { testProgress, quizDetails } = data;
  const { currentQuestion, totalQuestions, questionID } = testProgress;

  const [selectedAnswerId, setSelectedAnswer] = useState<string | null>(
    quizDetails.userAnswerId
  );

  const [showExplanation, setShowExplanation] = useState(false);
  // const [checkedAnswerId, setCheckedAnswerId] = useState('');
  const progressValue = (currentQuestion / totalQuestions) * 100;
  const isUserCorrect = selectedAnswerId === quizDetails.correctAnswerId;

  const handleAnswerChange = (value: string) => {
    setSelectedAnswer(value);
  };

  const handleSubmit = () => {
    if (!selectedAnswerId) return;
    setShowExplanation(true);

    console.log(`Submitting answer ${selectedAnswerId} for QID ${questionID}`);
  };

  return (
    <div className="flex flex-col space-y-4 font-[manrope]">
      {/* TOP BAR */}
      <div className="flex items-center gap-4 rounded-[12px] text-[18px] border question-bg p-[24px]">
        <div className=" px-2">
          <Progress value={progressValue} className="md:h-[20px] bg-white/60" />
        </div>

        <div className="space-x-2 flex flex-col gap-4 items-start">
          <div className="text-sm md:text-[20px] font-medium text-white font-bold">
            {String(currentQuestion).padStart(2, '0')} / {totalQuestions}
          </div>
          <div className="text-[18px] text-white">
            Question ID: {questionID}
          </div>
        </div>

        <div className="flex items-center space-x-2 gap-8 text-[18px]">
          <button className="text-white cursor-pointer p-2  gap-2 flex flex-col">
            <span className="flex items-center gap-2">
              <TopbarCheckbox className="size-[24px]" />{' '}
              <Flag className="size-[32px]" />{' '}
            </span>{' '}
            Mark
          </button>
          <button className="text-white cursor-pointer p-2  gap-2 flex flex-col items-center ">
            <ChatBubble className="size-[32px]" /> Feedback
          </button>
          <button className="text-white cursor-pointer p-2  gap-2 flex flex-col items-center">
            <ZoomInIcon className="size-[32px]" />
            Zoom In
          </button>
          <button className="text-white cursor-pointer p-2  gap-2 flex flex-col items-center">
            <ZoomOutIcon className="size-[32px]" /> Zoom Out
          </button>
          <button className="text-white cursor-pointer p-2  gap-2 flex flex-col items-center">
            <ShareIcon className="size-[32px]" /> Share
          </button>
          <button className="text-white cursor-pointer p-2  gap-2 flex flex-col items-center">
            <PauseIcon className="size-[32px]" /> Pause Test
          </button>
        </div>

        <Btn
          onClick={onNext}
          className="bg-[#b79e6b] text-white transition-colors w-[97px] h-[53px] mx-10"
        >
          <span className="flex items-center">
            Next <ArrowRight />
          </span>
        </Btn>
      </div>

      {/* MAIN CONTENT */}
      <div className="background p-2 rounded-md grid grid-cols-12">
        {/* LEFT SIDEBAR - QUESTION LIST */}
        <div className="flex col-span-1 rounded-md mt-4 mb-4 background p-2 space-y-2  max-h-[700px] overflow-y-auto custom-scroll ">
          <aside className="space-y-2 p-2 h-full">
            {Array.from({ length: totalQuestions }, (_, i) => {
              const qIndex = i + 1;
              const isCurrent = qIndex === currentQuestion;

              return (
                <button
                  key={qIndex}
                  onClick={() => onJumpTo && onJumpTo(qIndex)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 rounded-md border transition-all',
                    isCurrent
                      ? 'bg-[#b79e6b] text-white border-[#b79e6b]'
                      : 'bg-[#01281e] text-white/80 border-[#084434] hover:text-white'
                  )}
                >
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full border flex items-center justify-center',
                      isCurrent ? 'border-white bg-white' : 'border-white/50'
                    )}
                  >
                    {isCurrent && (
                      <div className="w-2 h-2 rounded-full bg-[#b79e6b]" />
                    )}
                  </div>

                  <span className="text-sm">{qIndex}</span>
                </button>
              );
            })}
          </aside>
          <div className="">
            <VerticalProgress value={progressValue} />
          </div>
        </div>

        {/* RIGHT SIDE (QUESTION + EXPLANATION) */}
        <div className="col-span-11 md:flex gap-[24px] transition-all ease-in-out duration-500 ">
          {/* Question Card */}
          <div className="w-full bg-[#f9f9f5] md:m-[32px] md:p-[32px] rounded-[16px] shadow-lg">
            <div className="">
              <CardHeader className="p-4">
                <p className="text-[20px] text-gray-700 leading-relaxed font-normal">
                  {quizDetails.title}
                </p>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Question */}
                <div className="font-semibold text-[20px] text-[#01281e] flex items-center ">
                  <Image
                    src="/images/dashboard/main_dashboard/qns.png"
                    width={28}
                    height={28}
                    alt=""
                    className="mr-3"
                  />
                  {quizDetails.question}
                </div>

                {/* OPTIONS */}
                <RadioGroup
                  onValueChange={handleAnswerChange}
                  value={selectedAnswerId || undefined}
                  className="space-y-4"
                >
                  {quizDetails.options.map((option: Option) => {
                    const isUserCorrect =
                      selectedAnswerId === quizDetails.correctAnswerId;

                    const isCorrectOption =
                      option.id === quizDetails.correctAnswerId;

                    const isUserWrongOption =
                      option.id === selectedAnswerId && !isCorrectOption;

                    const isOtherOption =
                      showExplanation &&
                      option.id !== selectedAnswerId &&
                      !isCorrectOption;

                    // const shouldShowAsChecked =
                    //   (showExplanation && isCorrectOption) ||
                    //   (showExplanation && isUserWrongOption);

                    return (
                      <div
                        key={option.id}
                        className={cn(
                          'relative flex items-center justify-between p-2 rounded-xl border border-[#00000026] transition-all',

                          // Correct answer
                          showExplanation &&
                            isCorrectOption &&
                            'bg-green-100 border-green-500',

                          // User wrong answer
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
                                selectedAnswerId === option.id ||
                                isCorrectOption
                              }
                              varient={
                                isCorrectOption ? 'default' : 'destructive'
                              }
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
                            } cursor-pointer text-base`}
                          >
                            <span className="font-bold mr-2">{option.id}.</span>
                            {option.text}
                          </Label>
                        </div>

                        {/* Percentage */}
                        {showExplanation && (
                          <CircularProgress
                            showLabel
                            value={option?.percentage ?? 0}
                            className="text-md font-semibold text-gray-600"
                          ></CircularProgress>
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
                      <CardContent className=" flex items-center justify-between">
                        <div>
                          <div className="font-bold text-lg">
                            {isUserCorrect ? (
                              <h4 className="text-[#20AC19] flex items-center gap-2">
                                <CorrectIcon /> Correct (
                                {quizDetails.correctAnswerId})
                              </h4>
                            ) : (
                              <h4 className="text-red-600 flex gap-2 items-center">
                                {' '}
                                <WrongIcon /> Wrong Answer
                              </h4>
                            )}
                          </div>
                        </div>
                        {isUserCorrect ? (
                          ''
                        ) : (
                          <div className="text-sm text-gray-600">
                            <p className="flex items-center gap-2 font-semibold text-[#20AC19]">
                              <CorrectIcon /> Correct Answer:{' '}
                              {quizDetails.correctAnswerId}
                            </p>
                          </div>
                        )}

                        <div className="text-right flex gap-2 items-start">
                          <div className="flex items-center justify-center">
                            <Image
                              src="/images/dashboard/statistics.png"
                              width={32}
                              height={32}
                              alt=""
                              className=""
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
                        </div>
                      </CardContent>
                    </div>
                  )}
                </RadioGroup>

                {/* Submit Button */}

                <Btn
                  text="Submit Answer"
                  onClick={handleSubmit}
                  disabled={!selectedAnswerId}
                  className="bg-[#01281e] text-white px-8 py-3 text-md font-semibold cursor-auto"
                />
              </CardContent>
            </div>
          </div>

          {/* EXPLANATION PANEL */}
          {showExplanation && (
            <div className="m-[32px] p-[24px]  bg-[#f9f9f5] shadow-lg rounded-[16px] w-full   border font-[manrope] max-h-[1521px] overflow-x-hidden custom-scrollbar ">
              <h2 className="text-lg font-bold text-[#01281e] mb-2 flex items-center gap-2">
                <ExplainIcon /> Explanations:
              </h2>

              <p className="text-gray-700 md:text-[18px] leading-relaxed whitespace-pre-line max-w-[544px]">
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
                <OptionIcon /> Why the Other Options Are Incorrect:
              </h3>

              <div className="space-y-3 max-w-[544px]">
                {quizDetails.explanation.whyIncorrect.map((item, idx) => (
                  <div key={idx} className="text-[18px] text-gray-700">
                    <span className="font-semibold text-[#01503b]">
                      {item.option}:
                    </span>{' '}
                    <span className="leading-relaxed whitespace-pre-line">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              <h3 className="text-md font-semibold text-[#01281e] mt-6 mb-1 flex items-center gap-2 text-[18px]">
                <OptionIcon /> Pimping Point:
              </h3>
              <p className="text-[#01503b] text-[18px] whitespace-pre-line">
                {quizDetails.explanation.pinningPoint}
              </p>

              <h3 className="text-md font-semibold text-[#01281e] mt-6 mb-1 flex items-center gap-2 text-[18px]">
                <OptionIcon /> Memory trick:
              </h3>
              <p className="text-[#01281e] font-semibold leading-[150%] text-[18px]">
                {quizDetails.explanation.memoryTrick}
              </p>

              <h3 className="text-md font-semibold text-[#01281e] mt-6 mb-1 flex items-center gap-2 text-[18px]">
                <BookIcon /> References:
              </h3>
              <ul className="list-none pl-6 text-[#01281e] text-[18px] font-semibold space-y-1">
                {quizDetails.explanation.references.map((ref, index) => (
                  <li key={index} className="">
                    {ref}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizQuestionView;
