// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import QuizQuestionView from '@/components/create_test_components/QuizQuestionView';

// import type { MarkedQuestion, QuizQuestionDataUI } from '@/types/test-session';
// import { toast } from 'sonner';

// const TEST_SESSION_KEY_PREFIX = 'TEST_SESSION_';
// const MARKED_KEY_PREFIX = 'MARKED_QUESTIONS_';

// function safeParseJSON<T>(value: string | null): T | null {
//   if (!value) return null;
//   try {
//     return JSON.parse(value) as T;
//   } catch {
//     return null;
//   }
// }

// interface StoredTestSession {
//   id: string;
//   total_questions: number;
//   questions: QuizQuestionDataUI[];
// }

// export default function CreateTestPage() {
//   const router = useRouter();
//   const params = useParams();

//  const testId = params?.testId as string | undefined;

//   const [questions, setQuestions] = useState<QuizQuestionDataUI[]>([]);
//   const [markedQuestions, setMarkedQuestions] = useState<MarkedQuestion[]>([]);
//   const [currentQuestion, setCurrentQuestion] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [selectedAnswerId, setSelectedAnswer] = useState<string | null>(null);

//   useEffect(() => {
//     if (!testId || questions.length === 0) return;

//     const existing = safeParseJSON<StoredTestSession>(
//       sessionStorage.getItem(`${TEST_SESSION_KEY_PREFIX}${testId}`),
//     );

//     if (!existing) return;

//     sessionStorage.setItem(
//       `${TEST_SESSION_KEY_PREFIX}${testId}`,
//       JSON.stringify({
//         ...existing,
//         questions,
//       }),
//     );
//   }, [questions, testId]);

//   useEffect(() => {
//     if (!testId) return;

//     const session = safeParseJSON<StoredTestSession>(
//       sessionStorage.getItem(`${TEST_SESSION_KEY_PREFIX}${testId}`),
//     );

//     const marks =
//       safeParseJSON<MarkedQuestion[]>(
//         localStorage.getItem(`${MARKED_KEY_PREFIX}${testId}`),
//       ) ?? [];

//     if (!session || !session.questions || session.questions.length === 0) {
//       console.log('No test session found for:', testId);
//       router.replace('/dashboard/user/create-test');
//       return;
//     }

//     console.log('Loaded session:', session);

//     setQuestions(session.questions);
//     console.log(questions, 'questions------------------------')
//     setMarkedQuestions(marks);
//     setLoading(false);
//   }, [testId, router]);

//   const totalQuestions = questions.length;
//   const data = questions[currentQuestion - 1] ?? null;

//   const persistMarks = (updated: MarkedQuestion[]) => {
//     if (!testId) return;
//     localStorage.setItem(
//       `${MARKED_KEY_PREFIX}${testId}`,
//       JSON.stringify(updated),
//     );
//   };

//   // const onJumpTo = (index: number) => {
//   //   if (index < 1 || index > totalQuestions) return;
//   //   setCurrentQuestion(index);
//   // };

//   const onJumpTo = (index: number) => {
//     // Access quizDetails from the data prop
//     const quizDetails = data?.quizDetails;

//     // Check if the user has selected an answer
//     if (!selectedAnswerId) {
//       toast.error('Please select an answer before proceeding.');
//       return; // Prevent jumping to the next question if no answer is selected
//     }

//     // Check if the user has submitted the answer (using quizDetails)
//     if (!quizDetails?.userAnswerId) {
//       toast.error('Please submit your answer before proceeding.');
//       return; // Prevent jumping to the next question if the answer isn't submitted
//     }

//     // If no issues, jump to the selected question
//     if (index >= 1 && index <= totalQuestions) {
//       setCurrentQuestion(index);
//     }
//   };

//   const onNext = () => {
//      const quizDetails = data?.quizDetails;

//     if (!selectedAnswerId) {
//       toast.error('Please submit your answer before proceeding.');
//       return;
//     }
//      if (!quizDetails.userAnswerId) {
//        toast.error('Please submit your answer before proceeding.');
//        return; // Prevent moving to the next question if the answer isn't submitted
//      }

//     // If the user has answered, proceed to the next question
//     if (currentQuestion >= totalQuestions) {
//       router.push(`/dashboard/user/test-complete/${testId}`);
//       return;
//     }

//     setCurrentQuestion(prev => prev + 1);
//   };

//   const onPrevious = () => {
//     if (currentQuestion > 1) {
//       setCurrentQuestion(prev => prev - 1);
//     }
//   };

//   const onToggleMarkLocalOnly = () => {
//     setMarkedQuestions(prev => {
//       const exists = prev.some(q => q.index === currentQuestion);
//       const current = questions[currentQuestion - 1];

