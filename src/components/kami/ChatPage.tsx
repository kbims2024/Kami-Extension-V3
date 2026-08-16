'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Home,
  Send,
  Check,
  CheckCheck,
  Mic,
  StopCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '@/store/useAppStore';
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
  borderLight: '#E9EDEF',
};

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  read: boolean;
  createdAt: string;
  sender: {
    name: string;
    phone: string;
  };
}

interface ChatPageProps {
  setCurrentScreen: (screen: string) => void;
  setIsMenuOpen: (open: boolean) => void;
  onHome?: () => void;
}

interface PublicDiscussionConfig {
  enabled: boolean;
  cglName: string;
  responseTimeText: string;
}

const DEFAULT_CHAT_CONFIG: PublicDiscussionConfig = {
  enabled: true,
  cglName: 'Comité de Gestion des Lots',
  responseTimeText: 'Réponse du CGL sous 24 h ouvrées',
};

export function ChatPage({ setCurrentScreen, setIsMenuOpen, onHome }: ChatPageProps) {
  const { currentUser } = useAppStore();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [chatConfig, setChatConfig] = useState<PublicDiscussionConfig>(DEFAULT_CHAT_CONFIG);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [currentUser]);

  useEffect(() => {
    let mounted = true;
    fetch('/api/discussion-config', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (mounted && data?.config) setChatConfig(data.config);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionConstructor =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition ||
      (window as any).mozSpeechRecognition;

    if (!SpeechRecognitionConstructor) {
      setSpeechSupported(false);
      recognitionRef.current = null;
      return;
    }

    const recognition = new SpeechRecognitionConstructor();
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      const cleanTranscript = transcript.trim();
      if (cleanTranscript) {
        setNewMessage((prev) => {
          const current = prev.trim();
          return current ? `${current} ${cleanTranscript}` : cleanTranscript;
        });
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error !== 'no-speech') {
        toast.error('Erreur de reconnaissance vocale');
      }
    };

    recognitionRef.current = recognition;
    setSpeechSupported(true);

    return () => {
      try { recognition.stop(); } catch {}
    };
  }, []);

  const handleVoiceInput = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      toast.error('Reconnaissance vocale non compatible avec ce navigateur');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    try {
      recognition.start();
      setIsListening(true);
    } catch (error) {
      console.error('Speech recognition start failed:', error);
      setIsListening(false);
      toast.error('Impossible de démarrer l’enregistrement vocal');
    }
  };

  const loadMessages = async () => {
    if (!currentUser?.id) {
      console.error('[ChatPage] Current user not available');
      return;
    }
    try {
      const response = await fetch(`/api/messages?userId=${currentUser.id}&markRead=true`);

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setMessages(data);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('kami:chat-read', { detail: { userId: currentUser.id } }));
      }
    } catch (error) {
      console.error('[ChatPage] Error loading messages:', error);
    }
  };

  const handleSendMessage = async () => {
    // Validation
    if (!newMessage.trim()) {
      toast.error('Le message ne peut pas être vide');
      return;
    }

    if (!chatConfig.enabled) {
      toast.error('Les discussions sont désactivées par le CGL');
      return;
    }

    if (!currentUser?.id) {
      toast.error('Vous devez être connecté pour envoyer un message');
      return;
    }

    if (isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      // D'abord, s'assurer que l'admin existe
      const ensureRes = await fetch('/api/admin/ensure');
      if (!ensureRes.ok) {
        throw new Error('Impossible de récupérer l\'administrateur');
      }
      const ensureData = await ensureRes.json();
      const adminId = ensureData.adminId;

      // Envoyer le message
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newMessage.trim(),
          receiverId: adminId,
          senderId: currentUser.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
        toast.error(error.error || 'Erreur lors de l\'envoi du message');
        return;
      }

      setNewMessage('');
      toast.success('Message envoyé');

      // Recharger les messages
      await loadMessages();
    } catch (error) {
      console.error('[ChatPage] Exception sending message:', error);
      toast.error('Erreur lors de l\'envoi du message. Vérifiez votre connexion.');
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

  // ─── Helpers ───

  const formatTimeShort = (dateString: string) => {
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

  // Group messages by date
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

  // ─── Render ───

  return (
    <div className="flex-1 flex flex-col h-screen max-h-screen bg-[var(--wa-bg)]" style={{ ['--wa-bg' as any]: WA.chatBg } as React.CSSProperties}>
      {/* ─── Header (WhatsApp green bar) ─── */}
      <header
        className="flex items-center px-2 py-1.5 shrink-0 relative z-20"
        style={{ backgroundColor: WA.headerDark }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentScreen('home')}
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

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center ml-1 flex-shrink-0">
          <span className="text-lg font-bold text-white">CG</span>
        </div>

        <div className="flex-1 ml-3 min-w-0">
          <h1 className="text-[15px] font-semibold text-white truncate leading-tight">
            {chatConfig.cglName}
          </h1>
          <p className="text-[12px] text-blue-200/90 leading-tight">
            {chatConfig.responseTimeText}
          </p>
        </div>
      </header>

      {/* ─── Chat area ─── */}
      <div
        className="flex-1 overflow-y-auto px-3 py-2 space-y-1"
        style={{
          backgroundImage: isDark
            ? `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            : `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {messages.length === 0 ? (
          <div className="mx-auto max-w-sm px-6 py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg">
              <span className="text-2xl font-bold text-white">CG</span>
            </div>
            <h2 className="text-base font-semibold" style={{ color: isDark ? '#E9EDEF' : WA.textDark }}>
              {chatConfig.cglName}
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed" style={{ color: WA.timeSent }}>
              Posez vos questions, signalez un problème ou transmettez une demande
              directement au Comité de Gestion des Lots. Un membre vous répond en
              général sous 24 h ouvrées.
            </p>
            <Button
              onClick={() => inputRef.current?.focus()}
              className="mt-5 rounded-full px-5"
              style={{ backgroundColor: WA.headerTeal }}
            >
              Démarrer la discussion
            </Button>
          </div>
        ) : (
          groupedMessages.map((group, gi) => (
            <div key={gi}>
              {/* Date separator */}
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

              {group.messages.map((message, index) => {
                const isMyMessage = message.senderId === currentUser?.id;
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
                      className={`relative max-w-[85%] md:max-w-[65%] px-3 py-2 shadow-sm ${isMyMessage ? 'rounded-3xl rounded-br-none' : 'rounded-3xl rounded-tl-none'}`}
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
                      <span className="absolute bottom-[5px] right-[8px] flex items-center gap-0.5 text-[11px]" style={{ color: WA.timeSent }}>
                        <span>{formatTimeShort(message.createdAt)}</span>
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

      {/* ─── Input bar (WhatsApp style) ─── */}
      <div className="shrink-0 flex items-center gap-2 px-3 py-3 border-t" style={{ backgroundColor: isDark ? '#121C2B' : '#F8FAFC', borderColor: isDark ? '#1F2A38' : '#E5E7EB' }}>
        {!chatConfig.enabled && (
          <div className="flex-1 rounded-xl px-4 py-3 text-[13px] font-medium text-center" style={{ backgroundColor: isDark ? '#1A2332' : '#F1F5F9', color: WA.timeSent }}>
            Les discussions sont temporairement désactivées par le CGL.
          </div>
        )}
        {chatConfig.enabled && (
        <>
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Écrire un message..."
            disabled={isLoading}
            className="w-full rounded-full px-4 py-3 text-[15px] outline-none border border-transparent focus:border-blue-300 focus:ring-2 focus:ring-blue-200"
            style={{
              backgroundColor: isDark ? WA.inputBgDark : WA.inputBg,
              color: isDark ? '#E9EDEF' : WA.textDark,
              minHeight: '46px',
              maxHeight: '120px',
            }}
          />
        </div>

        <Button
          onClick={newMessage.trim() ? handleSendMessage : handleVoiceInput}
          disabled={isLoading || (!newMessage.trim() && !speechSupported)}
          className="rounded-full shrink-0"
          style={{
            width: '46px',
            height: '46px',
            backgroundColor: newMessage.trim() ? WA.headerTeal : 'transparent',
            color: newMessage.trim() ? 'white' : '#64748B',
          }}
          size="icon"
        >
          {newMessage.trim() ? (
            <Send className="h-5 w-5" />
          ) : isListening ? (
            <StopCircle className="h-5 w-5" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </Button>
        </>
        )}
      </div>

      {/* ─── Dark mode overrides ─── */}
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
