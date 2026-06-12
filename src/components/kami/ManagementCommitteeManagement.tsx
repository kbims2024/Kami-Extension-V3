'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, UserPlus, UserMinus, Search, Shield, User, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface CommitteeMember {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  createdAt: string;
}

interface AvailableUser {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  role: string;
}

interface ManagementCommitteeManagementProps {
  onBack?: () => void;
}

export function ManagementCommitteeManagement({ onBack }: ManagementCommitteeManagementProps) {
  const [committeeMembers, setCommitteeMembers] = useState<CommitteeMember[]>([]);
  const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCommitteeMembers();
    loadAvailableUsers();
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

  const loadAvailableUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        // Filtrer les utilisateurs qui ne sont pas déjà dans le comité
        const available = data.filter(
          (user: AvailableUser) => user.role !== 'MANAGEMENT_COMMITTEE' && user.role !== 'ADMIN'
        );
        setAvailableUsers(available);
      }
    } catch (error) {
      console.error('Error loading available users:', error);
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
        loadAvailableUsers();
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
        loadAvailableUsers();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Erreur lors du retrait');
      }
    } catch (error) {
      toast.error('Erreur lors du retrait');
    }
  };

  const filteredAvailableUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery) ||
    (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col bg-card p-6 pt-16">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </Button>
        )}
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Chargement...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-card p-6 pt-16">
      {onBack && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4"
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </Button>
      )}

      <h2 className="text-2xl font-bold text-center text-foreground mb-6 flex items-center justify-center">
        <Shield className="mr-2 h-6 w-6 text-purple-600 dark:text-purple-400" />
        Gestion du Comité de Gestion des Lots
      </h2>

      <div className="space-y-6">
        {/* Membres actuels du comité */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              Membres du Comité
            </CardTitle>
            <CardDescription>
              Les membres de ce comité peuvent répondre aux questions des utilisateurs via le système de discussion.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {committeeMembers.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Aucun membre dans le comité de gestion
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Ajoutez des utilisateurs pour former le comité
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {committeeMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-foreground truncate">{member.name}</p>
                            <Badge className="bg-purple-600 hover:bg-purple-700 text-xs">
                              Membre
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{member.phone}</p>
                          {member.email && (
                            <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCommittee(member.id)}
                        className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Ajouter des membres */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Ajouter des membres
            </CardTitle>
            <CardDescription>
              Sélectionnez des utilisateurs pour les ajouter au comité de gestion
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

            <ScrollArea className="h-[400px]">
              {filteredAvailableUsers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {searchQuery ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur disponible'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredAvailableUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 bg-card rounded-lg border border-border hover:border-purple-400 dark:hover:border-purple-500 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground truncate">{user.name}</p>
                          <p className="text-sm text-muted-foreground truncate">{user.phone}</p>
                          {user.email && (
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => addToCommittee(user.id)}
                        className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Ajouter
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}