//       const updated = exists
//         ? prev.filter(q => q.index !== currentQuestion)
//         : [
//             ...prev,
//             {
//               index: currentQuestion,
//               questionId: current?.testProgress?.questionID ?? '',
//               title: current?.quizDetails?.question_title ?? '',
//               question: current?.quizDetails?.question_steam ?? '',
//               fullData: current,
//             },
//           ];

//       persistMarks(updated);
//       return updated;
//     });
//   };

//   if (loading) {
//     return <div className="p-6">Loading test...</div>;
//   }

//   if (!data || !testId) {
//     return <div className="p-6">No test data found.</div>;
//   }

//   return (
//     <QuizQuestionView
//       key={data.testProgress.questionID}
//       testId={testId}
//       data={data}
//       markedQuestions={markedQuestions}
//       onToggleMark={onToggleMarkLocalOnly}
//       onJumpTo={onJumpTo}
//       onNext={onNext}
//       onPrevious={onPrevious}
//       currentQuestion={currentQuestion}
//       setQuestions={setQuestions}
//       selectedAnswerId={selectedAnswerId}
//       setSelectedAnswer={setSelectedAnswer}
//     />
//   );
// }

// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import QuizQuestionView from '@/components/create_test_components/QuizQuestionView';

// import type { MarkedQuestion, QuizQuestionDataUI } from '@/types/test-session';
// import { toast } from 'sonner';

// const TEST_SESSION_KEY_PREFIX = 'TEST_SESSION_';
// const MARKED_KEY_PREFIX = 'MARKED_QUESTIONS_';

// function safeParseJSON<T>(value: string | null): T | null {
//   if (!value) return null;
//   try {
//     return JSON.parse(value) as T;
//   } catch {
//     return null;
//   }
// }

// function buildSessionProgressSnapshot(questions: QuizQuestionDataUI[]) {
//   return questions.map(q => ({
//     testProgress: {
//       ...q.testProgress, // questionID, totalQuestions, etc.
//     },
//     quizDetails: {
//       // ── Display fields (needed to render question & options) ──
//       question_title: q.quizDetails.question_title ?? null,
//       question_steam: q.quizDetails.question_steam ?? null,

//       // ── Answer options (text + id only; drop percentages to save space) ──
//       answerOptions: (q.quizDetails.answerOptions ?? []).map(o => ({
//         id: o.id,
//         option_text: o.option_text,
//         is_correct: o.is_correct,
//         percentage: o.percentage ?? 0,
//       })),

//       // ── Progress fields ──
//       userAnswerId: q.quizDetails.userAnswerId ?? null,
//       correctAnswerId: q.quizDetails.correctAnswerId ?? null,

//       // ── Explanation: EXCLUDED from snapshot (too heavy) ──
//       // It is re-populated in state after answerQuestion API call,
//       // so it does NOT need to survive a page reload.
//       explanation: q.quizDetails.explanation ?? null,
//     },
//   }));
// }

// export default function CreateTestPage() {
//   const router = useRouter();
//   const params = useParams();

//   const testId = params?.testId as string | undefined;

//   const [questions, setQuestions] = useState<QuizQuestionDataUI[]>([]);
//   const [markedQuestions, setMarkedQuestions] = useState<MarkedQuestion[]>([]);
//   const [currentQuestion, setCurrentQuestion] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [selectedAnswerId, setSelectedAnswer] = useState<string | null>(null);

//   const MARK_KEY = `${MARKED_KEY_PREFIX}${testId}`;
//   const SESSION_KEY = `${TEST_SESSION_KEY_PREFIX}${testId}`;

//   const safeSetSession = (key: string, value: unknown) => {
//     try {
//       const serialized = JSON.stringify(value);

//       if (serialized.length > 3 * 1024 * 1024) {
//         console.warn(
//           `[Session] Payload for "${key}" is ${(serialized.length / 1024).toFixed(1)} KB — skipping save.`,
//         );
//         return;
//       }

//       sessionStorage.setItem(key, serialized);
//     } catch (err) {
//       if (err instanceof DOMException && err.name === 'QuotaExceededError') {
//         console.error(
//           '[Session] QuotaExceededError — clearing stale session data.',
//         );
//         sessionStorage.clear();
//       }
//     }
//   };

//   const safeSetLocal = (key: string, value: unknown) => {
//     try {
//       localStorage.setItem(key, JSON.stringify(value));
//     } catch (err) {
//       if (err instanceof DOMException && err.name === 'QuotaExceededError') {
//         console.error(
//           '[Local] QuotaExceededError — clearing stale local data.',
//         );
//         localStorage.clear();
//       }
//     }
//   };

