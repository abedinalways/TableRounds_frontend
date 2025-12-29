'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import dynamic from 'next/dynamic';
import StatCards from './StatCards';
import leaderboardData from '../../../public/data/leadership-stat.json';
import type { LeaderboardData } from '@/types/type';
import { LeaderboardTable } from './LeaderboardTable';
import Image from 'next/image';

const data = leaderboardData as LeaderboardData;


const Mapview = dynamic(() => import('./Mapview'), {
  ssr: false,
});

function MapView() {
  return (
    <div className="w-full px-3 sm:px-2 md:px-6">
      <Mapview />
    </div>
  );
}

function LeaderboardView() {
  return (
    <div className='min-h-screen'>

      <StatCards stats={data.stats} />
      <LeaderboardTable data={leaderboardData.leaderboard}/>
    </div>
     
  );
}

export default function LeaderboardMapToggle() {
  const [isMap, setIsMap] = useState(true);

  return (
    <div className="w-full bg-none font-[manrope] ">
      <CardHeader className="flex flex-wrap items-center justify-between">
        <div>
          <CardTitle className="md:text-[48px] text-[32px] text-[#01281e]">
            {isMap ? 'Map' : 'Leaderboard'}
          </CardTitle>
          <p className="text-[18px] text-muted-foreground">
            {isMap
              ? 'Explore where TableRounds surgeons are worldwide'
              : 'Compare your performance with surgeons around the world'}
          </p>
        </div>
          
        <div className="flex  md:items-center gap-2 bg-white px-6 py-4 rounded-2xl">
          <span
            className={`md:text-lg text-md ${!isMap ? 'font-semibold' : ''}`}
          >
            Leaderboard
          </span>
          <Switch
            checked={isMap}
            onCheckedChange={setIsMap}
            className="cursor-pointer"
          />
          <span
            className={`md:text-lg text-md  ${isMap ? 'font-semibold' : ''}`}
          >
            Map
          </span>
        </div>
      </CardHeader>
      <CardContent className="mt-4 text-[#01281e]">
        {isMap ? <MapView /> : <LeaderboardView />}
      </CardContent>
      
    </div>
  );
}
