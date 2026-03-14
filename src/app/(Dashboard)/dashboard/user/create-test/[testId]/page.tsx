'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import QuizQuestionView from '@/components/create_test_components/QuizQuestionView';

import type { MarkedQuestion, QuizQuestionDataUI } from '@/types/test-session';

const TEST_SESSION_KEY_PREFIX = 'TEST_SESSION_';
const MARKED_KEY_PREFIX = 'MARKED_QUESTIONS_';

function safeParseJSON<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

interface StoredTestSession {
  id: string;
  total_questions: number;
  questions: QuizQuestionDataUI[];
}

export default function CreateTestPage() {
  const router = useRouter();
  const params = useParams();

 const testId = params?.testId as string | undefined;

  const [questions, setQuestions] = useState<QuizQuestionDataUI[]>([]);
  const [markedQuestions, setMarkedQuestions] = useState<MarkedQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!testId || questions.length === 0) return;

    const existing = safeParseJSON<StoredTestSession>(
      sessionStorage.getItem(`${TEST_SESSION_KEY_PREFIX}${testId}`),
    );

    if (!existing) return;

    sessionStorage.setItem(
      `${TEST_SESSION_KEY_PREFIX}${testId}`,
      JSON.stringify({
        ...existing,
        questions,
      }),
    );
  }, [questions, testId]);

  useEffect(() => {
    if (!testId) return;

    const session = safeParseJSON<StoredTestSession>(
      sessionStorage.getItem(`${TEST_SESSION_KEY_PREFIX}${testId}`),
    );

    const marks =
      safeParseJSON<MarkedQuestion[]>(
        localStorage.getItem(`${MARKED_KEY_PREFIX}${testId}`),
      ) ?? [];

    if (!session || !session.questions || session.questions.length === 0) {
      console.log('No test session found for:', testId);
      router.replace('/dashboard/user/create-test');
      return;
    }

    console.log('Loaded session:', session);

    setQuestions(session.questions);
    console.log(questions, 'questions------------------------')
    setMarkedQuestions(marks);
    setLoading(false);
  }, [testId, router]);

  const totalQuestions = questions.length;
  const data = questions[currentQuestion - 1] ?? null;

  const persistMarks = (updated: MarkedQuestion[]) => {
    if (!testId) return;
    localStorage.setItem(
      `${MARKED_KEY_PREFIX}${testId}`,
      JSON.stringify(updated),
    );
  };

  const onJumpTo = (index: number) => {
    if (index < 1 || index > totalQuestions) return;
    setCurrentQuestion(index);
  };

  const onNext = () => {
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

      const updated = exists
        ? prev.filter(q => q.index !== currentQuestion)
        : [
            ...prev,
            {
              index: currentQuestion,
              questionId: current?.testProgress?.questionID ?? '',
              title: current?.quizDetails?.question_title ?? '',
              question: current?.quizDetails?.question_steam ?? '',
            },
          ];

      persistMarks(updated);
      return updated;
    });
  };

  if (loading) {
    return <div className="p-6">Loading test...</div>;
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
    />
  );
}
