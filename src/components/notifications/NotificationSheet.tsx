'use client';

import { useCallback, useState } from 'react';
import { BellOff, CheckCheck, Trash2, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { usePathname, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { RootState, type AppDispatch } from '../../app/redux/store';
import {
  markAllAsRead,
  markAsRead,
  clearNewFlag,
  clearNotifications,
  addNotification,
  removeNotification,
  type AppNotification,
} from '../../store/NotificationSlice';
import {
  useGetUserNotificationsQuery,
  useGetAdminNotificationsQuery,
  useDeleteUserNotificationMutation,
  useDeleteAllUserNotificationsMutation,
  useDeleteAdminNotificationMutation,
  useDeleteAllAdminNotificationsMutation,
} from '../../app/redux/api/notificationApi';
import { chatApi, type Conversation } from '../../app/redux/api/chat/chatApi';
import { store } from '../../app/redux/store';
import { NotificationItem } from './NotificationItem';
import DeleteNotificationModal from './DeleteNotificationModal';
import { cn } from '@/lib/utils';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getDashboardMessagePath(
  currentPathname: string,
  role: 'admin' | 'user',
  conversationId: string,
) {
  const segments = currentPathname.split('/').filter(Boolean);
  const dashboardIndex = segments.indexOf('dashboard');
  const detectedRole =
    dashboardIndex !== -1 && segments[dashboardIndex + 1]
      ? segments[dashboardIndex + 1]
      : role;

  // Admin uses "support-message" path, user uses "messages" path
  const messageSegment =
    detectedRole === 'admin' ? 'support-message' : 'messages';

  return `/dashboard/${detectedRole}/${messageSegment}/${conversationId}`;
}

/**
 * Resolve the conversation id for a message notification:
 * 1. Use the id carried by the notification (socket notifications always have it)
 * 2. Try matching the sender against the RTK Query conversations cache
 * 3. Refetch conversations from the API and try again
 */
async function resolveConversationId(
  dispatch: AppDispatch,
  notification: AppNotification,
): Promise<string | null> {
  if (notification.conversationId) return notification.conversationId;

  const findMatch = (conversations: Conversation[]) => {
    const me = (store.getState() as RootState).auth?.user;
    return conversations.find((c: Conversation) => {
      const otherUser = c.creator_id === me?.id ? c.participant : c.creator;
      if (notification.senderId && otherUser?.id) {
        return otherUser.id === notification.senderId;
      }
      return otherUser?.name === notification.user?.name;
    });
  };

  // 2) Try the RTK Query conversations cache
  try {
    const state = store.getState() as RootState;
    const queryResult = chatApi.endpoints.getConversations.select()(state);
    const data = queryResult?.data as unknown;

    const conversations: Conversation[] = Array.isArray(
      (data as { data?: Conversation[] })?.data,
    )
      ? (data as { data: Conversation[] }).data
      : Array.isArray(data)
        ? (data as Conversation[])
        : [];

    const matched = findMatch(conversations);
    if (matched) return matched.id;
  } catch {
    // ignore cache errors
  }

  // 3) Fetch fresh conversations from the API
  try {
    const result = await dispatch(
      chatApi.endpoints.getConversations.initiate(undefined, {
        forceRefetch: true,
      }),
    ).unwrap();

    const apiResponse = result as unknown as {
      data?: Conversation[] | { data: Conversation[] };
    };

    const conversations: Conversation[] = Array.isArray(apiResponse?.data)
      ? apiResponse.data
      : apiResponse?.data?.data || [];

    const matched = findMatch(conversations);
    if (matched) return matched.id;
  } catch {
    // ignore fetch errors
  }

  return null;
}

/** Group a (roughly newest-first) notification list into Today/Yesterday/Earlier. */
function groupNotificationsByDay(items: AppNotification[]) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const groups: { label: string; items: AppNotification[] }[] = [];

  for (const notification of items) {
    const date = new Date(notification.timestamp);
    let label = 'Earlier';
    if (!Number.isNaN(date.getTime())) {
      if (date.toDateString() === today.toDateString()) label = 'Today';
      else if (date.toDateString() === yesterday.toDateString())
        label = 'Yesterday';
    }

    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.label === label) {
      lastGroup.items.push(notification);
    } else {
      groups.push({ label, items: [notification] });
    }
  }

  return groups;
}

