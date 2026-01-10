'use client';

import React, { useRef, useState } from 'react';
import { QuizQuestionData } from '@/types/quiz';
import { MarkedQuestion } from '@/types/markedQuestion';
import QuizTopbar from './QuizTopbar';
import QuestionSidebar from './QuestionSidebar';
import QuestionCard from './QuestionCard';
import ExplanationPanel from './ExplanationPanel';
import gsap from 'gsap';

interface QuizQuestionViewProps {
  data: QuizQuestionData;
  markedQuestions: MarkedQuestion[];
  onToggleMark: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onJumpTo?: (index: number) => void;
}

export const QuizQuestionView: React.FC<QuizQuestionViewProps> = ({
  data,
  markedQuestions,
  onToggleMark,
  onNext,
  onPrevious,
  onJumpTo,
}) => {
  const { testProgress, quizDetails } = data;
  const { currentQuestion, totalQuestions, questionID } = testProgress;

  const [selectedAnswerId, setSelectedAnswer] = useState<string | null>(
    quizDetails.userAnswerId
  );
  const [showExplanation, setShowExplanation] = useState(false);
  const [isQuestionHidden, setIsQuestionHidden] = useState(false);

  const questionRef = useRef<HTMLDivElement>(null);
  const explanationRef = useRef<HTMLDivElement>(null);

  const progressValue = (currentQuestion / totalQuestions) * 100;
  const isUserCorrect = selectedAnswerId === quizDetails.correctAnswerId;
  const isMarked = markedQuestions.some(q => q.index === currentQuestion);

  const handleAnswerChange = (value: string) => setSelectedAnswer(value);

  const handleSubmit = () => {
    if (!selectedAnswerId) return;
    setShowExplanation(true);
    setIsQuestionHidden(false); // reset hidden state after submit
  };

  // handle previous
  const handlePrevious = () => {
    // reset UI states
    setShowExplanation(false);
    setIsQuestionHidden(false);
    setSelectedAnswer(null);

    // reset GSAP styles if needed
    if (questionRef.current && explanationRef.current) {
      gsap.set(questionRef.current, {
        flex: '1 1 0%',
        opacity: 1,
      });

      gsap.set(explanationRef.current, {
        flex: '1 1 0%',
      });
    }

    onPrevious();
  };


 const handleToggleHide = () => {
   if (!showExplanation) return;

   const qEl = questionRef.current;
   const eEl = explanationRef.current;
   if (!qEl || !eEl) return;

   if (!isQuestionHidden) {
     // hide
     gsap.to(qEl, {
       flex: '0 0 0%',
       opacity: 0,
       duration: 0.45,
       ease: 'power2.inOut',
       onComplete: () => setIsQuestionHidden(true),
     });

     gsap.to(eEl, {
       flex: '1 1 100%',
       duration: 0.45,
       ease: 'power2.inOut',
     });
   } else {
     // show
     setIsQuestionHidden(false);

     gsap.to(qEl, {
       flex: '1 1 0%',
       opacity: 1,
       duration: 0.5,
       ease: 'power2.out',
     });

     gsap.to(eEl, {
       flex: '1 1 0%',
       duration: 0.5,
       ease: 'power2.out',
     });
   }
 };


  // zoom in & zoom out function
  const [zoomLevel, setZoomLevel] = useState(1);
  const MIN_ZOOM = 0.8;
  const MAX_ZOOM = 1.4;
  const STEP = 0.1;

  const handleZoomIn = () => setZoomLevel(z => Math.min(z + STEP, MAX_ZOOM));
  const handleZoomOut = () => setZoomLevel(z => Math.max(z - STEP, MIN_ZOOM));


  return (
    <div className="flex flex-col space-y-4 font-[manrope]">
      <QuizTopbar
        progressValue={progressValue}
        currentQuestion={currentQuestion}
        totalQuestions={totalQuestions}
        questionID={questionID}
        isMarked={isMarked}
        onToggleMark={onToggleMark}
        onNext={onNext}
        onPrevious={handlePrevious}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />

      <div className="background rounded-md grid grid-cols-1 md:grid-cols-12 ">
        <QuestionSidebar
          totalQuestions={totalQuestions}
          currentQuestion={currentQuestion}
          markedQuestions={markedQuestions}
          onJumpTo={onJumpTo}
        />

       
        {/* Right Side */}
        <div className="col-span-11 mx-4 min-w-0">
          {/* ✅ this wrapper is the key */}
          <div className="w-full overflow-auto">
            <div
              className="flex flex-col md:flex-row gap-6 min-w-0"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top left',
                transition: 'transform 0.2s ease',
              }}
            >
              {/* Question Card */}
              <div
                ref={questionRef}
                className={`flex-1 min-w-0 overflow-hidden ${
                  isQuestionHidden ? 'pointer-events-none' : ''
                }`}
                style={{
                  flex: isQuestionHidden ? '0 0 0%' : '1 1 0%',
                  opacity: isQuestionHidden ? 0 : 1,
                }}
              >
                <QuestionCard
                  quizDetails={quizDetails}
                  selectedAnswerId={selectedAnswerId}
                  showExplanation={showExplanation}
                  isUserCorrect={isUserCorrect}
                  onAnswerChange={handleAnswerChange}
                  onSubmit={handleSubmit}
                  onToggleHide={handleToggleHide}
                  isQuestionHidden={isQuestionHidden}
                />
              </div>

              {/* Explanation Panel */}
              {showExplanation && (
                <div
                  ref={explanationRef}
                  className="min-w-0"
                  style={{
                    flex: isQuestionHidden ? '1 1 100%' : '1 1 0%',
                  }}
                >
                  <ExplanationPanel
                    quizDetails={quizDetails}
                    isQuestionHidden={isQuestionHidden}
                    onShowQuestion={handleToggleHide}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizQuestionView;
