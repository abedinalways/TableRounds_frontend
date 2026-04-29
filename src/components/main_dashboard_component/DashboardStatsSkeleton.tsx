export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 font-[manrope] animate-pulse">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="border rounded-xl shadow-sm p-4 bg-white">
          <div className="flex items-center gap-3">
            <div className="rounded-full w-[54px] h-[54px] bg-gray-200" />
            <div className="h-5 w-36 rounded-md bg-gray-200" />
          </div>

          <div className="mt-4 space-y-2">
            <div className="h-8 w-24 rounded-md bg-gray-200" />
            <div className="h-4 w-20 rounded-md bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
