'use client';

import { useState } from 'react';
import Sidebar from './sidebar/Sidebar';
import Topbar from './topbar/Topbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f7f3] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-55 fixed inset-y-0 left-0 z-50">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} mobile />

      {/* Main Content */}
      <div className="flex flex-col flex-1 lg:ml-55 w-full">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 sm:p-6 overflow-auto flex-1">{children}</main>
      </div>
    </div>
  );
}