// ─── Component ────────────────────────────────────────────────────────────────

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

  // Loading state for the list (first fetch while the sheet is open).
  // Hooks are subscribed with skip so each role only touches its own endpoint.
  const userNotificationsQuery = useGetUserNotificationsQuery(undefined, {
    skip: role !== 'user',
  });
  const adminNotificationsQuery = useGetAdminNotificationsQuery(undefined, {
    skip: role !== 'admin',
  });
  const isLoadingList =
    role === 'admin'
      ? adminNotificationsQuery.isLoading
      : userNotificationsQuery.isLoading;

  // ── Mutations ──────────────────────────────────────────────────────────────
  const [deleteUserNotification] = useDeleteUserNotificationMutation();
  const [deleteAdminNotification] = useDeleteAdminNotificationMutation();
  const [deleteAllUser] = useDeleteAllUserNotificationsMutation();
  const [deleteAllAdmin] = useDeleteAllAdminNotificationsMutation();

  // ── Delete confirmation state ──────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<AppNotification | null>(
    null,
  );
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ── Click → route by notification type ─────────────────────────────────────
  const handleNotificationClick = useCallback(
    async (notification: AppNotification) => {
      dispatch(markAsRead(notification.id));
      dispatch(clearNewFlag(notification.id));

      // Message notifications → open the conversation (and jump to the message)
      if (notification.type === 'conversation') {
        const convId = await resolveConversationId(dispatch, notification);

        if (!convId) {
          toast.error('Could not find the conversation. Please try again.');
          return;
        }

        const messagePath = getDashboardMessagePath(pathname, role, convId);
        const finalPath = notification.messageId
          ? `${messagePath}?messageId=${notification.messageId}`
          : messagePath;

        onClose();
        router.push(finalPath);
        return;
      }

      // New user registrations (admin) → pending users tab
      if (notification.type === 'user-registered' && role === 'admin') {
        onClose();
        router.push('/dashboard/admin/show-users?tab=pending');
        return;
      }

      // Follow → the sender's profile
      if (notification.type === 'follow' && notification.senderId) {
        const profilePath =
          role === 'admin'
            ? `/dashboard/admin/user-profile/${notification.senderId}`
            : `/dashboard/user/profile/${notification.senderId}`;

        onClose();
        router.push(profilePath);
        return;
      }

      // Approval events (user) → their profile
      if (
        (notification.type === 'approved' ||
          notification.type === 'rejected') &&
        role === 'user'
      ) {
        onClose();
        router.push('/dashboard/user/my-profile');
      }
    },
    [dispatch, onClose, pathname, role, router],
  );

  // ── Confirm-delete (single notification) ───────────────────────────────────
  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return;

    const target = deleteTarget;
    setDeleting(true);
    setDeletingId(target.id);

    // Optimistic removal — the UI updates instantly (fixes the "hang")
    dispatch(removeNotification(target.id));

    try {
      // temp_ ids are optimistic socket entries — they have no server
      // record of their own yet, so there is nothing to delete on the backend.
      if (!target.id.startsWith('temp_')) {
        if (role === 'admin') {
          await deleteAdminNotification(target.id).unwrap();
        } else {
          await deleteUserNotification(target.id).unwrap();
        }
      }
    } catch {
      // Rollback on failure
      dispatch(addNotification(target));
      toast.error('Failed to delete notification. Please try again.');
    } finally {
      setDeleting(false);
      setDeletingId(null);
      setDeleteTarget(null);
    }
  }, [
    deleteTarget,
    dispatch,
    role,
    deleteAdminNotification,
    deleteUserNotification,
  ]);

  // ── Confirm-clear-all ──────────────────────────────────────────────────────
  const handleConfirmClearAll = useCallback(async () => {
    const snapshot = [...notifications];

    setDeleting(true);
    // Optimistic clear — UI empties immediately
    dispatch(clearNotifications());

    try {
      if (role === 'admin') {
        await deleteAllAdmin().unwrap();
      } else {
        await deleteAllUser().unwrap();
      }
    } catch {
      snapshot.forEach(n => dispatch(addNotification(n)));
      toast.error('Failed to clear notifications. Please try again.');
    } finally {
      setDeleting(false);
      setConfirmClearAll(false);
    }
  }, [notifications, dispatch, role, deleteAllAdmin, deleteAllUser]);

  const handleClose = useCallback(() => {
    dispatch(markAllAsRead());

    notifications.forEach(n => {
      if (n.isNew) dispatch(clearNewFlag(n.id));
    });

    onClose();
  }, [dispatch, notifications, onClose]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
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

          {/* List — grouped by day */}
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-3 space-y-1">
              {isLoadingList && notifications.length === 0 ? (
                <div className="space-y-2">
                  {[0, 1, 2, 3].map(i => (
                    <div
                      key={i}
                      className="flex gap-3 items-center p-3 rounded-xl animate-pulse"
                    >
                      <div className="w-[38px] h-[38px] rounded-full bg-gray-200 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-1/3 bg-gray-200 rounded" />
                        <div className="h-3 w-2/3 bg-gray-200 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifications.length > 0 ? (
                groupNotificationsByDay(notifications).map(group => (
                  <div key={group.label} className="space-y-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 px-1 pt-2 pb-1">
                      {group.label}
                    </p>

                    {group.items.map(notification => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        role={role}
                        onDelete={id => {
                          const target = notifications.find(n => n.id === id);
                          if (target) setDeleteTarget(target);
                        }}
                        onClick={handleNotificationClick}
                        isDeleting={deletingId === notification.id}
                      />
                    ))}
                  </div>
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
                onClick={() => setConfirmClearAll(true)}
                disabled={deleting}
                className={cn(
                  'w-full text-xs gap-1.5 text-red-500 hover:text-red-600 hover:bg-red-50',
                  deleting && 'opacity-50 cursor-not-allowed',
                )}
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear all notifications
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete confirmation modal — proper flow instead of instant delete */}
      <DeleteNotificationModal
        open={!!deleteTarget}
        mode="single"
        isDeleting={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />

      <DeleteNotificationModal
        open={confirmClearAll}
        mode="all"
        isDeleting={deleting}
        onCancel={() => setConfirmClearAll(false)}
        onConfirm={handleConfirmClearAll}
      />
    </>
  );
}
