'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

import CircularProgressData from './CircularProgress';
import TestStatIcon from '../reusable/icons/TestStatIcon';
import { PerformanceByDifficulty, useGetStatisticsQuery } from '@/app/redux/api/StatisTicsApi';

import Link from 'next/link';
import { TestStatisticsSkeleton } from './TestStatisticsSkeleton';
import {
  
  PerformanceByTopic,
} from '@/app/redux/api/StatisTicsApi';

const difficultyIcons: Record<string, string> = {
  Board: '/images/dashboard/statistics/statistics.png',
};

const getDifficultyIcon = (difficulty: string) => {
  return (
    difficultyIcons[difficulty] || '/images/dashboard/statistics/statistics.png'
  );
};

const formatDifficultyName = (difficulty: string) => {
  if (difficulty === 'Board') return 'Boards';
  return difficulty;
};

const TestStatistics: React.FC = () => {
  const { data, isLoading, isError } = useGetStatisticsQuery();
  console.log(data);

  if (isLoading) {
    return <TestStatisticsSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6 min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg">Failed to load statistics</p>
      </div>
    );
  }

 
  const { tests, performance_by_topic, performance_by_difficulty } = data.data;

  const topicIcons: Record<string, string> = {
    Anesthesia_Medicine: '/images/dashboard/statistics/img06.png',
    Dentoalveolar: '/images/dashboard/statistics/img07.png',
    Reconstruction: '/images/dashboard/statistics/img12.png',
    Cancer: '/images/dashboard/statistics/img04.png',
    Implants: '/images/dashboard/statistics/img11.png',
    TMJ: '/images/dashboard/statistics/img10.png',
    Cleft_Craniofacial: '/images/dashboard/statistics/img05.png',
    Orthognathic: '/images/dashboard/statistics/img02.png',
    Trauma: '/images/dashboard/statistics/img09.png',
    Cosmetics: '/images/dashboard/statistics/img03.png',
    Pathology: '/images/dashboard/statistics/img08.png',
  };

  const getTopicIcon = (topic: string) => {
    return topicIcons[topic] || '/images/dashboard/statistics/img12.png';
  };

  const formatTopicName = (topic: string) => {
    if (topic === 'Recontraction') return 'Reconstruction';
    return topic.replace(/_/g, ' / ');
  };

  /** ---------- TOP STAT CARDS ---------- */
  const statCards = [
    {
      title: 'Total Tests',
      value: tests.total,
      subtitle: 'All tests',
      bgColor: 'bg-[#f0fdf4]',
      textColor: 'text-[#01281e]',
      link: '#',
    },
    {
      title: 'Completed',
      value: tests.completed,
      subtitle: 'Finished tests',
      bgColor: 'bg-[#ecfeff]',
      textColor: 'text-[#01503b]',
      link: '#',
    },
    {
      title: 'Incomplete',
      value: tests.incomplete,
      subtitle: 'Pending tests',
      bgColor: 'bg-[#fef2f2]',
      textColor: 'text-red-600',
      link: '/dashboard/user/incomplete-test',
    },
  ];

  return (
    <div className="w-full p-6 mx-auto mt-6 rounded-[12px] bg-white border border-gray-100 shadow-sm font-[manrope]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <TestStatIcon />
        <h1 className="text-[24px] font-semibold text-[#444950]">
          Test Statistics
        </h1>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, index) => (
          <Card key={index} className={`${card.bgColor} border-none shadow-sm`}>
            <CardContent className="pt-6 flex flex-col items-center gap-2">
              <h3 className="text-[24px] font-semibold text-[#01281e]">
                {card.title}
              </h3>
              <Link
                href={card.link}
                className={`text-[32px] font-bold ${card.textColor}`}
              >
                <span
                  className={`text-[36px] font-bold cursor-pointer ${card.textColor}`}
                >
                  {String(card.value).padStart(2, '0')}
                </span>
              </Link>
              <p className="text-[18px] text-[#4b5563]">{card.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance by Difficulty */}
      {performance_by_difficulty && performance_by_difficulty.length > 0 && (
        <div className="mb-10">
          <h2 className="text-[24px] font-semibold text-[#444950] mb-6">
            Performance Breakdown by Difficulty
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           
            {performance_by_difficulty.map(
              (item: PerformanceByDifficulty, index: number) => (
                <Card key={index} className="shadow-sm border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="md:text-[24px] font-bold text-[#444950] flex items-center gap-2">
                      <Image
                        src={getDifficultyIcon(item.difficulty)}
                        width={25}
                        height={25}
                        alt={item.difficulty}
                        unoptimized
                      />
                      {formatDifficultyName(item.difficulty)}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="flex justify-center mb-6">
                      <CircularProgressData
                        percentage={item.correct_percentage}
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between bg-[#ecfdf5] px-6 py-3 rounded-[8px]">
                        <span>Correct Percentage</span>
                        <span className="font-semibold">
                          {item?.correct_percentage}%
                        </span>
                      </div>

                      <div className="flex justify-between bg-[#fef2f2] px-6 py-3 rounded-[8px]">
                        <span>Rank</span>
                        <span className="font-semibold text-red-500">
                          {item?.rank}
                        </span>
                      </div>

                      <div className="flex justify-between card-bg px-6 py-3 rounded-[8px]">
                        <span>Question Bank Progress</span>
                        <span className="font-semibold">
                          {item?.question_bank_progress}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ),
            )}
          </div>
        </div>
      )}

      {/* Performance Breakdown By Topic */}
      <h2 className="text-[24px] font-semibold text-[#444950] mb-6">
        Performance Breakdown by Topic
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       
        {performance_by_topic.map((item: PerformanceByTopic, index: number) => (
          <Card key={index} className="shadow-sm border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="md:text-[24px] font-bold text-[#444950] flex items-center gap-2">
                <Image
                  src={getTopicIcon(item.topic)}
                  width={25}
                  height={25}
                  alt={item.topic}
                  unoptimized
                />
                {formatTopicName(item.topic)}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex justify-center mb-6">
                <CircularProgressData percentage={item.correct_percentage} />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between bg-[#ecfdf5] px-6 py-3 rounded-[8px]">
                  <span>Correct Percentage</span>
                  <span className="font-semibold">
                    {item?.correct_percentage}%
                  </span>
                </div>

                <div className="flex justify-between bg-[#fef2f2] px-6 py-3 rounded-[8px]">
                  <span>Rank</span>
                  <span className="font-semibold text-red-500">
                    {item?.rank}
                  </span>
                </div>

                <div className="flex justify-between card-bg px-6 py-3 rounded-[8px]">
                  <span>Question Bank Progress</span>
                  <span className="font-semibold">
                    {item?.question_bank_progress}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TestStatistics;
