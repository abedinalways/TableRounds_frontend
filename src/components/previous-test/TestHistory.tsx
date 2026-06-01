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
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  MoreHorizontal,
  Eye,
  BarChart3,
} from 'lucide-react';
import { useGetPreviousTestHistoryStatsQuery } from '@/app/redux/api/previousTestHistoryApi';
import { TestHistorySkeleton } from './TestHistorySkeleton';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const PAGE_LIMIT = 10;

interface Props {
  search: string;
}

const displayDifficultyLabel = (difficulty: string): string => {
  if (difficulty === 'Board') return 'Boards';
  return difficulty;
};

export function TestHistory({ search }: Props) {
  const [page, setPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    return <TestHistorySkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="mt-6 text-center text-red-500">
        Failed to load test history
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-lg border md:text-[16px] w-full max-w-full overflow-x-auto">
      <div
        className={`overflow-x-auto transition-opacity ${
          isFetching ? 'opacity-50 pointer-events-none' : 'opacity-100'
        }`}
      >
        <Table className="min-w-[900px] w-full">
          <TableHeader className="bg-[#01503b] font-semibold">
            <TableRow>
              <TableHead className="whitespace-nowrap text-white">
                Score
              </TableHead>
              <TableHead className="whitespace-nowrap text-white">
                Difficulty
              </TableHead>
              <TableHead className="whitespace-nowrap text-white">
                Date
              </TableHead>
              <TableHead className="whitespace-nowrap text-white">
                Test Mode
              </TableHead>
              <TableHead className="whitespace-nowrap text-white">
                Topic
              </TableHead>
              <TableHead className="whitespace-nowrap text-white">
                # Qs
              </TableHead>
              <TableHead className="whitespace-nowrap text-right text-white">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredTests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-6 text-center text-gray-500"
                >
                  No results found
                </TableCell>
              </TableRow>
            ) : (
              filteredTests.map(test => (
                <TableRow key={test.id} className="hover:bg-[#f9fafb]">
                  <TableCell className="whitespace-nowrap">
                    <CircularProgressPercentage
                      showLabel
                      value={test?.score ?? 0}
                      className="text-[10px]! font-normal"
                    />
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    <div className="flex flex-wrap gap-2">
                      {(test.difficulty ?? []).map((level, index) => {
                        let badgeClass = '';

                        switch (level) {
                          case 'Intern':
                            badgeClass = 'bg-[#fde1dc] text-red-500';
                            break;
                          case 'Senior':
                            badgeClass = 'bg-[#f0e1dc] text-[#b79e6b]';
                            break;
                          case 'Board':
                            badgeClass = 'bg-[#cdebe3] text-[#01503b]';
                            break;
                          default:
                            badgeClass = 'bg-[#e5e7eb] text-gray-500';
                            break;
                        }

                        return (
                          <Badge
                            key={index}
                            className={`rounded-[6px] px-3 py-1.5 text-xs font-medium ${badgeClass}`}
                          >
                            {displayDifficultyLabel(level)}
                          </Badge>
                        );
                      })}
                    </div>
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-[#4b5563]">
                    {new Date(test.created_at).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    <div className="flex flex-wrap gap-2">
                      {test.test_mode.map(mode => (
                        <Badge
                          key={mode}
                          className="rounded-[6px] bg-[#cdebe3] px-3 py-1.5 text-xs font-medium text-[#01503b]"
                        >
                          {mode}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    <Badge className="rounded-[6px] bg-[#cdebe3] px-3 py-1.5 text-xs font-medium text-[#01503b]">
                      {test.topic.length === 1 ? 'Single' : 'Multiple'}
                    </Badge>
                  </TableCell>

                  <TableCell className="whitespace-nowrap font-medium text-[#111827]">
                    {test.total_questions}
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-right">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full text-[#01281e] hover:bg-[#ecfdf5] hover:text-[#01503b] focus-visible:ring-2 focus-visible:ring-[#01503b]/30 cursor-pointer"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                          <span className="sr-only">Open action menu</span>
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        side="bottom"
                        sideOffset={8}
                        className="z-[9999] w-[180px] rounded-xl border border-[#e5e7eb] bg-white p-1.5 shadow-xl"
                      >
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/dashboard/user/test-review/${test.id}`,
                            )
                          }
                          className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-[#111827] outline-none hover:bg-[#ecfdf5] focus:bg-[#ecfdf5]"
                        >
                          <Eye className="h-4 w-4 text-[#01503b]" />
                          Review
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/dashboard/user/test-complete/${test.id}`,
                            )
                          }
                          className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-[#111827] outline-none hover:bg-[#ecfdf5] focus:bg-[#ecfdf5]"
                        >
                          <BarChart3 className="h-4 w-4 text-[#01503b]" />
                          Results
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
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

        <div className="flex flex-wrap items-center gap-2">
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
                  ? 'bg-[#01503b] text-white hover:bg-[#01503b]/90'
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
