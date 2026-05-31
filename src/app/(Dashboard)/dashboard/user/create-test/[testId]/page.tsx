


/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

import QuizQuestionView from '@/components/create_test_components/QuizQuestionView';
import type { MarkedQuestion, QuizQuestionDataUI } from '@/types/test-session';
import { toast } from 'sonner';
import { useGetTestQuery } from '@/app/redux/api/startTestApi';
import type { TestData } from '@/app/redux/api/startTestApi';
import { CreateTestPageSkeleton } from '@/components/create_test_components/CreateTestPageSkeleton';

function normalizeId(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'object') {
    const obj = value as Record<string, any>;
    if (obj.id) return String(obj.id);
    if (obj._id) return String(obj._id);
    if (obj.value) return String(obj.value);
    if (obj.option_id) return String(obj.option_id);
    if (obj.answer_option_id) return String(obj.answer_option_id);
    if (obj.selected_option_id) return String(obj.selected_option_id);
    if (obj.selected_answer_option_id) return String(obj.selected_answer_option_id);
  }
  return null;
}

function pickId(...values: unknown[]): string | null {
  for (const value of values) {
    const id = normalizeId(value);
    if (id) return id;
  }
  return null;
}

function normalizeText(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value).trim().toLowerCase();
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, any>;
    const text = obj.option_text ?? obj.answer_text ?? obj.selected_option_text ?? obj.value ?? obj.text ?? obj.label ?? null;
    if (text) return String(text).trim().toLowerCase();
  }
  return null;
}

function getQuestionIdFromApiAnswer(answer: any): string | null {
  return pickId(
    answer?.question_id,
    answer?.questionId,
    answer?.questionID,
    answer?.question?.id,
    answer?.question?._id,
    answer?.question?.question_id,
  );
}

function getSelectedOptionIdFromApiAnswer(answer: any, questionAnswerOptions: any[] = []): string | null {
  const directId = pickId(
    answer?.selected_option_id,
    answer?.selectedOptionId,
    answer?.selected_answer_option_id,
    answer?.selected_answer_id,
    answer?.user_answer_option_id,
    answer?.user_answer_id,
    answer?.answer_id,
    answer?.answer_option_id,
    answer?.answerOptionId,
    answer?.option_id,
    answer?.selected_option,
    answer?.selectedOption,
    answer?.answer_option,
    answer?.answerOption,
    answer?.option,
    answer?.selected_answer,
    answer?.user_answer,
  );
  if (directId) return directId;

  const selectedText = normalizeText(
    answer?.option_text ?? answer?.selected_option_text ?? answer?.answer_option_text ?? answer?.selectedAnswerText ?? answer?.answerText ?? answer?.answer ?? answer?.selected_option ?? answer?.answer_option ?? answer?.option ?? answer?.selected_answer ?? answer?.user_answer,
  );

  if (selectedText) {
    const matchedOption = questionAnswerOptions.find(option => {
      const optionText = normalizeText(option?.option_text);
      return optionText && optionText === selectedText;
    });
    if (matchedOption?.id) return String(matchedOption.id);
  }
  return null;
}

function getCorrectOptionIdFromQuestion(questionAnswerOptions: any[] = []): string | null {
  const correctOption = questionAnswerOptions.find(option => option.is_correct);
  return correctOption?.id ? String(correctOption.id) : null;
}

function mapQuestionExplanation(question: any) {
  if (!question) return null;
  const main = question?.explanation ?? question?.explanation_text ?? null;
  const whyIncorrect = question?.why_incorrect ?? null;
  const pinningPoint = question?.pimping_point ?? null;
  const memoryTrick = question?.memory_trick ?? null;
  const referance = question?.referance ?? null;

  if (!main && !whyIncorrect && !pinningPoint && !memoryTrick && !referance) {
    return null;
  }

  return {
    main,
    image: question?.explanation_image_url ?? (question?.explanation_image ? (String(question.explanation_image).startsWith('http') ? question.explanation_image : `https://backend.tablerounds.ai/public/storage/question/${question.explanation_image}`) : null),
    whyIncorrect: whyIncorrect ? [{ option: '', text: whyIncorrect }] : [],
    pinningPoint,
    memoryTrick,
    referance: referance ? (Array.isArray(referance) ? referance : [referance]) : [],
  };
}

