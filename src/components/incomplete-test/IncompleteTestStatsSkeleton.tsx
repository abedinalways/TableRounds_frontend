export function IncompleteTestStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 mt-8 font-[manrope] animate-pulse">
      <div className="background rounded-xl p-5 flex justify-center items-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="h-9 w-80 rounded-md bg-white/25" />
          <div className="h-14 w-24 rounded-md bg-white/30" />
        </div>
      </div>
    </div>
  );
}
