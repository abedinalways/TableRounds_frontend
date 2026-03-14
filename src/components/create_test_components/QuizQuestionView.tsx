'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

import QuizTopbar from './QuizTopbar';
import QuestionSidebar from './QuestionSidebar';
import QuestionCard from './QuestionCard';
import ExplanationPanel from './ExplanationPanel';

import type {
  MarkedQuestion,
  QuizDetailsUI,
  QuizQuestionDataUI,
} from '@/types/test-session';

import {
  useAnswerQuestionMutation,
  useLazyGetTestResultQuery,
  useSkipQuestionMutation,
  useToggleMarkMutation,
} from '@/app/redux/api/testSessionApi';

interface QuizQuestionViewProps {
  testId: string;
  data: QuizQuestionDataUI;
  markedQuestions: MarkedQuestion[];
  onToggleMark: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onJumpTo?: (index: number) => void;
  // setQuestions: React.Dispatch<React.SetStateAction<QuizDetailsUI[]>>;
  setQuestions: React.Dispatch<React.SetStateAction<QuizQuestionDataUI[]>>;
  currentQuestion: number;
}

const QuizQuestionView: React.FC<QuizQuestionViewProps> = ({
  testId,
  data,
  markedQuestions,
  onToggleMark,
  onNext,
  onPrevious,
  onJumpTo,
  setQuestions,
  currentQuestion,
}) => {
  const { testProgress, quizDetails } = data;
  const { totalQuestions, questionID } = testProgress;

  
  const [selectedAnswerId, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  useEffect(() => {
    setSelectedAnswer(quizDetails.userAnswerId ?? null);
    setShowExplanation(Boolean(quizDetails.correctAnswerId));
    setIsQuestionHidden(false);
  }, [questionID]);

  const [isQuestionHidden, setIsQuestionHidden] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const questionRef = useRef<HTMLDivElement>(null);
  const explanationRef = useRef<HTMLDivElement>(null);

  const [answerQuestion, { isLoading: isAnswering }] =
    useAnswerQuestionMutation();
  const [toggleMarkApi] = useToggleMarkMutation();
  const [skipQuestionApi] = useSkipQuestionMutation();
  const [getResultTrigger] = useLazyGetTestResultQuery();

  
  useEffect(() => {
    if (questionRef.current && explanationRef.current) {
      gsap.set(questionRef.current, { flex: '1 1 0%', opacity: 1 });
      gsap.set(explanationRef.current, { flex: '1 1 0%' });
    }
  }, [questionID]);

  const progressValue = (currentQuestion / totalQuestions) * 100;

  const isMarked = markedQuestions.some(q => q.index === currentQuestion);

  const handleAnswerChange = (value: string) => {
    if (showExplanation) return;
    setSelectedAnswer(value);
  };

  /**
   * Submit Answer
   */
  const handleSubmit = async () => {
    if (!selectedAnswerId || showExplanation || isAnswering) return;

    try {
      await answerQuestion({
        test_id: testId,
        question_id: questionID,
        answer_option_id: selectedAnswerId,
      }).unwrap();

      const res = await getResultTrigger({
        test_id: testId,
        question_id: questionID,
      }).unwrap();

      if (!res?.success || !res?.data) {
        throw new Error(res?.message || 'Failed to fetch result');
      }

      setQuestions(prev => {
        const copy = [...prev];
        const idx = currentQuestion - 1;
        const existing = copy[idx];

        if (!existing) return prev;

        const percentages = res.data.answer_percentages ?? {};

        copy[idx] = {
          ...existing,
          quizDetails: {
            ...existing.quizDetails,
            userAnswerId: res.data.user_answer_id,
            correctAnswerId: res.data.correct_answer_id,
            explanation: res.data.explanation,
            answerOptions: existing.quizDetails.answerOptions.map(o => ({
              ...o,
              percentage:
                typeof percentages[o.id] === 'number' ? percentages[o.id] : 0,
            })),
          },
        };

        return copy;
      });

      setShowExplanation(true);
    } catch (error) {
      console.error('Submit failed:', error);
    }
  };

  /**
   * Toggle Mark
   */
  const handleToggleMark = async () => {
    try {
      onToggleMark();

      await toggleMarkApi({
        test_id: testId,
        question_id: questionID,
        is_marked: !isMarked,
      }).unwrap();
    } catch (error) {
      console.error('Mark toggle failed:', error);
    }
  };

  /**
   * Next Question
   */
  const handleNext = async () => {
    if (!selectedAnswerId) {
      try {
        await skipQuestionApi({
          test_id: testId,
          question_id: questionID,
        }).unwrap();
      } catch {
        // ignore skip errors
      }
    }

    onNext();
  };

  const handlePrevious = () => {
    onPrevious();
  };

  /**
   * Toggle hide/show question animation
   */
  const handleToggleHide = () => {
    if (!showExplanation) return;

    const qEl = questionRef.current;
    const eEl = explanationRef.current;
    if (!qEl || !eEl) return;

    if (!isQuestionHidden) {
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

  const MIN_ZOOM = 0.8;
  const MAX_ZOOM = 1.4;
  const STEP = 0.1;

  const handleZoomIn = () => setZoomLevel(z => Math.min(z + STEP, MAX_ZOOM));

  const handleZoomOut = () => setZoomLevel(z => Math.max(z - STEP, MIN_ZOOM));

  const isUserCorrect =
    quizDetails.correctAnswerId !== null &&
    selectedAnswerId !== null &&
    selectedAnswerId === quizDetails.correctAnswerId;

  return (
    <div className="flex flex-col space-y-4 font-[manrope]">
      <QuizTopbar
        progressValue={progressValue}
        currentQuestion={currentQuestion}
        totalQuestions={totalQuestions}
        questionID={questionID}
        isMarked={isMarked}
        onToggleMark={handleToggleMark}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />

      <div className="background rounded-md grid grid-cols-1 md:grid-cols-12">
        <QuestionSidebar
          totalQuestions={totalQuestions}
          currentQuestion={currentQuestion}
          markedQuestions={markedQuestions}
          onJumpTo={onJumpTo}
        />

        <div className="col-span-11 mx-4 min-w-0">
          <div className="w-full overflow-auto">
            <div
              className="flex flex-col md:flex-row gap-6 min-w-0"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top left',
                transition: 'transform 0.2s ease',
              }}
            >
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
                  testId={testId}
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

              {showExplanation && quizDetails.explanation && (
                <div
                  ref={explanationRef}
                  className="min-w-0"
                  style={{
                    flex: isQuestionHidden ? '1 1 100%' : '1 1 0%',
                  }}
                >
                  <ExplanationPanel
                    quizDetails={{ explanation: quizDetails.explanation }}
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
