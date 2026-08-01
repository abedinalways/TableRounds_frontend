
'use client';

import Image from 'next/image';
import { Menu } from 'lucide-react';
import Link from 'next/link';

import { NotificationButton } from '@/components/topbar/NotificationButton';
import { useMeQuery } from '@/app/redux/api/authApi';
import { useGetUserNotificationsQuery } from '@/app/redux/api/notificationApi';

import { useAppSelector } from '@/app/redux/hook';

interface TopbarProps {
  onMenuClick?: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps = {}) {
  // Load once; new notifications are delivered through the shared socket.
  useGetUserNotificationsQuery();

  const { data: user } = useMeQuery();

  // console.log(user, 'user data=====================++++++++++++++++');
  // console.log(
  //   user?.credentials,
  //   'credentials=====================++++++++++++++++',
  // );

  const role = useAppSelector(state => state.auth.auth.role) || user?.type;

  const getImageUrl = (path?: string) => {
    if (!path) return '/images/dashboard/doctor.png';
    if (path.startsWith('http')) return path;
    return `${process.env.NEXT_PUBLIC_API_ENDPOINT}/${path}`;
  };

  const avatar = getImageUrl(user?.avatar);

  const profileLink =
    role === 'admin'
      ? '/dashboard/admin/manage-settings'
      : '/dashboard/user/my-profile';

  return (
    <header className="sticky top-0 z-[1000] bg-white border-b flex items-center justify-between gap-3 px-4 sm:px-6 h-15">
      {onMenuClick && (
        <button
          onClick={onMenuClick}
          className="xl:hidden p-2 hover:bg-gray-100 rounded-md"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
      )}

      <div className="flex items-center gap-3 ml-auto">
        <NotificationButton />

        <Link
          href={profileLink}
          className="cursor-pointer flex gap-2 items-center"
        >
          <Image
            src={avatar}
            width={32}
            height={32}
            alt="profile"
            className="rounded-full aspect-square object-cover"
            unoptimized
          />

          <span className="hidden sm:block font-semibold text-gray-700 font-[manrope]">
            {user?.name}{' '}
            <span className="text-green-900 font-semibold uppercase">
              {role === 'admin' ? 'Admin' : `${user?.credentials ?? ''}`}
            </span>{' '}
          </span>
        </Link>
      </div>
    </header>
  );
}
