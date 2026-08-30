// UserAvatarDropdown.tsx (desktop)
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { CurrentUser } from './navbar.types';

interface UserAvatarDropdownProps {
  currentUser: CurrentUser;
  isLoggingOut: boolean;
  onLogout: () => void;
}

export default function UserAvatarDropdown({
  currentUser,
  isLoggingOut,
  onLogout,
}: UserAvatarDropdownProps) {
  const initials = currentUser.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 focus:outline-none group">
          <div className="w-9 h-9 rounded-full bg-[#B79E6B] flex items-center justify-center text-white text-sm font-semibold overflow-hidden border-2 border-[#B79E6B]/50 group-hover:border-[#B79E6B] transition-all">
            {currentUser.avatar ? (
              <Image
                src={currentUser.avatar}
                alt={currentUser.name || ''}
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{initials || 'U'}</span>
            )}
          </div>
          <span className="text-white text-sm font-medium max-w-[120px] truncate hidden xl:block">
            {currentUser.name}
          </span>
          <ChevronDown className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="bg-white z-[999] font-[manrope] w-56"
        sideOffset={8}
        align="end"
      >
        <DropdownMenuLabel className="truncate">
          {currentUser.name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={
              currentUser.type === 'admin'
                ? '/dashboard/admin'
                : '/dashboard/user'
            }
            className="cursor-pointer"
          >
            <User className="w-4 h-4 mr-2" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onLogout}
          disabled={isLoggingOut}
          className="text-red-600 cursor-pointer focus:text-red-600"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
