'use client';

import { PendingUsers } from '@/components/show-users/PendingUsers';
import { VerifiedUsers } from '@/components/show-users/VerifiedUsers';
import { ReportedUsers } from '@/components/show-users/ReportedUsers';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { toast } from 'sonner';

import {
  useGetUserStatusQuery,
  useApproveUserMutation,
  useRejectUserMutation,
  useGetReportedUsersQuery,
  useDeleteUserMutation,
} from '@/app/redux/api/userStatusApi';

export default function ShowUsersPage() {
 
  const [pendingPage, setPendingPage] = useState(1);
  const [verifiedPage, setVerifiedPage] = useState(1);

  const LIMIT = 10;
  const { data: pendingData, isLoading } = useGetUserStatusQuery({
    status: 'pending',
    page: pendingPage,
    limit: LIMIT,
  });
  console.log(pendingData, 'pending===========================++++++++++++')

  const { data: approvedData } = useGetUserStatusQuery({
    status: 'approved',
    page: verifiedPage,
    limit: LIMIT,
  });

  const { data: reportedData } = useGetReportedUsersQuery();

  const [approveUser] = useApproveUserMutation();
  const [rejectUser] = useRejectUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  

  const [tab, setTab] = useState<'pending' | 'verified' | 'reported'>(
    'pending',
  );
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      boxRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.25 },
    );
  }, [tab]);

  

  const pendingUsers =
    pendingData?.data.map(user => ({
      id: user.id,
      name: user.name,
      image: user.avatar_url,
      email: user.email,
      location: user.address ?? 'Unknown',
      document: 'View',
    })) ?? [];

  console.log(pendingData, '&&&&&&&&&&&&&&&&&&&&&========================')
  const verifiedUsers =
    approvedData?.data.map(user => ({
      id: user.id,
      name: user.name,
      image: user.avatar_url,
      email: user.email,
      location: user.address ?? 'Unknown',
      document: 'View',
      socialMedia: 'active',
    })) ?? [];
   console.log(verifiedUsers, '{{{{{{{{{{{{{{{{{{{{')
  const reportedUsers =
    reportedData?.data.map(item => ({
      id: item.id,
      reportingUser: {
        name: item.reporting_user?.name,
        image: item.reporting_user.avatar ?? undefined,
        email: item.reporting_user?.email,
      },
      reportedUser: {
        name: item.reported_user?.name,
        image: item.reporting_user.avatar ?? undefined,
        email: item.reported_user?.email,
      },
    })) ?? [];

  /* ================= ACTION HANDLERS ================= */

  const handleApproveUser = async (user: { id: string }) => {
    try {
      await approveUser(user.id).unwrap();
      toast.success('User approved successfully');
    } catch {
      toast.error('Failed to approve user');
    }
  };

  const handleRejectUser = async (id: string) => {
    try {
      await rejectUser(id).unwrap();
      toast.success('User rejected successfully');
    } catch {
      toast.error('Failed to reject user');
    }
  };

  const handleDeleteVerifiedUser = async (id: string) => {
    try {
      await deleteUser(id).unwrap();
      toast.success('User deleted successfully');
    } catch {
      toast.error('Failed to delete user');
    }
  };

 

  if (isLoading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="font-[manrope]">
      <div className="mb-8">
        <h2 className="text-[#01281e] text-[32px] md:text-[48px] font-bold leading-[130%] ">
          Users
        </h2>
        <p className="text-[#6b7280] text-[14px] md:text-[18px] font-normal leading-[130%] ">
          Manage user access and verification requests
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab('pending')}
          className={`md:px-6 px-4 md:py-4 py-2 rounded-[4px] font-semibold cursor-pointer ${
            tab === 'pending'
              ? 'bg-[#01503b] text-white'
              : 'bg-white text-[#01503b] border border-[#01503b]'
          }`}
        >
          Verifications Pending
        </button>

        <button
          onClick={() => setTab('verified')}
          className={`md:px-6 px-4 md:py-4 py-2 rounded-[4px] font-semibold cursor-pointer ${
            tab === 'verified'
              ? 'bg-[#01503b] text-white'
              : 'bg-white text-[#01503b] border border-[#01503b]'
          }`}
        >
          Verified Users
        </button>

        <button
          onClick={() => setTab('reported')}
          className={`md:px-6 px-4 md:py-4 py-2 rounded-[4px] font-semibold cursor-pointer ${
            tab === 'reported'
              ? 'bg-[#01503b] text-white'
              : 'bg-white text-[#01503b] border border-[#01503b]'
          }`}
        >
          Report Users
        </button>
      </div>

      <div ref={boxRef}>
        {tab === 'pending' && (
          <PendingUsers
            users={pendingUsers}
            onApprove={handleApproveUser}
            onReject={handleRejectUser}
            page={pendingPage}
            limit={LIMIT}
            total={pendingData?.meta?.total}
            onPageChange={setPendingPage}
          />
        )}

        {tab === 'verified' && (
          <VerifiedUsers
            users={verifiedUsers}
            onDelete={handleDeleteVerifiedUser}
            page={verifiedPage}
            limit={LIMIT}
            total={approvedData?.meta?.total}
            onPageChange={setVerifiedPage}
          />
        )}

        {tab === 'reported' && <ReportedUsers users={reportedUsers} />}
      </div>
    </div>
  );
}
