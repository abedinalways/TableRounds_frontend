'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getRole } from '@/lib/auth';

export default function UserDashboard() {
  const router = useRouter();

  useEffect(() => {
    if (getRole() !== 'user') router.push('/login');
  }, []);

  return <div className="text-md  font-bold text-black bg-red-500">User Dashboard</div>;
}
