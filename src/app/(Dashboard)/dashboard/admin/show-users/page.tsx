// 'use client';

// import { VerifiedUsers } from '@/components/show-users/VerifiedUsers';
// import { ReportedUsers } from '@/components/show-users/ReportedUsers';

// import { useEffect, useRef, useState } from 'react';
// import gsap from 'gsap';
// import { toast } from 'sonner';

// import {
//   useGetUserStatusQuery,
//   useApproveUserMutation,
//   useRejectUserMutation,
//   useGetReportedUsersQuery,
//   useDeleteUserMutation,
// } from '@/app/redux/api/userStatusApi';
// import { PendingUsers } from '@/components/show-users/PendingUsers';
// import { ChatProvider } from '@/app/(Dashboard)/context/ChatContext';
// import { RejectedUsers } from '@/components/show-users/RejectedUsers';

// export default function ShowUsersPage() {

//   const [pendingPage, setPendingPage] = useState(1);
//   const [verifiedPage, setVerifiedPage] = useState(1);
//   const [rejectedPage, setRejectedPage] = useState(1);

//   const LIMIT = 10;
//   const { data: pendingData, isLoading } = useGetUserStatusQuery({
//     status: 'pending',
//     page: pendingPage,
//     limit: LIMIT,
//   });
//   console.log(pendingData, 'pending===========================++++++++++++')

//   const { data: approvedData } = useGetUserStatusQuery({
//     status: 'approved',
//     page: verifiedPage,
//     limit: LIMIT,
//   });

//   const { data: rejectedData } = useGetUserStatusQuery({
//     status: 'rejected',
//     page: rejectedPage,
//     limit: LIMIT,
//   });
//   console.log(rejectedData, 'rejected===========================++++++++++++')

//   const { data: reportedData } = useGetReportedUsersQuery();
//   console.log(reportedData, 'reported===========================++++++++++++')
//   const [approveUser] = useApproveUserMutation();
//   const [rejectUser] = useRejectUserMutation();
//   const [deleteUser] = useDeleteUserMutation();

//  const [tab, setTab] = useState<
//    'pending' | 'verified' | 'rejected' | 'reported'
//  >('pending');
//   const boxRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     gsap.fromTo(
//       boxRef.current,
//       { opacity: 0, y: 10 },
//       { opacity: 1, y: 0, duration: 0.25 },
//     );
//   }, [tab]);

//   const pendingUsers =
//     pendingData?.data.map(user => ({
//       id: user.id,
//       name: user.name,
//       image: user.avatar_url,
//       email: user.email,
//       address: user.address ?? 'Unknown',
//       document: 'View',
//       verifiy_document_url: user.verifiy_document_url,
//     })) ?? [];

//   const verifiedUsers =
//     approvedData?.data.map(user => ({
//       id: user.id,
//       name: user.name,
//       image: user.avatar_url,
//       email: user.email,
//       location: user.address ?? 'Unknown',
//       document: 'View',
//       facebook: user.facebook,
//       linkedin: user.linkedin,
//       twitter_x: user.twitter_x,
//       instagram: user.instagram,
//       verifiy_document_url: user.verifiy_document_url,
//       socialMedia: 'active',
//     })) ?? [];

//   const rejectedUsers =
//     rejectedData?.data.map(user => ({
//       id: user.id,
//       name: user.name,
//       image: user.avatar_url,
//       email: user.email,
//       location: user.address ?? 'Unknown',
//       document: 'View',
//       verifiy_document_url: user.verifiy_document_url,
//     })) ?? [];

//   const reportedUsers =
//     reportedData?.data.map(item => ({
//       id: item.id,

//       reportingUser: {
//         id: item?.reporter.id,
//         name: item?.reporter.name,
//         image: item?.reporter.avatar_url ?? undefined,
//         email: item?.reporter.email,
//       },
//       reportedUser: {
//         id: item?.reported.id,
//         name: item.reported?.name,
//         image: item.reported?.avatar_url ?? undefined,
//         email: item.reported?.email,
//       },
//       conversation_id: item?.conversation_id,
//     })) ?? [];

//    console.log(reportedData, 'khfweroifherwfgoi werufgoiwer==================')

//   /* ================= ACTION HANDLERS ================= */

//   const handleApproveUser = async (user: { id: string }) => {
//     try {
//       await approveUser(user.id).unwrap();
//       toast.success('User approved successfully');
//     } catch {
//       toast.error('Failed to approve user');
//     }
//   };

//   const handleRejectUser = async (id: string) => {
//     try {
//       await rejectUser(id).unwrap();
//       toast.success('User rejected successfully');
//     } catch {
//       toast.error('Failed to reject user');
//     }
//   };

//   const handleDeleteVerifiedUser = async (id: string) => {
//     try {
//       await deleteUser(id).unwrap();
//       toast.success('User deleted successfully');
//     } catch {
//       toast.error('Failed to delete user');
//     }
//   };

