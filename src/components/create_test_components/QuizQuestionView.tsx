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
  // useLazyGetTestResultQuery,
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
  selectedAnswerId: string | null; // Add selectedAnswerId to props
  setSelectedAnswer: React.Dispatch<React.SetStateAction<string | null>>;
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
  selectedAnswerId,
  setSelectedAnswer,
}) => {
  const { testProgress, quizDetails } = data;
  const { totalQuestions, questionID } = testProgress;

  // const [selectedAnswerId, setSelectedAnswer] = useState<string | null>(null);
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

  const handleSubmit = async () => {
    // Ensure the selectedAnswerId is valid
    if (!selectedAnswerId || showExplanation || isAnswering) return;

    try {
      const res = await answerQuestion({
        test_id: testId,
        question_id: questionID,
        // seletecd_option_id: selectedAnswerId,
        answer_option_id: selectedAnswerId,
      }).unwrap();

      if (!res?.success || !res?.data) {
        throw new Error(res?.message || 'Failed to submit answer');
      }

      const answerOptions = res.data.answerOptions ?? [];
      const correctOption = answerOptions.find((o: any) => o.is_correct);

      setSelectedAnswer(res.data.selected_option_id);

      setQuestions(prev => {
        const copy = [...prev];
        const idx = currentQuestion - 1;
        const existing = copy[idx];

        if (!existing) return prev;

        copy[idx] = {
          ...existing,
          quizDetails: {
            ...existing.quizDetails,

            userAnswerId: res.data.selected_option_id,
            correctAnswerId: correctOption?.id ?? null,
            explanation: {
              main: res.data.explanation,
              image: res.data.explanation_image_url
                ? res.data.explanation_image_url
                : res.data.explanation_image
                  ? `https://backend.tablerounds.ai/public/storage/question/${res.data.explanation_image}`
                  : null,
              whyIncorrect: res.data.why_incorrect
                ? [{ option: '', text: res.data.why_incorrect }]
                : [],
              pinningPoint: res.data.pimping_point,
              memoryTrick: res.data.memory_trick,
              referance: res.data.referance
                ? Array.isArray(res.data.referance)
                  ? res.data.referance
                  : [res.data.referance]
                : [],
            },
            answerOptions: answerOptions.map((o: any) => ({
              id: o.id,
              option_text: o.option_text,
              is_correct: o.is_correct,
              percentage: o.total_select ?? 0,
            })),
          },
        };

        return copy;
      });
      console.log(quizDetails, 'llllll=======================');
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
      // const saved = localStorage.getItem('MARKED_QUESTIONS');
      const MARK_KEY = `MARKED_QUESTIONS_${testId}`;
      const saved = localStorage.getItem(MARK_KEY);
      let parsed = saved ? JSON.parse(saved) : [];

      if (isMarked) {
        // remove
        parsed = parsed.filter((q: any) => q.index !== currentQuestion);
      } else {
        // add
        parsed.push({
          index: currentQuestion,
          questionId: questionID,
          title: quizDetails.question_title,
          question: quizDetails.question_steam,
          // fullData: data,
        });
      }

      // localStorage.setItem('MARKED_QUESTIONS', JSON.stringify(parsed));
      localStorage.setItem(MARK_KEY, JSON.stringify(parsed));

      // ✅ 2. Update UI instantly
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

  // Skip Question
  const handleSkip = async () => {
    try {
      await skipQuestionApi({
        test_id: testId,
        question_id: questionID,
      }).unwrap();

      onNext();
    } catch (err) {
      console.log('skip failed');
    }
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

  // const isUserCorrect =
  //   quizDetails.correctAnswerId !== null &&
  //   selectedAnswerId !== null &&
  //   selectedAnswerId === quizDetails.correctAnswerId;

  const isUserCorrect =
    quizDetails.userAnswerId === quizDetails.correctAnswerId;
  // console.log(isUserCorrect, 'who is  correct=================')
  return (
    <div className="flex flex-col space-y-4 font-[manrope]">
      <QuizTopbar
        onSkip={handleSkip}
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
        testId={testId}
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
