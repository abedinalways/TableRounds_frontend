'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/app/redux/hook';
import Sidebar from '../sidebar/Sidebar';
import Topbar from './admin-topbar/Topbar';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const token = useAppSelector(state => state.auth.auth?.token);
  const authRole = useAppSelector(state => state.auth.auth?.role);
  const user = useAppSelector(state => state.auth.user);

  const isAuthInitializing = token === false;
  const userRole = user?.role || user?.type;
  // If user profile is loaded from backend, trust it exclusively. Otherwise check initial auth role.
  const isAdmin = userRole ? userRole === 'admin' : authRole === 'admin';

  useEffect(() => {
    if (isAuthInitializing) return;

    // Not authenticated -> redirect to login
    if (!token) {
      router.replace('/login');
      return;
    }

    // Authenticated but not an admin -> redirect to user dashboard
    if (!isAdmin) {
      router.replace('/dashboard/user');
    }
  }, [isAuthInitializing, token, isAdmin, router]);

  // While checking or if unauthorized, do not render admin UI
  if (isAuthInitializing || !token || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#01503b]" />
        <p className="mt-3 text-sm text-gray-500 font-[manrope]">Verifying access...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <aside className="hidden lg:block w-55 fixed inset-y-0 left-0">
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

