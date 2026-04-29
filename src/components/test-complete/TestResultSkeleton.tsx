export function TestResultSkeleton() {
  return (
    <div className="flex flex-col gap-8 font-[manrope] animate-pulse">
      {/* Result Summary Skeleton */}
      <div className="background text-white rounded-xl">
        <div className="py-10 px-6 text-center space-y-6">
          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <div className="h-10 w-28 rounded-md bg-white/25" />
            <div className="h-10 w-24 rounded-md bg-white/25" />
          </div>

          {/* Icon */}
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-white/25" />
          </div>

          {/* Title */}
          <div className="mx-auto h-9 w-64 rounded-md bg-white/25" />

          {/* Score Box */}
          <div className="mx-auto w-fit rounded-[12px] bg-white/20 px-10 py-5 space-y-3">
            <div className="mx-auto h-10 w-28 rounded-md bg-white/30" />
            <div className="mx-auto h-4 w-20 rounded-md bg-white/25" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[12px] bg-white/20 px-8 py-5 space-y-3"
              >
                <div className="mx-auto h-5 w-12 rounded-md bg-white/30" />
                <div className="mx-auto h-3 w-16 rounded-md bg-white/25" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Topic Section Skeleton */}
      <div>
        <div className="mb-4 h-8 w-64 rounded-md bg-gray-200" />

        <div className="grid grid-cols-12 gap-8">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className={
                index > 2
                  ? 'lg:col-span-6 col-span-full'
                  : 'lg:col-span-4 col-span-full'
              }
            >
              <div className="rounded-xl border bg-white p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200" />
                  <div className="space-y-2 flex-1">
                    <div className="h-5 w-3/4 rounded-md bg-gray-200" />
                    <div className="h-4 w-1/2 rounded-md bg-gray-100" />
                  </div>
                </div>

                <div className="h-3 w-full rounded-full bg-gray-100">
                  <div className="h-3 w-2/3 rounded-full bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Difficulty Section Skeleton */}
        <div className="mt-10">
          <div className="mb-4 h-8 w-72 rounded-md bg-gray-200" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-xl border bg-white p-5 shadow-sm space-y-4"
              >
                <div className="h-5 w-28 rounded-md bg-gray-200" />
                <div className="h-10 w-20 rounded-md bg-gray-100" />
                <div className="h-3 w-full rounded-full bg-gray-100">
                  <div className="h-3 w-1/2 rounded-full bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
