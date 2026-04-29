export function TestStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 animate-pulse">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="background rounded-xl p-5 flex justify-between items-start"
        >
          <div className="space-y-3">
            <div className="h-5 w-28 rounded-md bg-white/25" />
            <div className="h-9 w-20 rounded-md bg-white/30" />
            <div className="h-5 w-24 rounded-md bg-white/20" />
          </div>

          <div className="h-12 w-12 rounded-md bg-white/25" />
        </div>
      ))}
    </div>
  );
}
