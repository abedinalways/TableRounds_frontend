'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useGetTestHistoryStatsQuery } from '@/app/redux/api/testHistoryAPi';



export function TestStats() {
  const { data, isLoading, isError } = useGetTestHistoryStatsQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center mt-8">
        <Loader2 className="animate-spin text-[#01281e]" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="text-center text-red-600 mt-8">
        Failed to load test stats
      </div>
    );
  }

  const stats = data.data;

  const cards = [
    {
      id: 'total_tests',
      title: 'Total Tests',
      value: String(stats.total_tests),
      subtitle: 'All attempts',
      icon: '/images/dashboard/test/img001.png',
    },
    {
      id: 'completed_tests',
      title: 'Completed Tests',
      value: String(stats.completed_tests),
      subtitle: 'Finished',
      icon: '/images/dashboard/test/img002.png',
    },
    {
      id: 'average_score',
      title: 'Average Score',
      value: `${stats.average_score}%`,
      subtitle: 'Overall average',
      icon: '/images/dashboard/test/img05.png',
    },
    {
      id: 'best_score',
      title: 'Best Score',
      value: `${stats.best_score}%`,
      subtitle: 'Highest achieved',
      icon: '/images/dashboard/test/img04.png',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
      {cards.map(item => (
        <Card key={item.id} className="background text-white">
          <CardContent className="p-5 flex justify-between items-start">
            <div>
              <p className="md:text-[20px] font-semibold leading-[130%]">
                {item.title}
              </p>
              <h2 className="md:text-[36px] font-bold">{item.value}</h2>
              <p className="md:text-[18px]">{item.subtitle}</p>
            </div>

            <div className="h-12 w-12 rounded-md test-bg flex items-center justify-center">
              <Image src={item.icon} alt={item.title} width={32} height={32} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
