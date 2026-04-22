'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function LoginSkeleton() {
  return (
    <div
      className="md:w-[1132px] px-6 md:px-16 md:py-16 py-8 rounded-xl shadow-xl 
      background relative overflow-hidden z-10 mx-2 md:mx-0 font-[manrope]"
    >
      {/* Email */}
      <div className="mb-6 flex justify-center">
        <div className="w-full max-w-[644px] space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-[61px] w-full rounded-xl" />
        </div>
      </div>

      {/* Password */}
      <div className="mb-8 flex justify-center">
        <div className="w-full max-w-[644px] space-y-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-[61px] w-full rounded-xl" />
        </div>
      </div>

      {/* Buttons */}
      <div className="md:flex items-center justify-center gap-4 space-y-2 md:space-y-0">
        <Skeleton className="md:w-[126px] w-full h-[54px] rounded-xl" />
        <Skeleton className="md:w-[225px] w-full h-[54px] rounded-md" />
      </div>
    </div>
  );
}
