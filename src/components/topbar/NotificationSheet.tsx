'use client';

import { X, ArrowRight } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Notification, NotificationItem } from './NotificationItem';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function NotificationSheet({ open, onClose }: Props) {
  const notifications: Notification[] = [
    {
      id: '1',
      user: {
        name: 'Carl Steadham',
        initials: 'CS',
        avatar: '/images/dashboard/notification/doc-06.png',
      },
      message: 'Followed you',
      timestamp: '5 min ago',
      type: 'follow',
    },
    {
      id: '2',
      user: {
        name: 'Carl Steadham',
        initials: 'CS',
        avatar: '/images/dashboard/notification/doc-01.png',
      },
      message: 'Sent you a message',
      timestamp: '10 min ago',
      type: 'message',
    },
    {
      id: '3',
      user: {
        name: 'Carl Steadham',
        initials: 'CS',
        avatar: '/images/dashboard/notification/doc-01.png',
      },
      message: 'Sent you a message',
      timestamp: '10 min ago',
      type: 'message',
    },
    {
      id: '4',
      user: {
        name: 'Carl Steadham',
        initials: 'CS',
        avatar: '/images/dashboard/notification/doc-01.png',
      },
      message: 'Sent you a message',
      timestamp: '10 min ago',
      type: 'message',
    },
    {
      id: '5',
      user: {
        name: 'Carl Steadham',
        initials: 'CS',
        avatar: '/images/dashboard/notification/doc-06.png',
      },
      message: 'Followed you',
      timestamp: '5 min ago',
      type: 'follow',
    },
    {
      id: '6',
      user: {
        name: 'Carl Steadham',
        initials: 'CS',
        avatar: '/images/dashboard/notification/doc-06.png',
      },
      message: 'Followed you',
      timestamp: '5 min ago',
      type: 'follow',
    },
    {
      id: '7',
      user: {
        name: 'Carl Steadham',
        initials: 'CS',
        avatar: '/images/dashboard/notification/doc-06.png',
      },
      message: 'Followed you',
      timestamp: '5 min ago',
      type: 'follow',
    },
  ];

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-96 p-0 z-100 ">
        {/* Header */}
        <SheetHeader className="p-4 border-b relative">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-base font-semibold">
              Notifications
            </SheetTitle>

            <Button size="icon" variant="ghost" onClick={onClose} className='absolute top-15 right-2 z-2000 cursor-pointer'>
              <X className="w-4 h-4 " />
            </Button>
          </div>
        </SheetHeader>

        {/* Content */}
        <ScrollArea className="h-[calc(100vh-8rem)] p-3">
          <div className="space-y-1">
            {notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t p-3">
          <Button
            variant="ghost"
            className="w-full text-teal-600 hover:bg-teal-50 cursor-pointer"
          >
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
