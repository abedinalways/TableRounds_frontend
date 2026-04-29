export function LeaderboardTableRowsSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, index) => (
        <tr key={index} className="border-b animate-pulse">
          <td className="p-3">
            <div className="h-10 w-20 rounded-md bg-gray-200" />
          </td>

          <td className="p-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-200" />
              <div className="space-y-2">
                <div className="h-4 w-32 rounded-md bg-gray-200" />
                <div className="h-3 w-24 rounded-md bg-gray-100" />
              </div>
            </div>
          </td>

          <td className="p-3 text-center">
            <div className="mx-auto h-4 w-10 rounded-md bg-gray-200" />
          </td>

          <td className="p-3">
            <div className="space-y-2">
              <div className="h-3 w-10 rounded-md bg-gray-200" />
              <div className="h-2 w-full rounded-full bg-gray-100" />
            </div>
          </td>

          <td className="p-3 text-center">
            <div className="mx-auto h-4 w-12 rounded-md bg-gray-200" />
          </td>

          <td className="p-3">
            <div className="mx-auto h-8 w-20 rounded-md bg-gray-200" />
          </td>
        </tr>
      ))}
    </>
  );
}
