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

export interface TestItem {
  score: number;
  difficulty: string;
  date: string;
  modes: string[];
  topic: string;
  qs: number;
}

export function TestHistory({ tests }: { tests: TestItem[] }) {
  return (
    <div className="rounded-lg border overflow-hidden mt-6 md:text-[16px]">
      <Table className="">
        <TableHeader className="bg-[#01503b]  md:text-[16px] font-semibold space-y-5">
          <TableRow className="">
            <TableHead className="text-white">Score</TableHead>
            <TableHead className="text-white">Difficulty</TableHead>
            <TableHead className="text-white">Date</TableHead>
            <TableHead className="text-white">Test Mode</TableHead>
            <TableHead className="text-white">Topic</TableHead>
            <TableHead className="text-white"># Qs</TableHead>
            <TableHead className="text-white text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className=''>
          {tests.map((test, i) => (
            <TableRow key={i}>
              <TableCell>
                <CircularProgressPercentage
                  showLabel
                  value={test?.score ?? 0}
                  className="text-xs font-normal"
                />
              </TableCell>

              <TableCell className="md:text-[16px]">
                {test.difficulty}
              </TableCell>
              <TableCell className="md:text-[16px]">{test.date}</TableCell>
              <TableCell className="space-x-4">
                {test.modes.map(mode => (
                  <Badge
                    key={mode}
                    variant="secondary"
                    className={
                      mode === 'Timed'
                        ? 'text-[#01503b] bg-[#cdebe3] rounded-[4px] px-[8px] py-[4px]'
                        : 'test-background text-[#b79e6b] rounded-[4px] px-[8px] py-[4px]'
                    }
                  >
                    {mode}
                  </Badge>
                ))}
              </TableCell>
              <TableCell className="md:text-[16px]">{test.topic}</TableCell>
              <TableCell className="md:text-[16px] ">{test.qs}</TableCell>
              <TableCell className="text-right cursor-pointer">•••</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}