import { TestStats, type StatItem } from '@/components/previous-test/TestStats';
import React from 'react';
import data from '../../../../../public/data/test-history.json';
export default function PreviousTestPage() {
  return (
    <div>
      <h2>previous tst</h2>
      <TestStats stats={data.stats as StatItem[]} />
    </div>
  );
}
