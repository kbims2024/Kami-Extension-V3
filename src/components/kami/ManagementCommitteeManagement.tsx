'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, UserPlus, UserMinus, Search, Shield, User, MessageSquare, Crown } from 'lucide-react';
import { toast } from 'sonner';

interface CommitteeMember {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  createdAt: string;
}

interface AllUser {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  role: string;
  createdAt: string;
}

interface ManagementCommitteeManagementProps {
  onBack?: () => void;
  setCurrentScreen?: (screen: string) => void;
  currentUser?: { id: string; role: string; name: string; phone: string } | null;
}

export function ManagementCommitteeManagement({ onBack, setCurrentScreen, currentUser }: ManagementCommitteeManagementProps) {
  const [committeeMembers, setCommitteeMembers] = useState<CommitteeMember[]>([]);
  const [allUsers, setAllUsers] = useState<AllUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCommitteeMembers();
    loadAllUsers();
  }, []);

  const loadCommitteeMembers = async () => {
    try {
      const response = await fetch('/api/admin/management-committee');
      if (response.ok) {
        const data = await response.json();
        setCommitteeMembers(data);
      }
    } catch (error) {
      console.error('Error loading committee members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setAllUsers(data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const addToCommittee = async (userId: string) => {
    try {
      const response = await fetch('/api/admin/management-committee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        toast.success('Membre ajouté au comité de gestion');
        loadCommitteeMembers();
        loadAllUsers();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Erreur lors de l\'ajout');
      }
    } catch (error) {
      toast.error('Erreur lors de l\'ajout');
    }
  };

  const removeFromCommittee = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/management-committee?userId=${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Membre retiré du comité de gestion');
        loadCommitteeMembers();
        loadAllUsers();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Erreur lors du retrait');
      }
    } catch (error) {
      toast.error('Erreur lors du retrait');
    }
  };

  const startChat = (userId: string, userName: string) => {
    localStorage.setItem('selectedChatUser', JSON.stringify({ id: userId, name: userName }));
    if (setCurrentScreen) {
      setCurrentScreen('admin-chat');
    }
  };

  const isCommitteeMember = (userId: string) => {
    return committeeMembers.some(member => member.id === userId);
  };

  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery) ||
    (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
        <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        Gestion du Comité de Gestion des Lots
      </h3>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-5 w-5 text-primary" />
            Tous les utilisateurs enregistrés
          </CardTitle>
          <CardDescription className="text-xs">
            Ajoutez ou retirez des membres du comité de gestion des lots
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              placeholder="Rechercher un utilisateur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <ScrollArea className="h-[500px]">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur enregistré'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredUsers.map((user, index) => {
                  const isMember = isCommitteeMember(user.id);
                  const isAdmin = user.role === 'ADMIN';

                  return (
                    <div
                      key={user.id || `committee-user-${index}`}
                      className={`flex items-center justify-between p-3 bg-card rounded-lg border ${
                        isMember 
                          ? 'border-purple-400 dark:border-purple-500 bg-purple-50/50 dark:bg-purple-950/20' 
                          : 'border-border'
                      } transition-colors`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isMember 
                            ? 'bg-purple-100 dark:bg-purple-900/30' 
                            : 'bg-muted'
                        }`}>
                          <User className={`h-5 w-5 ${
                            isMember 
                              ? 'text-purple-600 dark:text-purple-400' 
                              : 'text-muted-foreground'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-foreground truncate">{user.name}</p>
                            {isAdmin && (
                              <Badge className="bg-red-600 hover:bg-red-700 text-xs">
                                Admin
                              </Badge>
                            )}
                            {isMember && !isAdmin && (
                              <Badge className="bg-purple-600 hover:bg-purple-700 text-xs flex items-center gap-1">
                                <Crown className="h-3 w-3" />
                                Membre
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{user.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {!isMember && !isAdmin && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startChat(user.id, user.name)}
                            className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-400"
                            title="Discuter"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        )}
                        {isAdmin ? (
                          <Badge className="bg-muted text-muted-foreground text-xs px-2 py-1">
                            Non modifiable
                          </Badge>
                        ) : isMember ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCommittee(user.id)}
                            className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
                            title="Retirer du comité"
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => addToCommittee(user.id)}
                            className="hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-950 dark:hover:text-purple-400"
                            title="Ajouter au comité"
                          >
                            <UserPlus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="bg-muted/50 border-border">
        <CardContent className="p-3">
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <Badge className="bg-purple-600 hover:bg-purple-700 text-[10px]">Membre</Badge>
              <span className="text-muted-foreground">= Comité</span>
            </div>
            <div className="flex items-center gap-1.5">
              <UserPlus className="h-3 w-3 text-purple-600" />
              <span className="text-muted-foreground">= Ajouter</span>
            </div>
            <div className="flex items-center gap-1.5">
              <UserMinus className="h-3 w-3 text-red-500" />
              <span className="text-muted-foreground">= Retirer</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageSquare className="h-3 w-3 text-blue-500" />
              <span className="text-muted-foreground">= Discuter</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
