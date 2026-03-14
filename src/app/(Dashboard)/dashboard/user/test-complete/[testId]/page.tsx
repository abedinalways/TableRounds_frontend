'use client';

import TestResult from '@/components/test-complete/TestResult';
import { useParams } from 'next/navigation';

export default function TestCompletePage() {
  const params = useParams();
  const testId = params?.testId as string;

  return (
    <div>
      <TestResult testId={testId} />
    </div>
  );
}
