'use client';

import Image from 'next/image';
import {
  CheckCircle,
  Loader2,
  MessageSquare,
  UserPlus,
  X,
  XCircle,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { cn } from '@/lib/utils';
import type {
  AppNotification,
  NotificationType,
} from '@/store/NotificationSlice';

// ─── Type badge config ────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  NotificationType,
  { label: string; className: string; icon: React.ReactNode }
> = {
  approved: {
    label: 'Approved',
    className: 'bg-emerald-100 text-emerald-700',
    icon: <CheckCircle className="w-2.5 h-2.5 text-emerald-600" />,
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-100 text-red-600',
    icon: <XCircle className="w-2.5 h-2.5 text-red-500" />,
  },
  follow: {
    label: 'Follow',
    className: 'bg-blue-100 text-blue-700',
    icon: <UserPlus className="w-2.5 h-2.5 text-blue-600" />,
  },
  conversation: {
    label: 'Message',
    className: 'bg-violet-100 text-violet-700',
    icon: <MessageSquare className="w-2.5 h-2.5 text-violet-600" />,
  },
  'user-registered': {
    label: 'New User',
    className: 'bg-amber-100 text-amber-700',
    icon: <UserPlus className="w-2.5 h-2.5 text-amber-600" />,
  },
};

/** Which notification types navigate somewhere when clicked, per role. */
function isClickable(notification: AppNotification, role: 'admin' | 'user') {
  switch (notification.type) {
    case 'conversation':
      return true;
    case 'user-registered':
      return role === 'admin';
    case 'follow':
      return true;
    case 'approved':
    case 'rejected':
      return role === 'user';
    default:
      return false;
  }
}

/** Small action hint shown under the preview for clickable notifications. */
function getActionHint(
  notification: AppNotification,
  role: 'admin' | 'user',
): string | null {
  switch (notification.type) {
    case 'conversation':
      return 'Open message';
    case 'user-registered':
      return role === 'admin' ? 'Review user' : null;
    case 'follow':
      return 'View profile';
    case 'approved':
    case 'rejected':
      return role === 'user' ? 'View profile' : null;
    default:
      return null;
  }
}

/**
 * Prettify structured message payloads (e.g. shared test results) so the
 * notification shows a readable preview instead of raw JSON.
 */
function getNotificationPreview(message: string): string {
  if (!message) return message;

  try {
    const parsed = JSON.parse(message);

    if (parsed?.type === 'test_result' && parsed?.data) {
      const { questions, score } = parsed.data;
      const parts = ['Shared a test result'];
      if (questions) parts.push(`${questions}Q`);
      if (score !== undefined) parts.push(`Score: ${score}%`);
      return `📋 ${parts.join(' · ')}`;
    }

    if (parsed?.type) {
      return `📎 Shared a ${String(parsed.type).replace(/_/g, ' ')}`;
    }
  } catch {
    // Not JSON — plain text message, show as-is
  }

  return message;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  notification: AppNotification;
  role: 'admin' | 'user';
  onDelete: (id: string) => void;
  onClick?: (notification: AppNotification) => void;
  /** Shows a spinner on this item's delete button while the delete is in-flight. */
  isDeleting?: boolean;
}

export function NotificationItem({
  notification,
  role,
  onDelete,
  onClick,
  isDeleting = false,
}: Props) {
  const config = TYPE_CONFIG[notification.type] ?? TYPE_CONFIG.conversation;
  const clickable = isClickable(notification, role);
  const hint = getActionHint(notification, role);

  const handleClick = () => {
    if (!clickable) return;
    onClick?.(notification);
  };

  const timeAgo = (() => {
    try {
      const date = new Date(notification.timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return '';
    }
  })();

  return (
    <div
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : -1}
      onClick={handleClick}
      onKeyDown={event => {
        if (!clickable) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleClick();
        }
      }}
      className={cn(
        'group relative flex gap-3 items-start rounded-xl px-3 py-2.5',
        'transition-all duration-150 border',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400',
        clickable ? 'cursor-pointer' : 'cursor-default',
        notification.isRead
          ? 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-100'
          : 'bg-teal-50/60 border-teal-100 hover:bg-teal-50',
        notification.isNew && 'animate-notification-in',
      )}
    >
      {/* Avatar with type icon overlay */}
      <div className="relative shrink-0 mt-0.5">
        <Image
          src={notification.user.avatar || '/images/footer_logo.png'}
          width={38}
          height={38}
          alt={notification.user.name}
          className="rounded-full object-cover aspect-square ring-1 ring-gray-200"
          unoptimized
        />

        <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow ring-1 ring-gray-100">
          {config.icon}
        </span>

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
          {getNotificationPreview(notification.message)}
        </p>

        <div className="flex items-center gap-2 mt-1">
          <span
            className="text-[11px] text-gray-400"
            title={new Date(notification.timestamp).toLocaleString()}
          >
            {timeAgo}
          </span>

          {clickable && hint && (
            <span className="text-[11px] font-medium text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">
              {hint} →
            </span>
          )}
        </div>
      </div>

      {/* Delete button — visible on hover */}
      <button
        type="button"
        aria-label="Delete notification"
        disabled={isDeleting}
        onClick={e => {
          e.stopPropagation();
          onDelete(notification.id);
        }}
        className={cn(
          'absolute top-2.5 right-2.5 p-1 rounded-md',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-150',
          'text-gray-400 hover:text-gray-600 hover:bg-gray-100',
          'disabled:opacity-100 disabled:cursor-not-allowed',
        )}
      >
        {isDeleting ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <X className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}

