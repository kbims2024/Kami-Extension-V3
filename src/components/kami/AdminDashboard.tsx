'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Building2,
  Wallet,
  TrendingUp,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Activity,
  MapPin,
  ShoppingCart,
  UserCheck,
  UserPlus,
  MessageSquare,
  Ban,
  ShieldAlert,
  Trash2
} from 'lucide-react'
import { toast } from 'sonner'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'

// Types pour les données administratives
interface AdminStats {
  totalLots: number
  availableLots: number
  reservedLots: number
  paidLots: number
  totalUsers: number
  activeUsers: number
  totalRevenue: number
  pendingPayments: number
  reservationsThisMonth: number
  paymentsThisMonth: number
  averagePaymentPerUser: number
  occupancyRate: number
}

interface User {
  id: string
  name: string
  phone: string
  isResident: boolean
  referralCode: string
  status: string
  reservationCount: number
  totalPaid: number
  createdAt: string
}

interface Lot {
  id: string
  name: string
  block: string
  surface: string
  priceRes: number
  priceNon: number
  status: string
  description?: string
}

interface RecentPayment {
  id: string
  userName: string
  lotName: string
  amount: number
  status: string
  type: string
  createdAt: string
}

// Composant de carte de statistique
interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changePositive?: boolean
  icon: React.ReactNode
  description?: string
  trend?: number
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changePositive = true,
  icon,
  description,
  trend
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <div className="p-2 bg-primary/10 rounded-lg">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-foreground">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
      {(change || trend !== undefined) && (
        <div className={`flex items-center text-xs mt-2 ${changePositive ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
          {changePositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
          <span>{change || `${trend?.toFixed(1)}%`}</span>
        </div>
      )}
    </CardContent>
  </Card>
)

// Composant principal du tableau de bord administrateur
interface AdminDashboardProps {
  onBack?: () => void
  setCurrentScreen?: (screen: string) => void
}

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#8B5E3C', '#3B82F6']

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack, setCurrentScreen }) => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [lots, setLots] = useState<Lot[]>([])
  const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([])

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true)
      try {
        // Fetch admin statistics
        const statsResponse = await fetch('/api/admin/dashboard-stats')
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        }

        // Fetch users
        const usersResponse = await fetch('/api/admin/users')
        if (usersResponse.ok) {
          const usersData = await usersResponse.json()
          setUsers(usersData)
        }

        // Fetch lots
        const lotsResponse = await fetch('/api/lots')
        if (lotsResponse.ok) {
          const lotsData = await lotsResponse.json()
          setLots(lotsData)
        }

        // Fetch payments
        const paymentsResponse = await fetch('/api/admin/payments-list')
        if (paymentsResponse.ok) {
          const paymentsData = await paymentsResponse.json()
          setRecentPayments(paymentsData.slice(0, 10)) // Last 10 payments
        }
      } catch (error) {
        console.error('Error loading admin dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement du tableau de bord administrateur...</p>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} FCFA`
  }

  // Gestion des utilisateurs
  const handleBlockUser = async (userId: string, userName: string) => {
    if (!confirm(`Voulez-vous vraiment bloquer l'utilisateur ${userName} ?`)) return;

    try {
      const response = await fetch(`/api/admin/users/${encodeURIComponent(userId)}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'BLOCKED' }),
      });

      if (response.ok) {
        toast.success('Utilisateur bloqué avec succès !');
        // Recharger la liste des utilisateurs
        const usersResponse = await fetch('/api/admin/users');
        if (usersResponse.ok) {
          setUsers(await usersResponse.json());
        }
      } else {
        toast.error('Erreur lors du blocage de l\'utilisateur');
      }
    } catch (error) {
      toast.error('Erreur lors du blocage de l\'utilisateur');
    }
  }

  const handleUnblockUser = async (userId: string, userName: string) => {
    if (!confirm(`Voulez-vous vraiment débloquer l'utilisateur ${userName} ?`)) return;

    try {
      const response = await fetch(`/api/admin/users/${encodeURIComponent(userId)}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ACTIVE' }),
      });

      if (response.ok) {
        toast.success('Utilisateur débloqué avec succès !');
        // Recharger la liste des utilisateurs
        const usersResponse = await fetch('/api/admin/users');
        if (usersResponse.ok) {
          setUsers(await usersResponse.json());
        }
      } else {
        toast.error('Erreur lors du déblocage de l\'utilisateur');
      }
    } catch (error) {
      toast.error('Erreur lors du déblocage de l\'utilisateur');
    }
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${userName} ? Cette action est irréversible.`)) return;

    try {
      const response = await fetch(`/api/admin/users?id=${encodeURIComponent(userId)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Utilisateur supprimé avec succès !');
        // Recharger la liste des utilisateurs
        const usersResponse = await fetch('/api/admin/users');
        if (usersResponse.ok) {
          setUsers(await usersResponse.json());
        }
      } else {
        toast.error('Erreur lors de la suppression de l\'utilisateur');
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression de l\'utilisateur');
    }
  }

  // Données pour les graphiques
  const lotStatusData = [
    { name: 'Disponible', value: stats?.availableLots || 0, color: '#10B981' },
    { name: 'Réservé', value: stats?.reservedLots || 0, color: '#F59E0B' },
    { name: 'Payé', value: stats?.paidLots || 0, color: '#EF4444' }
  ]

  const blockDistribution = lots.reduce((acc, lot) => {
    const block = lot.block
    if (!acc[block]) {
      acc[block] = { block, available: 0, reserved: 0, paid: 0 }
    }
    if (lot.status === 'AVAILABLE') acc[block].available++
    else if (lot.status === 'RESERVED') acc[block].reserved++
    else if (lot.status === 'PAID') acc[block].paid++
    return acc
  }, {} as Record<string, any>)

  const blockData = Object.values(blockDistribution)

  const userStatsData = [
    { name: 'Résidents', value: users.filter(u => u.isResident).length, color: '#8B5E3C' },
    { name: 'Non-Résidents', value: users.filter(u => !u.isResident).length, color: '#3B82F6' }
  ]

  const revenueData = recentPayments.slice(0, 7).reverse().map((payment, index) => ({
    name: new Date(payment.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
    montant: payment.amount,
    lot: payment.lotName
  }))

  return (
    <div className="min-h-screen flex flex-col bg-background pb-20">
      {/* Header */}
      <header className="bg-card p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowUpRight className="h-5 w-5 text-foreground rotate-180" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Tableau de Bord Admin</h1>
            <p className="text-xs text-muted-foreground">Vue d'ensemble de la plateforme</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-[#8B5E3C]">Administration</Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentScreen?.('admin-chat')}
            className="hover:bg-blue-50 dark:hover:bg-blue-950"
          >
            <MessageSquare className="h-5 w-5 text-foreground" />
          </Button>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6">
        {/* Cartes de statistiques principales */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Lots"
            value={stats?.totalLots || 0}
            icon={<Building2 className="h-5 w-5 text-primary" />}
            description="Lots dans le système"
            trend={stats?.occupancyRate}
          />
          <StatCard
            title="Utilisateurs"
            value={stats?.totalUsers || 0}
            icon={<Users className="h-5 w-5 text-blue-500 dark:text-blue-400" />}
            description="Utilisateurs inscrits"
            change={stats?.activeUsers ? `${stats.activeUsers} actifs` : undefined}
          />
          <StatCard
            title="Revenus Totaux"
            value={`${(stats?.totalRevenue || 0).toLocaleString()} FCFA`}
            icon={<DollarSign className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />}
            description="Cumul des paiements"
          />
          <StatCard
            title="Paiements en attente"
            value={stats?.pendingPayments || 0}
            icon={<AlertCircle className="h-5 w-5 text-orange-500 dark:text-orange-400" />}
            description="À valider"
            changePositive={false}
          />
        </div>

        {/* Graphiques principaux */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Distribution des lots par statut */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Distribution des Lots
              </CardTitle>
              <CardDescription>
                Répartition par statut
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={lotStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {lotStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => value.toLocaleString()} />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Répartition par îlots */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Répartition par Îlots
              </CardTitle>
              <CardDescription>
                Distribution des lots par bloc
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={blockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="block" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => value.toLocaleString()} />
                  <Legend />
                  <Bar dataKey="available" stackId="a" fill="#10B981" name="Disponible" />
                  <Bar dataKey="reserved" stackId="a" fill="#F59E0B" name="Réservé" />
                  <Bar dataKey="paid" stackId="a" fill="#EF4444" name="Payé" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Statistiques utilisateurs et revenus */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Types d'utilisateurs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                Types d'Utilisateurs
              </CardTitle>
              <CardDescription>
                Résidents vs Non-Résidents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <RechartsPieChart>
                  <Pie
                    data={userStatsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {userStatsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => value.toLocaleString()} />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Résidents</p>
                  <p className="text-2xl font-bold text-[#8B5E3C] dark:text-[#A5785C]">
                    {users.filter(u => u.isResident).length}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Non-Résidents</p>
                  <p className="text-2xl font-bold text-blue-500 dark:text-blue-400">
                    {users.filter(u => !u.isResident).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Historique des revenus récents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Revenus Récents
              </CardTitle>
              <CardDescription>
                Derniers paiements (7 derniers)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Montant']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="montant" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="Montant"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Statistiques détaillées */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Réservations ce mois"
            value={stats?.reservationsThisMonth || 0}
            icon={<ShoppingCart className="h-5 w-5 text-purple-500 dark:text-purple-400" />}
            description="Nouvelles réservations"
          />
          <StatCard
            title="Paiements ce mois"
            value={stats?.paymentsThisMonth || 0}
            icon={<Wallet className="h-5 w-5 text-cyan-500 dark:text-cyan-400" />}
            description="Transactions validées"
          />
          <StatCard
            title="Moyenne par utilisateur"
            value={formatCurrency(stats?.averagePaymentPerUser || 0)}
            icon={<TrendingUp className="h-5 w-5 text-rose-500 dark:text-rose-400" />}
            description="Investissement moyen"
          />
        </div>

        {/* Détails avec onglets */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Utilisateurs ({users.length})
            </TabsTrigger>
            <TabsTrigger value="lots" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Lots ({lots.length})
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Paiements ({recentPayments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Liste des Utilisateurs</CardTitle>
                <CardDescription>
                  Tous les utilisateurs inscrits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {users.map((user, index) => (
                      <Card key={user.id || `admin-user-${index}`} className="border-border">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-foreground">{user.name}</h4>
                                <Badge
                                  variant={user.status === 'ACTIVE' ? 'default' : 'secondary'}
                                  className={user.status === 'ACTIVE' ? 'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500' : ''}
                                >
                                  {user.status === 'ACTIVE' ? 'Actif' : 'Bloqué'}
                                </Badge>
                                <Badge
                                  variant="secondary"
                                  className={user.isResident ? 'bg-[#8B5E3C]/10 text-[#8B5E3C] dark:text-[#A5785C]' : 'bg-blue-500/10 text-blue-500 dark:text-blue-400'}
                                >
                                  {user.isResident ? 'Résident' : 'Non-Résident'}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {user.phone} • Code: {user.referralCode}
                              </p>
                            </div>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Réservations</span>
                              <span className="font-medium text-foreground">{user.reservationCount}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Total Payé</span>
                              <span className="font-medium text-emerald-500 dark:text-emerald-400">
                                {formatCurrency(user.totalPaid)}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                            {user.status === 'ACTIVE' ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleBlockUser(user.id, user.name)}
                                className="flex-1 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30"
                              >
                                <Ban className="h-4 w-4 mr-1" />
                                Bloquer
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUnblockUser(user.id, user.name)}
                                className="flex-1 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                              >
                                <ShieldAlert className="h-4 w-4 mr-1" />
                                Débloquer
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id, user.name)}
                              className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lots" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Liste des Lots</CardTitle>
                <CardDescription>
                  Tous les lots de la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {lots.map((lot) => {
                      const getStatusBadge = () => {
                        switch (lot.status) {
                          case 'AVAILABLE':
                            return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">DISPONIBLE</Badge>
                          case 'RESERVED':
                            return <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">RÉSERVÉ</Badge>
                          case 'PAID':
                            return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">SOLDÉ</Badge>
                        }
                      }
                      
                      return (
                        <Card key={lot.id} className="border-border">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-foreground">{lot.name}</h4>
                                  {getStatusBadge()}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Îlot {lot.block} • {lot.surface}
                                </p>
                              </div>
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Prix Résident</span>
                                <span className="font-medium text-[#8B5E3C] dark:text-[#A5785C]">
                                  {formatCurrency(lot.priceRes)}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Prix Non-Résident</span>
                                <span className="font-medium text-blue-500 dark:text-blue-400">
                                  {formatCurrency(lot.priceNon)}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Paiements Récents</CardTitle>
                <CardDescription>
                  Derniers paiements effectués
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {recentPayments.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <DollarSign className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground">Aucun paiement récent</p>
                      </div>
                    ) : (
                      recentPayments.map((payment, index) => (
                        <Card key={payment.id || `recent-pay-${index}`} className="border-border">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-foreground">{payment.userName}</h4>
                                  <Badge
                                    variant={payment.status === 'VALIDATED' ? 'default' : 'secondary'}
                                    className={
                                      payment.status === 'VALIDATED'
                                        ? 'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500'
                                        : 'bg-orange-500/10 text-orange-500 dark:text-orange-400'
                                    }
                                  >
                                    {payment.status === 'VALIDATED' ? 'Validé' : 'En attente'}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Lot {payment.lotName} • {payment.type === 'FULL' ? 'Paiement complet' : 'Paiement partiel'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(payment.createdAt).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-foreground">
                                  {formatCurrency(payment.amount)}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AdminDashboard