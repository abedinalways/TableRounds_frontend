'use client';

import { WelcomeBanner } from '@/components/main_dashboard_component/WelcomeBanner';

import FindColleagues from '@/components/main_dashboard_component/FindColleagues';
// import Calendar from '@/components/main_dashboard_component/calendar';
import StatsCards from '@/components/main_dashboard_component/StatsCards ';

export default function UserDashboard() {
  return (
    <div className=" gap-4">
      <div className=" space-y-6">
        <WelcomeBanner />
        <StatsCards />
        <FindColleagues />
      </div>
      <div className="">
        {/* <Calendar /> */}
      </div>
    </div>
  );
}
