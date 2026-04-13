'use client';

import TestResult from '@/components/test-complete/TestResult';
import { useParams } from 'next/navigation';

export default function TestCompletePage() {
  const params = useParams();
  const testId = params?.testId as string;
  // console.log(testId, 'on my way id=================')

  return (
    <div>
      <TestResult testId={testId} />
    </div>
  );
}
