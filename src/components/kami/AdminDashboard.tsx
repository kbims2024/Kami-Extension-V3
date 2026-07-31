'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
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
  MapPin
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

  const lotStatsData = [
    { name: 'Disponibles', value: stats?.availableLots || 0, color: '#10B981' },
    { name: 'Réservés', value: stats?.reservedLots || 0, color: '#F59E0B' },
    { name: 'Soldés', value: stats?.paidLots || 0, color: '#EF4444' }
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

  return (
    <div className="space-y-6">
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground">
          Retour
        </Button>
      )}

      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Tableau de Bord Administrateur</h2>
        <p className="text-muted-foreground">Aperçu global de la plateforme</p>
      </div>

      {/* Cartes de statistiques principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Utilisateurs"
          value={stats?.totalUsers || 0}
          description={`${stats?.activeUsers || 0} actifs`}
          icon={<Users className="h-5 w-5 text-primary" />}
          change={'+12%'}
          changePositive={true}
        />
        <StatCard
          title="Lots Disponibles"
          value={stats?.availableLots || 0}
          description={`Sur ${stats?.totalLots || 0} total`}
          icon={<Building2 className="h-5 w-5 text-emerald-500" />}
        />
        <StatCard
          title="Chiffre d'Affaires"
          value={formatCurrency(stats?.totalRevenue || 0)}
          description={`${stats?.paymentsThisMonth || 0} paiements ce mois`}
          icon={<Wallet className="h-5 w-5 text-[#8B5E3C]" />}
          change={'+23%'}
          changePositive={true}
        />
        <StatCard
          title="Réservations"
          value={stats?.reservationsThisMonth || 0}
          description="Ce mois-ci"
          icon={<Calendar className="h-5 w-5 text-blue-500" />}
          change={'+8%'}
          changePositive={true}
        />
      </div>

      {/* Graphiques */}
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
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPieChart>
                <Pie
                  data={lotStatsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {lotStatsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats?.availableLots || 0}</div>
                <div className="text-xs text-muted-foreground">Disponibles</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats?.reservedLots || 0}</div>
                <div className="text-xs text-muted-foreground">Réservés</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-950/20">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats?.paidLots || 0}</div>
                <div className="text-xs text-muted-foreground">Soldés</div>
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
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  className="text-xs"
                  stroke="currentColor"
                />
                <YAxis
                  className="text-xs"
                  stroke="currentColor"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="reservations" stroke={COLORS[4]} strokeWidth={2} name="Réservations" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Détails avec onglets */}
      <Tabs defaultValue="lots" className="space-y-4">
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