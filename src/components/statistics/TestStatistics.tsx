'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

import CircularProgressData from './CircularProgress';
import TestStatIcon from '../reusable/icons/TestStatIcon';
import { useGetStatisticsQuery } from '@/app/redux/api/StatisTicsApi';



const TestStatistics: React.FC = () => {
  const { data, isLoading, isError } = useGetStatisticsQuery();
  console.log(data);

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-teal-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6 min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg">Failed to load statistics</p>
      </div>
    );
  }

  const {tests, performance_by_topic } = data.data;

  /** ---------- TOP STAT CARDS (same design) ---------- */
  const statCards = [
    {
      title: 'Total Tests',
      value: tests.total,
      subtitle: 'All tests',
      bgColor: 'bg-[#f0fdf4]',
      textColor: 'text-[#01281e]',
    },
    {
      title: 'Completed',
      value: tests.completed,
      subtitle: 'Finished tests',
      bgColor: 'bg-[#ecfeff]',
      textColor: 'text-[#01503b]',
    },
    {
      title: 'Incomplete',
      value: tests.incomplete,
      subtitle: 'Pending tests',
      bgColor: 'bg-[#fef2f2]',
      textColor: 'text-red-600',
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
              <p className={`text-[36px] font-bold ${card.textColor}`}>
                {String(card.value).padStart(2, '0')}
              </p>
              <p className="text-[18px] text-[#4b5563]">{card.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Breakdown */}
      <h2 className="text-[24px] font-semibold text-[#444950] mb-6">
        Performance Breakdown
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {performance_by_topic.map((item, index) => (
          <Card key={index} className="shadow-sm border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-[24px] font-bold text-[#444950] flex items-center gap-2">
                <Image
                  src="/images/dashboard/statistics.png"
                  width={25}
                  height={25}
                  alt=""
                />
                {item.topic.replace('_', ' ')}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex justify-center mb-6">
                <CircularProgressData percentage={item.correct_percentage} />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between bg-[#ecfdf5] px-6 py-3 rounded-[8px]">
                  <span>Total Correct</span>
                  <span className="font-semibold">
                    {item.correct_percentage}%
                  </span>
                </div>

                <div className="flex justify-between bg-[#fef2f2] px-6 py-3 rounded-[8px]">
                  <span>Percentile Rank</span>
                  <span className="font-semibold text-red-500">
                    {item.percentile_rank}
                  </span>
                </div>

                <div className="flex justify-between card-bg px-6 py-3 rounded-[8px]">
                  <span>Question Bank Progress</span>
                  <span className="font-semibold">
                    {item.question_bank_progress}%
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
