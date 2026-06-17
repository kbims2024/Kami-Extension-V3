'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  Map,
  MessageSquare
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
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    whileHover={{ y: -8, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
          className="p-2 bg-primary/10 rounded-lg"
        >
          {icon}
        </motion.div>
      </CardHeader>
      <CardContent>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="text-3xl font-bold text-foreground"
        >
          {typeof value === 'number' ? value.toLocaleString() : value}
        </motion.div>
        {description && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xs text-muted-foreground mt-1"
          >
            {description}
          </motion.p>
        )}
        {change && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className={`flex items-center text-xs mt-2 ${changePositive ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}
          >
            {changePositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
            <span>{change}</span>
          </motion.div>
        )}
      </CardContent>
    </Card>
  </motion.div>
)

// Composant de barre de progression
const ProgressBar: React.FC<{ value: number; max: number; label?: string }> = ({ value, max, label }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  
  return (
    <div className="space-y-2">
      {label && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex justify-between text-sm"
        >
          <span className="text-muted-foreground">{label}</span>
          <span className="font-medium text-foreground">{percentage.toFixed(1)}%</span>
        </motion.div>
      )}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
        />
      </div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-between text-xs text-muted-foreground"
      >
        <span>{value.toLocaleString()} FCFA</span>
        <span>{max.toLocaleString()} FCFA</span>
      </motion.div>
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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-[400px]"
      >
        <div className="text-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"
          />
          <p className="text-muted-foreground">Chargement de vos statistiques...</p>
        </div>
      </motion.div>
    )
  }

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} FCFA`
  }

  return (
    <div className="min-h-screen flex flex-col bg-background pb-20">
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="bg-card p-4 shadow-sm flex items-center sticky top-0 z-10"
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen?.(true)}>
            <Menu className="h-5 w-5 text-foreground" />
          </Button>
        </motion.div>
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="ml-4"
        >
          <h1 className="text-xl font-bold text-foreground">Tableau de Bord</h1>
          <p className="text-xs text-muted-foreground">
            Suivez toutes vos opérations et statistiques
          </p>
        </motion.div>
      </motion.header>

      <div className="flex-1 p-4 space-y-6">

      {/* Cartes de statistiques principales */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
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
      </motion.div>

      {/* Bouton Discussion avec le Comité de Gestion */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl"
                >
                  <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg">
                    Discuter avec le Comité de Gestion
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Posez vos questions ou signalez un problème
                  </p>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setCurrentScreen?.('chat')}
                  className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-medium"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Discuter
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Statistiques financières détaillées */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="grid gap-4 md:grid-cols-2"
      >
        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <motion.div whileHover={{ rotate: 10 }} className="h-5 w-5">
                  <TrendingUp />
                </motion.div>
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
        </motion.div>

        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <motion.div whileHover={{ rotate: 10 }} className="h-5 w-5">
                  <ShoppingCart />
                </motion.div>
                Résumé des Opérations
              </CardTitle>
              <CardDescription>
                Vue d'ensemble de vos activités
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                    <span className="text-sm text-foreground">En cours de paiement</span>
                  </div>
                  <Badge variant="secondary">
                    {stats?.totalReserved - stats?.totalPurchased || 0}
                  </Badge>
                </motion.div>
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                    <span className="text-sm text-foreground">Finalisés</span>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
                    {stats?.totalPurchased || 0}
                  </Badge>
                </motion.div>
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                    <span className="text-sm text-foreground">Total Paiements</span>
                  </div>
                  <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 dark:text-blue-400">
                    {payments.length}
                  </Badge>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Détails des réservations et paiements */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="space-y-4"
      >
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
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Building2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    </motion.div>
                    <p className="text-muted-foreground">Aucune réservation pour le moment</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Réservez votre premier lot pour commencer à suivre vos statistiques
                    </p>
                  </motion.div>
                ) : (
                  <ScrollArea className="h-[400px] pr-4">
                    <motion.div className="space-y-4">
                      {reservations.map((reservation, index) => {
                        const progress = (reservation.paidAmount / reservation.totalPrice) * 100
                        const isPaid = reservation.status === 'PAID'
                        
                        return (
                          <motion.div
                            key={reservation.id || `user-res-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index, duration: 0.3 }}
                            whileHover={{ scale: 1.02, y: -4 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Card className="border-border hover:shadow-lg transition-shadow duration-300">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-semibold text-foreground">{reservation.lotName}</h4>
                                      <Badge
                                        variant={isPaid ? 'default' : 'secondary'}
                                        className={isPaid ? 'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500' : ''}
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
                          </motion.div>
                        )
                      })}
                    </motion.div>
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
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Wallet className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    </motion.div>
                    <p className="text-muted-foreground">Aucun paiement pour le moment</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Effectuez votre premier paiement pour voir l'historique
                    </p>
                  </motion.div>
                ) : (
                  <ScrollArea className="h-[400px] pr-4">
                    <motion.div className="space-y-4">
                      {payments.map((payment, index) => (
                        <motion.div
                          key={payment.id || `user-pay-${index}`}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index, duration: 0.3 }}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card className="border-border hover:shadow-lg transition-shadow duration-300">
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
                        </motion.div>
                      ))}
                    </motion.div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
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