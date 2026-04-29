export function TestStatisticsSkeleton() {
  return (
    <div className="w-full p-6 mt-6 rounded-[12px] bg-white border shadow-sm font-[manrope] animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-6 w-6 bg-gray-200 rounded" />
        <div className="h-6 w-48 bg-gray-200 rounded-md" />
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="p-6 rounded-xl bg-gray-100 space-y-3 text-center"
          >
            <div className="h-5 w-24 mx-auto bg-gray-200 rounded" />
            <div className="h-10 w-16 mx-auto bg-gray-300 rounded" />
            <div className="h-4 w-28 mx-auto bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* Section title */}
      <div className="h-6 w-56 bg-gray-200 rounded mb-6" />

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border rounded-xl p-5 space-y-5">
            <div className="h-6 w-40 bg-gray-200 rounded" />

            <div className="flex justify-center">
              <div className="h-24 w-24 rounded-full bg-gray-200" />
            </div>

            <div className="space-y-3">
              <div className="h-10 bg-gray-100 rounded" />
              <div className="h-10 bg-gray-100 rounded" />
              <div className="h-10 bg-gray-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
