'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getRole } from '@/lib/auth';

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    if (getRole() !== 'admin') router.push('/dashboard/user');
  }, [router]);

  return <div className="text-2xl font-bold">Admin Dashboard</div>;
}
