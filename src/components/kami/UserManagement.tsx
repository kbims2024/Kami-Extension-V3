'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Users,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Trash2,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Ban
} from 'lucide-react'
import { toast } from 'sonner'

interface User {
  id: string
  name: string
  phone: string
  isResident: boolean
  referralCode: string
  status: string
  createdAt: string
  kycVerified?: boolean
}

interface UserManagementProps {
  onBack?: () => void
}

export const UserManagement: React.FC<UserManagementProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [userFilter, setUserFilter] = useState<string>('')
  const [sortField, setSortField] = useState<string>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const usersResponse = await fetch('/api/admin/users')
      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setUsers(usersData)
      }
    } catch (error) {
      console.error('Error loading users:', error)
      toast.error('Erreur lors du chargement des utilisateurs')
    } finally {
      setLoading(false)
    }
  }

  // Fonction de tri des utilisateurs
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection(field === 'createdAt' ? 'desc' : 'asc')
    }
  }

  // Fonction de filtrage des utilisateurs
  const filteredUsers = users.filter(user => {
    if (!userFilter) return true
    const filter = userFilter.toLowerCase()

    switch (userFilter) {
      case 'active':
        return user.status === 'ACTIVE'
      case 'blocked':
        return user.status === 'BLOCKED'
      case 'resident':
        return user.isResident
      case 'non-resident':
        return !user.isResident
      case 'kyc-verified':
        return user.kycVerified === true
      case 'kyc-pending':
        return user.kycVerified !== true
      default:
        return user.name.toLowerCase().includes(filter) ||
               user.phone.includes(filter) ||
               user.referralCode.toLowerCase().includes(filter)
    }
  })

  // Fonction de tri des utilisateurs filtrés
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let comparison = 0

    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'type':
        comparison = a.isResident === b.isResident ? 0 : a.isResident ? -1 : 1
        break
      case 'status':
        comparison = a.status.localeCompare(b.status)
        break
      case 'kyc':
        const aKyc = a.kycVerified ? 1 : 0
        const bKyc = b.kycVerified ? 1 : 0
        comparison = aKyc - bKyc
        break
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        break
      default:
        comparison = 0
    }

    return sortDirection === 'asc' ? comparison : -comparison
  })

  const formatSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 ml-1 opacity-50" />
    }
    return sortDirection === 'asc'
      ? <ChevronUp className="h-3 w-3 ml-1" />
      : <ChevronDown className="h-3 w-3 ml-1" />
  }

  const handleUserFilterClick = (filter: string) => {
    if (userFilter === filter) {
      setUserFilter('')
    } else {
      setUserFilter(filter)
    }
  }

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
        await loadUsers()
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
        await loadUsers()
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
        await loadUsers()
      } else {
        toast.error('Erreur lors de la suppression de l\'utilisateur');
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression de l\'utilisateur');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement des utilisateurs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground">
          Retour
        </Button>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gestion des Utilisateurs
          </CardTitle>
          <CardDescription>
            {sortedUsers.length} utilisateur{sortedUsers.length > 1 ? 's' : ''} affiché{sortedUsers.length > 1 ? 's' : ''}
            {userFilter && ` • Filtre actif: ${userFilter}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th
                    className="text-left py-3 px-4 font-semibold text-foreground cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Utilisateur
                      {formatSortIcon('name')}
                    </div>
                  </th>
                  <th
                    className="text-left py-3 px-4 font-semibold text-foreground cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleUserFilterClick(userFilter === 'resident' ? '' : 'resident')}
                  >
                    <div className="flex items-center gap-2">
                      Type
                      {userFilter === 'resident' && (
                        <Badge variant="secondary" className="text-xs">
                          {sortedUsers.filter(u => u.isResident).length}
                        </Badge>
                      )}
                      {userFilter === 'non-resident' && (
                        <Badge variant="secondary" className="text-xs">
                          {sortedUsers.filter(u => !u.isResident).length}
                        </Badge>
                      )}
                    </div>
                  </th>
                  <th
                    className="text-left py-3 px-4 font-semibold text-foreground cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleUserFilterClick(userFilter === 'active' ? '' : 'active')}
                  >
                    <div className="flex items-center gap-2">
                      Statut
                      {userFilter === 'active' && (
                        <Badge variant="secondary" className="text-xs">
                          {sortedUsers.filter(u => u.status === 'ACTIVE').length}
                        </Badge>
                      )}
                      {userFilter === 'blocked' && (
                        <Badge variant="secondary" className="text-xs">
                          {sortedUsers.filter(u => u.status === 'BLOCKED').length}
                        </Badge>
                      )}
                    </div>
                  </th>
                  <th
                    className="text-left py-3 px-4 font-semibold text-foreground cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleUserFilterClick(userFilter === 'kyc-verified' ? '' : 'kyc-verified')}
                  >
                    <div className="flex items-center gap-2">
                      KYC
                      {userFilter === 'kyc-verified' && (
                        <Badge variant="secondary" className="text-xs">
                          {sortedUsers.filter(u => u.kycVerified).length}
                        </Badge>
                      )}
                      {userFilter === 'kyc-pending' && (
                        <Badge variant="secondary" className="text-xs">
                          {sortedUsers.filter(u => !u.kycVerified).length}
                        </Badge>
                      )}
                    </div>
                  </th>
                  <th
                    className="text-left py-3 px-4 font-semibold text-foreground cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center">
                      Date
                      {formatSortIcon('createdAt')}
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((user, index) => (
                  <tr key={user.id || `user-${index}`} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.phone}</p>
                        <p className="text-xs text-muted-foreground">Code: {user.referralCode}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        className={user.isResident ? 'bg-[#8B5E3C]/10 text-[#8B5E3C] dark:text-[#A5785C]' : 'bg-blue-500/10 text-blue-500 dark:text-blue-400'}
                      >
                        {user.isResident ? 'Résident' : 'Non-Résident'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={user.status === 'ACTIVE' ? 'default' : 'secondary'}
                        className={user.status === 'ACTIVE' ? 'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500' : ''}
                      >
                        {user.status === 'ACTIVE' ? 'Actif' : 'Bloqué'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={user.kycVerified ? 'default' : 'secondary'}
                        className={user.kycVerified ? 'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500' : 'bg-orange-500/10 text-orange-500 dark:text-orange-400'}
                      >
                        {user.kycVerified ? 'Vérifié' : 'En attente'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <p className="text-sm">
                          {new Date(user.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(user.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {user.status === 'ACTIVE' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                            onClick={() => handleBlockUser(user.id, user.name)}
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                            onClick={() => handleUnblockUser(user.id, user.name)}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                          onClick={() => handleDeleteUser(user.id, user.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {sortedUsers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Aucun utilisateur trouvé
              </div>
            )}

            {userFilter && (
              <div className="mt-4 flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setUserFilter('')}
                >
                  Effacer le filtre
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}