'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getRole } from '@/lib/auth';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const role = getRole();
    if (role === 'admin') router.push('/dashboard/admin');
    else if (role === 'user') router.push('/dashboard/user');
    else router.push('/login');
  }, [router]);

  return <p>Loading...</p>;
}
