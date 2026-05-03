/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSelector } from 'react-redux';

import QuizQuestionView from '@/components/create_test_components/QuizQuestionView';
import type { MarkedQuestion, QuizQuestionDataUI } from '@/types/test-session';
import { toast } from 'sonner';
import { useGetTestQuery } from '@/app/redux/api/startTestApi';
import type { TestData } from '@/app/redux/api/startTestApi';
import { CreateTestPageSkeleton } from '@/components/create_test_components/CreateTestPageSkeleton';
import type { RootState } from '@/app/redux/store';

const MARKED_KEY_PREFIX = 'MARKED_QUESTIONS_';
const EMPTY_PERSISTED_ANSWERS: Record<string, any> = {};

function safeParseJSON<T>(value: string | null): T | null {
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

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
    if (obj.selected_answer_option_id) {
      return String(obj.selected_answer_option_id);
    }
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

    const text =
      obj.option_text ??
      obj.answer_text ??
      obj.selected_option_text ??
      obj.value ??
      obj.text ??
      obj.label ??
      null;

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

function getSelectedOptionIdFromApiAnswer(
  answer: any,
  questionAnswerOptions: any[] = [],
): string | null {
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
    answer?.option_text ??
      answer?.selected_option_text ??
      answer?.answer_option_text ??
      answer?.selectedAnswerText ??
      answer?.answerText ??
      answer?.answer ??
      answer?.selected_option ??
      answer?.answer_option ??
      answer?.option ??
      answer?.selected_answer ??
      answer?.user_answer,
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

function getCorrectOptionIdFromApiAnswer(
  answer: any,
  questionAnswerOptions: any[] = [],
): string | null {
  const directId = pickId(
    answer?.correct_option_id,
    answer?.correctAnswerId,
    answer?.correct_answer_id,
    answer?.correct_option,
    answer?.correctAnswer,
  );

  if (directId) return directId;

  const correctOption = questionAnswerOptions.find(option => option.is_correct);
  return correctOption?.id ? String(correctOption.id) : null;
}

function mapApiExplanation(answer: any) {
  if (!answer) return null;

  const main = answer?.explanation ?? answer?.explanation_text ?? null;
  const whyIncorrect = answer?.why_incorrect ?? null;
  const pinningPoint = answer?.pimping_point ?? null;
  const memoryTrick = answer?.memory_trick ?? null;
  const referance = answer?.referance ?? null;

  if (!main && !whyIncorrect && !pinningPoint && !memoryTrick && !referance) {
    return null;
  }

  return {
    main,
    image:
      answer?.explanation_image_url ??
      (answer?.explanation_image
        ? `https://backend.tablerounds.ai/public/storage/question/${answer.explanation_image}`
        : null),
    whyIncorrect: whyIncorrect ? [{ option: '', text: whyIncorrect }] : [],
    pinningPoint,
    memoryTrick,
    referance: referance
      ? Array.isArray(referance)
        ? referance
        : [referance]
      : [],
  };
}

function mapTestDataToQuestions(
  data: TestData,
  persistedAnswersForTest: Record<string, any>,
): QuizQuestionDataUI[] {
  const apiUserAnswers = (data as any)?.user_answers ?? [];

  return data.questions.map((q: any, index) => {
    const questionId = String(q.id);
    const displayQuestionId = String(q.question_id ?? '');
    const questionAnswerOptions = q.answerOptions ?? [];

    const persistedAnswer =
      persistedAnswersForTest?.[questionId] ??
      persistedAnswersForTest?.[displayQuestionId];

    const apiAnswer = apiUserAnswers.find((answer: any) => {
      const apiQuestionId = getQuestionIdFromApiAnswer(answer);

      return (
        apiQuestionId === questionId || apiQuestionId === displayQuestionId
      );
    });

    const apiSelectedOptionId = getSelectedOptionIdFromApiAnswer(
      apiAnswer,
      questionAnswerOptions,
    );

    const selectedOptionId =
      persistedAnswer?.selectedOptionId ?? apiSelectedOptionId ?? null;

    const hasAnswered = Boolean(selectedOptionId);

    const apiCorrectOptionId = getCorrectOptionIdFromApiAnswer(
      apiAnswer,
      questionAnswerOptions,
    );

    const correctOptionId = hasAnswered
      ? (persistedAnswer?.correctOptionId ??
        apiCorrectOptionId ??
        questionAnswerOptions.find((opt: any) => opt.is_correct)?.id ??
        null)
      : null;

    const answerOptions =
      persistedAnswer?.answerOptions?.length > 0
        ? persistedAnswer.answerOptions.map((opt: any) => ({
            ...opt,
            id: String(opt.id),
            is_correct:
              Boolean(opt.is_correct) ||
              Boolean(
                correctOptionId && String(opt.id) === String(correctOptionId),
              ),
          }))
        : questionAnswerOptions.map((opt: any) => ({
            id: String(opt.id),
            option_text: opt.option_text,
            is_correct:
              hasAnswered &&
              (Boolean(opt.is_correct) ||
                Boolean(
                  correctOptionId && String(opt.id) === String(correctOptionId),
                )),
            percentage: opt.total_select ?? opt.percentage ?? 0,
          }));

    const explanation = hasAnswered
      ? (persistedAnswer?.explanation ?? mapApiExplanation(apiAnswer))
      : null;

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
        correctAnswerId: correctOptionId ? String(correctOptionId) : null,
        userAnswerId: selectedOptionId ? String(selectedOptionId) : null,
        explanation,
      },
    };
  });
}

