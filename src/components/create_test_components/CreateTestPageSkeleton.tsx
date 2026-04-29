import { Skeleton } from "../ui/skeleton";

export function CreateTestPageSkeleton() {
  return (
    <div className="flex flex-col space-y-4 font-[manrope] animate-pulse">
      {/* Topbar */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-72" />
          </div>

          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-10 rounded-md" />
            ))}
          </div>
        </div>

        <div className="mt-4">
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      </div>

      {/* Main quiz layout */}
      <div className="background rounded-md grid grid-cols-1 md:grid-cols-12 p-4 gap-4">
        {/* Sidebar */}
        <div className="md:col-span-1 rounded-xl bg-white/10 p-3">
          <div className="grid grid-cols-5 gap-2 md:grid-cols-1">
            {Array.from({ length: 12 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-9 w-9 rounded-md bg-white/25"
              />
            ))}
          </div>
        </div>

        {/* Question area */}
        <div className="md:col-span-11 min-w-0">
          <div className="rounded-2xl bg-[#f9f9f5] p-6 md:p-8 space-y-6">
            {/* Question title */}
            <div className="space-y-3">
              <Skeleton className="h-7 w-64" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[92%]" />
              <Skeleton className="h-4 w-[75%]" />
            </div>

            {/* Options */}
            <div className="space-y-4">
              {[88, 74, 94, 68].map((width, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-xl border border-[#00000026] bg-gray-50 p-4"
                >
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton
                    className="h-4 rounded-md"
                    style={{ width: `${width}%` }}
                  />
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3 md:flex-row md:justify-between">
              <Skeleton className="h-[50px] w-full rounded-md md:w-[164px]" />
              <Skeleton className="h-[50px] w-full rounded-md md:w-[164px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
