'use client';

import { useRouter } from 'next/navigation';
import { MoreHorizontal, Eye, PlayCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { IncompleteTestItem } from '@/app/redux/api/incompleteTestApi';

interface Props {
  test: IncompleteTestItem;
  index: number;
  page: number;
}
const displayDifficultyLabel = (difficulty: string): string => {
  if (difficulty === 'Board') return 'Boards';
  return difficulty;
};

export function IncompleteTestRow({ test, index, page }: Props) {
  const router = useRouter();

  const PAGE_LIMIT = 10;
  const serial = (page - 1) * PAGE_LIMIT + index + 1;

  return (
    <TableRow className="hover:bg-[#f9fafb] font-[manrope]">
      {/* Number */}
      <TableCell>
        <span className="font-medium text-[#111827]">{serial}</span>
      </TableCell>

      {/* Difficulty */}
      <TableCell>
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
              case 'Boards':
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

      {/* Date */}
      <TableCell className="text-[#4b5563]">
        {new Date(test.created_at).toLocaleDateString()}
      </TableCell>

      {/* Test Mode */}
      <TableCell>
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

      {/* Topic */}
      <TableCell>
        <Badge className="rounded-[6px] bg-[#cdebe3] px-3 py-1.5 text-xs font-medium text-[#01503b]">
          {test.topic.length === 1 ? 'Single' : 'Multiple'}
        </Badge>
      </TableCell>

      {/* Total Questions */}
      <TableCell className="font-medium text-[#111827]">
        {test.total_questions}
      </TableCell>

      {/* Action */}
      <TableCell className="text-right">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-[#01281e] hover:bg-[#ecfdf5] hover:text-[#01503b] focus-visible:ring-2 focus-visible:ring-[#01503b]/30 cursor-pointer"
            >
              <MoreHorizontal className="h-5 w-5 " />
              <span className="sr-only">Open action menu</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            side="bottom"
            sideOffset={8}
            className="z-[9999] w-[180px] rounded-xl border border-[#e5e7eb] bg-white p-1.5 shadow-xl"
          >
            {/* <DropdownMenuItem
              onClick={() =>
                router.push(`/dashboard/user/test-review/${test.id}`)
              }
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-[#111827] outline-none hover:bg-[#ecfdf5] focus:bg-[#ecfdf5]"
            >
              <Eye className="h-4 w-4 text-[#01503b]" />
              Review
            </DropdownMenuItem> */}

            <DropdownMenuItem
              onClick={() =>
                router.push(`/dashboard/user/create-test/${test.id}`)
              }
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-[#111827] outline-none hover:bg-[#ecfdf5] focus:bg-[#ecfdf5]"
            >
              <PlayCircle className="h-4 w-4 text-[#01503b]" />
              Resume
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
