export function TestHistorySkeleton() {
  return (
    <div className="rounded-lg border mt-6 overflow-x-auto animate-pulse">
      <div className="min-w-[900px]">
        {/* Table Header */}
        <div className="grid grid-cols-7 gap-4 bg-[#01503b] px-4 py-4">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="h-4 rounded-md bg-white/30" />
          ))}
        </div>

        {/* Table Rows */}
        <div className="divide-y">
          {Array.from({ length: 8 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-7 gap-4 px-4 py-5 items-center"
            >
              <div className="h-10 w-10 rounded-full bg-gray-200" />

              <div className="flex gap-2">
                <div className="h-8 w-16 rounded-md bg-gray-200" />
                <div className="h-8 w-16 rounded-md bg-gray-100" />
              </div>

              <div className="h-4 w-24 rounded-md bg-gray-200" />

              <div className="flex gap-2">
                <div className="h-8 w-20 rounded-md bg-gray-200" />
                <div className="h-8 w-16 rounded-md bg-gray-100" />
              </div>

              <div className="h-8 w-20 rounded-md bg-gray-200" />

              <div className="h-4 w-10 rounded-md bg-gray-200" />

              <div className="ml-auto h-6 w-8 rounded-md bg-gray-200" />
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="h-4 w-40 rounded-md bg-gray-200" />

          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-8 w-8 rounded-md bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
