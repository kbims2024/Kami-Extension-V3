'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, User, Users, Search, Check, CheckCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
}

export function AdminChatPage({ setCurrentScreen, setIsMenuOpen }: AdminChatPageProps) {
  const [adminId, setAdminId] = useState<string | null>(null);
  const [users, setUsers] = useState<SimpleUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<SimpleUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadAdminId();
  }, []);

  useEffect(() => {
    if (adminId) {
      loadUsers();
    }
  }, [adminId]);

  // Listen for selected user from localStorage
  useEffect(() => {
    const selectedChatUser = localStorage.getItem('selectedChatUser');
    if (selectedChatUser && adminId) {
      try {
        const user = JSON.parse(selectedChatUser);
        // Find the user in the users list
        const foundUser = users.find(u => u.id === user.id);
        if (foundUser) {
          setSelectedUser(foundUser);
          setSelectedUserId(foundUser.id);
        } else {
          // If not found in users list, create a temporary user object
          const tempUser: SimpleUser = {
            id: user.id,
            name: user.name,
            phone: '',
            isResident: false
          };
          setSelectedUser(tempUser);
          setSelectedUserId(tempUser.id);
        }
        // Clear the localStorage
        localStorage.removeItem('selectedChatUser');
      } catch (error) {
        console.error('Error parsing selected user:', error);
      }
    }
  }, [adminId, users]);

  useEffect(() => {
    if (selectedUserId) {
      loadMessages(selectedUserId);
      // Poll for new messages every 5 seconds
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
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
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

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery)
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col bg-card min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-card border-b border-border sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentScreen('admin')}
            className="hover:bg-blue-50"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-foreground leading-tight">Discussions</h1>
            <p className="text-xs text-muted-foreground">Comité de Gestion des Lots</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMenuOpen(true)}
          className="hover:bg-blue-50"
        >
          <Users className="h-6 w-6 text-foreground" />
        </Button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Users List */}
        {!selectedUser && (
          <div className="w-full p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-2">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  Aucun utilisateur trouvé
                </div>
              ) : (
                filteredUsers.map((user, index) => (
                  <Card
                    key={user.id || `chat-user-${index}`}
                    className="cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                    onClick={() => {
                      setSelectedUser(user);
                      setSelectedUserId(user.id);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground truncate">{user.name}</p>
                          <p className="text-sm text-muted-foreground truncate">{user.phone}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* Chat View */}
        {selectedUser && (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-border flex items-center gap-3 bg-card">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedUser(null);
                  setSelectedUserId(null);
                }}
              >
                <ArrowLeft className="h-5 w-5 text-foreground" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{selectedUser.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedUser.phone}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-20">
                  <Send className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Aucun message avec {selectedUser.name}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Envoyez votre premier message
                  </p>
                </div>
              ) : (
                messages.map((message, index) => {
                  const isMyMessage = message.senderId === adminId;

                  return (
                    <div
                      key={message.id || `admin-chat-msg-${index}`}
                      className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          isMyMessage
                            ? 'bg-purple-600 text-white'
                            : 'bg-muted text-foreground'
                        }`}
                      >
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
                  className="bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-600"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}