function mapTestDataToQuestions(data: TestData): QuizQuestionDataUI[] {
  const apiUserAnswers = (data as any)?.user_answers ?? [];

  return data.questions.map((q: any, index) => {
    const questionId = String(q.id);
    const displayQuestionId = String(q.question_id ?? '');
    const questionAnswerOptions = q.answerOptions ?? [];

    const apiAnswer = apiUserAnswers.find((answer: any) => {
      const apiQuestionId = getQuestionIdFromApiAnswer(answer);
      return apiQuestionId === questionId || apiQuestionId === displayQuestionId;
    });

    const selectedOptionId = getSelectedOptionIdFromApiAnswer(apiAnswer, questionAnswerOptions);
    const hasAnswered = Boolean(selectedOptionId);
    const correctOptionId = hasAnswered ? getCorrectOptionIdFromQuestion(questionAnswerOptions) : null;

    const calculatePercentage = (opt: any) => {
      if (!opt.total_select && !opt.percentage) return 0;
      if (opt.percentage) return Number(opt.percentage);
      if (opt.total_select) {
        const totalSelects = questionAnswerOptions.reduce((sum: number, o: any) => sum + Number(o.total_select ?? 0), 0);
        if (totalSelects > 0) return Math.round((Number(opt.total_select) / totalSelects) * 100);
      }
      return 0;
    };

    const answerOptions = questionAnswerOptions.map((opt: any) => ({
      id: String(opt.id),
      option_text: opt.option_text,
      is_correct: hasAnswered && (Boolean(opt.is_correct) || Boolean(correctOptionId && String(opt.id) === String(correctOptionId))),
      total_select: Number(opt.total_select ?? 0),
      percentage: calculatePercentage(opt),
    }));

    const explanation = hasAnswered ? mapQuestionExplanation(q) : null;

    return {
      testProgress: {
        questionID: questionId,
        totalQuestions: data.total_questions,
        currentQuestion: index + 1,
      },
      quizDetails: {
        id: questionId,
        question_title: q.question_title ?? '',
        question_steam: q.question_steam,
        question_id: q.question_id,
        answerOptions,
        correctAnswerId: correctOptionId,
        userAnswerId: selectedOptionId ? String(selectedOptionId) : null,
        explanation,
        is_marked: Boolean(q.is_marked),
      },
    };
  });
}

