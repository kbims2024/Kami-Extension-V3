'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Home, Check, Shield, AlertCircle, Loader2, ChevronRight, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

export interface PaymentLotInfo {
  id: string;
  name: string;
  block: string;
  surface: string;
  priceRes: number;
  priceNon: number;
  status: string;
  paidAmount?: number;
}

interface PaymentUserInfo {
  id: string;
  name: string;
  isResident: boolean;
  phone?: string;
}

interface PaymentMethodScreenProps {
  lot: PaymentLotInfo;
  user: PaymentUserInfo;
  onBack: () => void;
  onPaymentComplete?: () => void;
  onHome?: () => void;
}

const PAYMENT_METHODS = [
  {
    id: 'wave',
    name: 'Wave',
    logo: '/images/wave.png',
    color: '#1DC3E0',
    bgColor: 'bg-[#1DC3E0]/10',
    borderColor: 'border-[#1DC3E0]/30',
    hoverBorder: 'hover:border-[#1DC3E0]',
    appScheme: 'wave://',
    fallbackUrl: 'https://wave.com/',
  },
  {
    id: 'orange_money',
    name: 'Orange Money',
    logo: '/images/orange-money.png',
    color: '#FF6600',
    bgColor: 'bg-[#FF6600]/10',
    borderColor: 'border-[#FF6600]/30',
    hoverBorder: 'hover:border-[#FF6600]',
    appScheme: 'orange-money://',
    fallbackUrl: 'https://www.orange.ci/',
  },
  {
    id: 'moov_money',
    name: 'Moov Money',
    logo: '/images/moov-money.png',
    color: '#0066CC',
    bgColor: 'bg-[#0066CC]/10',
    borderColor: 'border-[#0066CC]/30',
    hoverBorder: 'hover:border-[#0066CC]',
    appScheme: 'moovmoney://',
    fallbackUrl: 'https://www.moov-africa.ci/',
  },
  {
    id: 'mtn_money',
    name: 'MTN Money',
    logo: '/images/mtn-money.png',
    color: '#FFCC00',
    bgColor: 'bg-[#FFCC00]/10',
    borderColor: 'border-[#FFCC00]/30',
    hoverBorder: 'hover:border-[#FFCC00]',
    appScheme: 'mtnmobilemoney://',
    fallbackUrl: 'https://mtn.ci/',
  },
];

async function loadPaymentMethodLogos(): Promise<Record<string, string>> {
  try {
    const res = await fetch('/api/admin/payment-methods');
    if (!res.ok) return {};
    const data = await res.json();
    return data.logos || {};
  } catch (error) {
    console.error('Error loading payment logos:', error);
    return {};
  }
}

async function loadPaymentMethodNumbers(): Promise<Record<string, string>> {
  try {
    const res = await fetch('/api/admin/payment-methods');
    if (!res.ok) return {};
    const data = await res.json();
    return data.numbers || {};
  } catch {
    return {};
  }
}

