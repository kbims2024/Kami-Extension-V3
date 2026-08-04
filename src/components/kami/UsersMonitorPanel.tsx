'use client';

import { useState, useEffect, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  ArrowLeft,
  Home,
  Wifi,
  WifiOff,
  Clock,
  Users,
  User,
  Shield,
  Phone,
  Eye,
  RefreshCw,
  CircleDot,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MonitoredUser {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  role: string;
  status: string;
  isOnline: boolean;
  lastSeen: string | null;
  lastSeenRelative: string;
  createdAt: string;
}

interface MonitorData {
  all: MonitoredUser[];
  onlineUsers: MonitoredUser[];
  offlineUsers: MonitoredUser[];
  admins: MonitoredUser[];
  committeeMembers: MonitoredUser[];
  summary: {
    total: number;
    onlineCount: number;
    offlineCount: number;
  };
}

interface UsersMonitorPanelProps {
  onBack?: () => void;
  onHome?: () => void;
}

export function UsersMonitorPanel({ onBack, onHome }: UsersMonitorPanelProps) {
  const [data, setData] = useState<MonitorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'online' | 'offline'>('all');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/users-monitor');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Monitor load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    // Auto-refresh every 15 seconds
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, [loadData]);

  const filterUsers = useCallback(
    (users: MonitoredUser[]) =>
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.phone.includes(searchQuery) ||
          (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()))
      ),
    [searchQuery]
  );

  const getFilteredUsers = (): MonitoredUser[] => {
    if (!data) return [];
    switch (selectedTab) {
      case 'online':
        return filterUsers(data.onlineUsers);
      case 'offline':
        return filterUsers(data.offlineUsers);
      default:
        return filterUsers(data.all.filter((u) => u.role === 'USER'));
    }
  };

  const filtered = getFilteredUsers();
  const filteredAdmins = data ? filterUsers(data.admins) : [];
  const filteredCommittee = data ? filterUsers(data.committeeMembers) : [];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return (
          <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
            Admin
          </Badge>
        );
      case 'MANAGEMENT_COMMITTEE':
        return (
          <Badge className="bg-purple-600 text-white text-[10px] px-1.5 py-0 hover:bg-purple-700">
            Comité
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
            User
          </Badge>
        );
    }
  };

  const getStatusColor = (isOnline: boolean) => {
    return isOnline
      ? 'bg-emerald-500 dark:bg-emerald-400'
      : 'bg-gray-400 dark:bg-gray-500';
  };

  const getUserInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

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

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 text-muted-foreground animate-spin" />
        <p className="text-sm text-muted-foreground mt-3">Chargement de la surveillance...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border px-4 py-3 -mx-4 -mt-4 mb-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => onBack?.()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-bold text-foreground flex-1">Surveillance Utilisateurs</h2>
          {onHome && (
            <Button variant="ghost" size="icon" onClick={onHome}>
              <Home className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      {/* ─── Summary Cards ─── */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border border-border">
          <CardContent className="p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <CircleDot className="h-4 w-4 text-emerald-500" />
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {data?.summary.onlineCount || 0}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">En ligne</p>
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardContent className="p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <WifiOff className="h-4 w-4 text-gray-400" />
              <span className="text-2xl font-bold text-muted-foreground">
                {data?.summary.offlineCount || 0}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">Hors ligne</p>
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardContent className="p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {data?.summary.total || 0}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">Total</p>
          </CardContent>
        </Card>
      </div>

      {/* ─── Search + Refresh ─── */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher par nom, téléphone ou email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadData}
          className="shrink-0"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* ─── Tabs ─── */}
      <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
        {[
          { key: 'all' as const, label: 'Tous', count: data?.all.filter((u) => u.role === 'USER').length || 0 },
          { key: 'online' as const, label: 'En ligne', count: data?.summary.onlineCount || 0 },
          { key: 'offline' as const, label: 'Hors ligne', count: data?.summary.offlineCount || 0 },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key)}
            className={`flex-1 py-2 rounded-md text-xs font-semibold transition-all ${
              selectedTab === tab.key
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* ─── Committee & Admins section ─── */}
      {(filteredCommittee.length > 0 || filteredAdmins.length > 0) && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5" />
            Comité & Administration
          </p>
          {filteredAdmins.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              expanded={expandedUser === user.id}
              onToggle={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
              getRoleBadge={getRoleBadge}
              getStatusColor={getStatusColor}
              getUserInitials={getUserInitials}
              getAvatarColor={getAvatarColor}
            />
          ))}
          {filteredCommittee.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              expanded={expandedUser === user.id}
              onToggle={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
              getRoleBadge={getRoleBadge}
              getStatusColor={getStatusColor}
              getUserInitials={getUserInitials}
              getAvatarColor={getAvatarColor}
            />
          ))}
          <Separator />
        </div>
      )}

      {/* ─── Users list ─── */}
      <ScrollArea className="max-h-[500px]">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur inscrit'}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-1">
              {filtered.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  expanded={expandedUser === user.id}
                  onToggle={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                  getRoleBadge={getRoleBadge}
                  getStatusColor={getStatusColor}
                  getUserInitials={getUserInitials}
                  getAvatarColor={getAvatarColor}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </ScrollArea>

      {/* ─── Last refresh info ─── */}
      <p className="text-[10px] text-muted-foreground text-center flex items-center justify-center gap-1">
        <Clock className="h-3 w-3" />
        Actualisation automatique toutes les 15 secondes — Seuil deconnexion : 2 min d&apos;inactivité
      </p>
    </div>
  );
}

// ─── User Row Component ───

function UserRow({
  user,
  expanded,
  onToggle,
  getRoleBadge,
  getStatusColor,
  getUserInitials,
  getAvatarColor,
}: {
  user: MonitoredUser;
  expanded: boolean;
  onToggle: () => void;
  getRoleBadge: (role: string) => React.ReactNode;
  getStatusColor: (online: boolean) => string;
  getUserInitials: (name: string) => string;
  getAvatarColor: (name: string) => string;
}) {
  return (
    <motion.div layout className="group">
      <Card
        className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${
          user.isOnline ? 'border-emerald-200 dark:border-emerald-800/40' : 'border-border'
        } ${expanded ? 'ring-1 ring-primary/20' : ''}`}
        onClick={onToggle}
      >
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            {/* Avatar with online indicator */}
            <div className="relative flex-shrink-0">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                style={{ backgroundColor: getAvatarColor(user.name) }}
              >
                {getUserInitials(user.name)}
              </div>
              {/* Online dot */}
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-background ${getStatusColor(
                  user.isOnline
                )} ${user.isOnline ? 'animate-pulse' : ''}`}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm truncate text-foreground">{user.name}</p>
                {getRoleBadge(user.role)}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <Phone className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground truncate">{user.phone}</p>
              </div>
            </div>

            {/* Status */}
            <div className="text-right flex-shrink-0 ml-2">
              {user.isOnline ? (
                <div className="flex items-center gap-1">
                  <Wifi className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    En ligne
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[11px] text-muted-foreground">
                    {user.lastSeenRelative}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <Card className="border-t-0 rounded-t-none -mt-px">
              <CardContent className="p-4 space-y-3 bg-muted/30">
                <div className="grid grid-cols-2 gap-3">
                  <DetailItem
                    icon={<User className="h-3.5 w-3.5" />}
                    label="Téléphone"
                    value={user.phone}
                  />
                  <DetailItem
                    icon={<Shield className="h-3.5 w-3.5" />}
                    label="Rôle"
                    value={user.role === 'ADMIN' ? 'Administrateur' : user.role === 'MANAGEMENT_COMMITTEE' ? 'Comité de gestion' : 'Utilisateur'}
                  />
                  <DetailItem
                    icon={<Wifi className="h-3.5 w-3.5" />}
                    label="Statut"
                    value={user.isOnline ? '🟢 En ligne' : '🔴 Hors ligne'}
                  />
                  <DetailItem
                    icon={<Clock className="h-3.5 w-3.5" />}
                    label="Dernière connexion"
                    value={user.lastSeenRelative}
                  />
                </div>
                {user.lastSeen && (
                  <DetailItem
                    icon={<Eye className="h-3.5 w-3.5" />}
                    label="Date et heure exactes"
                    value={new Date(user.lastSeen).toLocaleString('fr-FR', {
                      dateStyle: 'full',
                      timeStyle: 'short',
                    })}
                  />
                )}
                {user.email && (
                  <DetailItem
                    icon={<User className="h-3.5 w-3.5" />}
                    label="Email"
                    value={user.email}
                  />
                )}
                <DetailItem
                  icon={<Clock className="h-3.5 w-3.5" />}
                  label="Inscrit le"
                  value={new Date(user.createdAt).toLocaleDateString('fr-FR', {
                    dateStyle: 'full',
                  })}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-muted-foreground mt-0.5">{icon}</span>
      <div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-xs font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
