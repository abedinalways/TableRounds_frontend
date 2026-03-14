'use client';

import DifficultyTopic from './DifficultyTopic';
import { ResultSummary } from './ResultSummary';
import { TopicResultCard } from './TopicResultCard';
import { useGetTestResultQuery } from '@/app/redux/api/startTestApi';

export default function TestResult({ testId }: { testId: string }) {
  const { data, isLoading } = useGetTestResultQuery(testId);

  if (isLoading) return <div>Loading result...</div>;

  const result = data?.data;

  const topics = result?.topic_wise_stats ?? [];

  return (
    <div className="flex flex-col gap-8">
      <ResultSummary
        score={result?.score}
        total={result?.total_questions}
        correct={result?.total_correct}
        incorrect={result?.total_incorrect}
        used={result?.used_questions}
        unused={result?.unused_questions}
      />

      <div className="font-[manrope]">
        <h1 className="mb-2 text-[20px] md:text-[24px] font-bold text-[#444950]">
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
          <h1 className="mb-2 text-[20px] md:text-[24px] font-bold text-[#444950]">
            How You Did by Difficulty
          </h1>

          <DifficultyTopic />
        </div>
      </div>
    </div>
  );
}
