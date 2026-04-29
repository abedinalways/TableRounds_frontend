export function StatCardsSkeleton() {
  return (
    <div className="rounded-[12px] p-2 background font-[manrope] animate-pulse">
      <div className="flex gap-4 items-center ml-8 mt-[24px]">
        <div className="w-[64px] h-[64px] rounded-[16px] bg-white/20" />

        <div className="flex flex-col gap-3">
          <div className="h-6 w-32 rounded-md bg-white/25" />
          <div className="h-5 w-44 rounded-md bg-white/20" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-xl bg-white/10 p-6 backdrop-blur">
            <div className="flex justify-between">
              <div className="flex flex-col gap-3">
                <div className="h-5 w-24 rounded-md bg-white/25" />
                <div className="h-9 w-20 rounded-md bg-white/30" />
                <div className="h-5 w-32 rounded-md bg-white/20" />
              </div>

              <div className="w-[48px] h-[48px] rounded-[8px] bg-white/20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
