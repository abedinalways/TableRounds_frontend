import { Skeleton } from '@/components/ui/skeleton';

export default function MessagePageSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[180px]" />
          <Skeleton className="h-4 w-[120px]" />
        </div>
      </div>

      <div className="space-y-3">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-[80%] rounded-xl" />
      </div>
    </div>
  );
}
