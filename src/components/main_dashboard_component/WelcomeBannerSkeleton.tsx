export function WelcomeBannerSkeleton() {
  return (
    <div className="px-4 pt-2 background text-white rounded-lg shadow-lg font-[manrope] animate-pulse">
      <div className="md:flex items-center justify-evenly py-4">
        <div className="rounded-full border-4 border-[#B79E6B]">
          <div className="w-[160px] h-[160px] rounded-full bg-white/25" />
        </div>

        <div className="space-y-4">
          <div className="h-9 w-64 rounded-md bg-white/25" />
          <div className="h-5 w-72 rounded-md bg-white/20" />
          <div className="h-5 w-56 rounded-md bg-white/20" />
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="h-5 w-36 rounded-md bg-white/20" />
          <div className="h-[138px] w-[138px] rounded-xl bg-white/20" />
        </div>
      </div>
    </div>
  );
}
