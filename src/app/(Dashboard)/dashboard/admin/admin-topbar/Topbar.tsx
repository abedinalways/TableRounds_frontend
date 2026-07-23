

'use client';

import Image from 'next/image';
import { Menu } from 'lucide-react';
import Link from 'next/link';

import { useMeQuery } from '@/app/redux/api/authApi';
import { useAppSelector } from '@/app/redux/hook';
import { useGetAdminNotificationsQuery } from '@/app/redux/api/notificationApi';
import { NotificationButton } from '@/components/admin-topbar/NotificationButton';

interface TopbarProps {
  onMenuClick?: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps = {}) {
  // Load once; new notifications are delivered through the shared socket.
  useGetAdminNotificationsQuery();

  const { data: user } = useMeQuery();
  const role = useAppSelector(state => state.auth.auth.role) || user?.type;

  const profileLink =
    role === 'admin'
      ? '/dashboard/admin/manage-settings'
      : '/dashboard/user/my-profile';

  const avatarBase = user?.avatar
    ? user.avatar.startsWith('http')
      ? user.avatar
      : `${process.env.NEXT_PUBLIC_API_ENDPOINT}/${user.avatar}`
    : '/images/dashboard/doctor.png';

  
  const avatar = user?.avatar
    ? user.avatar.startsWith('http')
      ? user.avatar
      : `${process.env.NEXT_PUBLIC_API_ENDPOINT}/${user.avatar}`
    : '/images/dashboard/doctor.png';

  return (
    <header className="sticky top-0 z-1000 bg-white border-b flex items-center justify-between gap-3 px-4 sm:px-6 h-15 font-[manrope]">
      {onMenuClick && (
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
      )}

      <div className="flex items-center gap-3 ml-auto">
        <NotificationButton role="admin" />

        <Link
          href={profileLink}
          className="cursor-pointer flex gap-2 items-center"
        >
          <Image
            key={avatar}
            src={avatar}
            width={32}
            height={32}
            alt="profile"
            className="rounded-full aspect-square object-cover"
            unoptimized
          />
          <span className="hidden sm:block font-semibold text-gray-700 font-[manrope]">
            {user?.name}{' '}
            <span className="text-green-900 font-semibold ">
              {role === 'admin' ? 'Admin' : `${user?.credentials}`}
            </span>
          </span>
        </Link>
      </div>
    </header>
  );
}
