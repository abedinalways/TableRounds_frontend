export function ColleaguesGridSkeleton({ showAll }: { showAll: boolean }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
      {Array.from({ length: showAll ? 9 : 6 }).map((_, index) => (
        <div key={index} className="p-4 rounded-xl border bg-white">
          <div className="flex gap-3">
            <div className="h-14 w-14 rounded-full bg-gray-200" />

            <div className="space-y-2 flex-1">
              <div className="h-5 w-32 rounded-md bg-gray-200" />
              <div className="h-4 w-24 rounded-md bg-gray-100" />
            </div>
          </div>

          {showAll && (
            <div className="mt-4 flex gap-2">
              <div className="h-10 flex-1 rounded-md bg-gray-200" />
              <div className="h-10 flex-1 rounded-md bg-gray-100" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