//   const handleApproveRejectedUser = async (id: string) => {
//     try {
//       await approveUser(id).unwrap();
//       toast.success('Rejected user approved successfully');
//     } catch {
//       toast.error('Failed to approve rejected user');
//     }
//   };

//   if (isLoading) {
//     return <p className="p-6">Loading...</p>;
//   }

//   return (
//     <ChatProvider>
//       <div className="font-[manrope]">
//         <div className="mb-8">
//           <h2 className="text-[#01281e] text-[32px] md:text-[48px] font-bold leading-[130%] ">
//             Users
//           </h2>
//           <p className="text-[#6b7280] text-[14px] md:text-[18px] font-normal leading-[130%] ">
//             Manage user access and verification requests
//           </p>
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-2 mb-4">
//           <button
//             onClick={() => setTab('pending')}
//             className={`md:px-6 px-4 md:py-4 py-2 rounded-[4px] font-semibold cursor-pointer ${
//               tab === 'pending'
//                 ? 'bg-[#01503b] text-white'
//                 : 'bg-white text-[#01503b] border border-[#01503b]'
//             }`}
//           >
//             Verifications Pending
//           </button>

//           <button
//             onClick={() => setTab('verified')}
//             className={`md:px-6 px-4 md:py-4 py-2 rounded-[4px] font-semibold cursor-pointer ${
//               tab === 'verified'
//                 ? 'bg-[#01503b] text-white'
//                 : 'bg-white text-[#01503b] border border-[#01503b]'
//             }`}
//           >
//             Verified Users
//           </button>

//           <button
//             onClick={() => setTab('reported')}
//             className={`md:px-6 px-4 md:py-4 py-2 rounded-[4px] font-semibold cursor-pointer ${
//               tab === 'reported'
//                 ? 'bg-[#01503b] text-white'
//                 : 'bg-white text-[#01503b] border border-[#01503b]'
//             }`}
//           >
//             Reported Users
//           </button>

//           <button
//             onClick={() => setTab('rejected')}
//             className={`md:px-6 px-4 md:py-4 py-2 rounded-[4px] font-semibold cursor-pointer ${
//               tab === 'rejected'
//                 ? 'bg-[#01503b] text-white'
//                 : 'bg-white text-[#01503b] border border-[#01503b]'
//             }`}
//           >
//             Rejected Users
//           </button>
//         </div>

//         <div ref={boxRef}>
//           {tab === 'pending' && (
//             <PendingUsers
//               users={pendingUsers}
//               onApprove={handleApproveUser}
//               onReject={handleRejectUser}
//               page={pendingPage}
//               limit={LIMIT}
//               total={pendingData?.meta?.total}
//               onPageChange={setPendingPage}
//             />
//           )}

//           {tab === 'verified' && (
//             <VerifiedUsers
//               users={verifiedUsers}
//               onDelete={handleDeleteVerifiedUser}
//               page={verifiedPage}
//               limit={LIMIT}
//               total={approvedData?.meta?.total}
//               onPageChange={setVerifiedPage}
//             />
//           )}

//           {tab === 'reported' && <ReportedUsers users={reportedUsers} />}

//           {tab === 'rejected' && (
//             <RejectedUsers
//               users={rejectedUsers}
//               onApprove={handleApproveUser}
//               onDelete={handleDeleteVerifiedUser}
//               page={rejectedPage}
//               limit={LIMIT}
//               total={rejectedData?.meta?.total}
//               onPageChange={setRejectedPage}
//             />
//           )}
//         </div>
//       </div>
//     </ChatProvider>
//   );
// }

'use client';

import { VerifiedUsers } from '@/components/show-users/VerifiedUsers';
import { ReportedUsers } from '@/components/show-users/ReportedUsers';
import { PendingUsers } from '@/components/show-users/PendingUsers';
import { RejectedUsers } from '@/components/show-users/RejectedUsers';
import { ChatProvider } from '@/app/(Dashboard)/context/ChatContext';


import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import gsap from 'gsap';
import { toast } from 'sonner';

import {
  useGetUserStatusQuery,
  useApproveUserMutation,
  useRejectUserMutation,
  useGetReportedUsersQuery,
  useDeleteUserMutation,
} from '@/app/redux/api/userStatusApi';
import TopTabs, { TabItem } from '@/components/show-users/TopTabs';

type UserTab = 'pending' | 'verified' | 'rejected' | 'reported';

const VALID_TABS: UserTab[] = ['pending', 'verified', 'reported', 'rejected'];

const TABS: TabItem<UserTab>[] = [
  { key: 'pending', label: 'Verifications Pending' },
  { key: 'verified', label: 'Verified Users' },
  { key: 'reported', label: 'Reported Users' },
  { key: 'rejected', label: 'Rejected Users' },
];

const LIMIT = 10;

