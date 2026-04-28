'use client';

import { useEffect, useState } from 'react';

import {
  useCompleteTestMutation,
  useGetTestResultQuery,
} from '@/app/redux/api/testSessionApi';

import DifficultyTopic from './DifficultyTopic';
import { ResultSummary } from './ResultSummary';
import { TopicResultCard } from './TopicResultCard';

export default function TestResult({ testId }: { testId: string }) {
  const [isCompleted, setIsCompleted] = useState(false);

  const [completeTest] = useCompleteTestMutation();

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

  if (isLoading)
    return (
      <div className="flex flex-col gap-8 font-[manrope]">
        {/* ResultSummary skeleton */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 animate-pulse">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Score circle */}
            <div className="flex-shrink-0 w-36 h-36 rounded-full bg-gray-200" />

            {/* Stats grid */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl bg-gray-100 p-4 space-y-2">
                  <div className="h-3 w-16 bg-gray-200 rounded" />
                  <div className="h-6 w-10 bg-gray-300 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* "How You Did by Topic" heading */}
        <div>
          <div className="h-6 w-52 bg-gray-200 rounded mb-4 animate-pulse" />

          {/* Topic cards */}
          <div className="grid grid-cols-12 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`animate-pulse rounded-2xl border border-gray-200 bg-white p-5 space-y-4
              ${i > 2 ? 'lg:col-span-6 col-span-full' : 'lg:col-span-4 col-span-full'}`}
              >
                {/* Icon + title row */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                    <div className="h-3 w-10 bg-gray-200 rounded" />
                  </div>
                  <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-200 rounded-full"
                      style={{ width: `${40 + i * 8}%` }}
                    />
                  </div>
                </div>

                {/* Correct / Total pills */}
                <div className="flex gap-3">
                  <div className="h-6 w-20 bg-gray-100 rounded-full" />
                  <div className="h-6 w-20 bg-gray-100 rounded-full" />
                </div>
              </div>
            ))}
          </div>

          {/* "How You Did by Difficulty" heading */}
          <div className="mt-10">
            <div className="h-6 w-60 bg-gray-200 rounded mb-4 animate-pulse" />

            {/* Difficulty rows */}
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5 flex items-center gap-4"
                >
                  <div className="h-4 w-20 bg-gray-200 rounded shrink-0" />
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-200 rounded-full"
                      style={{ width: `${30 + i * 20}%` }}
                    />
                  </div>
                  <div className="h-4 w-12 bg-gray-200 rounded shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );

  const result = data?.data;
  console.log(result, 'result========================')
  const topics = result?.topic_wise_stats ?? [];
  const difficulty = result?.difficulty.join(' , ');
  return (
    <div className="flex flex-col gap-8">
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

        <div className="mt-10">
          <h1 className="mb-2 text-[24px] font-bold text-[#444950]">
            How You Did by Difficulty
          </h1>

          <DifficultyTopic result={result} />
        </div>
      </div>
    </div>
  );
}