//   // ✅ Persist snapshot on every questions state change
//   useEffect(() => {
//     if (!testId || questions.length === 0) return;

//     const existing = safeParseJSON<Record<string, unknown>>(
//       sessionStorage.getItem(SESSION_KEY),
//     );

//     if (!existing) return;

//     safeSetSession(SESSION_KEY, {
//       ...existing,
//       questions: buildSessionProgressSnapshot(questions),
//     });
//   }, [questions, testId]);

//   // ✅ Load session on mount
//   useEffect(() => {
//     if (!testId) return;

//     const session = safeParseJSON<{ questions: QuizQuestionDataUI[] }>(
//       sessionStorage.getItem(SESSION_KEY),
//     );

//     const marks =
//       safeParseJSON<MarkedQuestion[]>(localStorage.getItem(MARK_KEY)) ?? [];

//     if (!session || !session.questions?.length) {
//       router.replace('/dashboard/user/create-test');
//       return;
//     }

//     setQuestions(session.questions);
//     setMarkedQuestions(marks);
//     setLoading(false);
//   }, [testId]);

//   const totalQuestions = questions.length;
//   const data = questions[currentQuestion - 1] ?? null;

//   const persistMarks = (updated: MarkedQuestion[]) => {
//     safeSetLocal(MARK_KEY, updated);
//   };

//   const onJumpTo = (index: number) => {
//     const quizDetails = data?.quizDetails;

//     if (!selectedAnswerId) {
//       toast.error('Please select an answer before proceeding.');
//       return;
//     }

//     if (!quizDetails?.userAnswerId) {
//       toast.error('Please submit your answer before proceeding.');
//       return;
//     }

//     if (index >= 1 && index <= totalQuestions) {
//       setCurrentQuestion(index);
//     }
//   };

//   const onNext = () => {
//     const quizDetails = data?.quizDetails;

//     if (!selectedAnswerId || !quizDetails?.userAnswerId) {
//       toast.error('Please submit your answer before proceeding.');
//       return;
//     }

//     if (currentQuestion >= totalQuestions) {
//       router.push(`/dashboard/user/test-complete/${testId}`);
//       return;
//     }

//     setCurrentQuestion(prev => prev + 1);
//   };

//   const onPrevious = () => {
//     if (currentQuestion > 1) {
//       setCurrentQuestion(prev => prev - 1);
//     }
//   };

//   const onToggleMarkLocalOnly = () => {
//     setMarkedQuestions(prev => {
//       const exists = prev.some(q => q.index === currentQuestion);
//       const current = questions[currentQuestion - 1];

//       const updated: MarkedQuestion[] = exists
//         ? prev.filter(q => q.index !== currentQuestion)
//         : [
//             ...prev,
//             {
//               index: currentQuestion,
//               questionId: current?.testProgress?.questionID ?? '',
//               title: current?.quizDetails?.question_title ?? '',
//               question: current?.quizDetails?.question_steam ?? '',
//               fullData: current,
//             },
//           ];

//       persistMarks(updated);
//       return updated;
//     });
//   };

//   if (loading) return <div className="p-6">Loading test...</div>;
//   if (!data || !testId) return <div className="p-6">No test data found.</div>;

//   return (
//     <QuizQuestionView
//       key={data.testProgress.questionID}
//       testId={testId}
//       data={data}
//       markedQuestions={markedQuestions}
//       onToggleMark={onToggleMarkLocalOnly}
//       onJumpTo={onJumpTo}
//       onNext={onNext}
//       onPrevious={onPrevious}
//       currentQuestion={currentQuestion}
//       setQuestions={setQuestions}
//       selectedAnswerId={selectedAnswerId}
//       setSelectedAnswer={setSelectedAnswer}
//     />
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import QuizQuestionView from '@/components/create_test_components/QuizQuestionView';

import type { MarkedQuestion, QuizQuestionDataUI } from '@/types/test-session';
import { toast } from 'sonner';
import { useGetTestQuery } from '@/app/redux/api/startTestApi';
import type { TestData } from '@/app/redux/api/startTestApi';

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
      question_title: q.question_title ?? '', // ✅ null → empty string
      question_steam: q.question_steam,
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

      const updated: MarkedQuestion[] = exists
        ? prev.filter(q => q.index !== currentQuestion)
        : [
            ...prev,
            {
              index: currentQuestion,
              questionId: current?.testProgress?.questionID ?? '',
              title: current?.quizDetails?.question_title ?? '',
              question: current?.quizDetails?.question_steam ?? '',
              fullData: current,
            },
          ];

      persistMarks(updated);
      return updated;
    });
  };

  if (isLoading) return <div className="p-6">Loading test...</div>;
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