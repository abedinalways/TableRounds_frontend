'use client';

import { useEffect, useState } from 'react';

import {
  useCompleteTestMutation,
  useGetTestResultQuery,
} from '@/app/redux/api/testSessionApi';

import DifficultyTopic from './DifficultyTopic';
import { ResultSummary } from './ResultSummary';
import { TopicResultCard } from './TopicResultCard';
import { TestResultSkeleton } from './TestResultSkeleton';
import { TestCompleteCelebration } from './TestCompleteCelebration';

export default function TestResult({ testId }: { testId: string }) {
  const [isCompleted, setIsCompleted] = useState(false);

  const [completeTest] = useCompleteTestMutation();
  const [showCelebration, setShowCelebration] = useState(false);
  const { data, isLoading } = useGetTestResultQuery(testId, {
    skip: !isCompleted,
  });



  useEffect(() => {
    const finishTest = async () => {
      if (!testId) return;

      await completeTest(testId);
      setIsCompleted(true);
    };

    finishTest();
  }, [testId]);

  useEffect(() => {
    if (!isLoading && isCompleted && data?.data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowCelebration(true);

      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 2800);

      return () => clearTimeout(timer);
    }
  }, [isLoading, isCompleted, data]);

  if (isLoading)
    return <TestResultSkeleton/>

  const result = data?.data;
  // console.log(result, 'result========================')
  const topics = result?.topic_wise_stats ?? [];
  const difficulty = result?.difficulty.join(' , ');
  return (
    <div className="relative flex flex-col gap-8">
      {showCelebration && <TestCompleteCelebration />}
      <ResultSummary
        score={result?.score}
        total={result?.total_questions}
        correct={result?.total_correct}
        incorrect={result?.total_incorrect}
        used={result?.used_questions}
        unused={result?.unused_questions}
        difficulty={difficulty}
        testId={result?.test_id}
        topics={result?.topic_wise_stats ?? []}
      />

      <div className="font-[manrope]">
        <h1 className="mb-2 text-[24px] font-bold text-[#444950]">
          How You Did by Topic
        </h1>

        <div className="grid grid-cols-12 gap-8">
          {topics.map((topic: any, index: number) => (
            <div
              key={topic.topic}
              className={
                index > 2
                  ? 'lg:col-span-6 col-span-full'
                  : 'lg:col-span-4 col-span-full'
              }
            >
              <TopicResultCard
                title={topic.topic}
                total={topic.total_questions}
                correct={topic.correct}
                icon="/images/dashboard/statistics/img01.png"
              />
            </div>
          ))}
        </div>

        <div className="mt-10 w-full overflow-hidden">
          <h1 className="mb-2 text-[20px] font-bold text-[#444950] sm:text-[24px]">
            How You Did by Difficulty
          </h1>

          <DifficultyTopic result={result} />
        </div>
      </div>
    </div>
  );
}
