'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getRole } from '@/lib/auth';
import { WelcomeBanner } from '@/components/main_dashboard_component/WelcomeBanner';
import StatsCards from '@/components/main_dashboard_component/StatsCards ';
import FindColleagues from '@/components/main_dashboard_component/FindColleagues';
import Calendar from '@/components/main_dashboard_component/calendar';

export default function UserDashboard() {
  const router = useRouter();

  useEffect(() => {
    
    if (getRole() !== 'user') {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="grid grid-cols-12 font-[manrope] gap-4">
      <div className="col-span-12 lg:col-span-9 space-y-6">
        <WelcomeBanner />
        <div>
          <StatsCards />
        </div>
        <div>
          <FindColleagues />
        </div>
      </div>
      <div className="col-span-12 lg:col-span-3">
        <Calendar/>
      </div>
    </div>
  );
}
