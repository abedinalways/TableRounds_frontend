
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

import statsData from '../../../public/data/stats.json' assert { type: 'json' };
import Image from 'next/image';

const StatsCards = () => {
 

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {statsData.map((item, idx) => (
        <Card
          key={idx}
          className="border rounded-xl shadow-sm p-4 bg-white hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
        >
          <CardContent className="p-0">
            <div className="flex items-center gap-3">
              <div className="icon-bg rounded-full w-[54px] h-[54px] flex items-center justify-center">

              <Image
                src={item.icon}
                  width={32}
                height={32}
                alt={item.title}
                className=""
              />
              </div>
              <h2 className="text-sm font-medium text-gray-600">
                {item.title}
              </h2>
            </div>

            <div className="mt-3">
              <p className="text-3xl font-semibold">{item.value}</p>
              <p className="text-sm text-gray-500">{item.subText}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
