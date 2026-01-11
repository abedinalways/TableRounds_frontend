'use client';

import DifficultyTopic from './DifficultyTopic';
import { ResultSummary } from './ResultSummary';
import { TopicResultCard } from './TopicResultCard';

export default function TestResult() {
const topics = [
  {
    title: 'Trauma',
    total: 10,
    correct: 9,
    icon: '/images/dashboard/statistics/img01.png',
  },
  {
    title: 'Orthognathic',
    total: 10,
    correct: 8,
    icon: '/images/dashboard/statistics/img10.png',
  },
  {
    title: 'Pathology',
    total: 10,
    correct: 9,
    icon: '/images/dashboard/statistics/img08.png',
  },
  {
    title: 'Dentoalveolar',
    total: 10,
    correct: 8,
    icon: '/images/dashboard/statistics/img07.png',
  },
  {
    title: 'TMJ',
    total: 10,
    correct: 10,
    icon: '/images/dashboard/statistics/img10.png',
  },
];

  

  return (
    <>
      <div className="flex flex-col gap-8 ">
        <ResultSummary
          score={42}
          total={50}
          correct={42}
          incorrect={8}
          used={26}
          unused={6}
        />

        <div className="font-[manrope] ">
          <h1 className="mb-2 text-[20px] md:text-[24px] font-bold text-[#444950]">
            How You Did by Topic
          </h1>
          <div className="grid grid-cols-12 gap-8">
            {topics.map((topic, index) => (
              <div
                className={
                  index > 2
                    ? 'lg:col-span-6 col-span-full'
                    : 'lg:col-span-4  col-span-full'
                }
                key={topic.title}
              >
                <TopicResultCard {...topic} />
              </div>
            ))}
          </div>
          {/* difficulty topic */}
          <div className="mt-10">
            <h1 className="mb-2 text-[20px] md:text-[24px] font-bold text-[#444950]">
              How You Did by Difficulty
            </h1>
            <DifficultyTopic/>
          </div>
        </div>
      </div>
    </>
  );
}
