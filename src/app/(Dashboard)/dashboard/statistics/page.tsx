import { StatsHeader } from '@/components/statistics/StatsHeader';
import statisticsData from '../../../../../public/data/statistics.json';
import React from 'react'
import PerformanceSummary from '@/components/statistics/PerformanceSummary';
import TestStatistics from '@/components/statistics/TestStatistics';

export default function StatisticsPage() {
  return (
    <div className="flex flex-col h-screen">
      <StatsHeader categories={statisticsData.categories} />
      <PerformanceSummary data={statisticsData} />
      <TestStatistics/>
    </div>
  );
}
