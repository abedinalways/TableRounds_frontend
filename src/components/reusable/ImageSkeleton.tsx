interface ImageSkeletonProps {
  className?: string;
}
export default function ImageSkeleton({ className = '' }: ImageSkeletonProps) {
  return (
    <div
      className={` animate-pulse rounded-lg bg-white/10 ${className} `}
      aria-hidden="true"
    />
  );
}
