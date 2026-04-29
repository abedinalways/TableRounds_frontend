

'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CircularProgressPercentage } from '../CircularProgressPercentage';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useGetPreviousTestHistoryStatsQuery } from '@/app/redux/api/previousTestHistoryApi';
import { TestHistorySkeleton } from './TestHistorySkeleton';

const PAGE_LIMIT = 10;

interface Props {
  search: string;
}

export function TestHistory({ search }: Props) {
  const [page, setPage] = useState(1);
  const [dropdownIndex, setDropdownIndex] = useState<number | null>(null);
  const router = useRouter();

  // Reset to page 1 whenever search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  const { data, isLoading, isFetching, isError } =
    useGetPreviousTestHistoryStatsQuery(
      { page, limit: PAGE_LIMIT },
      { refetchOnMountOrArgChange: true },
    );

  const totalPages = data?.meta_data
    ? Math.ceil(data.meta_data.total / data.meta_data.limit)
    : 1;

  const filteredTests = useMemo(() => {
    if (!data?.data) return [];
    const q = search.toLowerCase().trim();
    if (!q) return data.data;

    return data.data.filter(
      test =>
        (test?.difficulty ?? []).some(d => d.toLowerCase().includes(q)) ||
        test?.topic?.some(t => t.toLowerCase().includes(q)) ||
        test?.test_mode?.some(m => m.toLowerCase().includes(q)) ||
        new Date(test?.created_at).toLocaleDateString().includes(q),
    );
  }, [data, search]);

  if (isLoading) {
    return <TestHistorySkeleton/>;
  }

  if (isError || !data) {
    return (
      <div className="text-center text-red-500 mt-6">
        Failed to load test history
      </div>
    );
  }

  return (
    <div className="rounded-lg border mt-6 md:text-[16px] overflow-x-auto">
      {/* Dimmed overlay while fetching next page */}
      <div
        className={`transition-opacity ${isFetching ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
      >
        <Table>
          <TableHeader className="bg-[#01503b] font-semibold">
            <TableRow>
              <TableHead className="text-white">Score</TableHead>
              <TableHead className="text-white">Difficulty</TableHead>
              <TableHead className="text-white">Date</TableHead>
              <TableHead className="text-white">Test Mode</TableHead>
              <TableHead className="text-white">Topic</TableHead>
              <TableHead className="text-white"># Qs</TableHead>
              <TableHead className="text-white text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredTests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-6 text-gray-500"
                >
                  No results found
                </TableCell>
              </TableRow>
            ) : (
              filteredTests.map((test, i) => (
                <TableRow key={test.id}>
                  <TableCell>
                    <CircularProgressPercentage
                      showLabel
                      value={test?.score ?? 0}
                      className="text-[10px]!  font-normal"
                    />
                  </TableCell>

                  <TableCell>
                    <div className="flex space-x-2">
                      {(test.difficulty ?? []).map((level, index) => {
                        let badgeClass = '';
                        switch (level) {
                          case 'Intern':
                            badgeClass = 'bg-[#fde1dc] text-red-400';
                            break;
                          case 'Senior':
                            badgeClass = 'bg-[#f0e1dc] text-[#b79e6b]';
                            break;
                          case 'Boards':
                            badgeClass = 'bg-[#cdebe3] text-[#01503b]';
                            break;
                          default:
                            badgeClass = 'bg-[#e1e1e1] text-gray-500';
                            break;
                        }
                        return (
                          <Badge
                            key={index}
                            className={`px-2 rounded-[4px] py-2 ${badgeClass}`}
                          >
                            {level}
                          </Badge>
                        );
                      })}
                    </div>
                  </TableCell>

                  <TableCell>
                    {new Date(test.created_at).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="space-x-2">
                    {test.test_mode.map(mode => (
                      <Badge
                        key={mode}
                        className="bg-[#cdebe3] text-[#01503b] rounded-[4px] px-2 py-2"
                      >
                        {mode}
                      </Badge>
                    ))}
                  </TableCell>

                  <TableCell>
                    <Badge className="bg-[#cdebe3] text-[#01503b] rounded-[4px] px-2 py-2">
                      {test.topic.length === 1 ? 'Single' : 'Multiple'}
                    </Badge>
                  </TableCell>

                  <TableCell>{test.total_questions}</TableCell>

                  <TableCell className="text-right relative">
                    <span
                      onClick={() =>
                        setDropdownIndex(dropdownIndex === i ? null : i)
                      }
                      className="cursor-pointer text-lg"
                    >
                      •••
                    </span>

                    {dropdownIndex === i && (
                      <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md border z-20">
                        <button
                          className="block w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() =>
                            router.push(
                              `/dashboard/user/test-review/${test.id}`,
                            )
                          }
                        >
                          Review
                        </button>
                        <button
                          className="block w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() =>
                            router.push(
                              `/dashboard/user/test-complete/${test.id}`,
                            )
                          }
                        >
                          Results
                        </button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t">
        <p className="text-sm text-gray-500">
          {isFetching ? (
            <span className="flex items-center gap-1">
              <Loader2 size={12} className="animate-spin" /> Loading...
            </span>
          ) : (
            <>
              Showing {(page - 1) * PAGE_LIMIT + 1}–
              {Math.min(page * PAGE_LIMIT, data.meta_data.total)} of{' '}
              {data.meta_data.total}
            </>
          )}
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1 || isFetching}
            onClick={() => setPage(p => p - 1)}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft size={16} />
          </Button>

          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(pg => (
            <Button
              key={pg}
              variant={pg === page ? 'default' : 'outline'}
              size="sm"
              disabled={isFetching}
              onClick={() => setPage(pg)}
              className={`h-8 w-8 p-0 ${
                pg === page
                  ? 'bg-[#01503b] hover:bg-[#01503b]/90 text-white'
                  : ''
              }`}
            >
              {pg}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages || isFetching}
            onClick={() => setPage(p => p + 1)}
            className="h-8 w-8 p-0"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}