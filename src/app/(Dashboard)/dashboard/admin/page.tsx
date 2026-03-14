'use client';

import { useState } from 'react';
import { StatsCard } from '@/components/admin/StatsCard';
import { UserVerification } from '@/components/admin/UserVerification';
import { RecentActivity } from '@/components/admin/RecentActivity';

import {
  useGetUserStatusQuery,
  useApproveUserMutation,
  useRejectUserMutation,
  AdminUser,
} from '@/app/redux/api/userStatusApi';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export default function AdminDashboardPage() {
  const { data, isLoading } = useGetUserStatusQuery({
    status: 'pending',
  });

  const [approveUser, { isLoading: approving }] = useApproveUserMutation();
  const [rejectUser, { isLoading: rejecting }] = useRejectUserMutation();

  const [activities, setActivities] = useState<
    { id: string; message: string; time: string }[]
  >([]);

  const handleAction = async (
    user: AdminUser,
    action: 'approved' | 'rejected',
  ) => {
    try {
      if (action === 'approved') {
        await approveUser(user.id).unwrap();
      } else {
        await rejectUser(user.id).unwrap();
      }

      setActivities(prev => [
        {
          id: crypto.randomUUID(),
          message: `${
            action === 'approved' ? 'Approved' : 'Rejected'
          }: ${user.name}`,
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    } catch (error) {
      const err = error as FetchBaseQueryError;
      console.error(err.status);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-6 font-[manrope]">
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>

      <StatsCard />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <UserVerification
            users={data?.data ?? []}
            onAction={handleAction}
            loading={approving || rejecting}
          />
        </div>

        <RecentActivity activities={activities} />
      </div>
    </div>
  );
}
