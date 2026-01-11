'use client'
import { TestStats, type StatItem } from '@/components/previous-test/TestStats';
import data from '../../../../../public/data/test-history.json';
import {
  TestHistory,
  type TestItem,
} from '@/components/previous-test/TestHistory';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, SearchIcon } from 'lucide-react';

export default function PreviousTestPage() {
  // Manage the tests state here
  const [tests, setTests] = useState<TestItem[]>(data.tests);

  return (
    <div className="font-[manrope] flex flex-col gap-3 min-h-screen">
      <h2 className="text-[48px] text-[#01281e] font-bold leading-[130%]">
        Test History
      </h2>
      <p className="text-[18px] text-[#6b7280] leading-[130%] font-normal">
        Review your previous tests
      </p>
      <TestStats stats={data.stats as StatItem[]} />
      <div className="rounded-[12px] p-[18px] border border-[#e9e9e9] shadow-lg mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[#01281e] font-bold text-[20px]">
            Previous Test List
          </h2>
          {/* search box */}

          <div className=" w-full max-w-md">
            <div
              className="
      relative
      w-full
      sm:max-w-md
      md:max-w-lg
    "
            >
              <Search
                className="
        absolute
        left-3
        top-1/2
        -translate-y-1/2
        text-gray-400
      "
                size={18}
              />

              <Input
                type="text"
                placeholder="Search keywords of questions..."
                className="
        h-11
        w-full
        pl-10
        rounded-[10px]
        border border-[#e9e9e9]
        bg-[#f9fafb]
        text-[12px]
        text-[#374151]
        placeholder:text-[#9ca3af]
        
        focus-visible:ring-0
        focus-visible:ring-offset-0

        sm:h-[46px]
        md:h-[48px]
      "
              />
            </div>
          </div>
        </div>

        <TestHistory tests={tests} setTests={setTests} />
      </div>
    </div>
  );
}
