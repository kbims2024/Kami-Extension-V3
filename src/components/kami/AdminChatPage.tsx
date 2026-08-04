'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  Home,
  Send,
  Check,
  CheckCheck,
  Smile,
  Paperclip,
  Search,
  MoreVertical,
  Users,
} from 'lucide-react';
import { CommitteeNotificationBell } from './CommitteeNotificationBell';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

// ─── WhatsApp colour palette ───
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
  contactHover: '#F5F6F6',
  contactHoverDark: '#202C33',
  borderLight: '#E9EDEF',
  dividerLight: '#E9EDEF',
};

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  read: boolean;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    phone: string;
  };
}

interface SimpleUser {
  id: string;
  name: string;
  phone: string;
  isResident: boolean;
}

interface AdminChatPageProps {
  setCurrentScreen: (screen: string) => void;
  setIsMenuOpen: (open: boolean) => void;
  onHome?: () => void;
}

export function AdminChatPage({ setCurrentScreen, setIsMenuOpen, onHome }: AdminChatPageProps) {
  const [adminId, setAdminId] = useState<string | null>(null);
  const [users, setUsers] = useState<SimpleUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<SimpleUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastMessages, setLastMessages] = useState<Record<string, Message>>({});
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadAdminId();
  }, []);

  useEffect(() => {
    if (adminId) loadUsers();
  }, [adminId]);

  useEffect(() => {
    const selectedChatUser = localStorage.getItem('selectedChatUser');
    if (selectedChatUser && adminId) {
      try {
        const user = JSON.parse(selectedChatUser);
        const foundUser = users.find((u) => u.id === user.id);
        if (foundUser) {
          setSelectedUser(foundUser);
          setSelectedUserId(foundUser.id);
        } else {
          const tempUser: SimpleUser = { id: user.id, name: user.name, phone: '', isResident: false };
          setSelectedUser(tempUser);
          setSelectedUserId(tempUser.id);
        }
        localStorage.removeItem('selectedChatUser');
      } catch (error) {
        console.error('Error parsing selected user:', error);
      }
    }
  }, [adminId, users]);

  useEffect(() => {
    if (selectedUserId) {
      loadMessages(selectedUserId);
      const interval = () => loadMessages(selectedUserId);
      const intId = setInterval(interval, 5000);
      return () => clearInterval(intId);
    }
  }, [selectedUserId]);

  const loadAdminId = async () => {
    try {
      const response = await fetch('/api/admin/ensure');
      if (response.ok) {
        const data = await response.json();
        setAdminId(data.adminId);
      }
    } catch (error) {
      console.error('Error loading admin ID:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        // Load last message for each user
        loadAllLastMessages(data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadAllLastMessages = async (userList: SimpleUser[]) => {
    const lastMsgs: Record<string, Message> = {};
    const unread: Record<string, number> = {};
    for (const user of userList) {
      try {
        const res = await fetch(`/api/messages?userId=${user.id}`);
        if (res.ok) {
          const msgs: Message[] = await res.json();
          if (msgs.length > 0) {
            lastMsgs[user.id] = msgs[msgs.length - 1];
            // Count unread (messages not from admin)
            unread[user.id] = msgs.filter((m) => m.senderId !== adminId && !m.read).length;
          }
        }
      } catch {
        // skip
      }
    }
    setLastMessages(lastMsgs);
    setUnreadCounts(unread);
  };

  const loadMessages = async (userId: string) => {
    try {
      const response = await fetch(`/api/messages?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUserId || isLoading || !adminId) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newMessage,
          receiverId: selectedUserId,
          senderId: adminId,
        }),
      });
      if (response.ok) {
        setNewMessage('');
        await loadMessages(selectedUserId);
        // Update last message for this user
        loadAllLastMessages(users);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimeShort = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatContactTime = (dateString: string) => {
    const d = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const msgDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    if (msgDate.getTime() === today.getTime()) return formatTimeShort(dateString);
    if (msgDate.getTime() === yesterday.getTime()) return 'Hier';
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' });
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

  const groupedMessages = useMemo(() => {
    const groups: { date: string; messages: Message[] }[] = [];
    let currentLabel = '';

    messages.forEach((msg) => {
      const label = formatDateLabel(msg.createdAt);
      if (label !== currentLabel) {
        groups.push({ date: label, messages: [msg] });
        currentLabel = label;
      } else {
        groups[groups.length - 1].messages.push(msg);
      }
    });

    return groups;
  }, [messages]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      '#00A884', '#53BDEB', '#E8986E', '#D36F8A', '#7B61FF',
      '#F7C948', '#6ECFB8', '#FF6B6B', '#4ECDC4', '#A78BFA',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery)
  );

  // ─── Render ───

  return (
    <div className="flex-1 flex flex-col h-screen max-h-screen">
      {/* ─── Top header ─── */}
      <header
        className="flex items-center px-2 py-1.5 shrink-0 relative z-30"
        style={{ backgroundColor: WA.headerDark }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentScreen('admin')}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        {onHome && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onHome}
            className="text-white hover:bg-white/10"
          >
            <Home className="h-5 w-5" />
          </Button>
        )}
        <div className="flex-1 ml-2 min-w-0">
          <h1 className="text-[17px] font-semibold text-white truncate leading-tight">
            Discussions
          </h1>
        </div>
        <div className="flex items-center gap-1">
          {adminId && <CommitteeNotificationBell userId={adminId} />}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(true)}
            className="text-white hover:bg-white/10"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* ════════════════════════════════════════════
            CONTACT LIST (WhatsApp sidebar style)
           ════════════════════════════════════════════ */}
        {!selectedUser && (
          <div className="w-full flex flex-col bg-white dark:bg-[#0B1120]">
            {/* Search bar */}
            <div className="px-2 py-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  placeholder="Rechercher ou démarrer une discussion"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full text-[15px] outline-none"
                  style={{ backgroundColor: isDark ? WA.inputBgDark : WA.inputBg, color: isDark ? '#E9EDEF' : WA.textDark }}
                />
              </div>
            </div>

            {/* Contact list */}
            <div className="flex-1 overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6">
                  <Users className="h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-sm" style={{ color: WA.timeSent }}>Aucun contact trouvé</p>
                </div>
              ) : (
                filteredUsers.map((user) => {
                  const lastMsg = lastMessages[user.id];
                  const unread = unreadCounts[user.id] || 0;

                  return (
                    <motion.button
                      key={user.id}
                      whileTap={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                      onClick={() => {
                        setSelectedUser(user);
                        setSelectedUserId(user.id);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-left border-b transition-colors"
                      style={{
                        borderColor: isDark ? '#2A3942' : WA.borderLight,
                      }}
                    >
                      {/* Avatar */}
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-base"
                        style={{ backgroundColor: getAvatarColor(user.name) }}
                      >
                        {getInitials(user.name)}
                      </div>

                      {/* Name + last message */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-[16.5px] font-normal truncate pr-2" style={{ color: isDark ? '#E9EDEF' : WA.textDark }}>
                            {user.name}
                          </p>
                          <span
                            className="text-[12px] shrink-0"
                            style={{ color: unread > 0 ? WA.headerTeal : WA.timeSent }}
                          >
                            {lastMsg ? formatContactTime(lastMsg.createdAt) : ''}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <p className="text-[14px] truncate pr-2" style={{ color: WA.timeSent }}>
                            {lastMsg ? (
                              <>
                                {lastMsg.senderId === adminId && (
                                  <span className="text-[#53BDEB]">
                                    <CheckCheck className="inline h-3.5 w-3.5 mr-0.5 -mt-0.5" />
                                  </span>
                                )}
                                {lastMsg.content.substring(0, 50)}
                                {lastMsg.content.length > 50 ? '…' : ''}
                              </>
                            ) : (
                              <span className="italic">Aucun message</span>
                            )}
                          </p>
                          {unread > 0 && (
                            <span
                              className="shrink-0 min-w-[20px] h-[20px] rounded-full flex items-center justify-center text-[11px] font-bold text-white px-1.5"
                              style={{ backgroundColor: WA.headerTeal }}
                            >
                              {unread}
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
        )}

        {/* ════════════════════════════════════════════
            CHAT VIEW (WhatsApp conversation)
           ════════════════════════════════════════════ */}
        {selectedUser && (
          <div className="flex-1 flex flex-col" style={{ backgroundColor: isDark ? WA.chatBgDark : WA.chatBg }}>
            {/* Chat header */}
            <div
              className="flex items-center gap-2 px-1 py-1 shrink-0"
              style={{ backgroundColor: WA.headerDark }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedUser(null);
                  setSelectedUserId(null);
                  loadAllLastMessages(users);
                }}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>

              {/* Avatar */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm"
                style={{ backgroundColor: getAvatarColor(selectedUser.name) }}
              >
                {getInitials(selectedUser.name)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-white truncate leading-tight">
                  {selectedUser.name}
                </p>
                <p className="text-[12px] text-blue-300/80 leading-tight">en ligne</p>
              </div>

              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-3 py-2 space-y-1"
              style={{
                backgroundImage: isDark
                  ? `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                  : `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            >
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-6">
                  <div className="w-20 h-20 rounded-full bg-white/80 dark:bg-[#182229] flex items-center justify-center mb-4 shadow-sm">
                    <span className="text-3xl">💬</span>
                  </div>
                  <p className="text-sm font-medium" style={{ color: isDark ? '#E9EDEF' : WA.textDark }}>
                    Aucun message avec {selectedUser.name}
                  </p>
                  <p className="text-xs mt-1" style={{ color: WA.timeSent }}>
                    Envoyez votre premier message
                  </p>
                </div>
              ) : (
                groupedMessages.map((group, gi) => (
                  <div key={gi}>
                    {/* Date separator */}
                    <div className="flex justify-center my-3">
                      <span
                        className="px-3 py-1 rounded-lg text-[11px] font-medium shadow-sm"
                        style={{ backgroundColor: isDark ? WA.dateBubbleDark : WA.dateBubble, color: isDark ? '#8696A0' : WA.dateText }}
                      >
                        {group.date}
                      </span>
                    </div>

                    {group.messages.map((message, index) => {
                      const isMyMessage = message.senderId === adminId;
                      const prevMsg = index > 0 ? group.messages[index - 1] : null;
                      const isConsecutive = prevMsg && prevMsg.senderId === message.senderId;

                      return (
                        <motion.div
                          key={message.id || `msg-${gi}-${index}`}
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

                            <span
                              className="absolute bottom-[3px] right-[5px] flex items-center gap-0.5 float-right ml-2 -mt-[14px]"
                            >
                              <span className="text-[11px]" style={{ color: WA.timeSent }}>
                                {formatTimeShort(message.createdAt)}
                              </span>
                              {isMyMessage &&
                                (message.read ? (
                                  <CheckCheck className="h-[16px] w-[16px]" style={{ color: WA.checkRead }} />
                                ) : (
                                  <Check className="h-[16px] w-[16px]" style={{ color: WA.timeSent }} />
                                ))}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div className="shrink-0 flex items-end gap-1 px-1 py-1" style={{ backgroundColor: isDark ? WA.chatBgDark : WA.chatBg }}>
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 rounded-full">
                <Smile className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 rounded-full">
                <Paperclip className="h-5 w-5 rotate-45" />
              </Button>

              <div className="flex-1 relative">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Message"
                  disabled={isLoading}
                  className="w-full rounded-full px-4 py-2.5 text-[15px] outline-none resize-none border-none"
                  style={{ backgroundColor: isDark ? WA.inputBgDark : WA.inputBg, color: isDark ? '#E9EDEF' : WA.textDark, minHeight: '42px', maxHeight: '120px' }}
                />
              </div>

              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !newMessage.trim()}
                className="rounded-full shrink-0"
                style={{
                  width: '42px',
                  height: '42px',
                  backgroundColor: newMessage.trim() ? WA.headerTeal : 'transparent',
                  color: 'white',
                }}
                size="icon"
              >
                {newMessage.trim() ? (
                  <Send className="h-5 w-5" />
                ) : (
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
        )}
      </div>
      <style jsx global>{`
        .dark {
          --wa-bg: ${WA.chatBgDark};
          --wa-input-bg: ${WA.inputBgDark};
          --wa-header: ${WA.headerDark};
        }
      `}</style>
    </div>
  );
}
