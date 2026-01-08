'use client';

import Link from 'next/link';
import { useMemo, useEffect } from 'react';
import { getRole } from '@/lib/auth';
import { adminMenu, userMenu, MenuItem } from './sidebarItems';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import OmsLogo from '@/components/reusable/icons/OmsLogo';

interface SidebarProps {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  mobile?: boolean;
}

export default function Sidebar({
  open = false,
  setOpen,
  mobile = false,
}: SidebarProps) {
  const role = useMemo(() => getRole(), []);
  const pathname = usePathname();

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobile && open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobile, open]);

  if (!role) return null;

  const menu: MenuItem[] = role === 'admin' ? adminMenu : userMenu;

 const normalizePath = (path: string) => path.replace(/\/+$/, '');

 const isActive = (href: string) => {
   const currentPath = normalizePath(pathname);
   const targetPath = normalizePath(href);

   // dashboard should match ONLY the dashboard home page
   if (targetPath === '/dashboard') {
     return currentPath === '/dashboard';
   }

   return currentPath.startsWith(targetPath);
 };



  // Desktop sidebar (always visible on lg+)
  if (!mobile) {
    return (
      <div className="h-screen w-55 background border-r flex flex-col justify-between text-white overflow-y-auto font-[manrope]">
        <div className="p-2.5">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 mb-6">
              <Image
                src="/images/navbar-logo.png"
                width={40}
                height={40}
                alt="TableRounds Logo"
              />
              <h1 className="relative font-bold text-lg sm:text-xl lg:text-3xl text-white font-[manrope] mb-4">
                <div className="flex  items-center justify-center gap-1">
                  Table
                  <span className="">
                    <OmsLogo />
                  </span>
                </div>
                <span className="absolute top-6">Rounds</span>
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
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all
                    ${
                      isActive(item.href)
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
      </div>
    );
  }

  // Mobile sidebar (toggleable)
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0  bg-opacity-10 z-50 lg:hidden"
          onClick={() => setOpen?.(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64  background border-r flex flex-col text-white transition-transform duration-300 z-1000 lg:hidden
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-full overflow-y-auto">
          <div className="p-4">
            {/* Close button */}
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setOpen?.(false)}
                className="p-2 hover:bg-[#B79E6B] rounded-md transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Logo */}
            <Link href="/" onClick={() => setOpen?.(false)}>
              <div className="flex items-center gap-2 mb-6">
                <Image
                  src="/images/navbar-logo.png"
                  width={40}
                  height={40}
                  alt="TableRounds Logo"
                />
                <h1 className="relative font-bold text-lg sm:text-xl lg:text-3xl text-white font-[manrope] mb-4">
                  <div className="flex  items-center justify-center gap-1">
                    Table
                    <span className="">
                      <OmsLogo />
                    </span>
                  </div>
                  <span className="absolute top-6">Rounds</span>
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
                    onClick={() => setOpen?.(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all
                      ${
                        isActive(item.href)
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
        </div>
      </aside>
    </>
  );
}
