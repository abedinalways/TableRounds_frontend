'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { adminMenu, userMenu, MenuItem } from './sidebarItems';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import OmsLogo from '@/components/reusable/icons/OmsLogo';
import Cookies from 'js-cookie';

import ResetBankModal from '@/components/reset-bank/ResetModal';


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
  const pathname = usePathname();
  const router = useRouter();

  const role = Cookies.get('role');
  const menu: MenuItem[] = role === 'admin' ? adminMenu : userMenu;

  const [openResetModal, setOpenResetModal] = useState(false);

  useEffect(() => {
    if (mobile && open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobile, open]);

  const normalizePath = (path: string) => path.replace(/\/+$/, '');

  const isActive = (href: string) => {
    const currentPath = normalizePath(pathname);
    const targetPath = normalizePath(href);

    if (targetPath === '/dashboard/user/messages') {
      return currentPath.startsWith('/dashboard/user/messages');
    }

    const exactMatchRoutes = ['/dashboard/admin', '/dashboard/user'];
    if (exactMatchRoutes.includes(targetPath)) {
      return currentPath === targetPath;
    }

    return currentPath.startsWith(targetPath);
  };

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('role');
    router.replace('/login');
  };

  const renderMenuItem = (item: MenuItem) => {
    // RESET BANK ACTION
    if (item.title === 'Reset Bank') {
      return (
        <button
          key={item.title}
          onClick={() => {
            setOpenResetModal(true);
            if (mobile) setOpen?.(false);
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-all cursor-pointer hover:bg-[#B79E6B] hover:text-white w-full text-left"
        >
          <Image src={item.icon} width={18} height={18} alt={item.title} />
          <span className="text-sm">{item.title}</span>
        </button>
      );
    }

    // LOGOUT
    if (item.title === 'Logout') {
      return (
        <button
          key={item.title}
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md transition-all cursor-pointer hover:bg-red-500 hover:text-white w-full text-left"
        >
          <Image src={item.icon} width={18} height={18} alt={item.title} />
          <span className="text-sm">{item.title}</span>
        </button>
      );
    }

    // NORMAL LINK
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => mobile && setOpen?.(false)}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all
          ${
            isActive(item.href)
              ? 'bg-[#B79E6B] text-white font-semibold'
              : 'hover:bg-[#B79E6B] hover:text-white'
          }`}
      >
        <Image src={item.icon} width={18} height={18} alt={item.title} />
        <span className="text-sm">{item.title}</span>
      </Link>
    );
  };

  /* ================= DESKTOP ================= */

  if (!mobile) {
    return (
      <>
        <aside className="w-55 background border-r flex flex-col text-white font-[manrope] overflow-y-auto min-h-screen">
          <div className="p-4">
            <Link href="/">
              <div className="flex items-center gap-2 mb-6">
                <Image
                  src="/images/navbar-logo.png"
                  width={40}
                  height={40}
                  alt="Logo"
                />
                <h1 className="relative font-bold text-lg sm:text-xl lg:text-3xl text-white font-[manrope] mb-4">
                  <div className="flex items-center justify-center gap-1">
                    Table
                    <OmsLogo />
                  </div>
                  <span className="absolute top-6">Rounds</span>
                </h1>
              </div>
            </Link>

            <nav className="flex flex-col gap-1">
              {menu.map(item => (
                <div key={item.href || item.title}>
                  {item.section && (
                    <p className="mt-4 mb-1 text-xs uppercase text-gray-300 font-semibold">
                      {item.section}
                    </p>
                  )}
                  {renderMenuItem(item)}
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* RESET BANK MODAL */}
        <ResetBankModal
          open={openResetModal}
          onClose={() => setOpenResetModal(false)}
          onConfirm={() => {
            console.log('Reset confirmed');
          }}
        />
      </>
    );
  }

  /* ================= MOBILE ================= */

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen?.(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-64 background border-r
        flex flex-col text-white z-50 md:hidden
        transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-lg">Menu</h2>
            <button onClick={() => setOpen?.(false)}>
              <X />
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {menu.map(item => (
              <div key={item.href || item.title}>{renderMenuItem(item)}</div>
            ))}
          </nav>
        </div>
      </aside>

      {/* RESET BANK MODAL */}
      <ResetBankModal
        open={openResetModal}
        onClose={() => setOpenResetModal(false)}
        onConfirm={() => {
          console.log('Reset confirmed');
        }}
      />
    </>
  );
}
