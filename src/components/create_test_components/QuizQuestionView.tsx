'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { QuizQuestionData, Option } from '@/types/quiz';

import {ArrowRight } from 'lucide-react';
import { TopbarCheckbox } from '../topbarCheckbox';
import Btn from '../reusable/button/Btn';
import Image from 'next/image';

import { cn } from '@/lib/utils';
import ChatBubble from '../reusable/icons/ChatBubble';
import Flag from '../reusable/icons/Flag';
import ZoomInIcon from '../reusable/icons/ZoomInIcon';
import ZoomOutIcon from '../reusable/icons/ZoomOutIcon';
import ShareIcon from '../reusable/icons/ShareIcon';
import PauseIcon from '../reusable/icons/PauseIcon';
import { VerticalProgress } from '../verticalPorgress';

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

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(
    quizDetails.userAnswerId
  );

  const progressValue = (currentQuestion / totalQuestions) * 100;

  const handleAnswerChange = (value: string) => setSelectedAnswer(value);

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    console.log(`Submitting answer ${selectedAnswer} for QID ${questionID}`);
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
        <div className="flex col-span-1 rounded-md mt-4 mb-4 background p-2 space-y-2  max-h-[700px] overflow-y-auto overflow-hidden custom-scroll">
          <aside className="space-y-2 p-2 ">
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

        {/* RIGHT MAIN CONTENT */}
        <div className="col-span-11">
          <Card className="m-4 shadow-lg">
            <CardHeader className="p-4">
              <div className="flex items-start">
                <p className="text-base text-gray-700 leading-relaxed font-normal">
                  {quizDetails.title}
                </p>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* QUESTION TEXT */}
              <div className="font-semibold text-lg text-gray-800 flex items-start">
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
                value={selectedAnswer || undefined}
                className="space-y-4"
              >
                {quizDetails.options.map((option: Option) => (
                  <div
                    key={option.id}
                    className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors border"
                  >
                    <RadioGroupItem
                      value={option.id}
                      id={`option-${option.id}`}
                      className="w-5 h-5 border-gray-500"
                    />
                    <Label
                      htmlFor={`option-${option.id}`}
                      className="flex items-center text-base font-normal cursor-pointer"
                    >
                      <span className="font-bold text-gray-600 w-6">
                        {option.id}.
                      </span>
                      <span className="ml-2">{option.text}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {/* SUBMIT BUTTON */}
              <Btn
                text="Submit Answer"
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                className="bg-[#01281e] text-white px-8 py-3 text-md font-semibold"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuizQuestionView;
