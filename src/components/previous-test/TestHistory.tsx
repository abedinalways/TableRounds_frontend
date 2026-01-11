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
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';


export interface TestItem {
  score: number;
  difficulties: string[];
  date: string;
  modes: string[];
  topic: string;
  qs: number;
}

export function TestHistory({
  tests,
  setTests,
}: {
  tests: TestItem[];
  setTests: React.Dispatch<React.SetStateAction<TestItem[]>>;
}) {
  const [dropdownIndex, setDropdownIndex] = useState<number | null>(null);
  const router = useRouter();

  const handleDelete = (index: number) => {
    setTests(prevTests => prevTests.filter((_, i) => i !== index));
    setDropdownIndex(null);
  };

  const handlePreview = (index: number) => {
    const test = tests[index];
    router.push(`/dashboard/preview-test`); 
    setDropdownIndex(null);
  };

  return (
    <div className="rounded-lg border overflow-hidden mt-6 md:text-[16px]">
      <Table>
        <TableHeader className="bg-[#01503b]  md:text-[16px] font-semibold space-y-5">
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
          {tests.map((test, i) => (
            <TableRow key={i}>
              <TableCell>
                <CircularProgressPercentage
                  showLabel
                  value={test?.score ?? 0}
                  className="text-xs font-normal"
                />
              </TableCell>

              <TableCell className="md:text-[16px] space-x-2">
                {test.difficulties.map(difficulty => (
                  <Badge
                    key={difficulty}
                    variant="secondary"
                    className={(() => {
                      switch (difficulty) {
                        case 'Boards':
                          return 'text-[#01503b] bg-[#cdebe3] rounded-[4px] px-[8px] py-[4px] w-[57px] h-[34px]';
                        case 'Senior':
                          return 'test-background text-[#b79e6b] rounded-[4px] px-[8px] py-[4px]  w-[57px] h-[34px]';
                        case 'Intern':
                          return 'bg-[#fde1dc] text-red-400 rounded-[4px] px-[8px] py-[4px] w-[57px] h-[34px]';
                        default:
                          return 'test-background text-[#b79e6b] rounded-[4px] px-[8px] py-[4px] w-[57px] h-[34px]';
                      }
                    })()}
                  >
                    {difficulty}
                  </Badge>
                ))}
              </TableCell>
              <TableCell className="md:text-[16px]">{test.date}</TableCell>
              <TableCell className="space-x-4">
                {test.modes.map(mode => (
                  <Badge
                    key={mode}
                    variant="secondary"
                    className={
                      mode === 'Timed'
                        ? 'text-[#01503b] bg-[#cdebe3] rounded-[4px] px-[8px] py-[4px] w-[57px] h-[34px]'
                        : 'test-background text-[#b79e6b] rounded-[4px] px-[8px] py-[4px]  w-[57px] h-[34px]'
                    }
                  >
                    {mode}
                  </Badge>
                ))}
              </TableCell>
              <TableCell className="md:text-[16px]">{test.topic}</TableCell>
              <TableCell className="md:text-[16px] ">{test.qs}</TableCell>
              <TableCell className="text-right cursor-pointer relative">
                <span
                  onClick={() =>
                    setDropdownIndex(dropdownIndex === i ? null : i)
                  }
                  className="text-lg"
                >
                  •••
                </span>
                {dropdownIndex === i && (
                  <div className="absolute right-0 mt-2 w-32 z-20 bg-white shadow-lg rounded-md border border-gray-300">
                    <button className="block w-full text-left px-4 py-2 text-[#01281E] hover:bg-gray-100 cursor-pointer">
                      Review
                    </button>
                    <button
                      onClick={() => handlePreview(i)}
                      className="block w-full text-left px-4 py-2 text-[#01281E] hover:bg-gray-100 cursor-pointer"
                    >
                      Results
                    </button>
                    <button
                      
                      className="block w-full text-left px-4 py-2 text-[#01281E] hover:bg-gray-100 cursor-pointer"
                    >
                      Send
                    </button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
