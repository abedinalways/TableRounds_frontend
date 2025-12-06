'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getRole, logout } from '@/lib/auth';
import { adminMenu, userMenu, MenuItem } from './sidebarItems';

export default function Sidebar() {
  const [role, setRole] = useState<'admin' | 'user' | null>(null);

  useEffect(() => {
    setRole(getRole());
  }, []);

  if (!role) return null;

  const menu: MenuItem[] = role === 'admin' ? adminMenu : userMenu;

  return (
    <aside className="w-64 bg-white border-r h-screen flex flex-col justify-between">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <nav className="flex flex-col gap-2">
          {menu.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 rounded hover:bg-green-700 hover:text-white transition-colors"
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-6 border-t">
        <button
          onClick={() => {
            logout();
            window.location.href = '/login';
          }}
          className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
