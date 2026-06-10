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
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  Percent,
  AlertCircle,
  User,
  Menu,
  Home,
  Map
} from 'lucide-react'

// Types pour les données utilisateur
interface UserStats {
  totalReserved: number
  totalPurchased: number
  totalPaid: number
  totalRemaining: number
  totalInvestment: number
  averageProgress: number
  totalAdvances: number
  paymentProgress: number
}

interface Reservation {
  id: string
  lotName: string
  block: string
  surface: string
  totalPrice: number
  paidAmount: number
  status: string
  createdAt: string
}

interface Payment {
  id: string
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
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changePositive = true,
  icon,
  description
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
      {change && (
        <div className={`flex items-center text-xs mt-2 ${changePositive ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
          {changePositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
          <span>{change}</span>
        </div>
      )}
    </CardContent>
  </Card>
)

// Composant de barre de progression
const ProgressBar: React.FC<{ value: number; max: number; label?: string }> = ({ value, max, label }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  
  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-medium text-foreground">{percentage.toFixed(1)}%</span>
        </div>
      )}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{value.toLocaleString()} FCFA</span>
        <span>{max.toLocaleString()} FCFA</span>
      </div>
    </div>
  )
}

// Composant principal du tableau de bord
interface UserDashboardProps {
  currentUser?: any
  setCurrentScreen?: (screen: string) => void
  setIsMenuOpen?: (open: boolean) => void
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ currentUser, setCurrentScreen, setIsMenuOpen }) => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [payments, setPayments] = useState<Payment[]>([])

  // Simulation de chargement des données
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true)
      try {
        // Fetch user statistics
        const statsResponse = await fetch(`/api/user/stats?userId=${currentUser?.id}`)
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        }

        // Fetch reservations
        const reservationsResponse = await fetch(`/api/user/reservations?userId=${currentUser?.id}`)
        if (reservationsResponse.ok) {
          const reservationsData = await reservationsResponse.json()
          setReservations(reservationsData)
        }

        // Fetch payments
        const paymentsResponse = await fetch(`/api/user/payments?userId=${currentUser?.id}`)
        if (paymentsResponse.ok) {
          const paymentsData = await paymentsResponse.json()
          setPayments(paymentsData)
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [currentUser?.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement de vos statistiques...</p>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} FCFA`
  }

  return (
    <div className="min-h-screen flex flex-col bg-background pb-20">
      {/* Header */}
      <header className="bg-card p-4 shadow-sm flex items-center sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen?.(true)}>
          <Menu className="h-5 w-5 text-foreground" />
        </Button>
        <div className="ml-4">
          <h1 className="text-xl font-bold text-foreground">Tableau de Bord</h1>
          <p className="text-xs text-muted-foreground">
            Suivez toutes vos opérations et statistiques
          </p>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6">

      {/* Cartes de statistiques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Lots Réservés"
          value={stats?.totalReserved || 0}
          icon={<Building2 className="h-5 w-5 text-primary" />}
          description="Nombre total de réservations"
        />
        <StatCard
          title="Lots Achétés"
          value={stats?.totalPurchased || 0}
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />}
          description="Payés intégralement"
        />
        <StatCard
          title="Total Avancé"
          value={`${stats?.totalAdvances?.toLocaleString() || 0} FCFA`}
          icon={<Wallet className="h-5 w-5 text-blue-500 dark:text-blue-400" />}
          description="Montant total payé"
        />
        <StatCard
          title="Reste à Payer"
          value={`${stats?.totalRemaining?.toLocaleString() || 0} FCFA`}
          icon={<AlertCircle className="h-5 w-5 text-orange-500 dark:text-orange-400" />}
          description="Montant restant dû"
        />
      </div>

      {/* Statistiques financières détaillées */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Progression Globale
            </CardTitle>
            <CardDescription>
              Pourcentage de paiement de toutes vos réservations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProgressBar
              value={stats?.totalPaid || 0}
              max={stats?.totalInvestment || 1}
              label="Progression de paiement"
            />
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Investissement Total</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(stats?.totalInvestment || 0)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Progression Moyenne</p>
                <p className="text-2xl font-bold text-emerald-500 dark:text-emerald-400">
                  {stats?.paymentProgress?.toFixed(1) || 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Résumé des Opérations
            </CardTitle>
            <CardDescription>
              Vue d'ensemble de vos activités
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                  <span className="text-sm text-foreground">En cours de paiement</span>
                </div>
                <Badge variant="secondary">
                  {stats?.totalReserved - stats?.totalPurchased || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                  <span className="text-sm text-foreground">Finalisés</span>
                </div>
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
                  {stats?.totalPurchased || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                  <span className="text-sm text-foreground">Total Paiements</span>
                </div>
                <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 dark:text-blue-400">
                  {payments.length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Détails des réservations et paiements */}
      <Tabs defaultValue="reservations" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reservations" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Mes Réservations ({reservations.length})
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Mes Paiements ({payments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reservations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Liste des Réservations</CardTitle>
              <CardDescription>
                Tous les lots que vous avez réservés
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reservations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Building2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Aucune réservation pour le moment</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Réservez votre premier lot pour commencer à suivre vos statistiques
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {reservations.map((reservation) => {
                      const progress = (reservation.paidAmount / reservation.totalPrice) * 100
                      const isPaid = reservation.status === 'PAID'
                      
                      return (
                        <Card key={reservation.id} className="border-border">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-foreground">{reservation.lotName}</h4>
                                  <Badge
                                    variant={isPaid ? 'default' : 'secondary'}
                                    className={isPaid ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
                                  >
                                    {isPaid ? 'Payé' : 'En cours'}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Îlot {reservation.block} • {reservation.surface} m²
                                </p>
                              </div>
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Prix total</span>
                                <span className="font-medium text-foreground">
                                  {formatCurrency(reservation.totalPrice)}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Payé</span>
                                <span className="font-medium text-emerald-500 dark:text-emerald-400">
                                  {formatCurrency(reservation.paidAmount)}
                                </span>
                              </div>
                              <ProgressBar
                                value={reservation.paidAmount}
                                max={reservation.totalPrice}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Paiements</CardTitle>
              <CardDescription>
                Tous vos paiements effectués
              </CardDescription>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Wallet className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Aucun paiement pour le moment</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Effectuez votre premier paiement pour voir l'historique
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {payments.map((payment) => (
                      <Card key={payment.id} className="border-border">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-foreground">{payment.lotName}</h4>
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
                                {payment.type === 'FULL' ? 'Paiement complet' : 'Paiement partiel'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(payment.createdAt).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
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
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around py-3 text-muted-foreground">
        <Button
          variant="ghost"
          className="flex flex-col items-center h-auto"
          onClick={() => setCurrentScreen?.('home')}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Accueil</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center h-auto"
          onClick={() => setCurrentScreen?.('map')}
        >
          <Map className="h-5 w-5" />
          <span className="text-xs mt-1">Lots</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center h-auto text-[#10B981]"
          disabled
        >
          <Wallet className="h-5 w-5" />
          <span className="text-xs mt-1 font-bold">Tableau de bord</span>
        </Button>
      </nav>
    </div>
  )
}

export default UserDashboard