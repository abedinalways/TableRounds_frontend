


/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

import QuizTopbar from './QuizTopbar';
import QuestionSidebar from './QuestionSidebar';
import QuestionCard from './QuestionCard';
import ExplanationPanel from './ExplanationPanel';
// import { useDispatch } from 'react-redux';
// import type { AppDispatch } from '@/app/redux/store';
// import { saveIncompleteRetakeAnswer } from '@/app/redux/features/incompleteRetakeSlice';
import type { MarkedQuestion, QuizQuestionDataUI } from '@/types/test-session';

import {
  useAnswerQuestionMutation,
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
  refetchTest: () => Promise<any>;
  onJumpTo?: (index: number) => void;
  setQuestions: React.Dispatch<React.SetStateAction<QuizQuestionDataUI[]>>;
  currentQuestion: number;
  selectedAnswerId: string | null;
  setSelectedAnswer: React.Dispatch<React.SetStateAction<string | null>>;
  questions: QuizQuestionDataUI[];
}

const QuizQuestionView: React.FC<QuizQuestionViewProps> = ({
  testId,
  data,
  markedQuestions,
  questions,
  onToggleMark,
  onNext,
  refetchTest,
  onPrevious,
  onJumpTo,
  setQuestions,
  currentQuestion,
  selectedAnswerId,
  setSelectedAnswer,
}) => {
  const { testProgress, quizDetails } = data;
  const { totalQuestions, questionID } = testProgress;

  // const dispatch = useDispatch<AppDispatch>();

  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isQuestionHidden, setIsQuestionHidden] = useState<boolean>(false);
  const [shouldRenderQuestion, setShouldRenderQuestion] =
    useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const questionRef = useRef<HTMLDivElement>(null);
  const explanationRef = useRef<HTMLDivElement>(null);
  const showExplanationRef = useRef(showExplanation);

  const [answerQuestion, { isLoading: isAnswering }] =
    useAnswerQuestionMutation();
  const [toggleMarkApi] = useToggleMarkMutation();
  const [skipQuestionApi] = useSkipQuestionMutation();

  useEffect(() => {
    showExplanationRef.current = showExplanation;
  }, [showExplanation]);

  useEffect(() => {
    const nextSelectedAnswer = quizDetails.userAnswerId
      ? String(quizDetails.userAnswerId)
      : null;

    const nextShowExplanation = Boolean(
      quizDetails.userAnswerId && quizDetails.correctAnswerId,
    );

    setSelectedAnswer(prev =>
      prev === nextSelectedAnswer ? prev : nextSelectedAnswer,
    );

    setShowExplanation(prev =>
      prev === nextShowExplanation ? prev : nextShowExplanation,
    );

    setIsQuestionHidden(false);
    setShouldRenderQuestion(true);
  }, [
    questionID,
    quizDetails.userAnswerId,
    quizDetails.correctAnswerId,
    setSelectedAnswer,
  ]);

  useEffect(() => {
    if (questionRef.current && explanationRef.current) {
      gsap.set(questionRef.current, { flex: '1 1 0%', opacity: 1 });
      gsap.set(explanationRef.current, { flex: '1 1 0%' });
    }
  }, [questionID, shouldRenderQuestion]);

  const progressValue = (currentQuestion / totalQuestions) * 100;
  const isMarked = markedQuestions.some(q => q.index === currentQuestion);

  const handleAnswerChange = useCallback(
    (value: string) => {
      if (quizDetails.userAnswerId || showExplanationRef.current) return;

      setSelectedAnswer(String(value));
    },
    [quizDetails.userAnswerId, setSelectedAnswer],
  );

  const handleSubmit = useCallback(async (): Promise<boolean> => {
    if (!selectedAnswerId || showExplanationRef.current || isAnswering) {
      return false;
    }

    try {
      const res = await answerQuestion({
        test_id: testId,
        question_id: questionID,
        answer_option_id: selectedAnswerId,
      }).unwrap();

      if (!res?.success || !res?.data) {
        throw new Error(res?.message || 'Failed to submit answer');
      }

      const answerOptions = res.data.answerOptions ?? [];
      const correctOption = answerOptions.find((o: any) => o.is_correct);

      const selectedOptionId = String(res.data.selected_option_id);
      const correctOptionId = correctOption?.id
        ? String(correctOption.id)
        : null;

      const isCorrect = selectedOptionId === correctOptionId;

      const explanation = {
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
      };

      const mappedAnswerOptions = answerOptions.map((o: any) => ({
        id: String(o.id),
        option_text: o.option_text,
        is_correct: Boolean(o.is_correct),
        total_select: Number(o.total_select ?? 0),
      }));

      setSelectedAnswer(selectedOptionId);

      setQuestions(prev => {
        const copy = [...prev];
        const idx = currentQuestion - 1;
        const existing = copy[idx];

        if (!existing) return prev;

        copy[idx] = {
          ...existing,
          quizDetails: {
            ...existing.quizDetails,
            userAnswerId: selectedOptionId,
            correctAnswerId: correctOptionId,
            explanation,
            answerOptions: mappedAnswerOptions,
          },
        };

        return copy;
      });

      // dispatch(
      //   saveIncompleteRetakeAnswer({
      //     testId,
      //     questionId: questionID,
      //     selectedOptionId,
      //     correctOptionId,
      //     answerOptions: mappedAnswerOptions,
      //     explanation,
      //   }),
      // );

      setShowExplanation(true);
      
      return isCorrect;
    } catch (error: any) {
      const message = error?.data?.message || error?.message || 'Submit failed';

      const isAlreadyAnswered =
        typeof message === 'string' &&
        message.toLowerCase().includes('already answered');

      if (isAlreadyAnswered) {
        const fallbackSelectedOptionId =
          quizDetails.userAnswerId ?? selectedAnswerId;

        const fallbackCorrectOptionId =
          quizDetails.correctAnswerId ??
          quizDetails.answerOptions.find(option => option.is_correct)?.id ??
          null;

        if (fallbackSelectedOptionId) {
          const selectedId = String(fallbackSelectedOptionId);
          const correctId = fallbackCorrectOptionId
            ? String(fallbackCorrectOptionId)
            : null;

          setSelectedAnswer(selectedId);

          setQuestions(prev => {
            const copy = [...prev];
            const idx = currentQuestion - 1;
            const existing = copy[idx];

            if (!existing) return prev;

            copy[idx] = {
              ...existing,
              quizDetails: {
                ...existing.quizDetails,
                userAnswerId: selectedId,
                correctAnswerId: correctId,
                answerOptions: existing.quizDetails.answerOptions.map(
                  option => ({
                    ...option,
                    id: String(option.id),
                    is_correct:
                      Boolean(option.is_correct) ||
                      String(option.id) === String(correctId),
                  }),
                ),
              },
            };

            return copy;
          });

          setShowExplanation(Boolean(correctId));

          return correctId ? selectedId === correctId : false;
        }
      }

      console.error('Submit failed:', error);
      return false;
    }
  }, [
    selectedAnswerId,
    isAnswering,
    answerQuestion,
    testId,
    questionID,
    currentQuestion,
    setSelectedAnswer,
    setQuestions,
    // dispatch,
    quizDetails.userAnswerId,
    quizDetails.correctAnswerId,
    quizDetails.answerOptions,
  ]);

  const handleToggleMark = async () => {
   
    const currentMarkedState = Boolean(quizDetails.is_marked);
    const targetMarkedState = !currentMarkedState;

    try {
      // Toggle local parent array instantly
      onToggleMark();

      // Dispatch to API stream safely with correct inverse flag state
      await toggleMarkApi({
        test_id: testId,
        question_id: questionID,
        is_marked: targetMarkedState,
      }).unwrap();
    } catch (error) {
      console.error('Mark toggle failed:', error);
      // Revert if request fails
      onToggleMark();
    }
  };

  const handleNext = async () => {
    if (!selectedAnswerId && !quizDetails.userAnswerId) {
      try {
        await skipQuestionApi({
          test_id: testId,
          question_id: questionID,
        }).unwrap();
      } catch {
        console.log('skip failed');
      }
    }

    onNext();
  };

  const handlePrevious = () => {
    onPrevious();
  };

  const handleSkip = async () => {
    try {
      await skipQuestionApi({
        test_id: testId,
        question_id: questionID,
      }).unwrap();

      onNext();
    } catch {
      console.log('skip failed');
    }
  };

  const handleToggleHide = () => {
    if (!showExplanation) return;

    if (!isQuestionHidden) {
      const qEl = questionRef.current;
      const eEl = explanationRef.current;

      if (!qEl || !eEl) return;

      gsap.to(qEl, {
        flex: '0 0 0%',
        opacity: 0,
        duration: 0.45,
        ease: 'power2.inOut',
        onComplete: () => {
          setIsQuestionHidden(true);
          setShouldRenderQuestion(false);
        },
      });

      gsap.to(eEl, {
        flex: '1 1 100%',
        duration: 0.45,
        ease: 'power2.inOut',
      });

      return;
    }

    setShouldRenderQuestion(true);
    setIsQuestionHidden(false);

    requestAnimationFrame(() => {
      const qEl = questionRef.current;
      const eEl = explanationRef.current;

      if (!qEl || !eEl) return;

      gsap.fromTo(
        qEl,
        {
          flex: '0 0 0%',
          opacity: 0,
        },
        {
          flex: '1 1 0%',
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
        },
      );

      gsap.to(eEl, {
        flex: '1 1 0%',
        duration: 0.5,
        ease: 'power2.out',
      });
    });
  };

  const MIN_ZOOM = 0.8;
  const MAX_ZOOM = 1.4;
  const STEP = 0.1;

  const handleZoomIn = () => setZoomLevel(z => Math.min(z + STEP, MAX_ZOOM));
  const handleZoomOut = () => setZoomLevel(z => Math.max(z - STEP, MIN_ZOOM));

  const isUserCorrect =
    Boolean(quizDetails.userAnswerId) &&
    Boolean(quizDetails.correctAnswerId) &&
    String(quizDetails.userAnswerId) === String(quizDetails.correctAnswerId);

  return (
    <div className="flex flex-col space-y-4 font-[manrope]">
      <QuizTopbar
        quizDetails={quizDetails}
        onSkip={handleSkip}
        progressValue={progressValue}
        currentQuestion={currentQuestion}
        totalQuestions={totalQuestions}
        questionID={questionID}
        isMarked={Boolean(quizDetails.is_marked)}
        onToggleMark={handleToggleMark}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        testId={testId}
      />

      <div className="background rounded-md grid grid-cols-1 lg:grid-cols-12 gap-4 p-2 md:p-4  min-h-[400px]">
        <QuestionSidebar
          totalQuestions={totalQuestions}
          currentQuestion={currentQuestion}
          markedQuestions={markedQuestions}
          questions={questions}
          onJumpTo={onJumpTo}
        />

        <div className="md:col-span-11 mx-4 min-w-0">
          <div className="w-full overflow-auto">
            <div
              className="flex flex-col lg:flex-row gap-6 w-full min-w-0 items-start"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top left',
                transition: 'transform 0.2s ease',
              }}
            >
              {shouldRenderQuestion && (
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
                    questionID={questionID}
                    currentQuestion={currentQuestion}
                    setQuestions={setQuestions}
                    quizDetails={quizDetails}
                    selectedAnswerId={selectedAnswerId}
                    showExplanation={showExplanation}
                    isUserCorrect={isUserCorrect}
                    onAnswerChange={handleAnswerChange}
                    onToggleHide={handleToggleHide}
                    isQuestionHidden={isQuestionHidden}
                  />
                </div>
              )}

              {showExplanation && quizDetails.explanation && (
                <div
                  ref={explanationRef}
                  className="min-w-0 w-full"
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