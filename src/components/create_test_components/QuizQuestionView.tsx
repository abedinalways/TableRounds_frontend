

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { QuizQuestionData, Option } from '@/types/quiz';

import { CirclePause, Flag,  MessagesSquareIcon, ZoomIn, ZoomOut } from 'lucide-react';
import { TopbarCheckbox } from '../topbarCheckbox';
import Btn from '../reusable/button/Btn';
import { Checkbox } from '../ui/checkbox';

// Mock data (replace this with a prop or data fetching)
const mockData: QuizQuestionData = {
  testProgress: {
    currentQuestion: 5,
    totalQuestions: 30,
    questionID: '214541',
  },
  quizDetails: {
    title:
      'A 32-year-old man undergoes extraction of multiple impacted third molars under IV sedation with midazolam, fentanyl, and propofol. For local anesthesia he receives bilateral inferior alveolar nerve blocks and buccal infiltrations with 2% lidocaine containing 1:100,000 epinephrine. At the end of the case, the surgeon reviews the record and realizes that the total lidocaine dose exceeded the recommended maximum for his weight. The team increases monitoring and watches for early manifestations of local anesthetic systemic toxicity.',
    question:
      'Which of the following is the most characteristic early sign of lidocaine toxicity?',
    options: [
      { id: 'A', text: 'Bradycardia' },
      { id: 'B', text: 'Perioral numbness' },
      { id: 'C', text: 'Seizure' },
      { id: 'D', text: 'Ventricular arrhythmia' },
      { id: 'E', text: 'Urticaria' },
    ],
    userAnswerId: null,
    correctAnswerId: 'B',
  },
};

interface QuizQuestionViewProps {
  data?: QuizQuestionData;
  // Add handlers for navigation/actions
  onNext?: () => void;
  onPrev?: () => void;
  onSubmitAnswer?: (questionId: string, answerId: string) => void;
}

export const QuizQuestionView: React.FC<QuizQuestionViewProps> = ({
  data = mockData,
  onNext,
  // onPrev,
  // onSubmitAnswer,
}) => {
  const { testProgress, quizDetails } = data;
  const { currentQuestion, totalQuestions, questionID } = testProgress;

  // State to manage the user's selected answer for this question
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(
    quizDetails.userAnswerId
  );

  // Calculate progress percentage
  const progressValue = (currentQuestion / totalQuestions) * 100;

  // Handlers
  const handleAnswerChange = (value: string) => {
    setSelectedAnswer(value);
  };

  const handleSubmit = () => {
    if (selectedAnswer) {
     
      console.log(`Submitting answer ${selectedAnswer} for QID ${questionID}`);
      
    } else {
      console.log('Please select an answer before submitting.');
    }
  };

  return (
    <div className="flex flex-col space-y-4 font-[manrope]">
      {/* Top Bar - Progress and Info */}
      <div className="flex items-center rounded-[12px] border question-bg p-[24px]">
        <div className="flex-1 px-2">
          <Progress value={progressValue} className="h-2 bg-white" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-sm font-medium">
            <span className="text-white font-bold">
              {String(currentQuestion).padStart(2, '0')}
            </span>{' '}
            / {totalQuestions}
          </div>
          <div className="text-sm text-white">Question ID:{questionID}</div>
        </div>
        <div className="hidden sm:flex space-x-2">
          <button className="text-white cursor-pointer p-2 ">
            <span className="flex gap-2">
              <TopbarCheckbox /> <Flag size="16px" />
            </span>{' '}
            Mark
          </button>
          <button className="text-white cursor-pointer p-2">
            <span className="flex justify-center cursor-pointer">
              <MessagesSquareIcon size="16px" />
            </span>
            Feedback
          </button>
          <button className="text-white cursor-pointer p-2">
            <span className="flex justify-center cursor-pointer">
              <ZoomIn size="16px" />
            </span>
            Zoom In
          </button>
          <button className="text-white cursor-pointer p-2">
            <span className="flex justify-center cursor-pointer">
              <ZoomOut size="16px" />
            </span>
            Zoom Out
          </button>
          <button className="text-white cursor-pointer p-2">
            <span className="flex justify-center cursor-pointer">
              <CirclePause size="20px" />
            </span>
            Pause Test
          </button>
        </div>
        <Btn
          onClick={onNext}
          text="Next"
          className="bg-[#b79e6b] text-white px-6 py-2 h-10 transition-colors"
        />
      </div>

      {/* Main Content Card */}
      <div className="background p-2 rounded-md grid grid-cols-12">
        <aside className="col-span-1 rounded-md mt-4 mb-4 background p-2">
          <button className="bg-[#01281e] text-white flex items-center gap-2 px-6 py-3 rounded-md">
            <Checkbox /> 1
          </button>
         
        </aside>
        <div className="col-span-11 ">
          <Card className="m-4 shadow-lg">
            <CardHeader className="p-4 border-b border-green-200">
              <div className="flex items-start">
                <span className="text-2xl text-green-600 mr-4 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.5 2.5a1 1 0 001.414-1.414L10 9.586V7a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <p className="text-base text-gray-700 leading-relaxed font-normal">
                  {quizDetails.title}
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Question Prompt */}
              <div className="font-semibold text-lg text-gray-800 flex items-start">
                <span className="text-xl text-green-600 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M7.707 3.293a1 1 0 010 1.414L5.414 7H13a1 1 0 110 2H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" />
                  </svg>
                </span>
                {quizDetails.question}
              </div>

              {/* Answer Options (Radio Group) */}
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
                      className="w-5 h-5 border-green-500 text-green-600 focus:ring-green-500"
                    />
                    <Label
                      htmlFor={`option-${option.id}`}
                      className="flex items-center text-base font-normal cursor-pointer"
                    >
                      <span className="font-bold text-green-600 w-6 flex-shrink-0">
                        {option.id}.
                      </span>
                      <span className="ml-2">{option.text}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {/* Submit Button */}

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
