// MobileUserPanel.tsx
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import Btn from '../reusable/button/Btn';
import type { CurrentUser } from './navbar.types';

interface MobileUserPanelProps {
  currentUser: CurrentUser;
  isLoggingOut: boolean;
  onLogout: () => void;
  onNavigate: () => void;
}

export default function MobileUserPanel({
  currentUser,
  isLoggingOut,
  onLogout,
  onNavigate,
}: MobileUserPanelProps) {
  const initials = currentUser.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-white/5">
        <div className="w-10 h-10 rounded-full bg-[#B79E6B] flex items-center justify-center text-white text-sm font-semibold overflow-hidden">
          {currentUser.avatar ? (
            <Image
              src={currentUser.avatar}
              alt={currentUser.name || ''}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{initials || 'U'}</span>
          )}
        </div>
        <div className="text-left">
          <p className="text-white text-sm font-semibold truncate max-w-[180px]">
            {currentUser.name}
          </p>
          <p className="text-white/60 text-xs truncate max-w-[180px]">
            {currentUser.email}
          </p>
        </div>
      </div>
      <Link
        href={
          currentUser.type === 'admin' ? '/dashboard/admin' : '/dashboard/user'
        }
        onClick={onNavigate}
      >
        <Btn
          text="Dashboard"
          className="bg-[#B79E6B] text-white w-full h-[54px] hover:bg-[#a08c5f] transition-colors"
        />
      </Link>
      <button
        onClick={onLogout}
        disabled={isLoggingOut}
        className="bg-white/10 text-white w-full h-[54px] rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2 cursor-pointer font-medium"
      >
        <LogOut className="w-4 h-4" />
        {isLoggingOut ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );
}
