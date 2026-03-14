
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

import statsData from '../../../public/data/stats.json' assert { type: 'json' };
import Image from 'next/image';
import { useGetProfileQuery } from '@/app/redux/api/profileApi';

const StatsCards = () => {
  const { data: value, error } = useGetProfileQuery(); 
  console.log(value)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <Card className="border rounded-xl shadow-sm p-4 bg-white hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
        <CardContent className="p-0">
          <div className="flex items-center gap-3">
            <div className="icon-bg rounded-full w-[54px] h-[54px] flex items-center justify-center">
              <Image
                src="/images/dashboard/main_dashboard/card001.png"
                width={32}
                height={32}
                alt=""
                className=""
              />
            </div>
            <h2 className="text-sm font-medium text-gray-600">
              Percent Correct
            </h2>
          </div>

          <div className="mt-3">
            <p className="text-3xl font-semibold">
              {value?.correct_percentage}%
            </p>
            <p className="text-sm text-gray-500">Correct</p>
          </div>
        </CardContent>
      </Card>
      <Card className="border rounded-xl shadow-sm p-4 bg-white hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
        <CardContent className="p-0">
          <div className="flex items-center gap-3">
            <div className="icon-bg rounded-full w-[54px] h-[54px] flex items-center justify-center">
              <Image
                src="/images/dashboard/main_dashboard/card002.png"
                width={32}
                height={32}
                alt=""
                className=""
              />
            </div>
            <h2 className="text-sm font-medium text-gray-600">
              Percent Completed
            </h2>
          </div>

          <div className="mt-3">
            <p className="text-3xl font-semibold">
              {value?.total_completed_test}%
            </p>
            <p className="text-sm text-gray-500">completed</p>
          </div>
        </CardContent>
      </Card>
      <Card className="border rounded-xl shadow-sm p-4 bg-white hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
        <CardContent className="p-0">
          <div className="flex items-center gap-3">
            <div className="icon-bg rounded-full w-[54px] h-[54px] flex items-center justify-center">
              <Image
                src="/images/dashboard/main_dashboard/card003.png"
                width={32}
                height={32}
                alt=""
                className=""
              />
            </div>
            <h2 className="text-sm font-medium text-gray-600">Total Tests</h2>
          </div>

          <div className="mt-3">
            <p className="text-3xl font-semibold">
              {value?.total_completed_test}/
              {value?.total_test}
            </p>
            <p className="text-sm text-gray-500">completed</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
