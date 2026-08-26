'use client'
import React from 'react'
import { BarChart3, Wallet } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface AdminChartsProps {
  stats: {
    totalLots?: number
    availableLots?: number
    reservedLots?: number
    paidLots?: number
    totalUsers?: number
    subscribers?: number
    totalRevenue?: number
    pendingPayments?: number
    reservationsThisMonth?: number
    paymentsThisMonth?: number
  } | null
}

export default function AdminCharts({ stats }: AdminChartsProps) {
  const lotData = [
    { name: 'Disponibles', value: stats?.availableLots || 0, fill: '#10B981' },
    { name: 'Réservés', value: stats?.reservedLots || 0, fill: '#3B82F6' },
    { name: 'Soldés', value: stats?.paidLots || 0, fill: '#F59E0B' },
  ]
  const activityData = [
    { name: 'Réservations', value: stats?.reservationsThisMonth || 0, fill: '#3B82F6' },
    { name: 'Paiements validés', value: stats?.paymentsThisMonth || 0, fill: '#10B981' },
    { name: 'Paiements en attente', value: stats?.pendingPayments || 0, fill: '#F97316' },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-600" />
            Répartition des lots
          </CardTitle>
          <CardDescription>État actuel des lots enregistrés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lotData} margin={{ top: 16, right: 12, left: -16, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} />
                <Bar dataKey="value" name="Lots" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-blue-600" />
            Activité du mois
          </CardTitle>
          <CardDescription>Réservations et paiements du mois en cours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 16, right: 12, left: -16, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} />
                <Bar dataKey="value" name="Éléments" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
