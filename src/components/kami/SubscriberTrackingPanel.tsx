'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  Home,
  Search,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building2,
  Wallet,
  CreditCard,
  Eye,
  TrendingUp,
  Package,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Crown,
} from 'lucide-react';
import { toast } from 'sonner';

interface LotDetail {
  reservationId: string;
  lotId: string;
  lotName: string;
  surface: string;
  priceRes: number;
  priceNon: number;
  status: string;
  totalPrice: number;
  paidAmount: number;
  remainingAmount: number;
  paymentProgress: number;
  isResident: boolean;
  reservedAt: string;
  lotPaymentsCount: number;
  validatedPaymentsCount: number;
}

interface SubscriberData {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  role: string;
  isResident: boolean;
  quartier: string | null;
  villageOrigine: string | null;
  pseudo: string | null;
  status: string;
  createdAt: string;
  lotsReservedCount: number;
  lotsPurchasedCount: number;
  totalLotsCount: number;
  lotDetails: LotDetail[];
  totalAmountPaid: number;
  totalAmountRemaining: number;
  overallProgress: number;
}

interface SubscriberTrackingPanelProps {
  onBack?: () => void;
  setCurrentScreen?: (screen: string) => void;
  currentUser?: { id: string; role: string; name: string; phone: string } | null;
  onHome?: () => void;
}

