'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, User, Check, CheckCheck } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

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
}

export function ChatPage({ setCurrentScreen, setIsMenuOpen }: ChatPageProps) {
  const { currentUser } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadMessages();
    // Poll for new messages every 5 seconds
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const loadMessages = async () => {
    if (!currentUser?.id) return;

    try {
      const response = await fetch(`/api/messages?userId=${currentUser.id}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser?.id || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newMessage,
          receiverId: 'ADMIN', // Special ID for admin
        }),
      });

      if (response.ok) {
        setNewMessage('');
        await loadMessages();
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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffMins < 1440) return `Il y a ${Math.floor(diffMins / 60)} h`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="flex-1 flex flex-col bg-card min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-card border-b border-border sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentScreen('home')}
            className="hover:bg-blue-50"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-foreground leading-tight">Discussion</h1>
            <p className="text-xs text-muted-foreground">Échange avec l'administrateur</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMenuOpen(true)}
          className="hover:bg-blue-50"
        >
          <User className="h-6 w-6 text-foreground" />
        </Button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-20">
            <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Aucun message pour le moment
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Envoyez votre premier message à l'administrateur
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isAdmin = message.senderId === 'ADMIN';
            const isMyMessage = message.senderId === currentUser?.id;

            return (
              <div
                key={message.id}
                className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    isMyMessage
                      ? 'bg-blue-600 text-white'
                      : isAdmin
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-foreground border border-purple-200 dark:border-purple-800'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {!isMyMessage && !isAdmin && (
                    <p className="text-xs font-semibold mb-1 opacity-70">
                      {message.sender.name}
                    </p>
                  )}
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <p className="text-xs opacity-70">
                      {formatTime(message.createdAt)}
                    </p>
                    {isMyMessage && (
                      message.read ? (
                        <CheckCheck className="h-3 w-3 opacity-70" />
                      ) : (
                        <Check className="h-3 w-3 opacity-70" />
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Écrivez votre message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !newMessage.trim()}
            className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}