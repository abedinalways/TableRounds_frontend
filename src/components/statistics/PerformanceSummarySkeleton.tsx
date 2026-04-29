export function PerformanceSummarySkeleton() {
  return (
    <section className="grid gap-6 mt-6 font-[manrope] animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Performance Card */}
        <div className="rounded-2xl border shadow-sm p-6 space-y-6 bg-white">
          <div className="h-5 w-40 bg-gray-200 rounded-md" />

          <div className="flex gap-6">
            <div className="h-28 w-28 rounded-full bg-gray-200" />

            <div className="space-y-3 flex-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 rounded-md bg-gray-100" />
              ))}
            </div>
          </div>
        </div>

        {/* Question Bank Card */}
        <div className="rounded-2xl border shadow-sm p-6 space-y-6 bg-white">
          <div className="h-5 w-48 bg-gray-200 rounded-md" />

          <div className="flex gap-6">
            <div className="h-28 w-28 rounded-full bg-gray-200" />

            <div className="space-y-3 flex-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 rounded-md bg-gray-100" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
