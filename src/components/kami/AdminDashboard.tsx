'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Building2,
  Wallet,
  TrendingUp,
  Users,
  Home
} from 'lucide-react'

export const AdminDashboard: React.FC<any> = ({ onBack, onHome }) => {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/dashboard-stats')
      .then(res => res.json())
      .then(data => {
        setStats(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-10 text-center">Chargement...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={onBack}>Retour</Button>
      </div>
      <h2 className="text-2xl font-bold">Administration</h2>
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <Users className="h-5 w-5 mb-2 text-blue-500" />
          <p className="text-xs text-muted-foreground">Utilisateurs</p>
          <p className="text-xl font-bold">{stats?.totalUsers || 0}</p>
        </Card>
        <Card className="p-4">
          <TrendingUp className="h-5 w-5 mb-2 text-cyan-500" />
          <p className="text-xs text-muted-foreground">Souscripteurs</p>
          <p className="text-xl font-bold">{stats?.subscribers || 0}</p>
        </Card>
        <Card className="p-4">
          <Building2 className="h-5 w-5 mb-2 text-emerald-500" />
          <p className="text-xs text-muted-foreground">Lots Libres</p>
          <p className="text-xl font-bold">{stats?.availableLots || 0}</p>
        </Card>
        <Card className="p-4">
          <Wallet className="h-5 w-5 mb-2 text-amber-500" />
          <p className="text-xs text-muted-foreground">Revenus</p>
          <p className="text-xl font-bold">{(stats?.totalRevenue || 0).toLocaleString()} F</p>
        </Card>
      </div>
    </div>
  )
}
