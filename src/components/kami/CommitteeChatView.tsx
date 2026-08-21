'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageNav } from './PageNav';
import {
  ArrowLeft,
  Home,
  Send,
  Check,
  CheckCheck,
  MessageSquare,
  Phone,
  MapPin,
  User,
  Calendar,
  Search,
  Mail,
  Trash2,
  RefreshCw,
  Archive,
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { uploadVoiceMessage, formatVoiceDuration, RecordedVoice } from '@/hooks/useAudioRecorder';
import { VoiceMessagePlayer } from './VoiceMessagePlayer';
import { VoiceMessageComposer } from './VoiceMessageComposer';

// WhatsApp palette
const WA = {
  headerDark: '#1E3A5F',
  headerTeal: '#2563EB',
  outgoing: '#DBEAFE',
  outgoingDark: '#1E3A5F',
  incoming: '#FFFFFF',
  incomingDark: '#1F2C34',
  chatBg: '#E8EEF6',
  chatBgDark: '#0B1120',
  inputBg: '#F0F0F0',
  inputBgDark: '#2A3942',
  textDark: '#111B21',
  textLight: '#E9EDEF',
  checkRead: '#53BDEB',
  timeSent: '#667781',
  dateBubble: '#E1F3FB',
  dateBubbleDark: '#182229',
  dateText: '#54656F',
  borderLight: '#E9EDEF',
};

interface UserInfo {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  isResident: boolean;
  role: string | null;
  quartier: string | null;
  villageOrigine: string | null;
  createdAt: string;
  reservedCount?: number;
  paidCount?: number;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  read: boolean;
  attachment?: {
    type: 'audio' | 'video' | 'file';
    url: string;
    mimeType: string;
    size: number;
    duration?: number;
    name?: string;
  } | null;
  createdAt: string;
  sender: { id: string; name: string; phone: string };
}

interface ConversationMessage {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  read: boolean;
  attachment?: {
    type: 'audio' | 'video' | 'file';
    url: string;
    mimeType: string;
    size: number;
    duration?: number;
    name?: string;
  } | null;
  createdAt: string;
}

interface Conversation {
  user: UserInfo;
  lastMessage: ConversationMessage | null;
  messages: Message[];
  lastMessageAt: string;
  unreadCount: number;
}

interface CommitteeChatViewProps {
 setCurrentScreen: (screen: string) => void;
  onBack?: () => void;
  onHome?: () => void;
}

// ─── Helpers (module scope : stables, ne changent pas à chaque rendu) ───

const formatTime = (dateString: string) => {
  const d = new Date(dateString);
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

const getInitials = (name: string) => {
  return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
};

const getAvatarColor = (name: string) => {
  const colors = ['#00A884','#53BDEB','#E8986E','#D36F8A','#7B61FF','#F7C948','#6ECFB8','#FF6B6B','#4ECDC4','#A78BFA'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

// ─── Initiative card for a user ───
function InitiativeCard({ user, isDark }: { user: UserInfo; isDark: boolean }) {
  return (
    <div
      className="mx-3 mb-3 rounded-xl overflow-hidden shadow-sm border"
      style={{
        borderColor: isDark ? '#2A3942' : '#E2E8F0',
        backgroundColor: isDark ? '#1A2332' : '#FFFFFF',
      }}
    >
      {/* Purple header bar */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white/30"
            style={{ backgroundColor: getAvatarColor(user.name) }}
          >
            {getInitials(user.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm truncate">{user.name}</p>
            <p className="text-purple-200 text-[11px]">Initiative de discussion</p>
          </div>
        </div>
      </div>

      {/* Info rows */}
      <div className="px-4 py-2.5 space-y-2">
        <div className="flex items-center gap-2.5">
          <Phone className="h-3.5 w-3.5 text-purple-500 flex-shrink-0" />
          <span className="text-xs" style={{ color: isDark ? '#E9EDEF' : WA.textDark }}>{user.phone}</span>
        </div>
        {user.email && (
          <div className="flex items-center gap-2.5">
            <Mail className="h-3.5 w-3.5 text-purple-500 flex-shrink-0" />
            <span className="text-xs" style={{ color: isDark ? '#E9EDEF' : WA.textDark }}>{user.email}</span>
          </div>
        )}
        <div className="flex items-center gap-2.5">
          <User className="h-3.5 w-3.5 text-purple-500 flex-shrink-0" />
          <span className="text-xs" style={{ color: isDark ? '#E9EDEF' : WA.textDark }}>
            {user.isResident ? 'Résident KAMI' : 'Non-Résident'}
          </span>
          {user.role === 'MANAGEMENT_COMMITTEE' && (
            <Badge className="bg-purple-600 text-[9px] px-1.5 py-0 h-4">CGL</Badge>
          )}
        </div>
        {user.quartier && (
          <div className="flex items-center gap-2.5">
            <MapPin className="h-3.5 w-3.5 text-purple-500 flex-shrink-0" />
            <span className="text-xs" style={{ color: isDark ? '#E9EDEF' : WA.textDark }}>{user.quartier}</span>
          </div>
        )}
        <div className="flex items-center gap-2.5">
          <Calendar className="h-3.5 w-3.5 text-purple-500 flex-shrink-0" />
          <span className="text-[11px]" style={{ color: WA.timeSent }}>
            Inscrit le {new Date(user.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </span>
        </div>

        {/* Lot counts */}
        <div className="pt-1.5 flex gap-2">
          <div className="bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-lg border border-orange-200 dark:border-orange-800 flex-1">
            <p className="text-[9px] text-orange-600 dark:text-orange-400 font-bold uppercase">Réservés</p>
            <p className="text-sm font-bold text-orange-700 dark:text-orange-300">{user.reservedCount || 0}</p>
          </div>
          <div className="bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 flex-1">
            <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">Achetés</p>
            <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">{user.paidCount || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Single message bubble ───
function MessageBubble({
  message,
  prevMsg,
  adminId,
  isDark,
  onDelete,
}: {
  message: Message;
  prevMsg: Message | null;
  adminId: string | null;
  isDark: boolean;
  onDelete: (messageId: string) => void;
}) {
  const isMyMessage = message.senderId === adminId;
  const isConsecutive = prevMsg && prevMsg.senderId === message.senderId;
  const [isHovering, setIsHovering] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.15 }}
      className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} ${isConsecutive ? 'mt-[2px]' : 'mt-1'} group`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex max-w-full min-w-0 items-end gap-2">
        <div
          className={`relative min-w-0 max-w-[85%] md:max-w-[65%] px-3 py-2 shadow-sm ${isMyMessage ? 'rounded-3xl rounded-br-none' : 'rounded-3xl rounded-tl-none'}`}
          style={{
            backgroundColor: isMyMessage
              ? (isDark ? WA.outgoingDark : WA.outgoing)
              : (isDark ? WA.incomingDark : WA.incoming),
            color: isDark ? '#E9EDEF' : WA.textDark,
          }}
        >
          {message.attachment?.type === 'audio' ? (
            <div className="pb-1">
              <VoiceMessagePlayer
                url={message.attachment.url}
                mimeType={message.attachment.mimeType}
                duration={message.attachment.duration}
                accentColor={isMyMessage ? (isDark ? '#BFDBFE' : '#1D4ED8') : (isDark ? '#93C5FD' : '#1E3A5F')}
                isDark={isDark}
              />
            </div>
          ) : (
            <p className="text-[14.2px] leading-[19px] whitespace-pre-wrap break-words pr-12">
              {message.content}
            </p>
          )}
          <span className="absolute bottom-[5px] right-[8px] flex items-center gap-0.5 text-[11px]" style={{ color: WA.timeSent }}>
            <span>{formatTime(message.createdAt)}</span>
            {isMyMessage &&
              (message.read ? (
                <CheckCheck className="h-[16px] w-[16px]" style={{ color: WA.checkRead }} />
              ) : (
                <Check className="h-[16px] w-[16px]" style={{ color: WA.timeSent }} />
              ))}
          </span>
        </div>
        {isMyMessage && isHovering && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => onDelete(message.id)}
            className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
            title="Supprimer le message"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { error };
  }

  componentDidCatch(error: any, info: any) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="p-4">
          <h3 className="text-red-600 font-bold">Erreur lors du rendu</h3>
          <pre className="text-sm text-red-500">{String(this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children as React.ReactElement;
  }
}

export function CommitteeChatView({ setCurrentScreen, onBack, onHome }: CommitteeChatViewProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'list' | 'detail'>('list');
  const [isVoiceSending, setIsVoiceSending] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    title: string;
    message: string;
    confirmLabel?: string;
    onConfirm: () => void;
  } | null>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const selectedConvRef = useRef<Conversation | null>(null);
  const hasLoadedRef = useRef(false);
  const pollingRef = useRef(false);
  const pendingChatRef = useRef<{ id: string; name: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    const tryLoadAdmin = async () => {
      try {
        const res = await fetch('/api/admin/ensure', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setAdminId(data.adminId);
        } else if (!cancelled && attempts < 3) {
          attempts += 1;
          setTimeout(tryLoadAdmin, 3000);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled && attempts < 3) {
          attempts += 1;
          setTimeout(tryLoadAdmin, 3000);
        }
      }
    };
    tryLoadAdmin();
    return () => {
      cancelled = true;
    };
  }, []);

  // Garde une référence à jour de la conversation ouverte (pour le polling).
  useEffect(() => {
    selectedConvRef.current = selectedConv;
  }, [selectedConv]);

  useEffect(() => {
    if (!adminId) return;

    const tick = async () => {
      // Évite le chevauchement des requêtes si une réponse est plus lente que l'intervalle.
      if (pollingRef.current) return;
      pollingRef.current = true;
      try {
        const current = selectedConvRef.current;
        if (current?.user?.id) {
          await pollConversationMessages(current.user.id);
        } else {
          await loadConversations();
        }
      } finally {
        pollingRef.current = false;
      }
    };

    loadConversations();
    const interval = setInterval(tick, 5000);
    return () => clearInterval(interval);
  }, [adminId]);

  // Ouvre une conversation demandée depuis un autre écran admin
  // (Gestion du Comité / Suivi Souscripteurs) via localStorage.
  useEffect(() => {
    if (!adminId) return;
    const raw = typeof window !== 'undefined' ? localStorage.getItem('selectedChatUser') : null;
    if (!raw) return;
    localStorage.removeItem('selectedChatUser');
    try {
      const pending = JSON.parse(raw);
      if (pending?.id) {
        pendingChatRef.current = { id: pending.id, name: pending.name || 'Utilisateur' };
        setActiveView('detail');
        loadConversationMessages(pending.id);
      }
    } catch (error) {
      console.error('[CommitteeChatView] Invalid selectedChatUser:', error);
    }
  }, [adminId]);

  useEffect(() => {
    if (selectedConv && isNearBottom()) {
      scrollToBottom(false);
    }
  }, [selectedConv?.messages?.length]);

  const loadConversations = async () => {
    if (!hasLoadedRef.current) setIsLoading(true);
    try {
      const res = await fetch('/api/committee-chat', { cache: 'no-store' });
      if (res.ok) {
        const data: Conversation[] = await res.json();
        // Ne remplace l'état que si la liste a réellement changé
        // (aucun re-rendu quand rien n'a bougé).
        setConversations((prev) => {
          if (
            prev.length === data.length &&
            prev.every(
              (c, i) =>
                c.user.id === data[i].user.id &&
                c.unreadCount === data[i].unreadCount &&
                c.lastMessageAt === data[i].lastMessageAt &&
                (c.lastMessage?.id ?? null) === (data[i].lastMessage?.id ?? null)
            )
          ) {
            return prev;
          }
          return data;
        });
        const openId = selectedConvRef.current?.user.id;
        if (openId) {
          const updated = data.find((c: Conversation) => c.user.id === openId);
          if (updated) {
            setSelectedConv((prev) => {
              if (!prev) return prev;
              if (
                prev.lastMessageAt === updated.lastMessageAt &&
                prev.unreadCount === updated.unreadCount &&
                (prev.lastMessage?.id ?? null) === (updated.lastMessage?.id ?? null) &&
                (prev.messages[prev.messages.length - 1]?.id ?? null) ===
                  (updated.lastMessage?.id ?? null)
              ) {
                return prev;
              }
              return {
                ...prev,
                user: updated.user,
                lastMessage: updated.lastMessage,
                lastMessageAt: updated.lastMessageAt,
                unreadCount: updated.unreadCount,
              };
            });
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      hasLoadedRef.current = true;
    }
  };

  // Rafraîchissement silencieux de la conversation ouverte (polling).
  // 1. Lecture seule (sans `markRead`) : aucun état ni écriture si rien n'a changé.
  // 2. Uniquement en cas de nouveau message non lu, on marque comme lu une seule
  //    fois et on récupère l'état à jour des accusés de lecture.
  const pollConversationMessages = async (otherUserId: string) => {
    if (!adminId) return;
    try {
      const res = await fetch(
        `/api/messages?userId=${encodeURIComponent(adminId)}&otherUserId=${encodeURIComponent(otherUserId)}`,
        { cache: 'no-store' }
      );
      if (!res.ok) return;

      const messages: Message[] = await res.json();
      const current = selectedConvRef.current;
      if (!current) return;

      const lastCurrent = current.messages[current.messages.length - 1];
      const lastNew = messages[messages.length - 1];
      const changed =
        messages.length !== current.messages.length || lastCurrent?.id !== lastNew?.id;
      if (!changed) return;

      const hasUnreadIncoming = messages.some((m) => m.senderId !== adminId && !m.read);

      let finalMessages = messages;
      if (hasUnreadIncoming) {
        const markRes = await fetch(
          `/api/messages?userId=${encodeURIComponent(adminId)}&otherUserId=${encodeURIComponent(otherUserId)}&markRead=true`,
          { cache: 'no-store' }
        );
        if (markRes.ok) {
          finalMessages = await markRes.json();
        }
      }

      setSelectedConv((prev) => (prev ? { ...prev, messages: finalMessages, unreadCount: 0 } : prev));
      setConversations((prev) =>
        prev.map((c) =>
          c.user.id === otherUserId
            ? {
                ...c,
                unreadCount: 0,
                lastMessage: lastNew
                  ? {
                      id: lastNew.id,
                      content: lastNew.content,
                      senderId: lastNew.senderId,
                      receiverId: lastNew.receiverId,
                      read: lastNew.read,
                      createdAt: lastNew.createdAt,
                    }
                  : c.lastMessage,
                lastMessageAt: lastNew?.createdAt || c.lastMessageAt,
              }
            : c
        )
      );
      if (hasUnreadIncoming && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('kami:chat-read', { detail: { userId: otherUserId } }));
      }
      if (isNearBottom()) {
        scrollToBottom(false);
      }
    } catch (e) {
      console.error('[CommitteeChatView] Poll error:', e);
    }
  };

  const handleBack = () => {
    if (activeView === 'detail' && selectedConv) {
      setSelectedConv(null);
      setActiveView('list');
      return;
    }

    if (onBack) {
      onBack();
      return;
    }

    setCurrentScreen('espace-cgl');
  };

  const handleOpenConversation = async (otherUserId: string) => {
    setActiveView('detail');
    await loadConversationMessages(otherUserId);
  };

  const loadConversationMessages = async (otherUserId: string) => {
    if (!adminId) {
      console.error('[CommitteeChatView] Admin ID not available');
      return;
    }
    try {
      const res = await fetch(
        `/api/messages?userId=${encodeURIComponent(adminId)}&otherUserId=${encodeURIComponent(otherUserId)}&markRead=true`,
        { cache: 'no-store' }
      );

      if (!res.ok) {
        return;
      }

      const messages: Message[] = await res.json();

      const listUser = conversations.find((c) => c.user.id === otherUserId)?.user;
      const currentUserInfo =
        listUser ||
        (selectedConvRef.current?.user.id === otherUserId ? selectedConvRef.current.user : null) || {
          id: otherUserId,
          name: pendingChatRef.current?.name || 'Utilisateur',
          phone: '',
          email: null,
          isResident: false,
          role: null,
          quartier: null,
          villageOrigine: null,
          createdAt: new Date().toISOString(),
        };
      pendingChatRef.current = null;

      const lastMsg = messages[messages.length - 1];

      setSelectedConv({
        user: currentUserInfo,
        lastMessage: lastMsg
          ? {
              id: lastMsg.id,
              content: lastMsg.content,
              senderId: lastMsg.senderId,
              receiverId: lastMsg.receiverId,
              read: lastMsg.read,
              createdAt: lastMsg.createdAt,
            }
          : null,
        messages,
        lastMessageAt: lastMsg?.createdAt || '',
        unreadCount: 0,
      });

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('kami:chat-read', { detail: { userId: otherUserId } }));
      }

      await loadConversations();
    } catch (e) {
      console.error('[CommitteeChatView] Exception loading messages:', e);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      toast.error('Le message ne peut pas être vide');
      return;
    }

    if (!selectedConv) {
      toast.error('Aucune conversation sélectionnée');
      return;
    }

    if (!adminId) {
      toast.error('Administrateur non identifié');
      return;
    }

    if (isSending) {
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newMessage.trim(),
          receiverId: selectedConv.user.id,
          senderId: adminId,
        }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Erreur inconnue' }));
        toast.error(error.error || "Erreur lors de l'envoi du message");
        return;
      }

      setNewMessage('');
      await loadConversationMessages(selectedConv.user.id);
      await loadConversations();
    } catch (e) {
      console.error('[CommitteeChatView] Exception sending message:', e);
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const archiveConversation = async (userId: string) => {
    if (!adminId) return;

    setConfirmDialog({
      title: 'Archiver la discussion',
      message: 'Cette discussion disparaîtra de la liste active.',
      confirmLabel: 'Archiver',
      onConfirm: async () => {
        try {
          const res = await fetch('/api/messages', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'archiveConversation', userId }),
          });

          if (!res.ok) {
            throw new Error("Erreur d'archivage");
          }

          if (selectedConv?.user.id === userId) {
            setSelectedConv(null);
            setActiveView('list');
          }
          await loadConversations();
          toast.success('Discussion archivée');
        } catch (e) {
          console.error('[CommitteeChatView] archiveConversation error:', e);
          toast.error("Erreur lors de l'archivage de la discussion");
        }
      },
    });
  };

  const deleteConversation = async (userId: string) => {
    if (!adminId) return;

    setConfirmDialog({
      title: 'Supprimer la discussion',
      message: 'Supprimer définitivement cette discussion pour le CGL ?',
      confirmLabel: 'Supprimer',
      onConfirm: async () => {
        try {
          const res = await fetch('/api/messages', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'deleteConversation', userId }),
          });

          if (!res.ok) {
            throw new Error('Erreur de suppression');
          }

          if (selectedConv?.user.id === userId) {
            setSelectedConv(null);
            setActiveView('list');
          }
          await loadConversations();
          toast.success('Discussion supprimée');
        } catch (e) {
          console.error('[CommitteeChatView] deleteConversation error:', e);
          toast.error('Erreur lors de la suppression de la discussion');
        }
      },
    });
  };

  const handleDeleteMessage = async (messageId: string) => {
    setConfirmDialog({
      title: 'Supprimer le message',
      message: 'Êtes-vous sûr de vouloir supprimer ce message ?',
      confirmLabel: 'Supprimer',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/messages?messageId=${encodeURIComponent(messageId)}`, {
            method: 'DELETE',
          });
          if (res.ok) {
            if (selectedConv) {
              await loadConversationMessages(selectedConv.user.id);
            }
            toast.success('Message supprimé');
          } else {
            toast.error('Erreur lors de la suppression du message');
          }
        } catch (e) {
          console.error(e);
          toast.error('Erreur lors de la suppression du message');
        }
      },
    });
  };

  const isNearBottom = () => {
    const el = messagesContainerRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 120;
  };

  const scrollToBottom = (smooth = true) => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'end' });
    });
  };

  const formatDateLabel = (dateString: string) => {
    const d = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const msgDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    if (msgDate.getTime() === today.getTime()) return "AUJOURD'HUI";
    if (msgDate.getTime() === yesterday.getTime()) return 'HIER';
    return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();
  };

  const formatContactTime = (dateString: string) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const msgDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    if (msgDate.getTime() === today.getTime()) return formatTime(dateString);
    if (msgDate.getTime() === yesterday.getTime()) return 'Hier';
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' });
  };

  const sendVoiceMessage = async (voice: RecordedVoice): Promise<boolean> => {
    if (!selectedConv) {
      toast.error('Aucune conversation sélectionnée');
      return false;
    }
    if (!adminId) {
      toast.error('Administrateur non identifié');
      return false;
    }
    if (isVoiceSending) return false;

    setIsVoiceSending(true);
    try {
      const attachment = await uploadVoiceMessage(voice);

      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: '',
          receiverId: selectedConv.user.id,
          senderId: adminId,
          attachment,
        }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Erreur inconnue' }));
        toast.error(error.error || "Erreur lors de l'envoi du message vocal");
        return false;
      }

      await loadConversationMessages(selectedConv.user.id);
      await loadConversations();
      return true;
    } catch (e) {
      console.error('[CommitteeChatView] Exception sending voice message:', e);
      toast.error("Erreur lors de l'envoi du message vocal");
      return false;
    } finally {
      setIsVoiceSending(false);
    }
  };

  const groupedMessages = useMemo(() => {
    if (!selectedConv) return [];
    const groups: { date: string; messages: Message[] }[] = [];
    let currentLabel = '';
    selectedConv.messages.forEach((msg) => {
      const label = formatDateLabel(msg.createdAt);
      if (label !== currentLabel) {
        groups.push({ date: label, messages: [msg] });
        currentLabel = label;
      } else {
        groups[groups.length - 1].messages.push(msg);
      }
    });
    return groups;
  }, [selectedConv?.messages]);

  const filteredConversations = conversations.filter((c) =>
    c.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.user.phone || '').includes(searchQuery)
  );

  const refreshList = async () => {
    await loadConversations();
    if (selectedConv) {
      await loadConversationMessages(selectedConv.user.id);
    }
  };

  // ════════════════════════════════════════════
  //    CONTACT LIST VIEW
  // ════════════════════════════════════════════
  if (activeView === 'list' || !selectedConv) {
    return (
      <>
      <ErrorBoundary>
      <div className="flex-1 flex flex-col h-screen max-h-screen overflow-hidden">
        <PageNav
          onBack={handleBack}
          onHome={onHome || (() => setCurrentScreen('home'))}
          title="Gestion de Discussion"
          titleRight={
            <button
              type="button"
              onClick={refreshList}
              className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 hover:bg-purple-500/30 transition"
              aria-label="Actualiser les discussions"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          }
        />

        <div className="flex-1 flex flex-col bg-white dark:bg-[#0B1120] min-h-0">
          {/* Search */}
          <div className="px-2 py-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                placeholder="Rechercher une initiative..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full text-[15px] outline-none"
                style={{ backgroundColor: isDark ? WA.inputBgDark : WA.inputBg, color: isDark ? '#E9EDEF' : WA.textDark }}
              />
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6">
                <MessageSquare className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-sm" style={{ color: WA.timeSent }}>Aucune discussion</p>
              </div>
            ) : (
              filteredConversations.map((conv: Conversation) => {
                const lastMsg = conv.lastMessage;
                const isSelected = (selectedConv as any)?.user?.id === conv.user.id;
                return (
                  <div key={conv.user.id} className="relative">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOpenConversation(conv.user.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-all ${isSelected ? 'border border-blue-200 dark:border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 rounded-2xl shadow-sm' : 'rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-950'} ${conv.unreadCount > 0 ? 'ring-1 ring-blue-200 dark:ring-blue-600' : ''}`}
                      style={{ borderColor: isDark ? '#2A3942' : WA.borderLight }}
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-base"
                        style={{ backgroundColor: getAvatarColor(conv.user.name) }}
                      >
                        {getInitials(conv.user.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-[16.5px] truncate ${conv.unreadCount > 0 ? 'font-semibold' : 'font-medium'}`} style={{ color: isDark ? '#E9EDEF' : WA.textDark }}>
                            {conv.user.name}
                          </p>
                          <span className="text-[12px] shrink-0" style={{ color: conv.unreadCount > 0 ? WA.headerTeal : WA.timeSent }}>
                            {formatContactTime(conv.lastMessageAt)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-1">
                          <p className="text-[14px] truncate" style={{ color: WA.timeSent }}>
                            {lastMsg ? (
                              <>
                                {lastMsg.senderId === adminId && (
                                  <span style={{ color: '#53BDEB' }}><CheckCheck className="inline h-3.5 w-3.5 mr-0.5 -mt-0.5" /></span>
                                )}
                                {lastMsg.attachment?.type === 'audio'
                                  ? `🎤 Message vocal ${lastMsg.attachment.duration ? `(${formatVoiceDuration(lastMsg.attachment.duration)})` : ''}`
                                  : lastMsg.content.substring(0, 50)}{lastMsg.content.length > 50 && !lastMsg.attachment ? '…' : ''}
                              </>
                            ) : (
                              <span className="italic">Aucun message</span>
                            )}
                          </p>
                          {conv.unreadCount > 0 && (
                            <span
                              className="shrink-0 min-w-[20px] h-[20px] rounded-full flex items-center justify-center text-[11px] font-bold text-white px-1.5"
                              style={{ backgroundColor: WA.headerTeal }}
                            >
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.button>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); archiveConversation(conv.user.id); }}
                        className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-600"
                        title="Archiver"
                        aria-label="Archiver"
                      >
                        <Archive className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); deleteConversation(conv.user.id); }}
                        className="h-7 w-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200"
                        title="Supprimer"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      </ErrorBoundary>
    <ConfirmDialog
      open={!!confirmDialog}
      title={confirmDialog?.title}
      message={confirmDialog?.message}
      confirmLabel={confirmDialog?.confirmLabel}
      onCancel={() => setConfirmDialog(null)}
      onConfirm={() => {
        const action = confirmDialog?.onConfirm;
        setConfirmDialog(null);
        action?.();
      }}
    />
    </>
    );
  }

  // ════════════════════════════════════════════
  //    CHAT VIEW (initiative card + messages)
  // ════════════════════════════════════════════
  return (
    <>
    <ErrorBoundary>
    <div className="flex-1 flex flex-col h-screen max-h-screen">
      {/* ─── Header (WhatsApp style, comme la page des utilisateurs) ─── */}
      <header
        className="flex items-center px-2 py-1.5 shrink-0 relative z-20"
        style={{ backgroundColor: WA.headerDark }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="text-white hover:bg-white/10"
          aria-label="Retour"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onHome || (() => setCurrentScreen('home'))}
          className="text-white hover:bg-white/10"
          aria-label="Accueil"
        >
          <Home className="h-5 w-5" />
        </Button>

        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm ml-1"
          style={{ backgroundColor: getAvatarColor(selectedConv.user.name) }}
        >
          {getInitials(selectedConv.user.name)}
        </div>

        <div className="flex-1 ml-3 min-w-0">
          <h1 className="text-[15px] font-semibold text-white truncate leading-tight">
            Discussion CGL
          </h1>
          <p className="text-[12px] text-blue-200/90 leading-tight truncate">
            {selectedConv.user.name}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={refreshList}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition"
            aria-label="Actualiser la conversation"
            title="Actualiser"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => archiveConversation(selectedConv.user.id)}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition"
            aria-label="Archiver la discussion"
            title="Archiver la discussion"
          >
            <Archive className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => deleteConversation(selectedConv.user.id)}
            className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-100 hover:bg-red-500/30 transition"
            aria-label="Supprimer la discussion"
            title="Supprimer la discussion"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Messages area with initiative card at top */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto min-h-0"
        style={{
          backgroundColor: isDark ? WA.chatBgDark : WA.chatBg,
          backgroundImage: isDark
            ? `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            : `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        <div className="px-0 py-2">
          <InitiativeCard user={selectedConv.user} isDark={isDark} />

          {/* Date-separated messages */}
          {selectedConv.messages.length === 0 ? (
            <div className="mx-auto max-w-sm px-6 py-10 text-center">
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-white font-bold text-lg shadow-lg"
                style={{ backgroundColor: getAvatarColor(selectedConv.user.name) }}
              >
                {getInitials(selectedConv.user.name)}
              </div>
              <h2 className="text-base font-semibold" style={{ color: isDark ? '#E9EDEF' : WA.textDark }}>
                {selectedConv.user.name}
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed" style={{ color: WA.timeSent }}>
                Aucun message pour le moment. Envoyez votre premier message à cette
                initiative de discussion.
              </p>
            </div>
          ) : (
            groupedMessages.map((group, gi) => (
              <div key={gi}>
                <div className="flex justify-center my-3">
                  <span
                    className="px-3 py-1 rounded-lg text-[11px] font-medium shadow-sm"
                    style={{
                      backgroundColor: isDark ? WA.dateBubbleDark : WA.dateBubble,
                      color: isDark ? '#8696A0' : WA.dateText,
                    }}
                  >
                    {group.date}
                  </span>
                </div>
                <div className="px-4">
                  {group.messages.map((msg, idx) => (
                    <MessageBubble
                      key={msg.id || `msg-${gi}-${idx}`}
                      message={msg}
                      prevMsg={idx > 0 ? group.messages[idx - 1] : null}
                      adminId={adminId}
                      isDark={isDark}
                      onDelete={handleDeleteMessage}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="shrink-0 flex items-center gap-2 px-3 py-3 border-t w-full" style={{ backgroundColor: isDark ? '#111A27' : '#F8FAFC', borderColor: isDark ? '#1F2A38' : '#E5E7EB' }}>
        <VoiceMessageComposer
          isDark={isDark}
          sending={isVoiceSending}
          disabled={isSending}
          accentColor={WA.headerTeal}
          onActiveChange={setVoiceActive}
          onSend={sendVoiceMessage}
        />

        {!voiceActive && (
          <>
            <div className="flex-1 relative min-w-0">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Écrire une réponse..."
                disabled={isSending}
                className="w-full rounded-full px-4 py-3 text-[15px] outline-none border border-transparent focus:border-blue-300 focus:ring-2 focus:ring-blue-200"
                style={{ backgroundColor: isDark ? WA.inputBgDark : WA.inputBg, color: isDark ? '#E9EDEF' : WA.textDark, minHeight: '46px' }}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={isSending || !newMessage.trim()}
              className="rounded-full shrink-0"
              style={{
                width: '46px',
                height: '46px',
                backgroundColor: newMessage.trim() ? WA.headerTeal : 'transparent',
                color: newMessage.trim() ? 'white' : '#64748B',
              }}
              size="icon"
            >
              <Send className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>
      </div>
    </ErrorBoundary>
    <ConfirmDialog
      open={!!confirmDialog}
      title={confirmDialog?.title}
      message={confirmDialog?.message}
      confirmLabel={confirmDialog?.confirmLabel}
      onCancel={() => setConfirmDialog(null)}
      onConfirm={() => {
        const action = confirmDialog?.onConfirm;
        setConfirmDialog(null);
        action?.();
      }}
    />
    </>
  );
}

// ---------------------------------------------------------------------------
// ConfirmDialog
// ---------------------------------------------------------------------------

function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirmer',
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onCancel}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-sm rounded-2xl bg-background p-6 shadow-2xl border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-foreground">{title}</h3>
                  {message && (
                    <p className="mt-1 text-sm text-muted-foreground">{message}</p>
                  )}
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <Button variant="ghost" onClick={onCancel}>
                  Annuler
                </Button>
                <Button
                  variant="destructive"
                  onClick={onConfirm}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {confirmLabel}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
