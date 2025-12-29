import { Badge } from "../ui/badge";


export function StatsHeader({ categories }: { categories: string[] }) {
  return (
    <div className="font-[manrope]">
      <h2 className="text-[48px] font-semibold">Statistics</h2>
      <p className="text-sm text-muted-foreground">
        Track your progress and performance
      </p>

      <div className="mt-3 flex flex-wrap max-w-[787px] gap-2 ">
        {categories.map(cat => (
          <Badge
            key={cat}
            variant="secondary"
            className="rounded-full bg-white border border-gray-100 px-6 py-3 cursor-pointer"
          >
            {cat}
          </Badge>
        ))}
      </div>
    </div>
  );
}
