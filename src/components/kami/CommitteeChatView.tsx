'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Crown,
  ChevronDown,
  ChevronUp,
  Search,
  Users,
  Mail,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

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
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  read: boolean;
  createdAt: string;
  sender: { id: string; name: string; phone: string };
}

interface Conversation {
  user: UserInfo;
  messages: Message[];
  lastMessageAt: string;
  unreadCount: number;
}

interface CommitteeChatViewProps {
 setCurrentScreen: (screen: string) => void;
  onBack?: () => void;
  onHome?: () => void;
}

export function CommitteeChatView({ setCurrentScreen, onBack, onHome }: CommitteeChatViewProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedConvId, setExpandedConvId] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadAdminId();
  }, []);

  useEffect(() => {
    if (adminId) {
      loadConversations();
      const interval = setInterval(loadConversations, 8000);
      return () => clearInterval(interval);
    }
  }, [adminId]);

  useEffect(() => {
    if (selectedConv) {
      scrollToBottom();
    }
  }, [selectedConv?.messages?.length]);

  const loadAdminId = async () => {
    try {
      const res = await fetch('/api/admin/ensure');
      if (res.ok) {
        const data = await res.json();
        setAdminId(data.adminId);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/committee-chat');
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
        // Update selected conv if it exists
        if (selectedConv) {
          const updated = data.find((c: Conversation) => c.user.id === selectedConv.user.id);
          if (updated) setSelectedConv(updated);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConv || isSending || !adminId) return;
    setIsSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newMessage,
          receiverId: selectedConv.user.id,
          senderId: adminId,
        }),
      });
      if (res.ok) {
        setNewMessage('');
        await loadConversations();
      }
    } catch (e) {
      console.error(e);
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

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const formatTime = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
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

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = ['#00A884','#53BDEB','#E8986E','#D36F8A','#7B61FF','#F7C948','#6ECFB8','#FF6B6B','#4ECDC4','#A78BFA'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
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
    c.user.phone.includes(searchQuery)
  );

  // ─── Initiative card for a user ───
  const InitiativeCard = ({ user }: { user: UserInfo }) => (
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
      </div>
    </div>
  );

  // ─── Single message bubble ───
  const MessageBubble = ({ message, prevMsg }: { message: Message; prevMsg: Message | null }) => {
    const isMyMessage = message.senderId === adminId;
    const isConsecutive = prevMsg && prevMsg.senderId === message.senderId;

    return (
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.15 }}
        className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} ${isConsecutive ? 'mt-[2px]' : 'mt-1'}`}
      >
        <div
          className={`
            relative max-w-[85%] md:max-w-[65%] rounded-lg px-2.5 py-1 shadow-sm
            ${isMyMessage ? 'rounded-tr-none' : 'rounded-tl-none'}
            ${isMyMessage && isConsecutive ? 'rounded-tr-md' : ''}
            ${!isMyMessage && isConsecutive ? 'rounded-tl-md' : ''}
          `}
          style={{
            backgroundColor: isMyMessage
              ? (isDark ? WA.outgoingDark : WA.outgoing)
              : (isDark ? WA.incomingDark : WA.incoming),
            color: isDark ? '#E9EDEF' : WA.textDark,
          }}
        >
          <p className="text-[14.2px] leading-[19px] whitespace-pre-wrap break-words pr-12">
            {message.content}
          </p>
          <span className="absolute bottom-[3px] right-[5px] flex items-center gap-0.5 float-right ml-2 -mt-[14px]">
            <span className="text-[11px]" style={{ color: WA.timeSent }}>
              {formatTime(message.createdAt)}
            </span>
            {isMyMessage && (
              message.read
                ? <CheckCheck className="h-[16px] w-[16px]" style={{ color: WA.checkRead }} />
                : <Check className="h-[16px] w-[16px]" style={{ color: WA.timeSent }} />
            )}
          </span>
        </div>
      </motion.div>
    );
  };

  // ════════════════════════════════════════════
  //    CONTACT LIST VIEW
  // ════════════════════════════════════════════
  if (!selectedConv) {
    return (
      <div className="flex-1 flex flex-col h-screen max-h-screen">
        {/* Header */}
        <header
          className="flex items-center px-2 py-1.5 shrink-0 relative z-30"
          style={{ backgroundColor: WA.headerDark }}
        >
          <Button variant="ghost" size="icon" onClick={onBack || (() => setCurrentScreen('espace-cgl'))} className="text-white hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          {onHome && (
            <Button variant="ghost" size="icon" onClick={onHome} className="text-white hover:bg-white/10">
              <Home className="h-5 w-5" />
            </Button>
          )}
          <div className="flex-1 ml-2">
            <h1 className="text-[17px] font-semibold text-white">Gestion de Discussion</h1>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Crown className="h-4 w-4 text-purple-300" />
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col bg-white dark:bg-[#0B1120]">
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
              filteredConversations.map((conv) => {
                const lastMsg = conv.messages[conv.messages.length - 1];
                return (
                  <motion.button
                    key={conv.user.id}
                    whileTap={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                    onClick={() => setSelectedConv(conv)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left border-b transition-colors"
                    style={{ borderColor: isDark ? '#2A3942' : WA.borderLight }}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-base"
                      style={{ backgroundColor: getAvatarColor(conv.user.name) }}
                    >
                      {getInitials(conv.user.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-[16.5px] font-normal truncate pr-2" style={{ color: isDark ? '#E9EDEF' : WA.textDark }}>
                          {conv.user.name}
                        </p>
                        <span className="text-[12px] shrink-0" style={{ color: conv.unreadCount > 0 ? WA.headerTeal : WA.timeSent }}>
                          {formatContactTime(conv.lastMessageAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-[14px] truncate pr-2" style={{ color: WA.timeSent }}>
                          {lastMsg ? (
                            <>
                              {lastMsg.senderId === adminId && (
                                <span style={{ color: '#53BDEB' }}><CheckCheck className="inline h-3.5 w-3.5 mr-0.5 -mt-0.5" /></span>
                              )}
                              {lastMsg.content.substring(0, 50)}{lastMsg.content.length > 50 ? '…' : ''}
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
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════
  //    CHAT VIEW (initiative card + messages)
  // ════════════════════════════════════════════
  return (
    <div className="flex-1 flex flex-col h-screen max-h-screen">
      {/* Chat header */}
      <header
        className="flex items-center gap-2 px-1 py-1 shrink-0"
        style={{ backgroundColor: WA.headerDark }}
      >
        <Button
          variant="ghost" size="icon"
          onClick={() => { setSelectedConv(null); loadConversations(); }}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm"
          style={{ backgroundColor: getAvatarColor(selectedConv.user.name) }}
        >
          {getInitials(selectedConv.user.name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-semibold text-white truncate">{selectedConv.user.name}</p>
          <p className="text-[12px] text-blue-300/80">Discussion CGL</p>
        </div>
      </header>

      {/* Messages area with initiative card at top */}
      <div
        className="flex-1 overflow-y-auto"
        style={{
          backgroundColor: isDark ? WA.chatBgDark : WA.chatBg,
          backgroundImage: isDark
            ? `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            : `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        <div className="px-0 py-2">
          {/* Initiative card */}
          <InitiativeCard user={selectedConv.user} />

          {/* Date-separated messages */}
          {selectedConv.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6">
              <div className="w-16 h-16 rounded-full bg-white/80 dark:bg-[#182229] flex items-center justify-center mb-3 shadow-sm">
                <span className="text-2xl">💬</span>
              </div>
              <p className="text-sm font-medium" style={{ color: isDark ? '#E9EDEF' : WA.textDark }}>
                Aucun message
              </p>
            </div>
          ) : (
            groupedMessages.map((group, gi) => (
              <div key={gi}>
                <div className="flex justify-center my-3">
                  <span
                    className="px-3 py-1 rounded-lg text-[11px] font-medium shadow-sm"
                    style={{ backgroundColor: isDark ? WA.dateBubbleDark : WA.dateBubble, color: isDark ? '#8696A0' : WA.dateText }}
                  >
                    {group.date}
                  </span>
                </div>
                {group.messages.map((msg, idx) => (
                  <MessageBubble
                    key={msg.id || `msg-${gi}-${idx}`}
                    message={msg}
                    prevMsg={idx > 0 ? group.messages[idx - 1] : null}
                  />
                ))}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="shrink-0 flex items-end gap-1 px-1 py-1" style={{ backgroundColor: isDark ? WA.chatBgDark : WA.chatBg }}>
        <div className="flex-1 relative">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Répondre au comité..."
            disabled={isSending}
            className="w-full rounded-full px-4 py-2.5 text-[15px] outline-none border-none"
            style={{ backgroundColor: isDark ? WA.inputBgDark : WA.inputBg, color: isDark ? '#E9EDEF' : WA.textDark, minHeight: '42px' }}
          />
        </div>
        <Button
          onClick={handleSendMessage}
          disabled={isSending || !newMessage.trim()}
          className="rounded-full shrink-0"
          style={{
            width: '42px', height: '42px',
            backgroundColor: newMessage.trim() ? WA.headerTeal : 'transparent',
            color: 'white',
          }}
          size="icon"
        >
          {newMessage.trim() ? <Send className="h-5 w-5" /> : (
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          )}
        </Button>
      </div>
    </div>
  );
}
