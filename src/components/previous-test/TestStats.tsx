'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

export interface StatItem {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  icon: string;
}

export function TestStats({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
      {stats.map(item => (
        <Card key={item.id} className="background text-white">
          <CardContent className="p-5 flex justify-between items-start">
            <div>
              <p className="md:text-[20px] font-semibold leading-[130%]">
                {item.title}
              </p>
              <h2 className="md:text-[36px] font-bold">{item.value}</h2>
              <p className="md:text-[18px]">{item.subtitle}</p>
            </div>

            <div className="h-12 w-12 rounded-md test-bg  flex items-center justify-center">
              <Image src={item.icon} alt={item.title} width={32} height={32} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
