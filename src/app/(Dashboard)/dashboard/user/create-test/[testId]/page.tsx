

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import QuizQuestionView from '@/components/create_test_components/QuizQuestionView';

import type { MarkedQuestion, QuizQuestionDataUI } from '@/types/test-session';
import { toast } from 'sonner';
import { useGetTestQuery } from '@/app/redux/api/startTestApi';
import type { TestData } from '@/app/redux/api/startTestApi';
import { Skeleton } from '@/components/ui/skeleton';

const MARKED_KEY_PREFIX = 'MARKED_QUESTIONS_';

function safeParseJSON<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

/** Map GET /test/:id response → QuizQuestionDataUI[] */
function mapTestDataToQuestions(data: TestData): QuizQuestionDataUI[] {
  return data.questions.map((q, index) => ({
    testProgress: {
      questionID: q.id,
      totalQuestions: data.total_questions,
      currentQuestion: index + 1,
    },
    quizDetails: {
      id: q.id,
      question_title: q.question_title ?? '',
      question_steam: q.question_steam,
      question_id: q.question_id,
      answerOptions: q.answerOptions.map(opt => ({
        id: opt.id,
        option_text: opt.option_text,
        is_correct: false,
        percentage: 0,
      })),
      correctAnswerId: null,
      userAnswerId: null,
      explanation: null,
    },
  }));
}

export default function CreateTestPage() {
  const router = useRouter();
  const params = useParams();
  const testId = params?.testId as string | undefined;

  const [questions, setQuestions] = useState<QuizQuestionDataUI[]>([]);
  const [markedQuestions, setMarkedQuestions] = useState<MarkedQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswerId, setSelectedAnswer] = useState<string | null>(null);

  const MARK_KEY = `${MARKED_KEY_PREFIX}${testId}`;

  // ✅ Fetch test data from API
  const {
    data: testResponse,
    isLoading,
    isError,
  } = useGetTestQuery(testId!, { skip: !testId });

  // ✅ Initialize questions from API response
  useEffect(() => {
    if (!testResponse?.data) return;

    const mapped = mapTestDataToQuestions(testResponse.data);
    setQuestions(mapped);

    // Pre-populate marked questions from API user_answers
    const apiMarked: MarkedQuestion[] =
      testResponse.data.user_answers
        ?.filter(a => a.is_marked)
        .map(a => {
          const idx = mapped.findIndex(
            q => q.testProgress.questionID === a.question_id,
          );
          const q = mapped[idx];
          return {
            index: idx + 1,
            questionId: a.question_id,
            title: q?.quizDetails.question_title ?? '',
            question: q?.quizDetails.question_steam ?? '',
            fullData: q,
          };
        })
        .filter(m => m.index > 0) ?? [];

    // Merge with any existing localStorage marks
    const savedMarks =
      safeParseJSON<MarkedQuestion[]>(localStorage.getItem(MARK_KEY)) ?? [];

    const merged = [
      ...apiMarked,
      ...savedMarks.filter(
        s => !apiMarked.some(a => a.questionId === s.questionId),
      ),
    ];

    setMarkedQuestions(merged);
  }, [testResponse]);

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

    if (!selectedAnswerId) {
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

    if (!selectedAnswerId || !quizDetails?.userAnswerId) {
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
      console.log(current, "lllllllllllll==========")
      const updated: MarkedQuestion[] = exists
        ? prev.filter(q => q.index !== currentQuestion)
        : [
            ...prev,
            {
              index: currentQuestion,
              questionId: current?.quizDetails.question_id ?? '',
              title: current?.quizDetails?.question_title ?? '',
              question: current?.quizDetails?.question_steam ?? '',
              fullData: current,
            },
          ];

      persistMarks(updated);
      return updated;
    });
  };

  if (isLoading) return (
    <div className="grid grid-cols-[1fr_240px] gap-4 p-6 h-sereen">
      {/* Left column */}
      <div className="flex flex-col gap-4">
        {/* Progress bar card */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex justify-between mb-3">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="h-1.5 w-full rounded-full" />
          <Skeleton className="h-1.5 w-full rounded-full" />
          <Skeleton className="h-1.5 w-full rounded-full" />
          <Skeleton className="h-1.5 w-full rounded-full" />
        </div>

        {/* Question stem card */}
        <div className="rounded-xl border border-border bg-card p-6">
          <Skeleton className="h-3 w-16 mb-4" />
          <Skeleton className="h-3.5 w-full mb-2" />
          <Skeleton className="h-3.5 w-[88%] mb-2" />
          <Skeleton className="h-3.5 w-3/4" />
        </div>

        {/* Answer options */}
        <div className="flex flex-col gap-3">
          {[75, 90, 65, 82].map((w, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card px-5 py-4 flex items-center gap-4"
            >
              <Skeleton className="h-7 w-7 rounded-full shrink-0" />
              <Skeleton className={`h-3.5`} style={{ width: `${w}%` }} />
            </div>
          ))}
        </div>

      </div>

    </div>
  );
  if (isError)
    return <div className="p-6">Failed to load test. Please try again.</div>;
  if (!data || !testId) return <div className="p-6">No test data found.</div>;

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