export function SubscriberTrackingPanel({ onBack, setCurrentScreen, currentUser, onHome }: SubscriberTrackingPanelProps) {
  const [subscribers, setSubscribers] = useState<SubscriberData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubscriber, setSelectedSubscriber] = useState<SubscriberData | null>(null);
  const [expandedLots, setExpandedLots] = useState<Record<string, boolean>>({});
  const [filterStatus, setFilterStatus] = useState<string>('TOUS');

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/subscriber-tracking');
      if (response.ok) {
        const data = await response.json();
        setSubscribers(data);
      }
    } catch (error) {
      console.error('Error loading subscribers:', error);
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('fr-FR')} FCFA`;
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const toggleLotExpand = (subId: string) => {
    setExpandedLots((prev) => ({ ...prev, [subId]: !prev[subId] }));
  };

  const startChat = (userId: string, userName: string) => {
    localStorage.setItem('selectedChatUser', JSON.stringify({ id: userId, name: userName }));
    if (setCurrentScreen) {
      setCurrentScreen('committee-chat');
    }
  };

  const filteredSubscribers = subscribers.filter((sub) => {
    // Search filter
    const matchesSearch =
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.phone.includes(searchQuery) ||
      (sub.email && sub.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (sub.pseudo && sub.pseudo.toLowerCase().includes(searchQuery.toLowerCase()));

    // Status filter
    let matchesStatus = true;
    if (filterStatus === 'ACHETEUR') {
      matchesStatus = sub.lotsPurchasedCount > 0;
    } else if (filterStatus === 'SOUSCRIPTEUR') {
      matchesStatus = sub.lotsReservedCount > 0 && sub.lotsPurchasedCount === 0;
    } else if (filterStatus === 'SANS_LOT') {
      matchesStatus = sub.totalLotsCount === 0;
    } else if (filterStatus === 'COMITE') {
      matchesStatus = sub.role === 'MANAGEMENT_COMMITTEE';
    }

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RESERVED': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'PAID': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-emerald-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress > 0) return 'bg-orange-500';
    return 'bg-muted';
  };

  // Summary stats
  const totalSubscribers = subscribers.length;
  const totalWithLots = subscribers.filter((s) => s.totalLotsCount > 0).length;
  const totalBuyers = subscribers.filter((s) => s.lotsPurchasedCount > 0).length;
  const totalRevenue = subscribers.reduce((sum, s) => sum + s.totalAmountPaid, 0);

  return (
    <div className="space-y-4">
      {onBack && (
        <div className="flex items-center gap-1">
          <Button variant="ghost" onClick={onBack} className="text-muted-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
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
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-cyan-500 dark:text-cyan-400" />
          Suivi des Souscripteurs
        </h2>
        <p className="text-sm text-muted-foreground">
          Tableau de bord détaillé pour le suivi de chaque souscripteur
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-l-4 border-cyan-500">
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Total Souscripteurs</p>
            <p className="text-xl font-bold text-foreground">{totalSubscribers}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-orange-500">
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Avec Lots</p>
            <p className="text-xl font-bold text-foreground">{totalWithLots}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-emerald-500">
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Acheteurs</p>
            <p className="text-xl font-bold text-foreground">{totalBuyers}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-purple-500">
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Revenus Collectés</p>
            <p className="text-lg font-bold text-foreground">{formatCurrency(totalRevenue)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher par nom, téléphone, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'TOUS', label: 'Tous' },
            { key: 'ACHETEUR', label: 'Acheteurs' },
            { key: 'SOUSCRIPTEUR', label: 'Souscripteurs' },
            { key: 'SANS_LOT', label: 'Sans lot' },
            { key: 'COMITE', label: 'Comité' },
          ].map((f) => (
            <Button
              key={f.key}
              variant={filterStatus === f.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus(f.key)}
              className={
                filterStatus === f.key
                  ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                  : 'hover:bg-cyan-50 dark:hover:bg-cyan-950'
              }
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Subscriber List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
        </div>
      ) : filteredSubscribers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <User className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">
              {searchQuery || filterStatus !== 'TOUS'
                ? 'Aucun souscripteur trouvé'
                : 'Aucun souscripteur enregistré'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="max-h-[600px]">
          <div className="space-y-3 pr-4">
            {filteredSubscribers.map((subscriber) => (
              <Card
                key={subscriber.id}
                className="border border-border hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Avatar */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        subscriber.role === 'MANAGEMENT_COMMITTEE'
                          ? 'bg-purple-100 dark:bg-purple-900/30'
                          : subscriber.lotsPurchasedCount > 0
                            ? 'bg-emerald-100 dark:bg-emerald-900/30'
                            : subscriber.lotsReservedCount > 0
                              ? 'bg-orange-100 dark:bg-orange-900/30'
                              : 'bg-muted'
                      }`}>
                        <User className={`h-6 w-6 ${
                          subscriber.role === 'MANAGEMENT_COMMITTEE'
                            ? 'text-purple-600 dark:text-purple-400'
                            : subscriber.lotsPurchasedCount > 0
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : subscriber.lotsReservedCount > 0
                                ? 'text-orange-600 dark:text-orange-400'
                                : 'text-muted-foreground'
                        }`} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-foreground">{subscriber.name}</h3>
                          {subscriber.role === 'MANAGEMENT_COMMITTEE' && (
                            <Badge className="bg-purple-600 hover:bg-purple-700 text-xs flex items-center gap-1">
                              <Crown className="h-3 w-3" />
                              Comité
                            </Badge>
                          )}
                          {subscriber.status === 'BLOCKED' && (
                            <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs">
                              Bloqué
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {subscriber.phone}
                          </span>
                          {subscriber.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {subscriber.email}
                            </span>
                          )}
                          {subscriber.isResident && subscriber.quartier && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {subscriber.quartier}
                            </span>
                          )}
                          {!subscriber.isResident && subscriber.villageOrigine && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {subscriber.villageOrigine}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          Inscrit le {formatDate(subscriber.createdAt)}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setSelectedSubscriber(subscriber)}
                        title="Voir détails"
                      >
                        <Eye className="h-4 w-4 text-cyan-500" />
                      </Button>
                      {subscriber.role !== 'ADMIN' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => startChat(subscriber.id, subscriber.name)}
                          title="Discuter"
                        >
                          <MessageSquare className="h-4 w-4 text-blue-500" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-border">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                        <Package className="h-3 w-3" />
                        Réservés
                      </div>
                      <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                        {subscriber.lotsReservedCount}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                        <CreditCard className="h-3 w-3" />
                        Achetés
                      </div>
                      <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        {subscriber.lotsPurchasedCount}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                        <Wallet className="h-3 w-3" />
                        Payé
                      </div>
                      <p className="text-sm font-bold text-foreground">
                        {formatCurrency(subscriber.totalAmountPaid)}
                      </p>
                    </div>
                  </div>

                  {/* Lot Details Expandable */}
                  {subscriber.totalLotsCount > 0 && (
                    <div className="mt-3">
                      <button
                        onClick={() => toggleLotExpand(subscriber.id)}
                        className="w-full flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                      >
                        <span className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          Détails des lots ({subscriber.totalLotsCount})
                        </span>
                        {expandedLots[subscriber.id] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>

                      {expandedLots[subscriber.id] && (
                        <div className="space-y-2 mt-2 pl-2 border-l-2 border-border">
                          {subscriber.lotDetails.map((lot) => (
                            <div
                              key={lot.reservationId}
                              className="p-3 rounded-lg bg-muted/50 border border-border text-sm"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-foreground">{lot.lotName}</h4>
                                  <Badge className={getStatusColor(lot.status)}>{lot.status === 'RESERVED' ? 'Réservé' : 'Soldé'}</Badge>
                                  {lot.isResident && (
                                    <Badge variant="outline" className="text-xs">Résident</Badge>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                                <div className="text-muted-foreground">
                                  Surface: <span className="text-foreground">{lot.surface}</span>
                                </div>
                                <div className="text-muted-foreground">
                                  Prix: <span className="text-foreground">{formatCurrency(lot.totalPrice)}</span>
                                </div>
                                <div className="text-muted-foreground">
                                  Payé: <span className="text-emerald-600 dark:text-emerald-400 font-medium">{formatCurrency(lot.paidAmount)}</span>
                                </div>
                                <div className="text-muted-foreground">
                                  Reste: <span className="text-red-500 dark:text-red-400 font-medium">{formatCurrency(lot.remainingAmount)}</span>
                                </div>
                                <div className="text-muted-foreground">
                                  Paiements: <span className="text-foreground">{lot.validatedPaymentsCount} validé(s) / {lot.lotPaymentsCount} total</span>
                                </div>
                                <div className="text-muted-foreground">
                                  Réservé le: <span className="text-foreground">{formatDate(lot.reservedAt)}</span>
                                </div>
                              </div>

                              {/* Progress bar */}
                              <div className="w-full">
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-muted-foreground">Progression</span>
                                  <span className={`font-bold ${
                                    lot.paymentProgress >= 100
                                      ? 'text-emerald-600 dark:text-emerald-400'
                                      : 'text-foreground'
                                  }`}>
                                    {lot.paymentProgress}%
                                  </span>
                                </div>
                                <div className="w-full bg-border rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full transition-all ${getProgressColor(lot.paymentProgress)}`}
                                    style={{ width: `${Math.min(lot.paymentProgress, 100)}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Detail Modal */}
      <Dialog open={!!selectedSubscriber} onOpenChange={() => setSelectedSubscriber(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedSubscriber && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedSubscriber.role === 'MANAGEMENT_COMMITTEE'
                      ? 'bg-purple-100 dark:bg-purple-900/30'
                      : 'bg-cyan-100 dark:bg-cyan-900/30'
                  }`}>
                    <User className={`h-6 w-6 ${
                      selectedSubscriber.role === 'MANAGEMENT_COMMITTEE'
                        ? 'text-purple-600 dark:text-purple-400'
                        : 'text-cyan-600 dark:text-cyan-400'
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span>{selectedSubscriber.name}</span>
                      {selectedSubscriber.role === 'MANAGEMENT_COMMITTEE' && (
                        <Badge className="bg-purple-600 hover:bg-purple-700 text-xs">Comité</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground font-normal">
                      Souscripteur depuis le {formatDate(selectedSubscriber.createdAt)}
                    </p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              {/* Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-sm mb-3 text-muted-foreground">Informations personnelles</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedSubscriber.name}</span>
                        {selectedSubscriber.pseudo && (
                          <span className="text-muted-foreground">({selectedSubscriber.pseudo})</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedSubscriber.phone}</span>
                      </div>
                      {selectedSubscriber.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedSubscriber.email}</span>
                        </div>
                      )}
                      {selectedSubscriber.isResident && selectedSubscriber.quartier && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>Quartier: {selectedSubscriber.quartier}</span>
                        </div>
                      )}
                      {!selectedSubscriber.isResident && selectedSubscriber.villageOrigine && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>Village d'origine: {selectedSubscriber.villageOrigine}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Résident: {selectedSubscriber.isResident ? 'Oui' : 'Non'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-sm mb-3 text-muted-foreground">Résumé des lots</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          {selectedSubscriber.lotsReservedCount}
                        </p>
                        <p className="text-xs text-muted-foreground">Réservés</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                          {selectedSubscriber.lotsPurchasedCount}
                        </p>
                        <p className="text-xs text-muted-foreground">Achetés</p>
                      </div>
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total payé</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(selectedSubscriber.totalAmountPaid)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Reste à payer</span>
                        <span className="font-bold text-red-500 dark:text-red-400">
                          {formatCurrency(selectedSubscriber.totalAmountRemaining)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm items-center">
                        <span className="text-muted-foreground">Progression globale</span>
                        <span className="font-bold">{selectedSubscriber.overallProgress}%</span>
                      </div>
                      <div className="w-full bg-border rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full transition-all ${getProgressColor(selectedSubscriber.overallProgress)}`}
                          style={{ width: `${Math.min(selectedSubscriber.overallProgress, 100)}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Lot Information */}
              {selectedSubscriber.lotDetails.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Détails des lots</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedSubscriber.lotDetails.map((lot) => (
                        <div key={lot.reservationId} className="p-4 rounded-lg border border-border bg-muted/30">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-5 w-5 text-muted-foreground" />
                              <h4 className="font-bold text-foreground">{lot.lotName}</h4>
                            </div>
                            <Badge className={getStatusColor(lot.status)}>
                              {lot.status === 'RESERVED' ? 'Réservé' : 'Soldé'}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm mb-3">
                            <div>
                              <p className="text-muted-foreground text-xs">Surface</p>
                              <p className="font-medium">{lot.surface}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Prix total</p>
                              <p className="font-medium">{formatCurrency(lot.totalPrice)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Montant payé</p>
                              <p className="font-medium text-emerald-600 dark:text-emerald-400">{formatCurrency(lot.paidAmount)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Reste</p>
                              <p className="font-medium text-red-500 dark:text-red-400">{formatCurrency(lot.remainingAmount)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Paiements validés</p>
                              <p className="font-medium">{lot.validatedPaymentsCount} / {lot.lotPaymentsCount}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Date réservation</p>
                              <p className="font-medium">{formatDate(lot.reservedAt)}</p>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">État d&apos;avancement du paiement</span>
                              <span className={`font-bold ${lot.paymentProgress >= 100 ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                                {lot.paymentProgress}%
                              </span>
                            </div>
                            <div className="w-full bg-border rounded-full h-3">
                              <div
                                className={`h-3 rounded-full transition-all ${getProgressColor(lot.paymentProgress)}`}
                                style={{ width: `${Math.min(lot.paymentProgress, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {selectedSubscriber.lotDetails.length === 0 && (
                <div className="text-center py-8">
                  <Building2 className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">Aucun lot réservé ni acheté</p>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