export default function CreateTestPage() {
  const router = useRouter();
  const params = useParams();
  const testId = params?.testId as string | undefined;

  const initializedTestIdRef = useRef<string | null>(null);
  
  const hasInitializedRef = useRef<boolean>(false);

  const [questions, setQuestions] = useState<QuizQuestionDataUI[]>([]);
  const [markedQuestions, setMarkedQuestions] = useState<MarkedQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswerId, setSelectedAnswer] = useState<string | null>(null);

  const {
    data: testResponse,
    isLoading,
    isFetching,
    isError,
    refetch: refetchTest,
  } = useGetTestQuery(testId!, {
    skip: !testId,
    refetchOnMountOrArgChange: false, 
    refetchOnFocus: false,
    refetchOnReconnect: true,
  });

  
  useEffect(() => {
    if (!testResponse?.data || !testId) return;
    
    
    if (initializedTestIdRef.current !== testId) {
      initializedTestIdRef.current = testId;
      hasInitializedRef.current = false;
    }

    
    if (hasInitializedRef.current) return;

    const mapped = mapTestDataToQuestions(testResponse.data);
    setQuestions(mapped);
    hasInitializedRef.current = true;

    const firstUnansweredIndex = mapped.findIndex(question => !question.quizDetails.userAnswerId);
    setCurrentQuestion(firstUnansweredIndex >= 0 ? firstUnansweredIndex + 1 : 1);
  }, [testResponse, testId]);

 
  useEffect(() => {
    if (questions.length === 0) return;
    
    const updatedMarkedList = questions
      .map((q, idx) => {
        if (!q.quizDetails?.is_marked) return null;
        return {
          index: idx + 1,
          questionId: q.testProgress.questionID,
          title: q.quizDetails.question_title ?? '',
          question: q.quizDetails.question_steam ?? '',
          fullData: q,
        };
      })
      .filter((m): m is MarkedQuestion => m !== null);

    setMarkedQuestions(updatedMarkedList);
  }, [questions]);

  const totalQuestions = questions.length;
  const data = questions[currentQuestion - 1] ?? null;

  const canLeaveCurrentQuestion = () => {
    const quizDetails = data?.quizDetails;
    if (!quizDetails?.userAnswerId) {
      toast.error('Please submit your current answer before moving.');
      return false;
    }
    return true;
  };

  const onJumpTo = (index: number) => {
    if (index < 1 || index > totalQuestions) return;
    if (index === currentQuestion) return;

    
    if (!canLeaveCurrentQuestion()) return;

    const targetQuestion = questions[index - 1];

    
    if (targetQuestion?.quizDetails?.userAnswerId) {
      setCurrentQuestion(index);
      return;
    }

    
    const firstUnansweredIndex = questions.findIndex(
      question => !question.quizDetails?.userAnswerId,
    );

    const maxAllowedQuestion =
      firstUnansweredIndex === -1 ? totalQuestions : firstUnansweredIndex + 1;

    if (index <= maxAllowedQuestion) {
      setCurrentQuestion(index);
      return;
    }

    toast.error('Please answer the questions serially.');
  };

  const onNext = () => {
    const quizDetails = data?.quizDetails;
    if (!selectedAnswerId && !quizDetails?.userAnswerId) {
      toast.error('Please select an answer before proceeding.');
      return;
    }
    if (!quizDetails?.userAnswerId) {
      toast.error('Please submit your answer before proceeding.');
      return;
    }
    if (currentQuestion >= totalQuestions) {
      router.push(`/dashboard/user/test-complete/${testId}`);
      return;
    }
    setCurrentQuestion(prev => prev + 1);
  };

  const onPrevious = () => {
    if (currentQuestion <= 1) return;
    if (!canLeaveCurrentQuestion()) return;

    const previousQuestion = questions[currentQuestion - 2];
    if (!previousQuestion?.quizDetails?.userAnswerId) {
      toast.error('Previous question is not available yet.');
      return;
    }
    setCurrentQuestion(prev => prev - 1);
  };


  const onToggleMarkLocalOnly = () => {
    setQuestions(prev => {
      const copy = [...prev];
      const idx = currentQuestion - 1;
      if (copy[idx]) {
        copy[idx] = {
          ...copy[idx],
          quizDetails: {
            ...copy[idx].quizDetails,
            is_marked: !copy[idx].quizDetails.is_marked,
          },
        };
      }
      return copy;
    });
  };

  if (isLoading || (isFetching && questions.length === 0)) {
    return <CreateTestPageSkeleton />;
  }
  if (isError) {
    return <div className="p-6">Failed to load test. Please try again.</div>;
  }
  if (!data || !testId) {
    return <div className="p-6">No test data found.</div>;
  }

  return (
    <QuizQuestionView
      key={data.testProgress.questionID}
      testId={testId}
      data={data}
      refetchTest={refetchTest}
      markedQuestions={markedQuestions}
      onToggleMark={onToggleMarkLocalOnly}
      onJumpTo={onJumpTo}
      onNext={onNext}
      onPrevious={onPrevious}
      questions={questions}
      currentQuestion={currentQuestion}
      setQuestions={setQuestions}
      selectedAnswerId={selectedAnswerId}
      setSelectedAnswer={setSelectedAnswer}
    />
  );
}