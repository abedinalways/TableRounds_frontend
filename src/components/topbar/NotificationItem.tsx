// 'use client';

// import { Button } from '@/components/ui/button';
// import { XCircle } from 'lucide-react';
// import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
// import { AppNotification } from '../../store/NotificationSlice';
// import Image from 'next/image';
// function getActionText(type: AppNotification['type']): string {
//   switch (type) {
//     case 'follow':
//       return 'followed you';
//     case 'approved':
//       return 'approved your request';
//     case 'rejected':
//       return 'rejected your request';
//     case 'conversation':
//       return 'sent you a message';
//     case 'user-registered':
//       return 'joined the platform';
//     default:
//       return 'sent you a notification';
//   }
// }
// export function NotificationItem({
//   notification,
//   onDelete,
// }: {
//   notification: AppNotification;
//   onDelete: (id: string) => void;
//   }) {

//   const handleDelete = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     onDelete(notification.id);
//   };

//   // console.log(notification, "llllllllllllll===========sfcsssssssssss")

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
//             src={notification.user.avatar || '/images/navbar-logo.png'}
//             alt={notification.user.name}
//           />
//           <AvatarFallback className="text-xs font-medium">
//             <Image
//               src={'/images/navbar-logo.png'}
//               width={32}
//               height={32}
//               alt="profile"
//               className="rounded-full aspect-square object-cover"
//               unoptimized
//             />
//           </AvatarFallback>
//         </Avatar>
//       </div>

//       <div className="flex-1 min-w-0">
//         <p className="text-sm font-semibold text-gray-900">
//           <span className="font-semibold text-yellow-500">
//             {notification.user.name}
//           </span>{' '}
//           {getActionText(notification.type)}
//         </p>
//         <p className="text-xs text-gray-600 mt-0.5 truncate">
//           {notification.message}
//         </p>
//       </div>

//       <div className="flex flex-col items-end gap-1 shrink-0">
//         <span className="text-xs text-gray-400 whitespace-nowrap">
//           {new Date(notification.timestamp).toLocaleTimeString([], {
//             hour: '2-digit',
//             minute: '2-digit',
//           })}
//         </span>
//         <Button
//           size="icon"
//           variant="ghost"
//           onClick={handleDelete}
//           className="h-6 w-6 text-gray-400 hover:text-red-500 hover:bg-red-50"
//         >
//           <XCircle className="w-4 h-4" />
//         </Button>
//       </div>
//     </div>
//   );
// }

'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import type { AppNotification } from '../../store/NotificationSlice';

function getActionText(type: AppNotification['type']): string {
  switch (type) {
    case 'follow':
      return 'followed you';
    case 'approved':
      return 'approved your request';
    case 'rejected':
      return 'rejected your request';
    case 'conversation':
      return 'sent you a message';
    case 'user-registered':
      return 'joined the platform';
    default:
      return 'sent you a notification';
  }
}

interface Props {
  notification: AppNotification;
  onDelete: (id: string) => void;
  onClick?: (notification: AppNotification) => void;
}

export function NotificationItem({ notification, onDelete, onClick }: Props) {
  const isClickable = notification.type === 'conversation';

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onDelete(notification.id);
  };

  const handleClick = () => {
    if (!isClickable) return;
    onClick?.(notification);
  };

  return (
    <div
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : -1}
      onClick={handleClick}
      onKeyDown={event => {
        if (!isClickable) return;

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick?.(notification);
        }
      }}
      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition font-[manrope] ${
        notification.isRead
          ? 'bg-white hover:bg-gray-50'
          : 'bg-blue-50 hover:bg-blue-100'
      }`}
    >
      <div className="relative">
        <Avatar className="w-10 h-10">
          <AvatarImage
            src={notification.user.avatar || '/images/navbar-logo.png'}
            alt={notification.user.name}
          />

          <AvatarFallback className="text-xs font-medium">
            <Image
              src="/images/navbar-logo.png"
              width={32}
              height={32}
              alt="profile"
              className="rounded-full aspect-square object-cover shrink-0"
              unoptimized
            />
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">
          <span className="font-semibold text-yellow-500">
            {notification.user.name}
          </span>{' '}
          {getActionText(notification.type)}
        </p>

        <p className="text-xs text-gray-600 mt-0.5 truncate">
          {notification.message}
        </p>

        {isClickable && (
          <p className="text-xs font-medium text-blue-600 mt-1">
            Open conversation
          </p>
        )}
      </div>

      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-xs text-gray-400 whitespace-nowrap">
          {new Date(notification.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>

        <Button
          size="icon"
          variant="ghost"
          onClick={handleDelete}
          className="h-6 w-6 text-gray-400 hover:text-red-500 hover:bg-red-50"
        >
          <XCircle className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}