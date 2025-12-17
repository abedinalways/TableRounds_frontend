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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(item => (
        <Card key={item.id} className="background text-white">
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <p className="text-sm opacity-80">{item.title}</p>
              <h2 className="text-2xl font-bold">{item.value}</h2>
              <p className="text-xs opacity-70">{item.subtitle}</p>
            </div>

            <div className="h-10 w-10 rounded-md test-bg  flex items-center justify-center">
              <Image src={item.icon} alt={item.title} width={20} height={20} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
