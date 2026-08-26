'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HomeNotificationBellProps {
  currentUser: { id: string; role: string | null } | null;
  onNavigate: () => void;
}

interface CommitteeConversationSummary {
  user: { id: string };
  unreadCount: number;
}

/**
 * Cloche de notification affichée dans l'en-tête de la page d'accueil.
 * - Membres du CGL : nombre de conversations non lues (Espace CGL).
 * - Autres utilisateurs connectés : nombre de messages non lus du CGL (Discussions).
 * Le badge se rafraîchit via polling + événement `kami:chat-read`.
 */
export function HomeNotificationBell({ currentUser, onNavigate }: HomeNotificationBellProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const lastPaymentNotificationId = useRef<string | null>(null);

  const isCgl =
    currentUser?.role === 'ADMIN' || currentUser?.role === 'MANAGEMENT_COMMITTEE';

  const loadUnreadCount = useCallback(async () => {
    if (!currentUser?.id) {
      setUnreadCount(0);
      return;
    }
    try {
      if (isCgl) {
        const res = await fetch('/api/committee-chat', { cache: 'no-store' });
        if (!res.ok) return;
        const data: CommitteeConversationSummary[] = await res.json();
        setUnreadCount(
          Array.isArray(data) ? data.filter((c) => c.unreadCount > 0).length : 0
        );
      } else {
        const [messagesRes, notificationsRes] = await Promise.all([
          fetch(`/api/messages/unread?userId=${encodeURIComponent(currentUser.id)}`, { cache: 'no-store' }),
          fetch(`/api/user/notifications?userId=${encodeURIComponent(currentUser.id)}`, { cache: 'no-store' }),
        ]);
        const messages = messagesRes.ok ? await messagesRes.json() : {};
        const notifications = notificationsRes.ok ? await notificationsRes.json() : {};
        if (notifications.paymentValidated?.id && notifications.paymentValidated.id !== lastPaymentNotificationId.current) {
          lastPaymentNotificationId.current = notifications.paymentValidated.id;
        }
        setUnreadCount((Number(messages?.unreadCount) || 0) + (Number(notifications?.unreadCount) || 0));
      }
    } catch (e) {
      console.error('[HomeNotificationBell] Error loading unread count:', e);
    }
  }, [currentUser?.id, isCgl]);

  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 15_000);
    const handleChatRead = () => loadUnreadCount();
    window.addEventListener('kami:chat-read', handleChatRead);
    return () => {
      clearInterval(interval);
      window.removeEventListener('kami:chat-read', handleChatRead);
    };
  }, [loadUnreadCount]);

  if (!currentUser?.id) return null;

  const badgeLabel = unreadCount > 99 ? '99+' : unreadCount > 0 ? String(unreadCount) : undefined;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-10 w-10 rounded-full text-current"
      aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} non lues)` : ''}`}
      onClick={onNavigate}
      title={isCgl ? 'Notifications et messages (Espace CGL)' : 'Mes messages'}
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
        </motion.span>
      )}
    </Button>
  );
}
