'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Home
} from 'lucide-react'
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
  subscribers: number
  totalRevenue: number
  pendingPayments: number
  reservationsThisMonth: number
  paymentsThisMonth: number
  averagePaymentPerUser: number
  occupancyRate: number
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
  onClick?: () => void
  isActive?: boolean
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changePositive = true,
  icon,
  description,
  trend,
  onClick,
  isActive
}) => (
  <Card
    onClick={onClick}
    className={`${onClick ? 'cursor-pointer transition-shadow hover:shadow-lg' : ''} ${isActive ? 'ring-2 ring-primary/30' : ''}`}
  >
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
interface UserSummary {
  id: string
  name: string
  phone: string
  email?: string | null
  isResident: boolean
  quartier?: string | null
  villageOrigine?: string | null
  status: string
  createdAt: string
}

interface SubscriberSummary {
  id: string
  name: string
  phone: string
  email?: string | null
  role: string
  isResident: boolean
  quartier?: string | null
  villageOrigine?: string | null
  pseudo?: string | null
  status: string
  createdAt: string
  lotsReservedCount: number
  lotsPurchasedCount: number
  totalLotsCount: number
  totalAmountPaid: number
  totalAmountRemaining: number
}

interface AdminDashboardProps {
  onBack?: () => void
  setCurrentScreen?: (screen: string) => void
  setAdminView?: (view: string) => void
  onHome?: () => void
}

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#8B5E3C', '#3B82F6']

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack, setCurrentScreen, setAdminView, onHome }) => {
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [stats, setStats] = useState<AdminStats | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])
  const [lots, setLots] = useState<Lot[]>([])
  const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([])
  const [users, setUsers] = useState<UserSummary[]>([])
  const [subscribers, setSubscribers] = useState<SubscriberSummary[]>([])
  const [selectedDetail, setSelectedDetail] = useState<string | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'lots' | 'payments'>('lots')

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
          <p className="text-muted-foreground">Chargement du tableau de bord global...</p>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} FCFA`
  }

  const lotStatsData = [
    { name: 'Lots Disponibles', value: stats?.availableLots || 0, color: '#10B981' },
    { name: 'Lots Réservés', value: stats?.reservedLots || 0, color: '#F59E0B' },
    { name: 'Lots Achetés', value: stats?.paidLots || 0, color: '#EF4444' }
  ]

  const paymentStatusData = [
    { name: 'Validés', value: stats?.paidLots || 0, color: '#10B981' },
    { name: 'En attente', value: stats?.pendingPayments || 0, color: '#F59E0B' }
  ]

  const monthlyData = [
    { month: 'Jan', revenue: 0, reservations: 0 },
    { month: 'Fév', revenue: 0, reservations: 0 },
    { month: 'Mar', revenue: 0, reservations: 0 },
    { month: 'Avr', revenue: 0, reservations: 0 },
    { month: 'Mai', revenue: 0, reservations: 0 },
    { month: 'Juin', revenue: 0, reservations: 0 },
    { month: 'Juil', revenue: stats?.totalRevenue || 0, reservations: stats?.reservationsThisMonth || 0 },
  ]

  const loadUsers = async () => {
    setDetailLoading(true)
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setDetailLoading(false)
    }
  }

  const loadSubscribers = async () => {
    setDetailLoading(true)
    try {
      const response = await fetch('/api/admin/subscriber-tracking')
      if (response.ok) {
        const data = await response.json()
        setSubscribers(data)
      }
    } catch (error) {
      console.error('Error loading subscribers:', error)
    } finally {
      setDetailLoading(false)
    }
  }

  const handleCardClick = (detail: string) => {
    setSelectedDetail(detail)
    if (detail === 'Utilisateurs' && users.length === 0) {
      loadUsers()
    }
    if (detail === 'Souscripteurs' && subscribers.length === 0) {
      loadSubscribers()
    }
    if (detail === 'Lots Achetés') {
      setActiveTab('payments')
    }
    if (detail === 'Lots Disponibles' || detail === 'Lots Réservés') {
      setActiveTab('lots')
    }
  }

  const renderDetailSection = () => {
    if (!selectedDetail) return null

    if (detailLoading) {
      return (
        <Card>
          <CardContent>
            <p className="text-muted-foreground">Chargement des détails...</p>
          </CardContent>
        </Card>
      )
    }

    switch (selectedDetail) {
      case 'Utilisateurs':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs</CardTitle>
              <CardDescription>Liste des utilisateurs avec statut et contact.</CardDescription>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun utilisateur trouvé.</p>
              ) : (
                <div className="grid gap-3">
                  {users.map((user) => (
                    <Card key={user.id} className="border-border">
                      <CardContent className="grid gap-2 sm:grid-cols-2">
                        <div>
                          <p className="text-sm font-semibold">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.phone}</p>
                          {user.email && <p className="text-xs text-muted-foreground">{user.email}</p>}
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-xs text-muted-foreground">Statut</p>
                          <p className="font-medium">{user.status}</p>
                          <p className="text-xs text-muted-foreground">Type</p>
                          <p className="font-medium">{user.isResident ? 'Résident' : 'Non-résident'}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )
      case 'Souscripteurs':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Souscripteurs</CardTitle>
              <CardDescription>Liste des souscripteurs avec montant payé et lots.</CardDescription>
            </CardHeader>
            <CardContent>
              {subscribers.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun souscripteur trouvé.</p>
              ) : (
                <div className="grid gap-3">
                  {subscribers.map((subscriber) => (
                    <Card key={subscriber.id} className="border-border">
                      <CardContent className="grid gap-2 sm:grid-cols-2">
                        <div>
                          <p className="text-sm font-semibold">{subscriber.name}</p>
                          <p className="text-xs text-muted-foreground">{subscriber.phone}</p>
                          {subscriber.email && <p className="text-xs text-muted-foreground">{subscriber.email}</p>}
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-xs text-muted-foreground">Lots réservés</p>
                          <p className="font-medium">{subscriber.lotsReservedCount}</p>
                          <p className="text-xs text-muted-foreground">Lots achetés</p>
                          <p className="font-medium">{subscriber.lotsPurchasedCount}</p>
                          <p className="text-xs text-muted-foreground">Montant payé</p>
                          <p className="font-medium">{subscriber.totalAmountPaid.toLocaleString()} FCFA</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )
      case 'Lots Disponibles':
      case 'Lots Réservés':
      case 'Lots Achetés':
        const statusMap = {
          'Lots Disponibles': 'AVAILABLE',
          'Lots Réservés': 'RESERVED',
          'Lots Achetés': 'PAID',
        } as const
        const filteredLots = lots.filter((lot) => lot.status === statusMap[selectedDetail as keyof typeof statusMap])
        return (
          <Card>
            <CardHeader>
              <CardTitle>{selectedDetail}</CardTitle>
              <CardDescription>{filteredLots.length} lot{filteredLots.length > 1 ? 's' : ''} affiché{filteredLots.length > 1 ? 's' : ''}</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredLots.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun lot trouvé pour ce statut.</p>
              ) : (
                <div className="grid gap-3">
                  {filteredLots.map((lot) => (
                    <Card key={lot.id} className="border-border">
                      <CardContent className="grid gap-2 sm:grid-cols-2">
                        <div>
                          <p className="text-sm font-semibold">{lot.name}</p>
                          <p className="text-xs text-muted-foreground">Îlot {lot.block} • {lot.surface}</p>
                          <p className="text-xs text-muted-foreground">{lot.description || 'Aucune description'}</p>
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-xs text-muted-foreground">Prix Résident</p>
                          <p className="font-medium">{formatCurrency(lot.priceRes)}</p>
                          <p className="text-xs text-muted-foreground">Prix Non-Résident</p>
                          <p className="font-medium">{formatCurrency(lot.priceNon)}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )
      case "Chiffre d'Affaires":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Chiffre d'Affaires</CardTitle>
              <CardDescription>Liste des paiements récents et revenus détaillés.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 mb-4 sm:grid-cols-2">
                <div className="rounded-lg bg-emerald-50 p-4">
                  <p className="text-xs text-muted-foreground">Revenu total</p>
                  <p className="text-xl font-bold">{formatCurrency(stats?.totalRevenue || 0)}</p>
                </div>
                <div className="rounded-lg bg-orange-50 p-4">
                  <p className="text-xs text-muted-foreground">Paiements ce mois</p>
                  <p className="text-xl font-bold">{stats?.paymentsThisMonth || 0}</p>
                </div>
              </div>
              {recentPayments.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun paiement récent.</p>
              ) : (
                <div className="grid gap-3">
                  {recentPayments.map((payment) => (
                    <Card key={payment.id} className="border-border">
                      <CardContent className="grid gap-2 sm:grid-cols-2">
                        <div>
                          <p className="text-sm font-semibold">{payment.userName}</p>
                          <p className="text-xs text-muted-foreground">Lot {payment.lotName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(payment.amount)}</p>
                          <p className="text-xs text-muted-foreground">{new Date(payment.createdAt).toLocaleDateString('fr-FR')}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {onBack && (
        <div className="flex items-center gap-1">
          <Button variant="ghost" onClick={onBack} className="text-muted-foreground">
            Retour
          </Button>
          {onHome && (
            <Button variant="ghost" size="icon" onClick={onHome} className="text-muted-foreground">
              <Home className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Tableau de Bord Global</h2>
        <p className="text-muted-foreground">Aperçu global de la plateforme</p>
      </div>

      {/* Cartes de statistiques principales */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="Utilisateurs"
          value={stats?.totalUsers || 0}
          description={`${stats?.activeUsers || 0} actifs`}
          icon={<Users className="h-5 w-5 text-primary" />}
          change={'+12%'}
          changePositive={true}
          onClick={() => handleCardClick('Utilisateurs')}
          isActive={selectedDetail === 'Utilisateurs'}
        />
        <StatCard
          title="Souscripteurs"
          value={stats?.subscribers || 0}
          description="Utilisateurs ayant réservé ou acheté"
          icon={<TrendingUp className="h-5 w-5 text-cyan-500" />}
          onClick={() => handleCardClick('Souscripteurs')}
          isActive={selectedDetail === 'Souscripteurs'}
        />
        <StatCard
          title="Lots Disponibles"
          value={stats?.availableLots || 0}
          description={`Sur ${stats?.totalLots || 0} total`}
          icon={<Building2 className="h-5 w-5 text-emerald-500" />}
          onClick={() => handleCardClick('Lots Disponibles')}
          isActive={selectedDetail === 'Lots Disponibles'}
        />
        <StatCard
          title="Lots Réservés"
          value={stats?.reservedLots || 0}
          description="En attente de finalisation"
          icon={<Calendar className="h-5 w-5 text-orange-500" />}
          onClick={() => handleCardClick('Lots Réservés')}
          isActive={selectedDetail === 'Lots Réservés'}
        />
        <StatCard
          title="Lots Achetés"
          value={stats?.paidLots || 0}
          description="Transactions finalisées"
          icon={<CheckCircle2 className="h-5 w-5 text-red-500" />}
          onClick={() => handleCardClick('Lots Achetés')}
          isActive={selectedDetail === 'Lots Achetés'}
        />
        <StatCard
          title="Chiffre d'Affaires"
          value={formatCurrency(stats?.totalRevenue || 0)}
          description={`${stats?.paymentsThisMonth || 0} paiements ce mois`}
          icon={<Wallet className="h-5 w-5 text-[#8B5E3C]" />}
          change={'+23%'}
          changePositive={true}
          onClick={() => handleCardClick("Chiffre d'Affaires")}
          isActive={selectedDetail === "Chiffre d'Affaires"}
        />
      </div>
      <Dialog open={!!selectedDetail} onOpenChange={() => setSelectedDetail(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="border-b border-border px-6 py-4">
            <DialogTitle className="text-lg font-semibold">
              {selectedDetail || 'Détails'}
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            {renderDetailSection()}
          </div>
        </DialogContent>
      </Dialog>

      {/* Graphiques */}
      {isClient && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Répartition des lots */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Répartition des Lots
              </CardTitle>
              <CardDescription>
                État actuel de tous les lots
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
                  <Pie
                    data={lotStatsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {lotStatsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} verticalAlign="bottom" height={36} />
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-3 gap-3 mt-4 min-w-0 overflow-hidden">
                <div className="text-center p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats?.availableLots || 0}</div>
                  <div className="text-xs text-muted-foreground">Lots Disponibles</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats?.reservedLots || 0}</div>
                  <div className="text-xs text-muted-foreground">Lots Réservés</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-950/20">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats?.paidLots || 0}</div>
                  <div className="text-xs text-muted-foreground">Lots Achetés</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Évolution mensuelle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Évolution Mensuelle
              </CardTitle>
              <CardDescription>
                Réservations et revenus des 6 derniers mois
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={monthlyData} margin={{ top: 20, right: 10, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="month"
                    interval={0}
                    tick={{ fontSize: 10, fill: 'currentColor' }}
                    stroke="currentColor"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: 'currentColor' }}
                    stroke="currentColor"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend verticalAlign="top" height={30} wrapperStyle={{ fontSize: 11, paddingBottom: 6 }} />
                  <Line type="monotone" dataKey="reservations" stroke={COLORS[4]} strokeWidth={2} name="Réservations" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Détails avec onglets */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'lots' | 'payments')} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lots" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Lots ({lots.length})
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Paiements ({recentPayments.length})
          </TabsTrigger>
        </TabsList>

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
                    <div className="text-center py-8 text-muted-foreground">
                      <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Aucun paiement récent</p>
                    </div>
                  ) : (
                    recentPayments.map((payment) => (
                      <Card key={payment.id} className="border-border">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-foreground">{payment.userName}</h4>
                              <p className="text-sm text-muted-foreground">Lot {payment.lotName}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-foreground">{formatCurrency(payment.amount)}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(payment.createdAt).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <Badge
                              variant={payment.status === 'VALIDATED' ? 'default' : 'secondary'}
                              className={
                                payment.status === 'VALIDATED'
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                  : ''
                              }
                            >
                              {payment.status === 'VALIDATED' ? (
                                <>
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Validé
                                </>
                              ) : (
                                <>
                                  <Clock className="h-3 w-3 mr-1" />
                                  En attente
                                </>
                              )}
                            </Badge>
                            <Badge variant="outline">
                              {payment.type}
                            </Badge>
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
  )
}