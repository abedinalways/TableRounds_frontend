import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import TrophyIcon from '../reusable/icons/TrophyIcon';

export interface Stat {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  icon: string;
}

interface StatCardsProps {
  stats: Stat[];
}

export default function StatCards({ stats }: StatCardsProps) {
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
        {stats.map(item => (
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
              <div className="w-[48px] h-[48px] rounded-[8px] bg-icon flex items-center justify-center ">
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
