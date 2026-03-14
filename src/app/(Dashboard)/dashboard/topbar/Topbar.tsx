'use client';

import Image from 'next/image';
import { Menu } from 'lucide-react';
import { NotificationButton } from '@/components/topbar/NotificationButton';
import { useMeQuery } from '@/app/redux/api/authApi';
import { useNotificationSocket } from '@/app/socket/useNotificationSocket';
import { useGetUserNotificationsQuery } from '@/app/redux/api/notificationApi';
import { useChatSocket } from '@/app/redux/api/chat/useChatSocket';

interface TopbarProps {
  onMenuClick?: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps = {}) {
  // 
  useChatSocket();
  useGetUserNotificationsQuery();

  const { data: user } = useMeQuery();
  console.log(user, 'user data=====================')

  console.log('TOPBAR USER:', user);

  return (
    <header className="sticky top-0 z-1000 bg-white border-b flex items-center justify-between gap-3 px-4 sm:px-6 h-15">
      {onMenuClick && (
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
      )}

      <div className="flex items-center gap-3 ml-auto">
        <NotificationButton />
        <Image
          src={user?.avatar || '/images/dashboard/Admin/admin.png'}
          width={36}
          height={36}
          alt=""
          className="rounded-full"
        />
        <span className="hidden sm:block font-semibold text-gray-700">
           Dr. {user?.name}
        </span>
      </div>
    </header>
  );
}
