'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Package,
  ShoppingCart,
  Banknote,
  CircleCheck,
  Info,
  BellOff,
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CommitteeNotificationBellProps {
  userId: string;
  onNavigate?: () => void;
  onTargetNavigate?: (notification: CommitteeNotification) => void;
}

interface CommitteeNotification {
  id: string;
  title: string;
  message: string;
  type: string; // RESERVATION | ACHAT | PAYMENT | APPROVAL | SYSTEM
  read: boolean;
  data: {
    screen?: string;
    applicationId?: string;
    targetLabel?: string;
    reservationId: string;
    userId: string;
    userName: string;
    userPhone: string;
    lotId: string;
    lotName: string;
    lotBlock: string;
    amount: number;
    totalPrice: number;
    status: string;
    isResident: boolean;
  } | null;
  createdAt: string;
}

interface NotificationsResponse {
  notifications: CommitteeNotification[];
  unreadCount: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TYPE_CONFIG: Record<
  string,
  { emoji: string; icon: React.ElementType; label: string; color: string }
> = {
  RESERVATION: {
    emoji: '📌',
    icon: Package,
    label: 'Réservation',
    color: 'text-blue-500',
  },
  ACHAT: {
    emoji: '🛒',
    icon: ShoppingCart,
    label: 'Achat',
    color: 'text-violet-500',
  },
  PAYMENT: {
    emoji: '💰',
    icon: Banknote,
    label: 'Paiement',
    color: 'text-emerald-500',
  },
  APPROVAL: {
    emoji: '✅',
    icon: CircleCheck,
    label: 'Approbation',
    color: 'text-green-500',
  },
  SYSTEM: {
    emoji: 'ℹ️',
    icon: Info,
    label: 'Système',
    color: 'text-amber-500',
  },
  INSCRIPTION: {
    emoji: '👤',
    icon: Package,
    label: 'Inscription',
    color: 'text-cyan-500',
  },
  DISCUSSION: {
    emoji: '💬',
    icon: Info,
    label: 'Discussion',
    color: 'text-blue-500',
  },
  EXPERT_APPLICATION: {
    emoji: '🧰',
    icon: Package,
    label: 'Candidature expert',
    color: 'text-orange-500',
  },
  PUBLICATION: {
    emoji: '📢',
    icon: Info,
    label: 'Publication',
    color: 'text-indigo-500',
  },
};

/** Format a date string into a French relative time. */
function formatTimeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return "à l'instant";

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `il y a ${diffMin} min`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `il y a ${diffHr}h`;

  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return 'hier';
  if (diffDay < 7) return `il y a ${diffDay}j`;

