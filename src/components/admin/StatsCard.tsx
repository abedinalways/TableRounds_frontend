// components/admin/StatsCards.tsx
import { Card, CardContent } from '@/components/ui/card';


import Image from 'next/image';

export function StatsCard() {
  const stats = [
    {
      label: 'Total Users',
      value: '1,482',
      note: '+4.2% This week',
      icon: '/images/dashboard/Admin/img01.png',
    },
    {
      label: 'Pending Verifications',
      value: '37',
      note: 'Need review',
      icon: '/images/dashboard/Admin/img02.png',
    },
    {
      label: 'Questions',
      value: '2,915',
      note: 'Last added 2h ago',
      icon: '/images/dashboard/Admin/img04.png',
    },
    {
      label: 'Active Sessions',
      value: '118',
      note: 'DAU 742',
      icon: '/images/dashboard/Admin/img03.png',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <Card key={i} className="background text-white">
          <CardContent className="p-5 flex justify-between ">
            <div className='flex flex-col gap-4 justify-start '>
              <p className="text-sm md:text-[16px] leading-[130%] font-semibold opacity-90">{s.label}</p>
              <h2 className="text-2xl md:text-[36px] leading-[120%] font-bold">{s.value}</h2>
              <p className="text-xs md:text-[18px] leading-[160%] ">{s.note}</p>
            </div>
            <div className="stats-card-bg  w-12 h-12 rounded-xl">

            <Image
              src={s.icon}
              alt={s.label}
              width={32}
              height={32}
              className="flex mx-auto items-center justify-center mt-2"
            />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
