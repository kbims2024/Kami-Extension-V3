'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Send, Menu, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender: 'user' | 'admin';
  text: string;
  timestamp: Date;
}

interface ChatScreenProps {
  currentUser: any;
  setCurrentScreen: (screen: string) => void;
  setIsMenuOpen: (open: boolean) => void;
}

export function ChatScreen({ currentUser, setCurrentScreen, setIsMenuOpen }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    if (!currentUser?.id) return;

    try {
      const response = await fetch(`/api/chat?userId=${currentUser.id}`);
      if (response.ok) {
        const data = await response.json();
        const formattedMessages = data.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser?.id) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          sender: 'user',
          text: messageText,
        }),
      });

      if (response.ok) {
        const message = await response.json();
        setMessages([...messages, { ...message, timestamp: new Date(message.timestamp) }]);
      } else {
        toast.error('Erreur lors de l\'envoi du message');
        setNewMessage(messageText);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erreur lors de l\'envoi du message');
      setNewMessage(messageText);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-card min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center px-4 py-3 bg-card border-b border-border sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentScreen('home')}
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#8B5E3C] rounded-full flex items-center justify-center">
              <MessageCircle className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground">Discussion avec l'administrateur</h1>
              <p className="text-[10px] text-muted-foreground">Support KAMI-EXTENSION</p>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu className="h-5 w-5 text-foreground" />
        </Button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">Aucun message</p>
              <p className="text-xs text-muted-foreground">
                Commencez la discussion avec l'administrateur
              </p>
            </CardContent>
          </Card>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <Card
                className={`max-w-[80%] ${
                  message.sender === 'user'
                    ? 'bg-[#8B5E3C] text-white border-[#8B5E3C]'
                    : 'bg-muted text-foreground border-border'
                }`}
              >
                <CardContent className="p-3">
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      message.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex gap-2">
          <Input
            placeholder="Écrivez votre message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading || !currentUser?.id}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={loading || !newMessage.trim() || !currentUser?.id}
            className="bg-[#8B5E3C] hover:bg-[#6B472C] text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {!currentUser?.id && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Connectez-vous pour envoyer des messages
          </p>
        )}
      </div>
    </div>
  );
}