'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
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
  Activity,
  MapPin,
  Home
} from 'lucide-react'

// Chargement dynamique des graphiques pour éviter les erreurs de build SSR
const AdminCharts = dynamic(() => import('./AdminCharts'), {
  ssr: false,
  loading: () => <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-lg animate-pulse">Chargement des graphiques...</div>
})

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

export const AdminDashboard: React.FC<any> = ({ onBack, setAdminView, onHome }) => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [lots, setLots] = useState<Lot[]>([])
  const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([])
  const [activeTab, setActiveTab] = useState<'lots' | 'payments'>('lots')

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true)
      try {
        const statsRes = await fetch('/api/admin/dashboard-stats')
        if (statsRes.ok) setStats(await statsRes.json())

        const lotsRes = await fetch('/api/lots')
        if (lotsRes.ok) setLots(await lotsRes.json())

        const paymentsRes = await fetch('/api/admin/payments-list')
        if (paymentsRes.ok) {
          const pData = await paymentsRes.json()
          setRecentPayments(pData.slice(0, 10))
        }
      } catch (error) {
        console.error('Error loading dashboard:', error)
      } finally {
        setLoading(false)
      }
    }
    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  const lotStatsData = [
    { name: 'Libres', value: stats?.availableLots || 0, color: '#10B981' },
    { name: 'Réservés', value: stats?.reservedLots || 0, color: '#F59E0B' },
    { name: 'Soldés', value: stats?.paidLots || 0, color: '#EF4444' }
  ]

  const monthlyData = [
    { month: 'Jan', reservations: 0 },
    { month: 'Fév', reservations: 0 },
    { month: 'Mar', reservations: 0 },
    { month: 'Avr', reservations: 0 },
    { month: 'Mai', reservations: 0 },
    { month: 'Juin', reservations: 0 },
    { month: 'Juil', reservations: stats?.reservationsThisMonth || 0 },
  ]

  return (
    <div className="space-y-6">
      {onBack && (
        <div className="flex items-center gap-1">
          <Button variant="ghost" onClick={onBack} className="text-muted-foreground">Retour</Button>
          {onHome && <Button variant="ghost" size="icon" onClick={onHome} className="text-muted-foreground"><Home className="h-4 w-4" /></Button>}
        </div>
      )}

      <div>
        <h2 className="text-3xl font-bold text-foreground mb-1">Administration</h2>
        <p className="text-sm text-muted-foreground">Aperçu global du projet</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard title="Utilisateurs" value={stats?.totalUsers || 0} description={`${stats?.activeUsers || 0} actifs`} icon={<Users className="h-5 w-5 text-primary" />} />
        <StatCard title="Souscripteurs" value={stats?.subscribers || 0} icon={<TrendingUp className="h-5 w-5 text-cyan-500" />} />
        <StatCard title="Lots Libres" value={stats?.availableLots || 0} icon={<Building2 className="h-5 w-5 text-emerald-500" />} />
        <StatCard title="Total Encaissé" value={`${(stats?.totalRevenue || 0).toLocaleString()} F`} icon={<Wallet className="h-5 w-5 text-[#8B5E3C]" />} />
      </div>

      {/* Graphiques chargés dynamiquement (Pas d'erreur SSR) */}
      <AdminCharts lotStatsData={lotStatsData} monthlyData={monthlyData} stats={stats} />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lots">Lots ({lots.length})</TabsTrigger>
          <TabsTrigger value="payments">Paiements ({recentPayments.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="lots">
          <Card><CardContent className="p-4"><ScrollArea className="h-[300px]">
            {lots.map(lot => (
              <div key={lot.id} className="py-2 border-b flex justify-between">
                <div><p className="font-bold">Lot {lot.name}</p><p className="text-xs text-muted-foreground">Bloc {lot.block}</p></div>
                <Badge variant="outline">{lot.status}</Badge>
              </div>
            ))}
          </ScrollArea></CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
