export function ColleagueSkeleton() {
  return (
    <div className="border rounded-lg p-3 space-y-3 animate-pulse">
      <div className="h-12 w-12 bg-muted rounded-full mx-auto" />
      <div className="h-3 bg-muted rounded w-3/4 mx-auto" />
      <div className="h-3 bg-muted rounded w-2/4 mx-auto" />
      <div className="h-3 bg-muted rounded w-2/4 mx-auto" />
    </div>
  );
}
