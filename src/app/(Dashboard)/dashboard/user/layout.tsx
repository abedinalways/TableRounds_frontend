'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import Topbar from '../topbar/Topbar';
import { useAppSelector } from '@/app/redux/hook';
import Sidebar from '../sidebar/Sidebar';

interface UserLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {

  // console.log(role, 'kon')
  const [open, setOpen] = useState(false);

 


  return (
    <div className="min-h-screen flex">
      <aside className="hidden lg:block w-55 fixed inset-y-0 left-0 z-50">
        <Sidebar />
      </aside>

      <Sidebar mobile open={open} setOpen={setOpen} />

      <div className="flex flex-col flex-1 lg:ml-55 w-full">
        <Topbar onMenuClick={() => setOpen(true)} />
        <main className="p-4 sm:p-6 overflow-auto flex-1">{children}</main>
      </div>
    </div>
  );
}
