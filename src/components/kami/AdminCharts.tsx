'use client'

import React from 'react'
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, TrendingUp } from 'lucide-react'

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#8B5E3C', '#3B82F6']

export default function AdminCharts({ lotStatsData, monthlyData, stats }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Répartition des lots */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Répartition des Lots
          </CardTitle>
          <CardDescription>État actuel de tous les lots</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
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
                  {lotStatsData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} verticalAlign="bottom" height={36} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
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
              <div className="text-xs text-muted-foreground">Achetés</div>
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
          <CardDescription>Réservations des 6 derniers mois</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 20, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Legend verticalAlign="top" height={30} wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="reservations" stroke={COLORS[4]} strokeWidth={2} name="Réservations" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
