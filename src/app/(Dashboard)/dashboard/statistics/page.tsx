import { StatsHeader } from '@/components/statistics/StatsHeader';
import statisticsData from '../../../../../public/data/statistics.json';
import React from 'react'

export default function StatisticsPage() {
  return (
    <div className="flke flex-col ">
      
      <StatsHeader categories={statisticsData.categories} />
    </div>
  );
}
