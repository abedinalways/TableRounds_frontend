'use client';

import Image from 'next/image';
import { Menu } from 'lucide-react';
import { getUser } from '@/lib/auth';
import Link from 'next/link';

interface TopbarProps {
  onMenuClick?: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps = {}) {
  const user = getUser();

  return (
    <header className="sticky top-0 z-30 bg-white border-b flex items-center justify-between gap-3 px-4 sm:px-6 py-3">
      {/* Mobile Menu Button */}
      {onMenuClick && (
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
      )}

      {/* Right side items */}
      <div className="flex items-center gap-3 ml-auto">
        <Image
          src="/images/dashboard/topbar/bell.png"
          width={20}
          height={20}
          alt=""
          className="cursor-pointer"
        />
        <Image
          src="/images/dashboard/topbar/message.png"
          width={20}
          height={20}
          alt=""
          className="cursor-pointer"
        />
        <Link href='/dashboard/profile'>
          <Image
            src="/images/dashboard/topbar/doctor.png"
            width={36}
            height={36}
            alt=""
            className="rounded-full cursor-pointer"
          />
        </Link>
        <span className="hidden sm:block font-semibold text-gray-700">
          Dr. {user?.name}
        </span>
      </div>
    </header>
  );
}
