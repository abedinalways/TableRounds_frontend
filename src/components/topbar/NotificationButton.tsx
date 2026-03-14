'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { NotificationSheet } from './NotificationSheet';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/redux/store';

export function NotificationButton() {
  const [open, setOpen] = useState(false);

  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications,
  );

  const unreadCount = notifications.filter(item => !item.isRead).length;

  console.log('BUTTON NOTIFICATIONS:', notifications);

  return (
    <>
      <button onClick={() => setOpen(true)} className="relative cursor-pointer">
        <Bell className="w-5 h-5 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-5 h-5 px-1 rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <NotificationSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}
