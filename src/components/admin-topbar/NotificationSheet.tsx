

'use client';

import { useCallback } from 'react';
import { BellOff, CheckCheck, Trash2, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { RootState, type AppDispatch } from '../../app/redux/store';
import {
  markAllAsRead,
  markAsRead,
  clearNewFlag,
  clearNotifications, // ✅ used for optimistic clear
  addNotification, // ✅ used for rollback
  type AppNotification,
} from '../../store/NotificationSlice';
import {
  useDeleteUserNotificationMutation,
  useDeleteAllUserNotificationsMutation,
  useDeleteAdminNotificationMutation,
  useDeleteAllAdminNotificationsMutation,
} from '../../app/redux/api/notificationApi';
import { chatApi, type Conversation } from '../../app/redux/api/chat/chatApi';
import { store } from '../../app/redux/store';
import { NotificationItem } from './NotificationItem';
import { cn } from '@/lib/utils';

function getDashboardMessagePath(currentPathname: string, role: string, conversationId: string) {
  const segments = currentPathname.split('/').filter(Boolean);
  const dashboardIndex = segments.indexOf('dashboard');
  const detectedRole =
    dashboardIndex !== -1 && segments[dashboardIndex + 1]
      ? segments[dashboardIndex + 1]
      : role;

  // Admin uses "support-message" path, user uses "messages" path
  const messageSegment = detectedRole === 'admin' ? 'support-message' : 'messages';

  return `/dashboard/${detectedRole}/${messageSegment}/${conversationId}`;
}

interface Props {
  open: boolean;
  onClose: () => void;

  role?: 'admin' | 'user';
}

export function NotificationSheet({ open, onClose, role = 'user' }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();

  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications,
  );
  const unreadCount = useSelector(
    (state: RootState) => state.notifications.unreadCount,
  );

  // ── Mutations ──────────────────────────────────────────────────────────────
  const [deleteUserNotification, { isLoading: deletingUser }] =
    useDeleteUserNotificationMutation();
  const [deleteAdminNotification, { isLoading: deletingAdmin }] =
    useDeleteAdminNotificationMutation();
  const [deleteAllUser, { isLoading: clearingUser }] =
    useDeleteAllUserNotificationsMutation();
  const [deleteAllAdmin, { isLoading: clearingAdmin }] =
    useDeleteAllAdminNotificationsMutation();

  const isDeleting = deletingUser || deletingAdmin;
  const isClearing = clearingUser || clearingAdmin;

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleDelete = useCallback(
    (id: string) => {
      if (role === 'admin') {
        deleteAdminNotification(id);
      } else {
        deleteUserNotification(id);
      }
    },
    [role, deleteAdminNotification, deleteUserNotification],
  );

  const handleNotificationClick = useCallback(
    async (notification: AppNotification) => {
      if (notification.type !== 'conversation') return;

      let convId = notification.conversationId;

      // If notification doesn't have conversationId, try to find it
      // from the conversations cache by matching the sender
      if (!convId) {
        try {
          const state = store.getState() as RootState;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const queryResult = (chatApi.endpoints.getConversations.select as any)(state);
          const conversationsData = queryResult?.data;
          const conversations = Array.isArray(conversationsData?.data)
            ? conversationsData.data
            : conversationsData || [];
          const me = state.auth?.user;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const matchedConv = conversations.find((c: any) => {
            const otherUser =
              c.creator_id === me?.id ? c.participant : c.creator;
            if (notification.senderId && otherUser?.id) {
              return otherUser.id === notification.senderId;
            }
            return otherUser?.name === notification.user?.name;
          });

          if (matchedConv) {
            convId = matchedConv.id;
          }
        } catch {
          // Silently fail if we can't find the conversation
        }
      }

      // If still no convId, try to fetch conversations from API
      if (!convId) {
        try {
          const result = await dispatch(
            chatApi.endpoints.getConversations.initiate(undefined, { forceRefetch: true }),
          ).unwrap();
          
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const apiResponse = result as any;
          const conversations = Array.isArray(apiResponse?.data)
            ? apiResponse.data
            : apiResponse?.data?.data || [];
          const state = store.getState() as RootState;
          const me = state.auth?.user;

          const matchedConv = conversations.find((c: Conversation) => {
            const otherUser =
              c.creator_id === me?.id ? c.participant : c.creator;
            if (notification.senderId && otherUser?.id) {
              return otherUser.id === notification.senderId;
            }
            return otherUser?.name === notification.user?.name;
          });

          if (matchedConv) {
            convId = matchedConv.id;
          }
        } catch {
          // Silently fail if we can't fetch conversations
        }
      }

      if (!convId) {
        toast.error('Could not find conversation. Please try again.');
        return;
      }

      dispatch(markAsRead(notification.id));
      dispatch(clearNewFlag(notification.id));

      const messagePath = getDashboardMessagePath(
        pathname,
        role,
        convId,
      );

      const finalPath = notification.messageId
        ? `${messagePath}?messageId=${notification.messageId}`
        : messagePath;

      onClose();
      router.push(finalPath);
    },
    [dispatch, onClose, pathname, router, role],
  );

  const handleClearAll = useCallback(async () => {
    // ✅ Snapshot current list for rollback
    const snapshot = [...notifications];

    // ✅ Optimistic clear — UI empties immediately
    dispatch(clearNotifications());

    try {
      // ✅ Calls the correct endpoint based on role
      if (role === 'admin') {
        await deleteAllAdmin().unwrap();
      } else {
        await deleteAllUser().unwrap();
      }
    } catch {
      // ✅ Rollback: restore the snapshot if the API call failed
      snapshot.forEach(n => dispatch(addNotification(n)));
      toast.error('Failed to clear notifications. Please try again.');
    }
  }, [role, notifications, dispatch, deleteAllAdmin, deleteAllUser]);

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
                  onClick={handleNotificationClick}
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