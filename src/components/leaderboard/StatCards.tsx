'use client';

import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import TrophyIcon from '../reusable/icons/TrophyIcon';
import { Loader2 } from 'lucide-react';

import { useGetLeaderboardQuery } from '@/app/redux/api/leaderboardApi';

export default function StatCards() {
  const { data, isLoading, isError } = useGetLeaderboardQuery();
  console.log(data, 'iooooooo');
  if (isLoading) {
    return (
      <div className="rounded-[12px] p-8 background flex justify-center">
        <Loader2 className="animate-spin text-white" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="rounded-[12px] p-8 background text-white text-center">
        Failed to load stats
      </div>
    );
  }

  const stats = data?.data.leaderboard;
  console.log(stats, 'pen')
  console.log(stats[0].rank);
  const cards = [
    {
      id: 'rank',
      title: 'Your Rank',
      value: String(stats[0].rank),
      subtitle: 'Overall position',
      icon: '/images/dashboard/statistics/img01.png',
    },
    {
      id: 'accuracy',
      title: 'Accuracy',
      value: `${stats[0]?.accuracy}%`,
      subtitle: 'Correct answers',
      icon: '/images/dashboard/statistics/img01.png',
    },
    {
      id: 'avg_score',
      title: 'Avg Score',
      value: `${stats[0].avg_score}%`,
      subtitle: 'Average performance',
      icon: '/images/dashboard/statistics/img01.png',
    },
    {
      id: 'tests',
      title: 'Tests Completed',
      value: String(stats[0].tests_completed),
      subtitle: 'Total attempts',
      icon: '/images/dashboard/statistics/img01.png',
    },
  ];

  return (
    <div className="rounded-[12px] p-2 background font-[manrope]">
      {/* Header */}
      <div className="flex gap-4 items-center ml-8 mt-[24px]">
        <div className="w-[64px] h-[64px] rounded-[16px] bg-icon flex items-center justify-center">
          <TrophyIcon />
        </div>
        <div className="flex flex-col text-white">
          <h2 className="text-[24px] font-semibold leading-[130%]">
            Your Stats
          </h2>
          <p className="text-[18px] leading-[160%]">Your current standing</p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-6 text-white">
        {cards.map(item => (
          <Card
            key={item.id}
            className="bg-white/10 border-0 backdrop-blur font-[manrope]"
          >
            <CardContent className="p-6 space-y-2 text-white">
              <div className="flex justify-between">
                <div className="flex flex-col gap-[12px]">
                  <p className="xl:text-[16px]">{item.title}</p>
                  <h2 className="text-4xl font-bold">{item.value}</h2>
                  <p className="text-[16px]">{item.subtitle}</p>
                </div>

                <div className="w-[48px] h-[48px] rounded-[8px] bg-icon flex items-center justify-center">
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={26}
                    height={26}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
