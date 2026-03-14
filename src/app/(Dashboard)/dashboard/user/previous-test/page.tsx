'use client';

import { useState } from 'react';
import { TestStats } from '@/components/previous-test/TestStats';
import { TestHistory } from '@/components/previous-test/TestHistory';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function PreviousTestPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="font-[manrope] flex flex-col gap-3 min-h-screen">
      <h2 className="text-[48px] text-[#01281e] font-bold leading-[130%]">
        Test History
      </h2>

      <p className="text-[18px] text-[#6b7280] leading-[130%] font-normal">
        Review your previous tests
      </p>

      <TestStats />

      <div className="rounded-[12px] p-[18px] border border-[#e9e9e9] shadow-lg mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[#01281e] font-bold text-[20px]">
            Previous Test List
          </h2>

          {/* 🔍 SEARCH */}
          <div className="w-full max-w-md relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search keywords of questions..."
              className="h-11 w-full pl-10 rounded-[10px] border bg-[#f9fafb]"
            />
          </div>
        </div>

        <TestHistory search={search} />
      </div>
    </div>
  );
}
