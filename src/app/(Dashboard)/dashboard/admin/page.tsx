'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRole } from '@/lib/auth';

import { UserVerification } from '@/components/admin/UserVerification';
import { RecentActivity } from '@/components/admin/RecentActivity';
import { Activity, VerificationUser } from '@/types/admin';
import { StatsCard } from '@/components/admin/StatsCard';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (getRole() !== 'admin') router.push('/dashboard/user');
  }, [router]);

  const [users, setUsers] = useState<VerificationUser[]>([
    {
      id: 1,
      name: 'Kristin Watson',
      image: '/images/dashboard/Admin/doc-02.png',
      email: 'georgia@example.com',
      location: '2464 Royal Ln, Mesa, New Jersey',
      document: 'ID Card',
    },
    {
      id: 2,
      name: 'Floyd Miles',
      image: '/images/dashboard/Admin/doc-01.png',
      email: 'sanders@example.com',
      location: '8502 Preston Rd, Inglewood',
      document: 'Passport',
    },
    {
      id: 3,
      name: 'Kristin Watson',
      image: '/images/dashboard/Admin/doc-03.png',
      email: 'georgia@example.com',
      location: '2464 Royal Ln, Mesa, New Jersey',
      document: 'ID Card',
    },
    {
      id: 4,
      name: 'Floyd Miles',
      image: '/images/dashboard/Admin/doc-04.png',
      email: 'sanders@example.com',
      location: '8502 Preston Rd, Inglewood',
      document: 'Passport',
    },
    {
      id: 5,
      name: 'Kristin Watson',
      image: '/images/dashboard/Admin/doc-05.png',
      email: 'georgia@example.com',
      location: '2464 Royal Ln, Mesa, New Jersey',
      document: 'ID Card',
    },
    {
      id: 6,
      name: 'Floyd Miles',
      image: '/images/dashboard/Admin/doc-06.png',
      email: 'sanders@example.com',
      location: '8502 Preston Rd, Inglewood',
      document: 'Passport',
    },
    {
      id: 7,
      name: 'Floyd Miles',
      image: '/images/dashboard/Admin/doc-07.png',
      email: 'sanders@example.com',
      location: '8502 Preston Rd, Inglewood',
      document: 'Passport',
    },
    {
      id: 8,
      name: 'Floyd Miles',
      image: '/images/dashboard/Admin/doc-08.png',
      email: 'sanders@example.com',
      location: '8502 Preston Rd, Inglewood',
      document: 'Passport',
    },
    {
      id: 9,
      name: 'Floyd Miles',
      image: '/images/dashboard/Admin/doc-09.png',
      email: 'sanders@example.com',
      location: '8502 Preston Rd, Inglewood',
      document: 'Passport',
    },
    {
      id: 10,
      name: 'Floyd Miles',
      image: '/images/dashboard/Admin/doc-10.png',
      email: 'sanders@example.com',
      location: '8502 Preston Rd, Inglewood',
      document: 'Passport',
    },
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      message: '12 new users signed up • 3 via institutional email',
      time: '08:42 am',
    },
  ]);

  const handleAction = (
    user: VerificationUser,
    action: 'approved' | 'rejected'
  ) => {
    setUsers(prev => prev.filter(u => u.id !== user.id));

    setActivities(prev => [
      {
        id: Date.now(),
        message: `${action === 'approved' ? 'Approved' : 'Rejected'}: ${
          user.name
        }`,
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
  };

  return (
    <div className="p-6 space-y-6 font-[manrope]">
      <div className="flex justify-between items-center gap-2">
        <h1 className="text-3xl md:text-[48px] text-[#01281e] font-bold">
          Admin Panel
        </h1>
        <Link href='/dashboard/create-questions'>
          <button className="bg-[#01503b] md:px-6 px-4 md:py-4 py-2 rounded-lg text-white cursor-pointer">
            Create Questions
          </button>
        </Link>
      </div>
      <StatsCard />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <UserVerification users={users} onAction={handleAction} />
        </div>
        <RecentActivity activities={activities} />
      </div>
    </div>
  );
}