export default function CreateTestPage() {
  const router = useRouter();
  const params = useParams();
  const testId = params?.testId as string | undefined;

  const initializedTestIdRef = useRef<string | null>(null);

  const [questions, setQuestions] = useState<QuizQuestionDataUI[]>([]);
  const [markedQuestions, setMarkedQuestions] = useState<MarkedQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswerId, setSelectedAnswer] = useState<string | null>(null);

  const MARK_KEY = `${MARKED_KEY_PREFIX}${testId}`;

  const persistedAnswersForTest = useSelector((state: RootState) => {
    if (!testId) return EMPTY_PERSISTED_ANSWERS;

    return (
      state.incompleteRetake.answersByTestId[testId] ?? EMPTY_PERSISTED_ANSWERS
    );
  });

  const {
    data: testResponse,
    isLoading,
    isError,
  } = useGetTestQuery(testId!, { skip: !testId });

  useEffect(() => {
    if (!testResponse?.data || !testId) return;

    if (initializedTestIdRef.current === testId) return;

    initializedTestIdRef.current = testId;

    const mapped = mapTestDataToQuestions(
      testResponse.data,
      persistedAnswersForTest,
    );

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuestions(mapped);

    const firstUnansweredIndex = mapped.findIndex(
      question => !question.quizDetails.userAnswerId,
    );

    setCurrentQuestion(
      firstUnansweredIndex >= 0 ? firstUnansweredIndex + 1 : 1,
    );

    const apiMarked: MarkedQuestion[] =
      (testResponse.data as any).user_answers
        ?.filter((answer: any) => answer.is_marked)
        .map((answer: any) => {
          const apiQuestionId = getQuestionIdFromApiAnswer(answer);

          const idx = mapped.findIndex(q => {
            return (
              q.testProgress.questionID === apiQuestionId ||
              String(q.quizDetails.question_id ?? '') === apiQuestionId
            );
          });

          const q = mapped[idx];

          return {
            index: idx + 1,
            questionId: apiQuestionId ?? '',
            title: q?.quizDetails.question_title ?? '',
            question: q?.quizDetails.question_steam ?? '',
            fullData: q,
          };
        })
        .filter((m: MarkedQuestion) => m.index > 0) ?? [];

    const savedMarks =
      safeParseJSON<MarkedQuestion[]>(localStorage.getItem(MARK_KEY)) ?? [];

    const merged = [
      ...apiMarked,
      ...savedMarks.filter(
        saved => !apiMarked.some(api => api.questionId === saved.questionId),
      ),
    ];

    setMarkedQuestions(merged);
  }, [testResponse, testId, persistedAnswersForTest, MARK_KEY]);

  const safeSetLocal = (key: string, value: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      if (err instanceof DOMException && err.name === 'QuotaExceededError') {
        console.error(
          '[Local] QuotaExceededError — clearing stale local data.',
        );
        localStorage.clear();
      }
    }
  };

  const totalQuestions = questions.length;
  const data = questions[currentQuestion - 1] ?? null;

  const persistMarks = (updated: MarkedQuestion[]) => {
    safeSetLocal(MARK_KEY, updated);
  };

  const onJumpTo = (index: number) => {
    const quizDetails = data?.quizDetails;

    if (!selectedAnswerId && !quizDetails?.userAnswerId) {
      toast.error('Please select an answer before proceeding.');
      return;
    }

    if (!quizDetails?.userAnswerId) {
      toast.error('Please submit your answer before proceeding.');
      return;
    }

    if (index >= 1 && index <= totalQuestions) {
      setCurrentQuestion(index);
    }
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
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const onToggleMarkLocalOnly = () => {
    setMarkedQuestions(prev => {
      const exists = prev.some(q => q.index === currentQuestion);
      const current = questions[currentQuestion - 1];

      const updated: MarkedQuestion[] = exists
        ? prev.filter(q => q.index !== currentQuestion)
        : [
            ...prev,
            {
              index: currentQuestion,
              questionId: current?.testProgress.questionID ?? '',
              title: current?.quizDetails?.question_title ?? '',
              question: current?.quizDetails?.question_steam ?? '',
              fullData: current,
            },
          ];

      persistMarks(updated);
      return updated;
    });
  };

  if (isLoading) return <CreateTestPageSkeleton />;

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
      markedQuestions={markedQuestions}
      onToggleMark={onToggleMarkLocalOnly}
      onJumpTo={onJumpTo}
      onNext={onNext}
      onPrevious={onPrevious}
      currentQuestion={currentQuestion}
      setQuestions={setQuestions}
      selectedAnswerId={selectedAnswerId}
      setSelectedAnswer={setSelectedAnswer}
    />
  );
}