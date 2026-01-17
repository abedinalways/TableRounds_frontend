'use client';

import { Bell } from 'lucide-react';
import { useState } from 'react';
import { NotificationSheet } from './NotificationSheet';

export function NotificationButton() {
  const [open, setOpen] = useState(false);
  const unreadCount = 2;

  return (
    <>
      <button onClick={() => setOpen(true)} className="relative cursor-pointer">
        <Bell className="w-5 h-5 text-gray-700" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <NotificationSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}
