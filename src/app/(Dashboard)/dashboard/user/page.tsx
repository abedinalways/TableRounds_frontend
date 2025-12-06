'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRole, getUser } from '@/lib/auth';
import { WelcomeBanner } from '@/components/main_dashboard_component/WelcomeBanner';

export default function UserDashboard() {
  const [userName, setUserName]=useState('')
  const router = useRouter();

  useEffect(() => {
    if (getRole() !== 'user') router.push('/login');
  }, []);
  
  useEffect(() => {
    const user = getUser();
    setUserName(user?.name ?? '');
  },[])

  return (
    <div className='card-bg p-6'>
    <div className='grid grid-cols-12'>
      {/* Main Content Area (9/12 columns) */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          
          {/* 1. Welcome Banner */}
          <WelcomeBanner
            name={userName}
            date="November 8, 2025" 
            followers={2135} 
            following={213} 
          />
          </div>
    </div>
  </div>);
}