  // Fallback to locale date when older than a week
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CommitteeNotificationBell({ userId, onNavigate }: CommitteeNotificationBellProps) {
  const [notifications, setNotifications] = useState<CommitteeNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // ---- Fetch ---------------------------------------------------------------

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/committee-notifications?userId=${encodeURIComponent(userId)}`
      );
      if (!res.ok) return;
      const data: NotificationsResponse = await res.json();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch {
      // Silently fail – the bell simply won't update
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Initial load + 15-second polling
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Re-fetch when popover opens
  useEffect(() => {
    if (open) fetchNotifications();
  }, [open, fetchNotifications]);

  // ---- Actions -------------------------------------------------------------

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/committee-notifications/${id}`, { method: 'PATCH' });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      // silent
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/committee-notifications/mark-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      // silent
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/committee-notifications/${id}`, { method: 'DELETE' });
      const removed = notifications.find((n) => n.id === id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (removed && !removed.read) {
        setUnreadCount((c) => Math.max(0, c - 1));
      }
    } catch {
      // silent
    }
  };

  // ---- Badge label ---------------------------------------------------------

  const badgeLabel = unreadCount > 99 ? '99+' : unreadCount > 0 ? String(unreadCount) : undefined;

  // ---- Render ------------------------------------------------------------

  if (onNavigate) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="relative h-10 w-10 rounded-full"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} non lues)` : ''}`}
        onClick={onNavigate}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <motion.span
            key={unreadCount}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-none text-destructive-foreground"
          >
            {badgeLabel}
            {unreadCount > 99 && (
              <motion.span
                className="absolute inset-0 rounded-full bg-destructive"
                animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
          </motion.span>
        )}
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-full"
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} non lues)` : ''}`}
        >
          <Bell className="h-5 w-5" />

          {/* Unread badge */}
          {unreadCount > 0 && (
            <motion.span
              key={unreadCount}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-none text-destructive-foreground"
            >
              {badgeLabel}
              {/* Pulsing ring when count > 99 */}
              {unreadCount > 99 && (
                <motion.span
                  className="absolute inset-0 rounded-full bg-destructive"
                  animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
            </motion.span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[380px] max-w-[calc(100vw-2rem)] rounded-xl border bg-popover p-0 shadow-xl dark:shadow-black/40"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <h3 className="text-sm font-semibold text-popover-foreground">
            Notifications
          </h3>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto gap-1.5 px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                onClick={markAllAsRead}
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Tout marquer comme lu
              </Button>
            )}
            {onNavigate && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto gap-1.5 px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setOpen(false);
                  (onNavigate as any)?.();
                }}
              >
                Aller à l&apos;Espace CGL
              </Button>
            )}
          </div>
        </div>

        <Separator />

        {/* Notification list */}
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="h-6 w-6 rounded-full border-2 border-muted-foreground/20 border-t-muted-foreground"
            />
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState />
        ) : (
          <ScrollArea className="h-[360px]">
            <div className="flex flex-col">
              <AnimatePresence initial={false}>
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                    onTargetNavigate={onTargetNavigate}
                  />
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
}

// ---------------------------------------------------------------------------
// NotificationItem
// ---------------------------------------------------------------------------

function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  onTargetNavigate,
}: {
  notification: CommitteeNotification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onTargetNavigate?: (notification: CommitteeNotification) => void;
}) {
  const config = TYPE_CONFIG[notification.type] ?? TYPE_CONFIG.SYSTEM;
  const TypeIcon = config.icon;

  const handleClick = () => {
    if (!notification.read) onMarkAsRead(notification.id);
  };

  const hasTarget = Boolean(notification.data?.screen);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 80, transition: { duration: 0.2 } }}
      className={`group relative flex cursor-pointer gap-3 px-4 py-3 transition-colors hover:bg-accent/50 ${
        !notification.read ? 'bg-primary/5 dark:bg-primary/10' : ''
      }`}
      onClick={handleClick}
    >
      {/* Type icon */}
      <div
        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/80 ${config.color}`}
      >
        <TypeIcon className="h-4 w-4" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-sm leading-snug ${
              notification.read
                ? 'font-medium text-popover-foreground/80'
                : 'font-semibold text-popover-foreground'
            }`}
          >
            {notification.title}
          </p>

          {/* Actions (visible on hover) */}
          <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
            {!notification.read && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead(notification.id);
                }}
                aria-label="Marquer comme lu"
              >
                <Check className="h-3 w-3 text-muted-foreground" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(notification.id);
              }}
              aria-label="Supprimer"
            >
              <Trash2 className="h-3 w-3 text-muted-foreground" />
            </Button>
          </div>
        </div>

        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {notification.message}
        </p>

        <div className="mt-1 flex items-center gap-2">
          {!notification.read && (
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
          )}
          <span className="text-[11px] text-muted-foreground/70">
            {formatTimeAgo(notification.createdAt)}
          </span>
        </div>
        {hasTarget && onTargetNavigate && (
          <button
            type="button"
            className="mt-2 text-xs font-semibold text-primary hover:underline"
            onClick={(event) => {
              event.stopPropagation();
              handleClick();
              onTargetNavigate(notification);
            }}
          >
            {notification.data?.targetLabel || 'Voir la cible'}
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// EmptyState
// ---------------------------------------------------------------------------

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex h-48 flex-col items-center justify-center gap-3 text-muted-foreground"
    >
      <BellOff className="h-10 w-10 opacity-30" />
      <p className="text-sm font-medium">Aucune notification</p>
      <p className="text-xs opacity-60">
        Vous n'avez pas encore de notifications.
      </p>
    </motion.div>
  );
}
