'use client';


import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

import { useGetIncompleteTestsQuery } from '@/app/redux/api/incompleteTestApi';
import { IncompleteTestStatsSkeleton } from './IncompleteTestStatsSkeleton';

export function TestStats() {
  const { data, isLoading, isError } = useGetIncompleteTestsQuery();

  if (isLoading) {
    return <IncompleteTestStatsSkeleton/>;
  }

  if (isError || !data?.data) {
    return (
      <div className="text-center text-red-600 mt-8">
        Failed to load test
      </div>
    );
  }

  const stats = data.metadata;
  console.log(stats.total, '++++++++++++++++=================afefewwwwwwwww---==')

  

  return (
    <div className="grid grid-cols-1  gap-4 mt-8 font-[manrope]">
      <Card className="background text-white">
        <CardContent className="p-5 flex justify-center items-center">
          <div className="flex flex-col items-center justify-center">
            <p className="text-[32px] text-gray-200 flex justify-center items-center w-full  leading-[130%] font-semibold">
              Total Incomplete Tests
            </p>
            <p className="md:text-[48px] font-semibold leading-[130%] text-gray-200 ">
              {stats.total}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
