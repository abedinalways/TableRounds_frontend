

'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import {
  IncompleteTestItem,
  useGetIncompleteTestsQuery,
} from '@/app/redux/api/incompleteTestApi';
import { IncompleteTestRow } from './IncompleteTestRow';
import { IncompleteTestTableSkeleton } from './IncompleteTestTableSkeleton';

const PAGE_LIMIT = 10;

interface Props {
  search: string;
}

const displayDifficultyLabel = (difficulty: string): string => {
  if (difficulty === 'Board') return 'Boards';
  return difficulty;
};

export function IncompleteTestTable({ search }: Props) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [search]);

  const { data, isLoading, isFetching, isError } = useGetIncompleteTestsQuery(
    { page, limit: PAGE_LIMIT },
    { refetchOnMountOrArgChange: true },
  );

  const totalPages = data?.metadata
    ? Math.ceil(data.metadata.total / data.metadata.limit)
    : 1;

  const filteredTests = useMemo(() => {
    if (!data?.data) return [];

    const q = search.toLowerCase().trim();
    if (!q) return data.data;

    return data.data.filter((test: IncompleteTestItem) => {
      const idMatch = test.id.toLowerCase().includes(q);
      const dateMatch = new Date(test.created_at)
        .toLocaleDateString()
        .toLowerCase()
        .includes(q);

      const difficultyMatch = (test.difficulty ?? []).some(level =>
        level.toLowerCase().includes(q),
      );

      const topicMatch = (test.topic ?? []).some(topic =>
        topic.toLowerCase().includes(q),
      );

      const modeMatch = (test.test_mode ?? []).some(mode =>
        mode.toLowerCase().includes(q),
      );

      return idMatch || dateMatch || difficultyMatch || topicMatch || modeMatch;
    });
  }, [data, search]);

  if (isLoading) {
    return <IncompleteTestTableSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="text-center text-red-500 mt-6">
        Failed to load incomplete tests
      </div>
    );
  }

  return (
    <div className="rounded-lg border mt-6 md:text-[16px] overflow-x-auto">
      <div
        className={`transition-opacity ${
          isFetching ? 'opacity-50 pointer-events-none' : 'opacity-100'
        }`}
      >
        <Table>
          <TableHeader className="bg-[#01503b] font-semibold">
            <TableRow>
              <TableHead className="text-white">SL</TableHead>
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
              filteredTests.map((test, index) => (
                <IncompleteTestRow
                  key={test.id}
                  test={test}
                  page={page}
                  index={index}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t">
        <p className="text-sm text-gray-500">
          {isFetching ? (
            <span className="flex items-center gap-1">
              <Loader2 size={12} className="animate-spin" /> Loading...
            </span>
          ) : (
            <>
              Showing {(page - 1) * PAGE_LIMIT + 1}–
              {Math.min(page * PAGE_LIMIT, data.metadata.total)} of{' '}
              {data.metadata.total}
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
                  ? 'bg-[#01503b] hover:bg-[#01503b]/90 text-white '
                  : 'cursor-pointer'
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