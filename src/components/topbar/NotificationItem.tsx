'use client';

import { MessageSquare, UserPlus, CheckCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface Notification {
  id: string;
  user: {
    name: string;
    avatar?: string;
    initials: string;
  };
  message: string;
  timestamp: string;
  type: 'follow' | 'message' | 'completion';
}

export function NotificationItem({
  notification,
}: {
  notification: Notification;
}) {
  const iconMap = {
    follow: <UserPlus className="w-3 h-3 text-blue-500" />,
    message: <MessageSquare className="w-3 h-3 text-purple-500" />,
    completion: <CheckCircle className="w-3 h-3 text-green-500" />,
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition font-[manrope]">
      {/* Avatar */}
      <div className="relative">
        <Avatar className="w-10 h-10">
          <AvatarImage
            src={notification.user.avatar}
            alt={notification.user.name}
          />
          <AvatarFallback className="text-xs font-medium">
            {notification.user.initials}
          </AvatarFallback>
        </Avatar>

        {/* Type icon */}
        <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow">
          {iconMap[notification.type]}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">
          {notification.user.name}
        </p>
        <p className="text-sm text-gray-600 truncate">{notification.message}</p>
      </div>

      {/* Time */}
      <span className="text-xs text-gray-400 whitespace-nowrap">
        {notification.timestamp}
      </span>
    </div>
  );
}