export default function ShowUsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── Read tab from URL, fall back to 'pending' if missing/invalid ──────────
  const tabParam = searchParams.get('tab') as UserTab | null;
  const activeTab: UserTab =
    tabParam && VALID_TABS.includes(tabParam) ? tabParam : 'pending';

  // ── Update URL when tab changes (replaces history so back button works) ───
  const handleTabChange = (key: UserTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', key);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const [pendingPage, setPendingPage] = useState(1);
  const [verifiedPage, setVerifiedPage] = useState(1);
  const [rejectedPage, setRejectedPage] = useState(1);

  const boxRef = useRef<HTMLDivElement>(null);

  // ── Queries ────────────────────────────────────────────────────────────────
  const { data: pendingData, isLoading } = useGetUserStatusQuery({
    status: 'pending',
    page: pendingPage,
    limit: LIMIT,
  });

  const { data: approvedData } = useGetUserStatusQuery({
    status: 'approved',
    page: verifiedPage,
    limit: LIMIT,
  });

  const { data: rejectedData } = useGetUserStatusQuery({
    status: 'rejected',
    page: rejectedPage,
    limit: LIMIT,
  });

  const { data: reportedData } = useGetReportedUsersQuery();

  // ── Mutations ──────────────────────────────────────────────────────────────
  const [approveUser] = useApproveUserMutation();
  const [rejectUser] = useRejectUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  // ── Tab transition animation ───────────────────────────────────────────────
  useEffect(() => {
    gsap.fromTo(
      boxRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.25 },
    );
  }, [activeTab]);

  // ── Data mapping ───────────────────────────────────────────────────────────
  const pendingUsers =
    pendingData?.data.map(user => ({
      id: user.id,
      name: user.name,
      image: user.avatar_url,
      email: user.email,
      address: user.address ?? 'Unknown',
      document: 'View',
      verifiy_document_url: user.verifiy_document_url,
    })) ?? [];

  const verifiedUsers =
    approvedData?.data.map(user => ({
      id: user.id,
      name: user.name,
      image: user.avatar_url,
      email: user.email,
      location: user.address ?? 'Unknown',
      document: 'View',
      facebook: user.facebook,
      linkedin: user.linkedin,
      twitter_x: user.twitter_x,
      instagram: user.instagram,
      verifiy_document_url: user.verifiy_document_url,
      socialMedia: 'active',
    })) ?? [];

  const rejectedUsers =
    rejectedData?.data.map(user => ({
      id: user.id,
      name: user.name,
      image: user.avatar_url,
      email: user.email,
      location: user.address ?? 'Unknown',
      document: 'View',
      verifiy_document_url: user.verifiy_document_url,
    })) ?? [];

  const reportedUsers =
    reportedData?.data.map(item => ({
      id: item.id,
      reportingUser: {
        id: item.reporter.id,
        name: item.reporter.name,
        image: item.reporter.avatar_url ?? undefined,
        email: item.reporter.email,
      },
      reportedUser: {
        id: item.reported.id,
        name: item.reported?.name,
        image: item.reported?.avatar_url ?? undefined,
        email: item.reported?.email,
      },
      conversation_id: item.conversation_id,
    })) ?? [];

  // ── Action handlers ────────────────────────────────────────────────────────
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

  // ── Render ─────────────────────────────────────────────────────────────────
  if (isLoading) return <p className="p-6">Loading...</p>;

  return (
    <ChatProvider>
      <div className="font-[manrope]">
        <div className="mb-8">
          <h2 className="text-[#01281e] text-[32px] md:text-[48px] font-bold leading-[130%]">
            Users
          </h2>
          <p className="text-[#6b7280] text-[14px] md:text-[18px] font-normal leading-[130%]">
            Manage user access and verification requests
          </p>
        </div>

        <TopTabs<UserTab>
          tabs={TABS}
          activeKey={activeTab}
          onChange={handleTabChange}
          className="mb-4"
          activeColorClassName="bg-[#01503b] text-white"
          inactiveColorClassName="text-[#01503b] hover:bg-white"
        />

        <div ref={boxRef}>
          {activeTab === 'pending' && (
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

          {activeTab === 'verified' && (
            <VerifiedUsers
              users={verifiedUsers}
              onDelete={handleDeleteVerifiedUser}
              page={verifiedPage}
              limit={LIMIT}
              total={approvedData?.meta?.total}
              onPageChange={setVerifiedPage}
            />
          )}

          {activeTab === 'reported' && <ReportedUsers users={reportedUsers} />}

          {activeTab === 'rejected' && (
            <RejectedUsers
              users={rejectedUsers}
              onApprove={handleApproveUser}
              onDelete={handleDeleteVerifiedUser}
              page={rejectedPage}
              limit={LIMIT}
              total={rejectedData?.meta?.total}
              onPageChange={setRejectedPage}
            />
          )}
        </div>
      </div>
    </ChatProvider>
  );
}