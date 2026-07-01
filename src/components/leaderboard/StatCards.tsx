'use client';

import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import TrophyIcon from '../reusable/icons/TrophyIcon';
import { Loader2 } from 'lucide-react';

import { useGetLeaderboardQuery } from '@/app/redux/api/leaderboardApi';
import { useMeQuery } from '@/app/redux/api/authApi';
import { StatCardsSkeleton } from './StatCardsSkeleton';

export default function StatCards() {
  const { data, isLoading, isError } = useGetLeaderboardQuery({});
  const { data: userData } = useMeQuery();
  const userId = userData?.id;

  if (isLoading) {
    return <StatCardsSkeleton />;
  }

  if (isError || !data?.data) {
    return (
      <div className="rounded-[12px] p-8 background text-white text-center">
        Failed to load stats
      </div>
    );
  }

  const stats = data?.data.leaderboard;
  const statData = data?.data.user_stats;

  const cards = [
    {
      id: 'rank',
      title: 'Your Rank',
      value: String(statData?.rank || 'N/A'),
      subtitle: 'Overall position',
      icon: '/images/dashboard/statistics/img01.png',
    },
    {
      id: 'accuracy',
      title: 'Accuracy',
      value: `${statData?.accuracy || 'N/A'}%`,
      subtitle: 'Correct answers',
      icon: '/images/dashboard/statistics/img01.png',
    },
    {
      id: 'current_streak',
      title: 'Current Streak',
      value: `${statData?.current_streak || '0'}`,
      subtitle: 'Days Active',
      icon: '/images/dashboard/statistics/img01.png',
    },
    {
      id: 'tests',
      title: 'Question Bank Usage',
      value: `${statData?.completion_percentage || 'N/A'}%`,
      subtitle: 'Total attempts',
      icon: '/images/dashboard/statistics/img01.png',
    },
  ];

  return (
    <div className="rounded-[12px] p-2 background font-[manrope] relative">
      {/* Header Container */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between ml-8 mt-[24px] mr-8 gap-4">
        {/* Left Side: Icon and Title */}
        <div className="flex gap-4 items-center">
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

        {/* Right Side: Client's Requested Gold Note */}
        <div className="sm:text-right self-start sm:self-center">
          <p className="text-[#B79E6B] text-sm md:text-base font-bold tracking-wide">
            *Toggle your Score Visibility in &apos;My Profile&apos;
          </p>
        </div>
      </div>

      {/* Cards Grid */}
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
