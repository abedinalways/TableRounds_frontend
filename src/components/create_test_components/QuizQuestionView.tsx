'use client';

import React, { useState } from 'react';
import {  CardContent, CardHeader } from '@/components/ui/card';
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
    <div className="flex flex-col space-y-4 font-[manrope] ">
      {/* TOP BAR */}
      <div className="md:flex items-center md:justify-between gap-4 rounded-[12px] xl:text-[18px] md:text-sm text-xs border question-bg py-4">
        <div className="md:flex  items-center space-y-2">
          <div className="md:px-2 px-1">
            <Progress
              value={progressValue}
              className="md:h-5 h-2 bg-white/60"
            />
          </div>

          <div className="space-x-2 flex flex-col gap-4 md:items-start mx-4 md:mx-0">
            <div className="text-sm md:text-[20px]  text-white font-bold">
              {String(currentQuestion).padStart(2, '0')} / {totalQuestions}
            </div>
            <div className="md:text-[18px] text-sm text-white">
              Question ID: {questionID}
            </div>
          </div>

          <div className="flex flex-wrap md:flex-nowrap items-center gap-3 md:gap-6 xl:gap-10 md:text-[18px] text-xs">
            <button className="text-white cursor-pointer p-2  gap-2 flex flex-col ">
              <span className="flex items-center gap-2">
                <TopbarCheckbox className="md:size-6 size-4" />{' '}
                <Flag className="size-4 md:size-8 " />{' '}
              </span>{' '}
              Mark
            </button>
            <button className="text-white cursor-pointer p-2  gap-2 flex flex-col items-center ">
              <ChatBubble className="md:size-8 size-4" /> Feedback
            </button>
            <button className="text-white cursor-pointer p-2  gap-2 flex flex-col items-center">
              <ZoomInIcon className="md:size-8 size-4" />
              Zoom In
            </button>
            <button className="text-white cursor-pointer p-2  gap-2 flex flex-col items-center">
              <ZoomOutIcon className="md:size-8 size-4" /> Zoom Out
            </button>
            <button className="text-white cursor-pointer p-2  gap-2 flex flex-col items-center">
              <ShareIcon className="md:size-8 size-4" /> Share
            </button>
            <button className="text-white cursor-pointer p-2  gap-2 flex flex-col items-center">
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

      {/* MAIN CONTENT */}
      <div className="background p-2 rounded-md grid grid-cols-1 md:grid-cols-12">
        {/* LEFT SIDEBAR - QUESTION LIST */}
        <div
          className="lex md:col-span-1
  md:flex-col
  flex-row
  gap-2
  rounded-md
  mt-2 md:mt-4
  mb-2 md:mb-4
  background p-2
  md:max-h-[700px]
  overflow-x-auto md:overflow-y-auto
  custom-scroll"
        >
          <aside className="flex md:flex-col gap-2 p-2 h-full">
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
          {/* <div className="">
            <VerticalProgress value={progressValue} />
          </div> */}
        </div>

        {/* RIGHT SIDE (QUESTION + EXPLANATION) */}
        <div
          className=" col-span-11
  flex flex-col
  md:flex-row
  gap-3 md:gap-[5px]"
        >
          {/* Question Card */}
          <div className="w-full bg-[#f9f9f5] md:my-8 md:mx-[24px] md:p-[32px] rounded-[16px]">
            <div className="">
              <CardHeader className="p-4">
                <p className="text-sm md:text-[20px] text-gray-700 leading-relaxed font-normal">
                  {quizDetails.title}
                </p>
              </CardHeader>

              <CardContent className="md:p-6 space-y-6">
                {/* Question */}
                <div className="font-semibold text-sm md:text-[20px] text-[#01281e] flex items-center ">
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

                    return (
                      <div
                        key={option.id}
                        className={cn(
                          'relative flex items-center justify-between p-2 rounded-xl border border-[#00000026] transition-all ',

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
                            } cursor-pointer text-xs md:text-base`}
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
                            className=" text-sm md:text-md font-semibold text-gray-600"
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
                              <h4 className="text-[#20AC19] flex items-center gap-2 text-xs md:text-sm">
                                <CorrectIcon /> Correct (
                                {quizDetails.correctAnswerId})
                              </h4>
                            ) : (
                              <h4 className="text-red-600 flex gap-2 items-center text-xs md:text-sm">
                                {' '}
                                <WrongIcon /> Wrong Answer
                              </h4>
                            )}
                          </div>
                        </div>
                        {isUserCorrect ? (
                          ''
                        ) : (
                          <div className=" text-xs md:text-sm text-gray-600">
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
            <div className="p-[24px] md:my-[32px] md:mr-[32px] bg-[#f9f9f5] shadow-lg rounded-[16px] w-full   border font-[manrope] max-h-[1521px] overflow-x-hidden custom-scrollbar ">
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
