// 'use client';

// import { useState } from 'react';
// import { Bell } from 'lucide-react';

// import { useSelector } from 'react-redux';
// import { RootState } from '../../app/redux/store';
// import { NotificationSheet } from './NotificationSheet';

// export function NotificationButton() {
//   const [open, setOpen] = useState(false);

//   const notifications = useSelector(
//     (state: RootState) => state.notifications.notifications,
//   );

//   const unreadCount = notifications.filter(item => !item.isRead).length;

//   console.log('BUTTON NOTIFICATIONS:', notifications);

//   return (
//     <>
//       <button onClick={() => setOpen(true)} className="relative cursor-pointer">
//         <Bell className="w-5 h-5 text-gray-700" />
//         {unreadCount > 0 && (
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-5 h-5 px-1 rounded-full flex items-center justify-center">
//             {unreadCount}
//           </span>
//         )}
//       </button>

//       <NotificationSheet open={open} onClose={() => setOpen(false)} />
//     </>
//   );
// }

'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/redux/store';
import { NotificationSheet } from './NotificationSheet';
import { cn } from '@/lib/utils';

interface Props {
  /** Pass 'admin' in the admin topbar, defaults to 'user'. */
  role?: 'admin' | 'user';
}

export function NotificationButton({ role = 'user' }: Props) {
  const [open, setOpen] = useState(false);

  const unreadCount = useSelector(
    (state: RootState) => state.notifications.unreadCount,
  );

  // True if any notification arrived via socket (has isNew flag)
  const hasNew = useSelector((state: RootState) =>
    state.notifications.notifications.some(n => n.isNew),
  );

  return (
    <>
      <button
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        onClick={() => setOpen(true)}
        className="relative cursor-pointer p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {/* Pulse ring — shown when there are unseen socket notifications */}
        {hasNew && (
          <span className="absolute inset-0 rounded-lg animate-ping bg-teal-400 opacity-30 pointer-events-none" />
        )}

        <Bell
          className={cn(
            'w-5 h-5 transition-colors',
            unreadCount > 0 ? 'text-teal-600' : 'text-gray-600',
          )}
        />

        {/* Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none ring-2 ring-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      <NotificationSheet
        open={open}
        role={role}
        onClose={() => setOpen(false)}
      />
    </>
  );
}