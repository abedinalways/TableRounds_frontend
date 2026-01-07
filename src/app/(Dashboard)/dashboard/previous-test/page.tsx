'use client'
import { TestStats, type StatItem } from '@/components/previous-test/TestStats';
import data from '../../../../../public/data/test-history.json';
import {
  TestHistory,
  type TestItem,
} from '@/components/previous-test/TestHistory';
import { useState } from 'react';

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
        <h2 className="text-[#01281e] font-bold text-[20px]">
          Previous Test List
        </h2>
        <TestHistory tests={tests} setTests={setTests} />
      </div>
    </div>
  );
}
