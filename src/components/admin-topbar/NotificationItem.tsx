// 'use client';

// import { MessageSquare, UserPlus, CheckCircle, XCircle } from 'lucide-react';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// export interface Notification {
//   id: string;
//   user: { name: string; avatar?: string; initials: string };
//   message: string;
//   timestamp: string;
//   isRead?: boolean;
//   type: 'follow' | 'approved' | 'rejected' | 'conversation' | 'user-registered';
// }

// export function NotificationItem({
//   notification,
// }: {
//   notification: Notification;
// }) {
//   const iconMap = {
//     follow: <UserPlus className="w-3 h-3 text-blue-500" />,
//     approved: <CheckCircle className="w-3 h-3 text-green-500" />,
//     rejected: <XCircle className="w-3 h-3 text-red-500" />,
//     conversation: <MessageSquare className="w-3 h-3 text-purple-500" />,
//     'user-registered': <CheckCircle className="w-3 h-3 text-teal-500" />,
//   };

//   return (
//     <div
//       className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition font-[manrope] ${
//         notification.isRead
//           ? 'bg-white hover:bg-gray-50'
//           : 'bg-blue-50 hover:bg-blue-100'
//       }`}
//     >
//       <div className="relative">
//         <Avatar className="w-10 h-10">
//           <AvatarImage
//             src={notification.user.avatar || '/images/dashboard/message/doctor.png'}
//             alt={notification.user.name}
//           />
//           <AvatarFallback className="text-xs font-medium">
//             {notification.user.initials}
//           </AvatarFallback>
//         </Avatar>

//         <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow">
//           {iconMap[notification.type]}
//         </span>
//       </div>

//       <div className="flex-1 min-w-0">
//         <p className="text-sm font-semibold text-gray-900">
//           <span className='text-semibold text-yellow-500'>{notification.user.name}</span> sent you a message
//         </p>
//         <p className="text-xs text-gray-600">{notification.message}</p>
//       </div>

//       <span className="text-xs text-gray-400 whitespace-nowrap">
//         {new Date(notification.timestamp).toLocaleString()}
//       </span>
//     </div>
//   );
// }

'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useDispatch } from 'react-redux';

import { cn } from '@/lib/utils';
import { AppNotification, markAsRead } from '@/store/NotificationSlice';

// ─── Type badge config ────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  AppNotification['type'],
  { label: string; className: string }
> = {
  approved: { label: 'Approved', className: 'bg-emerald-100 text-emerald-700' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-600' },
  follow: { label: 'Follow', className: 'bg-blue-100 text-blue-700' },
  conversation: {
    label: 'Message',
    className: 'bg-violet-100 text-violet-700',
  },
  'user-registered': {
    label: 'New User',
    className: 'bg-amber-100 text-amber-700',
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  notification: AppNotification;
  onDelete: (id: string) => void;
  onClick?: (notification: AppNotification) => void;
}

export function NotificationItem({ notification, onDelete, onClick }: Props) {
  const dispatch = useDispatch();
  const config = TYPE_CONFIG[notification.type] ?? TYPE_CONFIG.conversation;

  const isClickable = notification.type === 'conversation';

  const handleClick = () => {
    if (!notification.isRead) {
      dispatch(markAsRead(notification.id));
    }

    if (isClickable) {
      onClick?.(notification);
    }
  };

  const timeAgo = (() => {
    try {
      return formatDistanceToNow(new Date(notification.timestamp), {
        addSuffix: true,
      });
    } catch {
      return '';
    }
  })();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
      className={cn(
        'group relative flex gap-3 items-start rounded-xl px-3 py-2.5 cursor-pointer',
        'transition-all duration-150 border',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400',
        notification.isRead
          ? 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-100'
          : 'bg-teal-50/60 border-teal-100 hover:bg-teal-50',
        notification.isNew && 'animate-fade-in',
      )}
    >
      {/* Avatar */}
      <div className="relative shrink-0 mt-0.5">
        <Image
          src={notification.user.avatar || '/images/footer_logo.png'}
          width={38}
          height={38}
          alt={notification.user.name}
          className="rounded-full object-cover aspect-square ring-1 ring-gray-200"
          unoptimized
        />
        {/* Unread dot */}
        {!notification.isRead && (
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-teal-500 ring-2 ring-white" />
        )}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0 pr-6">
        <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
          <span className="text-sm font-semibold text-gray-800 truncate">
            {notification.user.name}
          </span>
          <span
            className={cn(
              'text-[10px] font-semibold px-1.5 py-0.5 rounded-full',
              config.className,
            )}
          >
            {config.label}
          </span>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
          {notification.message}
        </p>

        <p className="text-[11px] text-gray-400 mt-1">{timeAgo}</p>
      </div>

      {/* Delete button — visible on hover */}
      <button
        aria-label="Delete notification"
        onClick={e => {
          e.stopPropagation();
          onDelete(notification.id);
        }}
        className={cn(
          'absolute top-2.5 right-2.5 p-1 rounded-md',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-150',
          'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
        )}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
