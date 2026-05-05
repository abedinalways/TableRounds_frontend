
'use client';

import { useCallback } from 'react';
import { BellOff, CheckCheck, Trash2, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { RootState } from '../../app/redux/store';
import {
  markAllAsRead,
  clearNewFlag,
  clearNotifications,
  addNotification,
} from '../../store/NotificationSlice';
import {
  useDeleteUserNotificationMutation,
  useDeleteAllUserNotificationsMutation,
} from '../../app/redux/api/notificationApi';
import { NotificationItem } from './NotificationItem';
import { cn } from '@/lib/utils';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function NotificationSheet({ open, onClose }: Props) {
  const dispatch = useDispatch();

  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications,
  );
  const unreadCount = useSelector(
    (state: RootState) => state.notifications.unreadCount,
  );

  // ── Mutations ──────────────────────────────────────────────────────────────
  const [deleteUserNotification, { isLoading: isDeleting }] =
    useDeleteUserNotificationMutation();
  const [deleteAllUser, { isLoading: isClearing }] =
    useDeleteAllUserNotificationsMutation();

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleDelete = useCallback(
    (id: string) => {
      deleteUserNotification(id);
    },
    [deleteUserNotification],
  );

  const handleClearAll = useCallback(async () => {
    const snapshot = [...notifications];
    dispatch(clearNotifications());

    try {
      await deleteAllUser().unwrap();
    } catch {
      snapshot.forEach(n => dispatch(addNotification(n)));
      toast.error('Failed to clear notifications. Please try again.');
    }
  }, [notifications, dispatch, deleteAllUser]);

  const handleClose = useCallback(() => {
    dispatch(markAllAsRead());
    notifications.forEach(n => {
      if (n.isNew) dispatch(clearNewFlag(n.id));
    });
    onClose();
  }, [dispatch, notifications, onClose]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Sheet
      open={open}
      onOpenChange={value => {
        if (!value) handleClose();
      }}
    >
      <SheetContent
        side="right"
        className="w-full sm:w-[400px] p-0 z-[100] font-[manrope] flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="px-4 py-3 border-b bg-white shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <SheetTitle className="text-base font-semibold text-gray-900">
                Notifications
              </SheetTitle>
              {unreadCount > 0 && (
                <span className="text-xs font-semibold bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => dispatch(markAllAsRead())}
                  className="h-8 px-2 text-xs text-gray-500 hover:text-teal-600 gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </Button>
              )}
              <Button
                size="icon"
                variant="ghost"
                onClick={handleClose}
                className="h-8 w-8 text-gray-500 hover:text-gray-800"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </SheetHeader>

        {/* List */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-3 space-y-1">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                  <BellOff className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    All caught up!
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    No notifications at the moment.
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t px-3 py-2.5 shrink-0 bg-white">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              disabled={isDeleting || isClearing}
              className={cn(
                'w-full text-xs gap-1.5 text-red-500 hover:text-red-600 hover:bg-red-50',
                (isDeleting || isClearing) && 'opacity-50 cursor-not-allowed',
              )}
            >
              <Trash2 className="w-3.5 h-3.5" />
              {isClearing ? 'Clearing…' : 'Clear all notifications'}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}