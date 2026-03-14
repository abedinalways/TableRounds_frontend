'use client';

import { WelcomeBanner } from '@/components/main_dashboard_component/WelcomeBanner';

import FindColleagues from '@/components/main_dashboard_component/FindColleagues';
import Calendar from '@/components/main_dashboard_component/calendar';
import StatsCards from '@/components/main_dashboard_component/StatsCards ';

export default function UserDashboard() {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-9 space-y-6">
        <WelcomeBanner />
        <StatsCards />
        <FindColleagues />
      </div>
      <div className="col-span-12 lg:col-span-3">
        <Calendar />
      </div>
    </div>
  );
}
