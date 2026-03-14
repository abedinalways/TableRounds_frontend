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
import { CircularProgressPercentage } from '../CircularProgressPercentage';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useGetPreviousTestHistoryStatsQuery } from '@/app/redux/api/previousTestHistoryApi';

interface Props {
  search: string;
}

export function TestHistory({ search }: Props) {
  const { data, isLoading, isError } = useGetPreviousTestHistoryStatsQuery();
  const [dropdownIndex, setDropdownIndex] = useState<number | null>(null);
  const router = useRouter();

  const filteredTests = useMemo(() => {
    if (!data?.data) return [];

    const q = search.toLowerCase();

    return data.data.filter(
      test =>
        test.difficulty.toLowerCase().includes(q) ||
        test.topic.some(t => t.toLowerCase().includes(q)) ||
        test.test_mode.some(m => m.toLowerCase().includes(q)) ||
        new Date(test.created_at).toLocaleDateString().includes(q),
    );
  }, [data, search]);

  if (isLoading) {
    return (
      <div className="flex justify-center mt-6">
        <Loader2 className="animate-spin text-[#01503b]" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-center text-red-500 mt-6">
        Failed to load test history
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-hidden mt-6 md:text-[16px]">
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
              <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                No results found
              </TableCell>
            </TableRow>
          ) : (
            filteredTests.map((test, i) => (
              <TableRow key={test.id}>
                <TableCell>
                  <CircularProgressPercentage
                    showLabel
                    value={test.score ?? 0}
                    className="text-xs font-normal"
                  />
                </TableCell>

                <TableCell>
                  <Badge
                    className={
                      test.difficulty === 'Intern'
                        ? 'bg-[#fde1dc] text-red-400 px-2 rounded-[4px] py-2'
                        : 'test-background text-[#b79e6b] rounded-[4px] px-2 py-2'
                    }
                  >
                    {test.difficulty}
                  </Badge>
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

                <TableCell className="space-x-2">
                  {test.topic.map(t => (
                    <Badge
                      key={t}
                      className="bg-[#cdebe3] text-[#01503b] rounded-[4px] px-2 py-2"
                    >
                      {t}
                    </Badge>
                  ))}
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
                      <button className="block w-full px-4 py-2 hover:bg-gray-100">
                        Review
                      </button>
                      <button
                        onClick={() =>
                          router.push(`/dashboard/preview-test/${test.id}`)
                        }
                        className="block w-full px-4 py-2 hover:bg-gray-100"
                      >
                        Results
                      </button>
                      <button className="block w-full px-4 py-2 hover:bg-gray-100">
                        Send
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
  );
}
