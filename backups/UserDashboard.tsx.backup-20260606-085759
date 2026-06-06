'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Home, TrendingUp, Wallet, Calendar, CheckCircle, AlertCircle, XCircle, Download, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface Lot {
  id: string;
  name: string;
  surface: string;
  priceRes: number;
  priceNon: number;
  status: 'AVAILABLE' | 'RESERVED' | 'PAID';
  block?: string;
  description?: string;
}

interface Payment {
  id: string;
  reservationId: string;
  lotName: string;
  surface: string;
  paidAmount: number;
  totalPrice: number;
  isResident: boolean;
  status: 'RESERVED' | 'PAID' | 'PENDING';
  createdAt: string;
}

interface UserDashboardProps {
  currentUser: any;
  setCurrentScreen: (screen: string) => void;
  setIsMenuOpen: (open: boolean) => void;
}

export function UserDashboard({ currentUser, setCurrentScreen, setIsMenuOpen }: UserDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState<Payment[]>([]);
  const [lots, setLots] = useState<Lot[]>([]);
  const [filter, setFilter] = useState<'all' | 'reserved' | 'paid' | 'pending'>('all');

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Charger les réservations de l'utilisateur via l'API stats
      const statsResponse = await fetch(`/api/user-stats?userId=${currentUser?.id}`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setReservations(statsData.reservations || []);
      }

      // Charger les lots disponibles pour comparaison
      const lotsResponse = await fetch('/api/lots');
      if (lotsResponse.ok) {
        const lotsData = await lotsResponse.json();
        setLots(Array.isArray(lotsData) ? lotsData : []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculer les statistiques
  const stats = {
    totalReservations: reservations.length,
    totalLotsReserved: reservations.filter((r) => r.status !== 'PAID').length,
    lotsPaid: reservations.filter((r) => r.status === 'PAID').length,
    lotsPending: reservations.filter((r) => r.status === 'RESERVED' || r.status === 'PENDING').length,
    totalPaid: reservations.reduce((sum, r) => sum + (r.paidAmount || 0), 0),
    totalValue: reservations.reduce((sum, r) => sum + (r.totalPrice || 0), 0),
    totalRemaining: reservations.reduce((sum, r) => sum + ((r.totalPrice || 0) - (r.paidAmount || 0)), 0),
  };

  // Filtrer les réservations
  const filteredReservations = reservations.filter((r) => {
    if (filter === 'all') return true;
    if (filter === 'reserved') return r.status === 'RESERVED';
    if (filter === 'paid') return r.status === 'PAID';
    if (filter === 'pending') return r.status === 'PENDING';
    return true;
  });

  // Calculer le pourcentage global de paiement
  const globalProgress = stats.totalValue > 0 ? Math.round((stats.totalPaid / stats.totalValue) * 100) : 0;

  // Calculer les statistiques mensuelles (simulées pour l'exemple)
  const monthlyStats = [
    { month: 'Jan', paid: 100000, value: 500000 },
    { month: 'Fév', paid: 150000, value: 1000000 },
    { month: 'Mar', paid: 200000, value: 1500000 },
    { month: 'Avr', paid: 180000, value: 1800000 },
    { month: 'Mai', paid: 250000, value: 2000000 },
    { month: 'Juin', paid: 0, value: 0 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <Badge className="bg-emerald-100 text-emerald-700">Soldé ✓</Badge>;
      case 'RESERVED':
        return <Badge className="bg-orange-100 text-orange-700">Réservé</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-700">En attente</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle className="h-5 w-5 text-emerald-600" />;
      case 'RESERVED':
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case 'PENDING':
        return <XCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const handleExportData = () => {
    const data = {
      user: currentUser,
      stats,
      reservations,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mes-reservations-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success('Données exportées avec succès !');
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col bg-card p-6 pt-16">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4"
          onClick={() => { setIsMenuOpen(true); setCurrentScreen('home'); }}
        >
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </Button>

        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement de vos données...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-card p-6 pt-16">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4"
        onClick={() => { setIsMenuOpen(true); setCurrentScreen('home'); }}
      >
        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
      </Button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Mon Tableau de Bord</h2>
          <p className="text-sm text-muted-foreground">
            Bienvenue, {currentUser?.name || 'Utilisateur'}
          </p>
        </div>
        <Button
          onClick={handleExportData}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Exporter
        </Button>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Lots Acquis</p>
                <p className="text-3xl font-bold mt-1">{stats.lotsPaid}</p>
                <p className="text-emerald-100 text-xs mt-1">sur {stats.totalReservations} réservés</p>
              </div>
              <div className="bg-white/20 p-2 rounded-lg">
                <Home className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Payé</p>
                <p className="text-2xl font-bold mt-1">
                  {stats.totalPaid.toLocaleString('fr-FR')} F
                </p>
                <p className="text-blue-100 text-xs mt-1">
                  {stats.totalValue > 0 && `${globalProgress}% du total`}
                </p>
              </div>
              <div className="bg-white/20 p-2 rounded-lg">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Reste à Payer</p>
                <p className="text-2xl font-bold mt-1">
                  {stats.totalRemaining.toLocaleString('fr-FR')} F
                </p>
                <p className="text-orange-100 text-xs mt-1">
                  {stats.lotsPending} lot(s) en cours
                </p>
              </div>
              <div className="bg-white/20 p-2 rounded-lg">
                <Wallet className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Valeur Totale</p>
                <p className="text-2xl font-bold mt-1">
                  {stats.totalValue.toLocaleString('fr-FR')} F
                </p>
                <p className="text-purple-100 text-xs mt-1">
                  {stats.totalReservations} lot(s) réservé(s)
                </p>
              </div>
              <div className="bg-white/20 p-2 rounded-lg">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progression globale */}
      <Card className="mb-6 border-2 border-blue-200 bg-blue-50 dark:bg-blue-950/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Progression Globale
          </CardTitle>
          <CardDescription>
            Avancement global de vos paiements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Progress value={globalProgress} className="h-3" />
            </div>
            <span className="text-2xl font-bold text-blue-600 min-w-[60px] text-right">
              {globalProgress}%
            </span>
          </div>
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>{stats.totalPaid.toLocaleString('fr-FR')} F payé</span>
            <span>{stats.totalValue.toLocaleString('fr-FR')} F total</span>
          </div>
        </CardContent>
      </Card>

      {/* Filtres */}
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Filtrer :</span>
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          Tous ({reservations.length})
        </Button>
        <Button
          variant={filter === 'reserved' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('reserved')}
        >
          Réservés ({reservations.filter(r => r.status === 'RESERVED').length})
        </Button>
        <Button
          variant={filter === 'paid' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('paid')}
        >
          Soldés ({reservations.filter(r => r.status === 'PAID').length})
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('pending')}
        >
          En attente ({reservations.filter(r => r.status === 'PENDING').length})
        </Button>
      </div>

      {/* Liste des réservations */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Mes Réservations</h3>

        {filteredReservations.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                {filter === 'all'
                  ? "Vous n'avez aucune réservation pour le moment."
                  : `Aucune réservation trouvée pour le filtre "${filter}".`}
              </p>
              <Button
                onClick={() => setCurrentScreen('map')}
                className="bg-primary"
              >
                <Home className="mr-2 h-4 w-4" />
                Voir les lots disponibles
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredReservations.map((reservation) => {
            const progress = reservation.totalPrice > 0
              ? Math.round((reservation.paidAmount / reservation.totalPrice) * 100)
              : 0;
            const remaining = reservation.totalPrice - reservation.paidAmount;

            return (
              <Card
                key={reservation.id}
                className={`border-2 ${
                  reservation.status === 'PAID'
                    ? 'border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20'
                    : reservation.status === 'RESERVED'
                    ? 'border-orange-200 bg-orange-50 dark:bg-orange-950/20'
                    : 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-foreground text-lg">
                          Lot {reservation.lotName}
                        </h4>
                        {getStatusBadge(reservation.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {reservation.surface} • {reservation.isResident ? 'Résident KAMI' : 'Non-Résident'}
                      </p>
                      {reservation.createdAt && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Réservé le {new Date(reservation.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {getStatusIcon(reservation.status)}
                    </div>
                  </div>

                  {/* Détails de paiement */}
                  <div className="bg-background dark:bg-card rounded-lg p-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Prix total</span>
                      <span className="font-bold">
                        {reservation.totalPrice.toLocaleString('fr-FR')} F
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Montant payé</span>
                      <span className="font-bold text-emerald-600">
                        {reservation.paidAmount.toLocaleString('fr-FR')} F
                      </span>
                    </div>
                    {remaining > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Reste à payer</span>
                        <span className="font-bold text-orange-600">
                          {remaining.toLocaleString('fr-FR')} F
                        </span>
                      </div>
                    )}

                    {/* Progression */}
                    <div className="pt-2">
                      <div className="flex items-center gap-3">
                        <Progress
                          value={progress}
                          className="flex-1 h-2"
                        />
                        <span className="text-sm font-semibold min-w-[45px] text-right">
                          {progress}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {remaining > 0 && (
                    <div className="mt-3 flex gap-2">
                      <Button
                        onClick={() => setCurrentScreen('map')}
                        size="sm"
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Wallet className="mr-2 h-4 w-4" />
                        Continuer le paiement
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}