export function TestReviewSkeleton() {
  return (
    <div className="p-6 space-y-6 font-[manrope] animate-pulse">
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <div className="h-12 w-72 bg-gray-200 rounded-lg" />
        <div className="h-10 w-28 bg-gray-300 rounded-md" />
      </div>

      {/* Score Card */}
      <div className="bg-[#0f5132]/90 p-6 rounded-xl flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-40 bg-white/30 rounded-md" />
        <div className="h-8 w-56 bg-white/30 rounded-md" />
        <div className="h-8 w-48 bg-white/30 rounded-md" />
      </div>

      {/* Question Skeleton Cards */}
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="border rounded-xl p-4 bg-white shadow-sm space-y-4"
          >
            <div className="h-6 w-3/4 bg-gray-200 rounded-md" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-100 rounded-md" />
              <div className="h-4 w-5/6 bg-gray-100 rounded-md" />
            </div>

            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, optIndex) => (
                <div
                  key={optIndex}
                  className="h-10 w-full bg-gray-100 border rounded-md"
                />
              ))}
            </div>

            {Array.from({ length: 4 }).map((_, blockIndex) => (
              <div
                key={blockIndex}
                className="mt-4 p-3 bg-[#f7f7f7] rounded-md space-y-2"
              >
                <div className="h-4 w-32 bg-gray-200 rounded-md" />
                <div className="h-4 w-full bg-gray-100 rounded-md" />
                <div className="h-4 w-4/5 bg-gray-100 rounded-md" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
