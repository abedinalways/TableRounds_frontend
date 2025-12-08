'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { getRole } from '@/lib/auth';
import { adminMenu, userMenu, MenuItem } from './sidebarItems';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';

export default function Sidebar() {
  const role = useMemo(() => getRole(), []);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  if (!role) return null;

  const menu: MenuItem[] = role === 'admin' ? adminMenu : userMenu;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="lg:hidden cursor-pointer fixed top-2 left-4 z-50 text-green-700 p-2 rounded-full "
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        {open ? (
          <X size="12px" />
        ) : (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static w-64 h-screen background border-r flex flex-col justify-between text-white transition-transform duration-300 z-40
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-4 lg:p-6 overflow-y-auto">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 mb-6">
              <Image
                src="/images/logo.png"
                width={40}
                height={40}
                alt="TableRounds Logo"
              />
              <h1 className="font-bold text-lg sm:text-xl text-white font-[manrope]">
                Table{' '}
                <span className="text-xs bg-[#B79E6B] p-1 rounded-sm">OSM</span>
                <br /> Rounds
              </h1>
            </div>
          </Link>

          {/* Menu */}
          <nav className="flex flex-col gap-1">
            {menu.map(item => (
              <div key={item.href}>
                {item.section && (
                  <p className="mt-4 mb-1 text-xs uppercase text-gray-300 font-semibold">
                    {item.section}
                  </p>
                )}

                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all
                    ${
                      pathname === item.href
                        ? 'bg-[#B79E6B] text-white font-semibold'
                        : 'hover:bg-[#B79E6B] hover:text-white'
                    }
                  `}
                >
                  <Image src={item.icon} width={18} height={18} alt="" />
                  <span>{item.title}</span>
                </Link>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
