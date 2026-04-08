'use client';

import { MessageSquare, UserPlus, CheckCircle, XCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface Notification {
  id: string;
  user: { name: string; avatar?: string; initials: string };
  message: string;
  timestamp: string;
  isRead?: boolean;
  type: 'follow' | 'approved' | 'rejected' | 'conversation' | 'user-registered';
}

export function NotificationItem({
  notification,
}: {
  notification: Notification;
}) {
  const iconMap = {
    follow: <UserPlus className="w-3 h-3 text-blue-500" />,
    approved: <CheckCircle className="w-3 h-3 text-green-500" />,
    rejected: <XCircle className="w-3 h-3 text-red-500" />,
    conversation: <MessageSquare className="w-3 h-3 text-purple-500" />,
    'user-registered': <CheckCircle className="w-3 h-3 text-teal-500" />,
  };

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition font-[manrope] ${
        notification.isRead
          ? 'bg-white hover:bg-gray-50'
          : 'bg-blue-50 hover:bg-blue-100'
      }`}
    >
      <div className="relative">
        <Avatar className="w-10 h-10">
          <AvatarImage
            src={notification.user.avatar || '/images/dashboard/message/doctor.png'} 
            alt={notification.user.name}
          />
          <AvatarFallback className="text-xs font-medium">
            {notification.user.initials}
          </AvatarFallback>
        </Avatar>

        <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow">
          {iconMap[notification.type]}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">
          <span className='text-semibold text-yellow-500'>{notification.user.name}</span> sent you a message
        </p>
        <p className="text-xs text-gray-600">{notification.message}</p>
      </div>

      <span className="text-xs text-gray-400 whitespace-nowrap">
        {new Date(notification.timestamp).toLocaleString()}
      </span>
    </div>
  );
}