export function PaymentMethodScreen({ lot, user, onBack, onPaymentComplete, onHome }: PaymentMethodScreenProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [agreeRules, setAgreeRules] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [existingPaid, setExistingPaid] = useState(0);
  const [showDevMessage, setShowDevMessage] = useState(false);
  const [paymentLogos, setPaymentLogos] = useState<Record<string, string>>({});
  const [paymentNumbers, setPaymentNumbers] = useState<Record<string, string>>({
    wave: '0140252521',
    orange_money: '0749615456',
    moov_money: '0140916502',
    mtn_money: '0505623221',
  });

  const totalPrice = user.isResident ? lot.priceRes : lot.priceNon;
  const remaining = totalPrice - existingPaid - (parseInt(paymentAmount) || 0);
  const isFullPayment = remaining <= 0;

  // Charger les paiements existants pour ce lot
  useEffect(() => {
    loadExistingPayments();
    loadPaymentMethodLogos().then((logos) => setPaymentLogos(logos));
    loadPaymentMethodNumbers().then((numbers) => setPaymentNumbers((prev) => ({ ...prev, ...numbers })));
  }, [lot.id, user.id]);

  const loadExistingPayments = async () => {
    try {
      const response = await fetch(`/api/user/payments?userId=${user.id}`);
      if (response.ok) {
        const payments = await response.json();
        const lotPayments = payments.filter((p: any) =>
          p.lotId === lot.id || p.lot?.id === lot.id
        );
        const totalPaid = lotPayments
          .filter((p: any) => p.status === 'VALIDATED')
          .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
        setExistingPaid(totalPaid);
      }
    } catch {
      // Use lot.paidAmount if available
      setExistingPaid(lot.paidAmount || 0);
    } finally {
      setLoading(false);
    }
  };

  const getMethodLogo = (methodId: string) => {
    const direct = paymentLogos[methodId];
    if (direct) return direct;
    return PAYMENT_METHODS.find((m) => m.id === methodId)?.logo || '/images/wave.png';
  };

  const handleSelectMethod = (methodId: string) => {
    setSelectedMethod(methodId);
    setPaymentAmount('');
    setAgreeRules(false);
    setShowDevMessage(false);
  };

  const handlePayAll = () => {
    const restant = totalPrice - existingPaid;
    setPaymentAmount(restant.toString());
  };

  const copyMerchantNumber = async (methodId: string) => {
    const number = paymentNumbers[methodId];
    if (!number) return;
    try {
      await navigator.clipboard.writeText(number);
      toast.success('Numéro marchand copié');
    } catch {
      toast.error('Impossible de copier le numéro');
    }
  };

  const openPaymentApp = (methodId: string) => {
    const method = PAYMENT_METHODS.find((m) => m.id === methodId);
    if (!method || typeof window === 'undefined') return;

    const appLink = method.appScheme;
    const fallback = () => {
      window.open(method.fallbackUrl, '_blank', 'noopener,noreferrer');
    };

    // Try the native app first. On mobile, this is the most reliable way to open the payment app directly.
    window.location.href = appLink;

    // If the app is not installed or the browser cannot launch the scheme, fallback to the web page.
    window.setTimeout(() => {
      fallback();
    }, 1800);
  };

  const handleValidate = async () => {
    const amount = parseInt(paymentAmount);
    if (!amount || amount < 10000) {
      toast.error('Le montant minimum est de 10 000 F');
      return;
    }
    if (amount > totalPrice - existingPaid) {
      toast.error('Le montant dépasse le reste à payer');
      return;
    }
    if (!agreeRules) {
      toast.error('Veuillez accepter le règlement intérieur');
      return;
    }

    setIsValidating(true);
    toast.info(`Ouverture de ${PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.name || 'l’application'}...`);

    await new Promise(resolve => setTimeout(resolve, 1200));

    if (selectedMethod) {
      openPaymentApp(selectedMethod);
    }

    setIsValidating(false);
  };

  const formatPrice = (n: number) => n.toLocaleString('fr-FR');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // === Étape 2 : Détails du paiement ===
  if (selectedMethod) {
    const method = PAYMENT_METHODS.find(m => m.id === selectedMethod)!;

    if (showDevMessage) {
      return (
        <div className="min-h-screen flex flex-col bg-background">
          {/* Header */}
          <header className="flex items-center gap-3 px-4 py-3 bg-card border-b border-border shrink-0">
            <Button variant="ghost" size="icon" onClick={onBack} className="h-9 w-9">
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </Button>
            {onHome && (
              <Button variant="ghost" size="icon" onClick={onHome} className="h-9 w-9">
                <Home className="h-5 w-5 text-foreground" />
              </Button>
            )}
            <h1 className="text-base font-bold text-foreground">Paiement</h1>
          </header>

          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
              style={{ backgroundColor: `${method.color}15` }}
            >
              <AlertCircle className="h-10 w-10" style={{ color: method.color }} />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-3">
              Paiement automatique
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Le processus de paiement automatique est encore en cours de développement.
              Veuillez contacter l&apos;administration pour effectuer votre paiement manuellement.
            </p>
            <Button
              className="mt-8 w-full max-w-xs font-bold py-5 rounded-xl"
              style={{ backgroundColor: method.color, color: method.id === 'mtn_money' ? '#000' : '#fff' }}
              onClick={onBack}
            >
              Compris
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="flex items-center gap-3 px-4 py-3 bg-card border-b border-border shrink-0">
          <Button variant="ghost" size="icon" onClick={() => setSelectedMethod(null)} className="h-9 w-9">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden" style={{ backgroundColor: `${method.color}15` }}>
              <img src={getMethodLogo(method.id)} alt={method.name} className="w-6 h-6 object-contain" />
            </div>
            <h1 className="text-base font-bold text-foreground">{method.name}</h1>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-md mx-auto space-y-4">

            {/* Résumé du lot */}
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Lot sélectionné</p>
                    <p className="text-lg font-bold text-foreground">Lot {lot.name}</p>
                    <p className="text-xs text-muted-foreground">{lot.surface} · Îlot {lot.block}</p>
                  </div>
                  <Badge variant="outline" className="text-xs font-medium">
                    {user.isResident ? 'Résident' : 'Non-Résident'}
                  </Badge>
                </div>
                <div className="border-t border-border pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Prix total</span>
                    <span className="font-bold text-foreground">{formatPrice(totalPrice)} F</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Déjà payé</span>
                    <span className="font-bold text-emerald-600">{formatPrice(existingPaid)} F</span>
                  </div>
                  <div className="border-t border-border pt-2">
                    <div className="flex justify-between text-base">
                      <span className="font-bold text-foreground">Reste à payer</span>
                      <span className="font-extrabold" style={{ color: method.color }}>
                        {formatPrice(totalPrice - existingPaid)} F
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Numéro marchand */}
            <Card className="border-border">
              <CardContent className="p-4 space-y-3">
                <div>
                  <p className="text-sm font-bold">Numéro marchand {method.name}</p>
                  <p className="text-xs text-muted-foreground">Envoyez le montant vers ce numéro, puis validez la demande.</p>
                </div>
                <div className="flex gap-2">
                  <Input readOnly value={paymentNumbers[method.id] || ''} className="text-lg font-bold tracking-wide" aria-label={`Numéro marchand ${method.name}`} />
                  <Button type="button" variant="outline" onClick={() => copyMerchantNumber(method.id)} aria-label="Copier le numéro marchand" title="Copier le numéro marchand">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <Button type="button" variant="outline" className="w-full" onClick={() => openPaymentApp(method.id)}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ouvrir {method.name}
                </Button>
              </CardContent>
            </Card>

            {/* Saisie du montant */}
            <Card className="border-border">
              <CardContent className="p-4 space-y-3">
                <Label className="text-sm font-bold">Montant de l&apos;avance</Label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      type="number"
                      min={10000}
                      max={totalPrice - existingPaid}
                      placeholder="Ex: 50000"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="text-lg font-bold pr-12 py-5"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                      F
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="shrink-0 px-3 font-bold text-xs border-dashed border-2"
                    style={{ borderColor: method.color, color: method.color }}
                    onClick={handlePayAll}
                  >
                    Tout<br />payer
                  </Button>
                </div>

                {/* Aperçu en temps réel */}
                {paymentAmount && parseInt(paymentAmount) > 0 && (
                  <div className="rounded-xl p-3 space-y-1.5" style={{ backgroundColor: `${method.color}08` }}>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Avance cette fois</span>
                      <span className="font-bold" style={{ color: method.color }}>
                        {formatPrice(parseInt(paymentAmount))} F
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Total après paiement</span>
                      <span className="font-bold text-emerald-600">
                        {formatPrice(existingPaid + parseInt(paymentAmount))} F
                      </span>
                    </div>
                    {remaining > 0 ? (
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Reste après paiement</span>
                        <span className="font-bold text-orange-500">
                          {formatPrice(remaining)} F
                        </span>
                      </div>
                    ) : (
                      <p className="text-xs font-bold text-emerald-600 text-center">
                        ✅ Lot entièrement payé !
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Réglement intérieur */}
            <Card className="border-border">
              <CardContent className="p-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    checked={agreeRules}
                    onCheckedChange={(checked) => setAgreeRules(checked as boolean)}
                    className="mt-0.5"
                  />
                  <span className="text-xs font-bold text-foreground leading-snug">
                    J&apos;ACCEPTE LE RÈGLEMENT INTÉRIEUR DE KAMI-EXTENSION
                  </span>
                </label>
              </CardContent>
            </Card>

            {/* Bouton valider */}
            <Button
              className="w-full font-bold py-5 rounded-xl text-base shadow-lg transition-all disabled:opacity-50"
              style={{
                backgroundColor: method.color,
                color: method.id === 'mtn_money' ? '#000' : '#fff',
              }}
              disabled={!agreeRules || !paymentAmount || parseInt(paymentAmount) < 10000 || isValidating}
              onClick={handleValidate}
            >
              {isValidating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Traitement en cours...
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5 mr-2" />
                  Valider le paiement via {method.name}
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={() => setSelectedMethod(null)}
            >
              Changer de moyen de paiement
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // === Étape 1 : Choix du moyen de paiement ===
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 bg-card border-b border-border shrink-0">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-9 w-9">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Button>
        {onHome && (
          <Button variant="ghost" size="icon" onClick={onHome} className="h-9 w-9">
            <Home className="h-5 w-5 text-foreground" />
          </Button>
        )}
        <h1 className="text-base font-bold text-foreground">Paiement</h1>
      </header>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-md mx-auto space-y-4">

          {/* Lot résumé */}
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Paiement pour</p>
                  <p className="text-lg font-bold text-foreground">Lot {lot.name}</p>
                  <p className="text-xs text-muted-foreground">{lot.surface} · {user.isResident ? 'Tarif Résident' : 'Tarif Non-Résident'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Montant total</p>
                  <p className="text-xl font-extrabold text-foreground">{formatPrice(totalPrice)} F</p>
                  {existingPaid > 0 && (
                    <>
                      <p className="text-xs text-muted-foreground mt-1">Payé</p>
                      <p className="text-sm font-bold text-emerald-600">{formatPrice(existingPaid)} F</p>
                    </>
                  )}
                </div>
              </div>
              {existingPaid > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Reste à payer</span>
                    <span className="font-bold text-orange-500">{formatPrice(totalPrice - existingPaid)} F</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sélection du moyen de paiement */}
          <div>
            <h2 className="text-sm font-bold text-foreground mb-3">Choisissez votre moyen de paiement</h2>
            <div className="space-y-2.5">
              {PAYMENT_METHODS.map((method) => (
                <Card
                  key={method.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${method.borderColor} ${method.hoverBorder} border-2`}
                  onClick={() => handleSelectMethod(method.id)}
                >
                  <CardContent className="p-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${method.color}12` }}
                      >
                        <img
                          src={getMethodLogo(method.id)}
                          alt={method.name}
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-foreground">{method.name}</p>
                        <p className="text-xs text-muted-foreground">Paiement mobile instantané</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Note de sécurité */}
          <div className="flex items-start gap-2 p-3 rounded-xl bg-muted/50">
            <Shield className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Vos transactions sont sécurisées. Le paiement sera validé par l&apos;administration après vérification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}