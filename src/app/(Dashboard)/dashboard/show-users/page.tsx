'use client'
import { PendingUsers } from '@/components/show-users/PendingUsers'
import { VerifiedUsers } from '@/components/show-users/VerifiedUsers';
import { PendingUser, VerifiedUser } from '@/types/admin';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { toast } from 'sonner';
export default function ShowUsersPage() {

   const [users, setUsers] = useState<PendingUser[]>([
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
  // add data for verification users
  const [verifiedUsers, setVerifiedUsers] = useState<VerifiedUser[]>([
    
      {
        id: 1,
        name: 'Kristin Watson',
        image: '/images/dashboard/Admin/doc-01.png',
        email: 'georgia@example.com',
        location: '2464 Royal Ln. Mesa, New Jersey',
        currentPractice: '2464 Royal Ln. Mesa, New Jersey',
        document: 'View',
        socialMedia: 'active',
      },
      {
        id: 2,
        name: 'Floyd Miles',
        image: '/images/dashboard/Admin/doc-02.png',
        email: 'sanders@example.com',
        location: '8502 Preston Rd. Inglewood',
        currentPractice: '8502 Preston Rd. Inglewood',
        document: 'View',
        socialMedia: 'active',
      },
      {
        id: 3,
        name: 'Savannah Nguyen',
        image: '/images/dashboard/Admin/doc-03.png',
        email: 'jackson@example.com',
        location: '2972 Westheimer Rd. Santa Ana',
        currentPractice: '2972 Westheimer Rd. Santa Ana',
        document: 'View',
        socialMedia: 'active',
      },
      {
        id: 4,
        name: 'Darlene Robertson',
        image: '/images/dashboard/Admin/doc-04.png',
        email: 'jennings@example.com',
        location: '8502 Preston Rd. Inglewood',
        currentPractice: '8502 Preston Rd. Inglewood',
        document: 'View',
        socialMedia: 'active',
      },
      {
        id: 5,
        name: 'Ronald Richards',
        image: '/images/dashboard/Admin/doc-05.png',
        email: 'hill@example.com',
        location: '6391 Elgin St. Celina, Delaware',
        currentPractice: '6391 Elgin St. Celina, Delaware',
        document: 'View',
        socialMedia: 'active',
      },
    
  ]);
  
   const [tab, setTab] = useState('pending');
   const boxRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
     gsap.fromTo(
       boxRef.current,
       { opacity: 0, y: 10 },
       { opacity: 1, y: 0, duration: 0.25 }
     );
   }, [tab]);
  
  const handleDeleteVerifiedUser = (id: number) => {
    setVerifiedUsers(prev => prev.filter(user => user.id !== id));

    toast.success('User deleted successfully');
  };

  const handleApproveUser = (user: PendingUser) => {
    // remove from pending
    setUsers(prev => prev.filter(u => u.id !== user.id));

    // add to verified
    setVerifiedUsers(prev => [
      ...prev,
      {
        id: user.id,
        name: user.name,
        image: user.image,
        email: user.email,
        location: user.location,
        currentPractice: user.location,
        document: 'View',
        socialMedia: 'active',
      },
    ]);

    toast.success('User approved successfully');
  };
   
  const handleRejectUser = (id: number) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    toast.error('User rejected');
  };

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
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab('pending')}
          className={`md:px-6 px-4 md:py-4 py-2 rounded-[4px] font-semibold cursor-pointer
    ${
      tab === 'pending'
        ? 'bg-[#01503b] text-white'
        : 'bg-white text-[#01503b] border border-[#01503b]'
    }
  `}
        >
          Verifications Pending User
        </button>
        <button
          onClick={() => setTab('verified')}
          className={`md:px-6 px-4 md:py-4 py-2 rounded-[4px] font-semibold cursor-pointer
    ${
      tab === 'verified'
        ? 'bg-[#01503b] text-white'
        : 'bg-white text-[#01503b] border border-[#01503b]'
    }
  `}
        >
          Verified Users
        </button>
      </div>
      <div ref={boxRef}>
        {tab === 'pending' && (
          <PendingUsers
            users={users}
            onApprove={handleApproveUser}
            onReject={handleRejectUser}
          />
        )}
        {tab === 'verified' && (
          <VerifiedUsers
            users={verifiedUsers}
            onDelete={handleDeleteVerifiedUser}
          />
        )}
      </div>
    </div>
  );
}
