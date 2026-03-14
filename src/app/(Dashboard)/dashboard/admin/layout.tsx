'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


import Topbar from '../topbar/Topbar';
// import Sidebar from '../sidebar/Sidebar';

import Sidebar from '../sidebar/Sidebar';


export default function AdminLayout({ children }: { children: React.ReactNode }) {

  const [open, setOpen] = useState(false);

  


  return (
    <div className="min-h-screen flex">
      <aside className="hidden lg:block w-55 fixed inset-y-0 left-0 ">
        <Sidebar />
      </aside>

      <Sidebar mobile open={open} setOpen={setOpen} />

      <div className="flex flex-col flex-1 lg:ml-55 w-full">
        <Topbar onMenuClick={() => setOpen(true)} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
