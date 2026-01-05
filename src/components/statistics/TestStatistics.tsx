'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Loader2 } from 'lucide-react';

import CircularProgressData from './CircularProgress';
import TestStatIcon from '../reusable/icons/TestStatIcon';
import GraphIcon from '../reusable/icons/GraphIcon';
import Image from 'next/image';

// Type definitions
interface StatCard {
  title: string;
  value: number;
  subtitle: string;
  bgColor: string;
  textColor: string;
}

interface BreakdownItem {
  title: string;
  correct: number;
  rank: number;
  progress: number;
  icon: string;
}

interface Performance {
  correctPercent: number;
  totalCorrect: number;
  totalIncorrect: number;
  totalOmitted: number;
}

interface QuestionBank {
  usedPercent: number;
  used: number;
  unused: number;
  total: number;
}

interface Statistics {
  statCards: StatCard[];
  breakdown: BreakdownItem[];
}

interface DashboardData {
  categories: string[];
  performance: Performance;
  questionBank: QuestionBank;
  statistics: Statistics;
}
const TestStatistics: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/statistics.json');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen flex items-center justify-center ">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-teal-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-2">Error loading data</p>
          <p className="text-gray-600">{error || 'No data available'}</p>
          <p className="text-sm text-gray-500 mt-4">
            Make sure data.json exists in the public folder
          </p>
        </div>
      </div>
    );
  }

  const { statistics } = data;
  const { statCards, breakdown } = statistics;

  return (
    <div className="w-full p-6 mx-auto mt-6 rounded-[12px]  bg-white border border-gray-100 shadow-sm font-[manrope]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <TestStatIcon />
        <h1 className="text-[24px] font-semibold text-[#444950]">
          Test Statistics
        </h1>
      </div>

      {/* Test Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, index) => (
          <Card key={index} className={`${card.bgColor} border-none shadow-sm`}>
            <CardContent className="pt-6 flex flex-col items-center gap-2">
              <h3 className="text-[24px] font-semibold text-[#01281e]">
                {card.title}
              </h3>
              <p className={`text-[36px] font-bold ${card.textColor} `}>
                {card.value.toString().padStart(2, '0')}
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
        {breakdown.map((item, index) => (
          <Card key={index} className="shadow-sm border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-[24px] font-bold text-[#444950] flex items-center gap-2">
                <Image src={item?.icon} width={25} height={25} alt=''/>
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Circular Progress */}
              <div className="flex justify-center mb-6">
                <CircularProgressData percentage={item.correct} />
              </div>

              {/* Stats */}
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-[#ecfdf5] py-[12px] px-[24px] rounded-[8px]">
                  <span className="text-[18px] text-gray-700">
                    Total Correct
                  </span>
                  <span className="text-[20px] font-semibold text-gray-900">
                    {item.correct}%
                  </span>
                </div>
                <div className="flex justify-between items-center bg-[#fef2f2] px-[24px] py-[12px] rounded-[8px]">
                  <span className="text-[18px] text-gray-700">
                    Percentile Rank
                  </span>
                  <span className="text-[20px] font-semibold text-red-500">
                    {item.rank}
                  </span>
                </div>
                <div className="flex justify-between items-center card-bg px-[24px] py-[12px] rounded-[8px]">
                  <span className="text-[18px] text-gray-700">
                    Question Bank progress
                  </span>
                  <span className="text-[20px] font-semibold text-gray-900">
                    {item.progress}%
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
