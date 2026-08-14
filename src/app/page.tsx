'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Building2, Map, Home, Wallet, Users, User, Shield, ArrowLeft, Menu, LogOut, LogIn, CheckCircle, XCircle, AlertCircle, ChartLine, CreditCard, UserPlus, PlusCircle, Wrench, Zap, Droplet, ShieldCheck, FileText, Copy, ClipboardCheck, Upload, Phone, Activity, Construction, TrendingUp, Camera, Share2, Headset, Plus, Trash2, Image as ImageIcon, Crown, WifiOff } from 'lucide-react';
import { EnhancedMapScreen } from '@/components/kami/EnhancedMapScreen';
import { PersuasiveLandingPage } from '@/components/kami/PersuasiveLandingPage';
import { TwoStepRegistration } from '@/components/kami/TwoStepRegistration';
import { AuthChoiceScreen } from '@/components/kami/AuthChoiceScreen';
import { LoginScreen } from '@/components/kami/LoginScreen';
import { AdminFiles } from '@/components/kami/AdminFiles';
import { FlashInfoAdmin } from '@/components/kami/FlashInfoAdmin';
import { ModernSideMenu } from '@/components/kami/ModernSideMenu';
import { AdminLogo } from '@/components/kami/AdminLogo';
import { SettingsPage } from '@/components/kami/SettingsPage';
import { UserDashboard } from '@/components/kami/UserDashboard';
import { AdminDashboard } from '@/components/kami/AdminDashboard';
import { PageNav } from '@/components/kami/PageNav';
import { CongratulationNotification } from '@/components/kami/CongratulationNotification';
import { ChatPage } from '@/components/kami/ChatPage';
import { AdminChatPage } from '@/components/kami/AdminChatPage';
import { PlanPage } from '@/components/kami/PlanPage';
import { ManagementCommitteeManagement } from '@/components/kami/ManagementCommitteeManagement';
import { PageTransition } from '@/components/ui/page-transition';
import { LogoDisplay } from '@/components/kami/LogoDisplay';
import { AdminLoginDialog } from '@/components/kami/AdminLoginDialog';
import { PaymentMethodScreen } from '@/components/kami/PaymentMethodScreen';
import { ServiceApresVenteScreen } from '@/components/kami/ServiceApresVenteScreen';
import { ExpertApplicationsAdmin } from '@/components/kami/ExpertApplicationsAdmin';
import { AdminHeroImage } from '@/components/kami/AdminHeroImage';
import { CommitteeNotificationBell } from '@/components/kami/CommitteeNotificationBell';
import { UsersMonitorPanel } from '@/components/kami/UsersMonitorPanel';
import { UserManagement } from '@/components/kami/UserManagement';
import { PublicProgressSection } from '@/components/kami/PublicProgressSection';
import { ProgressUpdatesAdmin } from '@/components/kami/ProgressUpdatesAdmin';
import { SubscriberTrackingPanel } from '@/components/kami/SubscriberTrackingPanel';
import { RegulationRulesScreen } from '@/components/kami/RegulationRulesScreen';
import { CGLPermissionsManager } from '@/components/kami/CGLPermissionsManager';
import { EspaceCGL } from '@/components/kami/EspaceCGL';
import { CommitteeChatView } from '@/components/kami/CommitteeChatView';

export default function KamiExtensionPage() {
  const [mounted, setMounted] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  // Store state
  const {
    currentUser,
    setCurrentUser,
    logout,
    currentScreen,
    setCurrentScreen,
    lots,
    setLots,
    myReservations,
    setMyReservations,
    addReservation,
    isMenuOpen,
    setIsMenuOpen,
    selectedLot,
    setSelectedLot,
    isReservationModalOpen,
    setIsReservationModalOpen,
    congratulationNotification,
    setCongratulationNotification,
  } = useAppStore();

  // Form states
  const [loginName, setLoginName] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginIsResident, setLoginIsResident] = useState(true);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [agreeRules, setAgreeRules] = useState(false);
  const [adminView, setAdminView] = useState<string | null>(null);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const footerTapCountRef = useRef(0);
  const footerTapTimerRef = useRef<NodeJS.Timeout | null>(null);

  const loadLots = async () => {
    try {
      const response = await fetch('/api/lots');
      if (response.ok) {
        const data = await response.json();
        setLots(data);
      }
    } catch (error) {
      console.error('Error loading lots:', error);
      // Data will be served from cache by the global fetch patch if offline
    }
  };

  const loadMyReservations = async () => {
    try {
      const response = await fetch(`/api/reservations?userId=${currentUser?.id}`);
      if (response.ok) {
        const data = await response.json();
        setMyReservations(data);
      }
    } catch (error) {
      console.error('Error loading reservations:', error);
    }
  };

  const checkCongratulationNotifications = async () => {
    if (!currentUser?.id) return;

    try {
      const response = await fetch(`/api/user/notifications?userId=${currentUser?.id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.shouldShow) {
          setCongratulationNotification({
            show: true,
            lotName: data.lotName,
            lotBlock: data.lotBlock,
          });
        }
      }
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  };

  // Heartbeat: keep user online status updated every 30s
  const sendHeartbeat = useCallback(async () => {
    if (!currentUser?.id || !navigator.onLine) return;
    try {
      await fetch('/api/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id }),
      });
    } catch {
      // silently fail
    }
  }, [currentUser?.id]);

  useEffect(() => {
    setMounted(true);

    // Manage offline state
    setIsOffline(!navigator.onLine);
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    loadLots();
    if (currentUser?.id) {
      loadMyReservations();
      checkCongratulationNotifications();
      // Send first heartbeat, then every 30s
      sendHeartbeat();
      const interval = setInterval(sendHeartbeat, 30000);
      return () => {
        clearInterval(interval);
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [currentUser, sendHeartbeat]);

  const handleLogin = async (name: string, identifier: string, password?: string) => {
    try {
      // Determine if identifier is a pseudo or phone
      const isPhone = /^\d/.test(identifier);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [isPhone ? 'phone' : 'pseudo']: identifier,
          password: password || undefined,
        }),
      });

      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user);
        toast.success(`Bienvenue ${user.pseudo || user.name} !`);
        setCurrentScreen('home');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Erreur de connexion');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Erreur de connexion');
    }
  };

  const handleOpenReservation = (lot: typeof lots[0]) => {
    if (!currentUser) {
      toast.error('Veuillez vous connecter pour réserver');
      setCurrentScreen('auth-choice');
      return;
    }
    setSelectedLot(lot);
    setCurrentScreen('payment-method');
  };

  const handleReservation = async () => {
    if (!selectedLot || !currentUser) return;

    const amount = parseInt(paymentAmount);
    const totalPrice = currentUser.isResident ? selectedLot.priceRes : selectedLot.priceNon;

    if (!amount || amount < 10000) {
      toast.error('Le montant minimum est de 10 000 FCFA');
      return;
    }

    if (amount > totalPrice) {
      toast.error('Le montant dépasse le prix du lot');
      return;
    }

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          lotId: selectedLot.id,
          amount,
          totalPrice,
          isResident: currentUser.isResident,
        }),
      });

      if (response.ok) {
        const reservation = await response.json();
        addReservation(reservation);
        toast.success('Paiement validé avec succès !');
        setIsReservationModalOpen(false);
        loadLots();
      } else {
        toast.error('Erreur lors de la réservation');
      }
    } catch (error) {
      // Fallback for demo
      const newReservation = {
        id: `RES-${Date.now()}`,
        lotId: selectedLot.id,
        lotName: selectedLot.name,
        surface: selectedLot.surface,
        paidAmount: amount,
        totalPrice,
        isResident: currentUser.isResident,
        status: amount === totalPrice ? ('PAID' as const) : ('RESERVED' as const),
      };
      addReservation(newReservation);
      toast.success('Paiement validé avec succès !');
      setIsReservationModalOpen(false);
    }
  };

  const copyReferralLink = () => {
    if (!currentUser?.referralCode) return;
    navigator.clipboard.writeText(`kami.app/ref/${currentUser.referralCode}`);
    toast.success('Lien copié !');
  };

  const handleRegistrationComplete = async (userData: { name: string; pseudo: string; phone?: string; isResident: boolean; password: string; quartier?: string; villageOrigine?: string }) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          pseudo: userData.pseudo,
          phone: userData.phone || undefined,
          isResident: userData.isResident,
          password: userData.password,
          quartier: userData.quartier,
          villageOrigine: userData.villageOrigine,
        }),
      });

      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user);
        toast.success(`Bienvenue ${user.pseudo || user.name} ! Votre compte est créé.`);
        setCurrentScreen('map');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Erreur lors de la création du compte');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Erreur lors de la création du compte');
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue">
            <WifiOff className="h-8 w-8" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">KAMI-EXTENSION</p>
          <h1 className="mt-3 text-2xl font-bold text-foreground">Chargement de l&apos;application</h1>
          <p className="mt-2 text-sm text-muted-foreground">Initialisation de votre espace en cours...</p>
        </div>
      </div>
    );
  }

  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
            <WifiOff className="h-8 w-8" />
          </div>

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Mode hors ligne</p>
          <h1 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">Connectez-vous pour voir le contenu</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            L&apos;application est en cours de lancement, mais votre connexion est actuellement indisponible. Revenez en ligne puis reconnectez-vous pour accéder à votre espace.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto"
            >
              Réessayer
            </Button>
            <Button
              onClick={() => setCurrentScreen('auth-choice')}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Se connecter
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Offline Indicator */}
      {isOffline && (
        <div className="bg-orange-600 text-white text-[10px] py-1 px-4 text-center font-bold z-50 sticky top-0">
          MODE HORS CONNEXION - AFFICHAGE DES DONNÉES EN CACHE
        </div>
      )}

      {/* Toast Container */}
      <div id="toast-container" />

      {/* Modern Side Menu */}
      <ModernSideMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        currentUser={currentUser}
        onNavigate={setCurrentScreen}
        onLogout={() => {
          logout();
          toast.success('Déconnexion réussie');
        }}
      />

      {/* Screens */}
      {/* Page d'accueil persuasive pour tous */}
      {currentScreen === 'home' && (
        <PageTransition>
          <PersuasiveLandingPage
            lots={lots}
            onReserveClick={() => {
              if (currentUser) {
                setCurrentScreen('map');
              } else {
                setCurrentScreen('auth-choice');
              }
            }}
            setIsMenuOpen={setIsMenuOpen}
            setCurrentScreen={setCurrentScreen}
          />
        </PageTransition>
      )}
      {currentScreen === 'progress' && (
        <PageTransition>
          <PublicProgressSection
            onBack={() => setCurrentScreen('home')}
            onHome={() => setCurrentScreen('home')}
            setCurrentScreen={setCurrentScreen}
          />
        </PageTransition>
      )}

      {/* Écran d'inscription en 2 étapes */}
      {!currentUser && currentScreen === 'register' && (
        <PageTransition>
          <TwoStepRegistration
            onComplete={handleRegistrationComplete}
            onBack={() => setCurrentScreen('auth-choice')}
            onHome={() => setCurrentScreen('home')}
            setIsMenuOpen={setIsMenuOpen}
          />
        </PageTransition>
      )}

      {/* Écran de choix d'authentification */}
      {!currentUser && currentScreen === 'auth-choice' && (
        <PageTransition>
          <AuthChoiceScreen
            onLoginClick={() => setCurrentScreen('login-screen')}
            onRegisterClick={() => setCurrentScreen('register')}
            onServiceApresVenteClick={() => setCurrentScreen('sav')}
            onBack={() => setCurrentScreen('home')}
            onHome={() => setCurrentScreen('home')}
            setIsMenuOpen={setIsMenuOpen}
          />
        </PageTransition>
      )}

      {/* Écran de connexion */}
      {!currentUser && currentScreen === 'login-screen' && (
        <PageTransition>
          <LoginScreen
            onLogin={(name, phone, password) => handleLogin(name, phone, password)}
            onBack={() => setCurrentScreen('auth-choice')}
            onHome={() => setCurrentScreen('home')}
            setIsMenuOpen={setIsMenuOpen}
          />
        </PageTransition>
      )}

      {/* Écran de connexion (ancien, pour compatibilité) */}
      {!currentUser && currentScreen === 'login' && (
        <PageTransition>
          <AuthChoiceScreen
            onLoginClick={() => setCurrentScreen('login-screen')}
            onRegisterClick={() => setCurrentScreen('register')}
            onServiceApresVenteClick={() => setCurrentScreen('sav')}
            onBack={() => setCurrentScreen('home')}
            onHome={() => setCurrentScreen('home')}
            setIsMenuOpen={setIsMenuOpen}
          />
        </PageTransition>
      )}

      {currentScreen === 'map' && (
        <PageTransition>
          <EnhancedMapScreen
            lots={lots}
            handleOpenReservation={handleOpenReservation}
            setCurrentScreen={setCurrentScreen}
            setIsMenuOpen={setIsMenuOpen}
            onHome={() => setCurrentScreen('home')}
          />
        </PageTransition>
      )}

      {currentScreen === 'dashboard' && (
        <PageTransition>
          <UserDashboard
            currentUser={currentUser}
            setCurrentScreen={setCurrentScreen}
            setIsMenuOpen={setIsMenuOpen}
            onHome={() => setCurrentScreen('home')}
            onPayLot={(reservation: any) => {
              // Find the lot from the lots list
              const lot = lots.find((l: any) => l.name === reservation.lotName);
              if (lot) {
                setSelectedLot({ ...(lot as any), paidAmount: reservation.paidAmount } as any);
                setCurrentScreen('payment-method');
              }
            }}
          />
        </PageTransition>
      )}

      {currentScreen === 'profile' && (
        <PageTransition>
          <ProfileScreen
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            copyReferralLink={copyReferralLink}
            setCurrentScreen={setCurrentScreen}
            setIsMenuOpen={setIsMenuOpen}
            onHome={() => setCurrentScreen('home')}
          />
        </PageTransition>
      )}

      {currentScreen === 'affiliation' && (
        <PageTransition>
          <AffiliationScreen
            currentUser={currentUser}
            copyReferralLink={copyReferralLink}
            setCurrentScreen={setCurrentScreen}
            setIsMenuOpen={setIsMenuOpen}
            onHome={() => setCurrentScreen('home')}
          />
        </PageTransition>
      )}

      {currentScreen === 'rules' && (
        <PageTransition>
          <RegulationRulesScreen
            setCurrentScreen={setCurrentScreen}
            onHome={() => setCurrentScreen('home')}
          />
        </PageTransition>
      )}

      {/* Écran Service Après-Vente */}
      {currentScreen === 'sav' && (
        <PageTransition>
          <ServiceApresVenteScreen
            onBack={() => setCurrentScreen(currentUser ? 'home' : 'auth-choice')}
            onHome={() => setCurrentScreen('home')}
            setIsMenuOpen={setIsMenuOpen}
            onLoginClick={() => setCurrentScreen('login-screen')}
          />
        </PageTransition>
      )}

      {currentScreen === 'espace-cgl' && (currentUser?.role === 'MANAGEMENT_COMMITTEE' || currentUser?.role === 'ADMIN') && (
        <PageTransition>
          <EspaceCGL
            setCurrentScreen={setCurrentScreen}
            setAdminView={setAdminView}
            goToAdminScreen={(view: string) => {
              setAdminView(view);
              setCurrentScreen('admin-cgl');
            }}
            onBack={() => setCurrentScreen('home')}
          />
        </PageTransition>
      )}

      {/* Committee Chat — permanent, accessible from Espace CGL */}
      {currentScreen === 'committee-chat' && (currentUser?.role === 'MANAGEMENT_COMMITTEE' || currentUser?.role === 'ADMIN') && (
        <PageTransition>
          <CommitteeChatView
            setCurrentScreen={setCurrentScreen}
            onBack={() => setCurrentScreen('espace-cgl')}
            onHome={() => setCurrentScreen('home')}
          />
        </PageTransition>
      )}

      {/* CGL member accessing admin sub-views through Espace CGL */}
      {currentScreen === 'admin-cgl' && (currentUser?.role === 'MANAGEMENT_COMMITTEE' || currentUser?.role === 'ADMIN') && (
        <PageTransition>
          <AdminScreen
            adminView={adminView}
            setAdminView={(v: string | null) => {
              if (v === null) setCurrentScreen('espace-cgl');
              else setAdminView(v);
            }}
            lots={lots}
            loadLots={loadLots}
            setCurrentScreen={setCurrentScreen}
            currentUser={currentUser}
          />
        </PageTransition>
      )}

      {currentScreen === 'admin' && currentUser?.role === 'ADMIN' && (
        <PageTransition>
          <AdminScreen
            adminView={adminView}
            setAdminView={setAdminView}
            lots={lots}
            loadLots={loadLots}
            setCurrentScreen={setCurrentScreen}
            currentUser={currentUser}
          />
        </PageTransition>
      )}

      {currentScreen === 'admin-flash-infos' && currentUser?.role === 'ADMIN' && (
        <PageTransition>
          <FlashInfoAdmin onBack={() => setCurrentScreen('home')} onHome={() => setCurrentScreen('home')} />
        </PageTransition>
      )}

      {currentScreen === 'settings' && (
        <PageTransition>
          <SettingsPage onBack={() => setCurrentScreen('home')} onHome={() => setCurrentScreen('home')} />
        </PageTransition>
      )}

      {currentScreen === 'plan' && (
        <PageTransition>
          <PlanPage
            setCurrentScreen={setCurrentScreen}
            setIsMenuOpen={setIsMenuOpen}
            onHome={() => setCurrentScreen('home')}
          />
        </PageTransition>
      )}

      {currentScreen === 'chat' && (
        <PageTransition>
          <ChatPage
            setCurrentScreen={setCurrentScreen}
            setIsMenuOpen={setIsMenuOpen}
            onHome={() => setCurrentScreen('home')}
          />
        </PageTransition>
      )}

      {currentScreen === 'admin-chat' && currentUser?.role === 'ADMIN' && (
        <PageTransition>
          <AdminChatPage
            setCurrentScreen={setCurrentScreen}
            setIsMenuOpen={setIsMenuOpen}
            onHome={() => setCurrentScreen('home')}
          />
        </PageTransition>
      )}

      {/* Payment Method Screen */}
      {currentScreen === 'payment-method' && selectedLot && currentUser && (
        <PageTransition>
          <PaymentMethodScreen
            lot={selectedLot as any}
            user={currentUser as any}
            onBack={() => {
              setCurrentScreen(currentUser ? 'map' : 'home');
            }}
            onHome={() => setCurrentScreen('home')}
            onPaymentComplete={() => {
              loadLots();
              loadMyReservations();
              setCurrentScreen('dashboard');
              toast.success('Paiement enregistré !');
            }}
          />
        </PageTransition>
      )}

      {/* Reservation Modal */}
      <Dialog open={isReservationModalOpen} onOpenChange={setIsReservationModalOpen}>
        <DialogContent className="max-w-lg rounded-t-3xl">
          <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-4" />
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Lot {selectedLot?.name}</DialogTitle>
            <p className="text-xs text-muted-foreground">{selectedLot?.surface}</p>
          </DialogHeader>

          {selectedLot && currentUser && (
            <div className="space-y-4">
              <Card className="bg-card border-border">
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="mr-3 h-5 w-5 text-[#8B5E3C]" />
                    <div>
                      <p className="text-xs text-muted-foreground">Votre statut</p>
                      <p className="font-bold text-foreground">
                        {currentUser.isResident ? 'Résident KAMI' : 'Non-Résident'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Prix appliqué</p>
                    <p className="font-extrabold text-[#8B5E3C]">
                      {(currentUser.isResident ? selectedLot.priceRes : selectedLot.priceNon).toLocaleString('fr-FR')} F
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div>
                <Label>Montant à payer maintenant</Label>
                <p className="text-xs text-muted-foreground mb-2">Minimum requis : 10 000 F</p>
                <Input
                  type="number"
                  min={10000}
                  placeholder="Ex: 50000"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>

              <Card className="bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800">
                <CardContent className="p-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={agreeRules}
                      onCheckedChange={(checked) => setAgreeRules(checked as boolean)}
                    />
                    <span className="text-xs font-bold text-foreground">
                      J'ACCEPTE LE RÈGLEMENT INTÉRIEUR
                    </span>
                  </label>
                </CardContent>
              </Card>

              <DialogFooter className="flex-col gap-2">
                <Button
                  className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold py-4 rounded-2xl"
                  disabled={!agreeRules}
                  onClick={handleReservation}
                >
                  Confirmer le paiement
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-muted-foreground"
                  onClick={() => setIsReservationModalOpen(false)}
                >
                  Annuler
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>


      {/* Footer avec déclencheur caché admin (5 appuis) */}
      <footer className="mt-auto bg-card border-t border-border py-4 px-6 text-center text-sm text-muted-foreground">
        <p
          onClick={() => {
            if (footerTapTimerRef.current) clearTimeout(footerTapTimerRef.current);
            footerTapCountRef.current += 1;
            if (footerTapCountRef.current >= 5) {
              footerTapCountRef.current = 0;
              setIsAdminLoginOpen(true);
            } else {
              footerTapTimerRef.current = setTimeout(() => {
                footerTapCountRef.current = 0;
              }, 2000);
            }
          }}
          className="cursor-default select-none"
        >
          © 2024 KAMI-EXTENSION - Tous droits réservés
        </p>
      </footer>

      {/* Admin Login Dialog (déclenché par 5 appuis sur le footer) */}
      <AdminLoginDialog
        open={isAdminLoginOpen}
        onOpenChange={setIsAdminLoginOpen}
        onAdminLoginSuccess={(user) => {
          setCurrentUser(user);
          setCurrentScreen('admin');
        }}
      />

      {/* Congratulation Notification */}
      <CongratulationNotification />
    </div>
  );
}

// Old Login Screen Component (déprécié)
function OldLoginScreen({
  loginName,
  setLoginName,
  loginPhone,
  setLoginPhone,
  loginIsResident,
  setLoginIsResident,
  handleLogin,
}: any) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-card p-6 pt-16">
      <div className="flex flex-col items-center mb-10">
        <div className="mb-4">
          <LogoDisplay size="xl" showBackground={true} />
        </div>
      </div>

      <div className="w-full max-w-md space-y-4">
        <div>
          <Label className="block text-sm font-bold text-foreground mb-1">Nom complet</Label>
          <Input
            type="text"
            placeholder="Ex: Jean Koné"
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
            className="h-12 text-lg"
          />
        </div>

        <div>
          <Label className="block text-sm font-bold text-foreground mb-1">Numéro de téléphone</Label>
          <Input
            type="tel"
            placeholder="+225 07 XX XX XX"
            value={loginPhone}
            onChange={(e) => setLoginPhone(e.target.value)}
            className="h-12 text-lg"
          />
        </div>

        <div>
          <Label className="block text-sm font-bold text-foreground mb-2">Votre statut de résidence :</Label>
          <RadioGroup value={loginIsResident.toString()} onValueChange={(v) => setLoginIsResident(v === 'true')}>
            <div
              className={`flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${loginIsResident ? 'border-[#10B981] bg-emerald-50 dark:bg-emerald-900/20' : 'border-border'}`}
            >
              <RadioGroupItem value="true" id="resident-yes" className="mr-3" />
              <Label htmlFor="resident-yes" className="cursor-pointer flex-1">
                <div>
                  <span className="font-bold text-foreground block">Résident de KAMI</span>
                  <p className="text-xs text-muted-foreground">Prix des lots : 100 000 F</p>
                </div>
              </Label>
            </div>
            <div
              className={`flex items-center p-3 border-2 rounded-xl cursor-pointer transition-all mt-2 ${!loginIsResident ? 'border-[#10B981] bg-emerald-50 dark:bg-emerald-900/20' : 'border-border'}`}
            >
              <RadioGroupItem value="false" id="resident-no" className="mr-3" />
              <Label htmlFor="resident-no" className="cursor-pointer flex-1">
                <div>
                  <span className="font-bold text-foreground block">Non-Résident</span>
                  <p className="text-xs text-muted-foreground">Prix des lots : 150 000 F</p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <Button
          onClick={handleLogin}
          className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold py-4 rounded-2xl shadow-lg text-lg"
        >
          Créer mon compte / Se connecter
        </Button>
      </div>
    </div>
  );
}

// Home Screen Component
function HomeScreen({ setCurrentScreen, setIsMenuOpen }: any) {
  return (
    <div className="flex-1 flex flex-col bg-card">
      <header className="flex justify-between items-center p-4 bg-card sticky top-0 z-10 shadow-sm">
        <LogoDisplay size="xl" className="text-[#8B5E3C]" />
        <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)}>
          <Menu className="h-6 w-6 text-foreground" />
        </Button>
      </header>

      <div className="bg-[#8B5E3C] text-white p-8 pb-12 rounded-b-[2rem] relative overflow-hidden">
        <Building2 className="absolute top-0 right-0 opacity-10 h-[150px] w-[150px]" />
        <h2 className="text-3xl font-extrabold mb-2 relative z-10">
          Construisez votre avenir au village
        </h2>
        <p className="opacity-90 mb-6 relative z-10">
          Le nouveau quartier moderne, propre et discipliné de Kami.
        </p>
        <Button
          onClick={() => setCurrentScreen('map')}
          className="bg-card text-[#8B5E3C] font-bold py-3 px-6 rounded-full shadow-lg hover:bg-background relative z-10"
        >
          <Map className="mr-2 h-4 w-4" />
          Voir les lots disponibles
        </Button>
      </div>

      <div className="p-6 grid grid-cols-2 gap-4">
        <Card className="bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800">
          <CardContent className="p-4 text-center">
            <Wrench className="text-[#10B981] dark:text-emerald-400 h-8 w-8 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-foreground">Routes Pavées</h4>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800">
          <CardContent className="p-4 text-center">
            <Zap className="text-blue-500 dark:text-blue-400 h-8 w-8 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-foreground">Électricité</h4>
          </CardContent>
        </Card>
        <Card className="bg-cyan-50 border-cyan-100 dark:bg-cyan-900/20 dark:border-cyan-800">
          <CardContent className="p-4 text-center">
            <Droplet className="text-cyan-500 dark:text-cyan-400 h-8 w-8 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-foreground">Eau Courante</h4>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-100 dark:bg-purple-900/20 dark:border-purple-800">
          <CardContent className="p-4 text-center">
            <ShieldCheck className="text-purple-500 dark:text-purple-400 h-8 w-8 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-foreground">Sécurité</h4>
          </CardContent>
        </Card>
      </div>

      <div className="px-6 pb-6">
        <Card className="border-2 border-dashed border-[#8B5E3C]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-foreground">Règlement Intérieur</h4>
              <p className="text-xs text-muted-foreground">11 chapitres • Dispositions complètes</p>
            </div>
            <Button
              onClick={() => setCurrentScreen('rules')}
              className="bg-[#8B5E3C] hover:bg-[#6B472C] text-white px-4 py-2 rounded-xl text-sm font-bold"
            >
              Lire
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Map Screen Component
function MapScreen({ lots, handleOpenReservation, setCurrentScreen, setIsMenuOpen }: any) {
  const availableCount = lots.filter((l: any) => l.status === 'AVAILABLE').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] px-2 py-0.5 font-bold">DISPONIBLE</Badge>;
      case 'RESERVED':
        return <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-[10px] px-2 py-0.5 font-bold">RÉSERVÉ</Badge>;
      case 'PAID':
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-[10px] px-2 py-0.5 font-bold">SOLDÉ</Badge>;
    }
  };

  const getLotButton = (lot: any) => {
    if (lot.status === 'AVAILABLE') {
      return (
        <Button
          onClick={() => handleOpenReservation(lot)}
          className="w-full mt-2 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold h-8"
        >
          Réserver
        </Button>
      );
    }
    return (
      <Button disabled className="w-full mt-2 bg-muted text-muted-foreground text-xs font-bold h-8">
        {lot.status === 'RESERVED' ? 'Réservé' : 'Soldé'}
      </Button>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-background pb-20">
      <header className="bg-card p-4 pb-2 shadow-sm flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)}>
            <Menu className="h-5 w-5 text-foreground" />
          </Button>
          <h2 className="text-lg font-bold text-foreground ml-2">Plan du Village</h2>
        </div>
        <Badge className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold">{availableCount} Libres</Badge>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {lots.map((lot: any) => (
            <Card
              key={lot.id}
              className={`border-2 ${
                lot.status === 'AVAILABLE'
                  ? 'bg-card border-emerald-200 dark:border-emerald-700'
                  : lot.status === 'RESERVED'
                  ? 'bg-background border-orange-200 dark:border-orange-700 opacity-50'
                  : 'bg-background border-red-200 dark:border-red-700 opacity-50'
              } rounded-2xl`}
            >
              <CardContent className="p-3 flex flex-col justify-between h-full">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <Home
                      className={`h-5 w-5 ${
                        lot.status === 'AVAILABLE' ? 'text-emerald-500 dark:text-emerald-400' : lot.status === 'RESERVED' ? 'text-orange-400' : 'text-red-400'
                      }`}
                    />
                    {getStatusBadge(lot.status)}
                  </div>
                  <h4 className="font-bold text-foreground">Lot {lot.name}</h4>
                  <p className="text-xs text-muted-foreground">{lot.surface}</p>
                </div>
                <div>
                  <p className="font-extrabold text-[#8B5E3C] text-sm">
                    Dès {lot.priceRes.toLocaleString('fr-FR')} F
                  </p>
                  {getLotButton(lot)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around py-3 text-muted-foreground">
        <Button
          variant="ghost"
          className="flex flex-col items-center h-auto"
          onClick={() => setCurrentScreen('home')}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Accueil</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center h-auto text-[#10B981]"
          disabled
        >
          <Map className="h-5 w-5" />
          <span className="text-xs mt-1 font-bold">Lots</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center h-auto"
          onClick={() => setCurrentScreen('dashboard')}
        >
          <Wallet className="h-5 w-5" />
          <span className="text-xs mt-1">Mes Lots</span>
        </Button>
      </nav>
    </div>
  );
}

// Dashboard Screen Component
function DashboardScreen({ myReservations, setCurrentScreen, setIsMenuOpen }: any) {
  return (
    <div className="flex-1 flex flex-col bg-background pb-20">
      <header className="bg-card p-4 shadow-sm flex items-center sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)}>
          <Menu className="h-5 w-5 text-foreground" />
        </Button>
        <h2 className="text-lg font-bold text-foreground ml-2">Mes Réservations</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {myReservations.length === 0 ? (
          <div className="text-center text-muted-foreground mt-20">
            <Home className="h-12 w-12 mx-auto mb-4" />
            <p>Aucun lot réservé.</p>
          </div>
        ) : (
          myReservations.map((reservation: any) => {
            const isPaid = reservation.paidAmount === reservation.totalPrice;
            const progress = (reservation.paidAmount / reservation.totalPrice) * 100;
            const remaining = reservation.totalPrice - reservation.paidAmount;

            return (
              <Card key={reservation.id || `res-${reservation.lotId}`} className="bg-card rounded-2xl shadow-sm border border-border mb-4">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-foreground">Lot {reservation.lotName}</h3>
                    <Badge className={isPaid ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'}>
                      {isPaid ? 'Soldé ✓' : 'Réservé'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Statut: {reservation.isResident ? 'Résident' : 'Non-Résident'} ({reservation.totalPrice.toLocaleString('fr-FR')} F)
                  </p>
                  <Card className="bg-card border-0">
                    <CardContent className="p-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Payé</span>
                        <span className="font-bold text-[#10B981]">{reservation.paidAmount.toLocaleString('fr-FR')} F</span>
                      </div>
                      {!isPaid && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Reste</span>
                          <span className="font-bold text-red-500 dark:text-red-400">{remaining.toLocaleString('fr-FR')} F</span>
                        </div>
                      )}
                      <div className="w-full bg-border rounded-full h-1.5 mt-2">
                        <div className="bg-[#10B981] h-1.5 rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around py-3 text-muted-foreground">
        <Button
          variant="ghost"
          className="flex flex-col items-center h-auto"
          onClick={() => setCurrentScreen('home')}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Accueil</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center h-auto"
          onClick={() => setCurrentScreen('map')}
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
          <span className="text-xs mt-1 font-bold">Mes Lots</span>
        </Button>
      </nav>
    </div>
  );
}

// Profile Screen Component
function ProfileScreen({ currentUser, setCurrentUser, copyReferralLink, setCurrentScreen, setIsMenuOpen, onHome }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [form, setForm] = useState({
    name: currentUser?.name || '',
    pseudo: currentUser?.pseudo || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    quartier: currentUser?.quartier || '',
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image trop volumineuse (max 5 Mo)'); return; }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { toast.error('Format non supporté (JPEG, PNG, WebP)'); return; }
    setPhotoUploading(true);
    try {
      const formData = new FormData();
      formData.append('profilePhoto', file);
      formData.append('userId', currentUser.id);
      const res = await fetch('/api/user/profile', { method: 'PUT', body: formData });
      if (res.ok) {
        const updated = await res.json();
        setCurrentUser({ ...currentUser, ...updated });
        toast.success('Photo de profil mise à jour');
      } else { toast.error('Erreur lors du téléchargement'); }
    } catch { toast.error('Erreur serveur'); }
    finally { setPhotoUploading(false); }
  };

  const quartiersKami = ['ASSAKLA', "N'GLOH", "N'ZOKLOH", "N'GUOUAH"];

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Le nom est obligatoire');
      return;
    }
    if (!form.pseudo.trim()) {
      toast.error('Le pseudo est obligatoire');
      return;
    }
    if (currentUser?.isResident && !form.quartier) {
      toast.error('Le quartier est obligatoire pour les résidents KAMI');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          name: form.name,
          pseudo: form.pseudo.trim(),
          phone: form.phone,
          email: form.email,
          quartier: currentUser.isResident ? form.quartier : undefined,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setCurrentUser({ ...currentUser, ...updatedUser });
        toast.success('Profil mis à jour avec succès');
        setIsEditing(false);
      } else {
        const data = await response.json();
        toast.error(data.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      toast.error('Erreur serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({
      name: currentUser?.name || '',
      pseudo: currentUser?.pseudo || '',
      phone: currentUser?.phone || '',
      email: currentUser?.email || '',
      quartier: currentUser?.quartier || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-background pb-20">
      <PageNav
        onBack={() => setIsMenuOpen(true)}
        onHome={onHome || (() => setCurrentScreen('home'))}
        title="Mon Profil"
        titleRight={!isEditing ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="text-brand-blue font-semibold"
          >
            Modifier
          </Button>
        ) : <div className="w-9" />}
      />

      <div className="flex-1 overflow-y-auto p-4">

      {/* Avatar + Statut */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-full bg-brand-blue/10 dark:bg-brand-blue/20 flex items-center justify-center overflow-hidden border-2 border-border">
            {currentUser?.profilePhoto ? (
              <img src={currentUser.profilePhoto} alt="Photo" className="w-full h-full object-cover" />
            ) : (
              <User className="h-9 w-9 text-brand-blue" />
            )}
          </div>
          {isEditing && (
            <label className="absolute bottom-0 right-0 w-7 h-7 bg-brand-blue rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-md">
              <Camera className="h-3.5 w-3.5 text-white" />
              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoUpload} disabled={photoUploading} />
            </label>
          )}
          {photoUploading && (
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            </div>
          )}
        </div>
        {!isEditing && (
          <>
            <h3 className="text-xl font-bold text-foreground">{currentUser?.name || 'Non connecté'}</h3>
            <p className="text-sm text-muted-foreground">{currentUser?.phone || ''}</p>
          </>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4 max-w-lg mx-auto w-full">
          {/* Nom */}
          <Card className="border-border">
            <CardContent className="p-4 space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Nom complet <span className="text-red-500">*</span>
              </Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Votre nom complet"
                className="h-10"
              />
            </CardContent>
          </Card>

          {/* Pseudo */}
          <Card className="border-border">
            <CardContent className="p-4 space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Pseudo <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-muted-foreground">Ce pseudo sera visible par tous sur la plateforme (réservations, etc.)</p>
              <Input
                value={form.pseudo}
                onChange={(e) => setForm({ ...form, pseudo: e.target.value })}
                placeholder="Votre pseudo public"
                className="h-10"
              />
            </CardContent>
          </Card>

          {/* Téléphone */}
          <Card className="border-border">
            <CardContent className="p-4 space-y-2">
              <Label className="text-sm font-semibold text-foreground">Téléphone</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Numéro de téléphone"
                className="h-10"
              />
            </CardContent>
          </Card>

          {/* Email */}
          <Card className="border-border">
            <CardContent className="p-4 space-y-2">
              <Label className="text-sm font-semibold text-foreground">Email (optionnel)</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="votre@email.com"
                className="h-10"
              />
            </CardContent>
          </Card>

          {/* Quartier (résidents uniquement) */}
          {currentUser?.isResident && (
            <Card className="border-border">
              <CardContent className="p-4 space-y-2">
                <Label className="text-sm font-semibold text-foreground">
                  Quartier <span className="text-red-500">*</span>
                </Label>
                <Select value={form.quartier} onValueChange={(v) => setForm({ ...form, quartier: v })}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Sélectionnez votre quartier" />
                  </SelectTrigger>
                  <SelectContent>
                    {quartiersKami.map((q) => (
                      <SelectItem key={q} value={q}>{q}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}

          {/* Boutons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 h-11 font-semibold"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              className="flex-1 h-11 bg-brand-blue hover:bg-blue-700 text-white font-semibold"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3 max-w-lg mx-auto w-full">
          {/* Nom */}
          <Card className="border-border">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Nom complet</p>
                <p className="font-bold text-foreground">{currentUser?.name || '-'}</p>
              </div>
              <User className="h-5 w-5 text-brand-blue" />
            </CardContent>
          </Card>

          {/* Pseudo */}
          <Card className="border-border bg-brand-blue/5 dark:bg-brand-blue/10">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Pseudo <span className="text-[10px] text-brand-blue font-medium">(public)</span></p>
                <p className="font-bold text-brand-blue">{currentUser?.pseudo || 'Non défini'}</p>
              </div>
              <User className="h-5 w-5 text-brand-blue" />
            </CardContent>
          </Card>

          {/* Téléphone */}
          <Card className="border-border">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Téléphone</p>
                <p className="font-bold text-foreground">{currentUser?.phone || '-'}</p>
              </div>
              <Phone className="h-5 w-5 text-brand-blue" />
            </CardContent>
          </Card>

          {/* Email */}
          <Card className="border-border">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-bold text-foreground">{currentUser?.email || 'Non renseigné'}</p>
              </div>
              <CreditCard className="h-5 w-5 text-brand-blue" />
            </CardContent>
          </Card>

          {/* Quartier (résidents) */}
          {currentUser?.isResident && (
            <Card className="border-border">
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Quartier</p>
                  <p className="font-bold text-foreground">{currentUser?.quartier || 'Non renseigné'}</p>
                </div>
                <Home className="h-5 w-5 text-brand-blue" />
              </CardContent>
            </Card>
          )}

          {/* Statut résidence */}
          <Card
            className={
              currentUser?.isResident
                ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800'
                : 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800'
            }
          >
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Statut de résidence</p>
                <p className={`font-bold ${currentUser?.isResident ? 'text-emerald-700 dark:text-emerald-400' : 'text-orange-700 dark:text-orange-400'}`}>
                  {currentUser?.isResident ? 'Résident KAMI (100 000 F)' : 'Non-Résident (150 000 F)'}
                </p>
              </div>
              <Home className={`h-5 w-5 ${currentUser?.isResident ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'}`} />
            </CardContent>
          </Card>

          {/* Parrainage */}
          {currentUser?.referralCode && (
            <Card className="border-border">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-2">Lien de parrainage</p>
                <div className="flex items-center bg-background border rounded-lg p-2 gap-2">
                  <input
                    type="text"
                    value={`kami.app/ref/${currentUser.referralCode}`}
                    readOnly
                    className="flex-1 text-sm outline-none text-foreground font-semibold bg-transparent min-w-0"
                  />
                  <Button
                    onClick={copyReferralLink}
                    size="sm"
                    variant="outline"
                    className="shrink-0"
                    title="Copier le lien"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0"
                    title="Partager le lien"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: 'Rejoins KAMI-EXTENSION', text: 'Réserve ton lot de terrain à KAMI-EXTENSION', url: `https://kami.app/ref/${currentUser.referralCode}` });
                      } else {
                        copyReferralLink();
                        toast.success('Lien copié ! Partagez-le avec vos proches.');
                      }
                    }}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      </div>
    </div>
  );
}

// Affiliation Screen Component
function AffiliationScreen({ currentUser, copyReferralLink, setCurrentScreen, setIsMenuOpen, onHome }: any) {
  return (
    <div className="flex-1 flex flex-col bg-card">
      <PageNav
        onBack={() => setIsMenuOpen(true)}
        onHome={onHome || (() => setCurrentScreen('home'))}
        title="Parrainage"
      />
      <div className="p-4">
      <Card className="bg-emerald-50 p-6 rounded-2xl text-center border border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800 mb-6">
        <p className="text-foreground text-sm">Vos gains totaux</p>
        <h3 className="text-4xl font-extrabold text-[#10B981] dark:text-emerald-400 mt-2">
          0 <span className="text-lg">FCFA</span>
        </h3>
      </Card>

      <Card className="bg-card p-4 rounded-xl mb-6">
        <p className="text-sm text-muted-foreground mb-2">Partagez votre lien de parrainage :</p>
        <div className="flex items-center bg-card border rounded-lg p-2 gap-2">
          <input
            type="text"
            value={currentUser?.referralCode ? `https://kami.app/ref/${currentUser.referralCode}` : 'Non connecté'}
            readOnly
            className="flex-1 text-sm outline-none text-foreground font-semibold bg-transparent min-w-0"
          />
          <Button
            onClick={copyReferralLink}
            size="sm"
            className="bg-[#8B5E3C] hover:bg-[#6B472C] text-white shrink-0"
            disabled={!currentUser?.referralCode}
            title="Copier"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="shrink-0"
            disabled={!currentUser?.referralCode}
            title="Partager"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: 'Rejoins KAMI-EXTENSION', text: 'Réserve ton lot de terrain à KAMI-EXTENSION', url: `https://kami.app/ref/${currentUser.referralCode}` });
              } else {
                copyReferralLink();
                toast.success('Lien copié ! Partagez-le avec vos proches.');
              }
            }}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <p className="text-xs text-muted-foreground text-center">
        Gagnez des commissions quand vos filleuls achètent un lot.
      </p>
      </div>
    </div>
  );
}

// Admin Screen Component
function SavSettingsAdmin({ onBack }: { onBack?: () => void }) {
  const [savPhone, setSavPhone] = useState('');
  const [savWhatsapp, setSavWhatsapp] = useState('');
  const [savEmail, setSavEmail] = useState('');
  const [savHoraires, setSavHoraires] = useState<{ day: string; hours: string }[]>([]);
  const [savFaq, setSavFaq] = useState<{ question: string; answer: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/sav-settings')
      .then(r => r.json())
      .then(data => {
        setSavPhone(data.savPhone || '');
        setSavWhatsapp(data.savWhatsapp || '');
        setSavEmail(data.savEmail || '');
        setSavHoraires(data.savHoraires || []);
        setSavFaq(data.savFaq || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/sav-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-role': 'ADMIN' },
        body: JSON.stringify({ savPhone, savWhatsapp, savEmail, savHoraires, savFaq }),
      });
      if (res.ok) toast.success('Paramètres SAV enregistrés !');
      else toast.error('Erreur lors de la sauvegarde');
    } catch {
      toast.error('Erreur de connexion');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-6">
        <Card className="bg-card p-6"><CardContent className="text-center text-muted-foreground"><AlertCircle className="h-8 w-8 mx-auto mb-2 animate-pulse" /><p>Chargement...</p></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-lg font-bold mb-2">Paramètres SAV</h2>

      <Card className="bg-card p-4">
        <CardContent className="p-0 space-y-4">
          <div>
            <Label className="text-xs font-bold">Téléphone SAV</Label>
            <Input value={savPhone} onChange={e => setSavPhone(e.target.value)} placeholder="+225 27 22 49 00 00" className="mt-1" />
          </div>
          <div>
            <Label className="text-xs font-bold">WhatsApp SAV</Label>
            <Input value={savWhatsapp} onChange={e => setSavWhatsapp(e.target.value)} placeholder="+225 07 58 42 10 00" className="mt-1" />
          </div>
          <div>
            <Label className="text-xs font-bold">Email SAV</Label>
            <Input value={savEmail} onChange={e => setSavEmail(e.target.value)} placeholder="sav@kami-extension.com" className="mt-1" />
          </div>

          <Separator />

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs font-bold">Horaires d&apos;ouverture</Label>
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setSavHoraires([...savHoraires, { day: '', hours: '' }])}><Plus className="h-3 w-3 mr-1" />Ajouter</Button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {savHoraires.map((h, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input value={h.day} onChange={e => { const n = [...savHoraires]; n[i].day = e.target.value; setSavHoraires(n); }} placeholder="Jour" className="flex-1 h-9 text-sm" />
                  <Input value={h.hours} onChange={e => { const n = [...savHoraires]; n[i].hours = e.target.value; setSavHoraires(n); }} placeholder="Horaires" className="flex-1 h-9 text-sm" />
                  <Button variant="ghost" size="sm" className="h-9 w-9 text-red-500 shrink-0" onClick={() => setSavHoraires(savHoraires.filter((_, idx) => idx !== i))}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs font-bold">FAQ</Label>
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setSavFaq([...savFaq, { question: '', answer: '' }])}><Plus className="h-3 w-3 mr-1" />Ajouter</Button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {savFaq.map((f, i) => (
                <div key={i} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-bold text-muted-foreground mt-2 shrink-0">Q{i + 1}</span>
                    <Input value={f.question} onChange={e => { const n = [...savFaq]; n[i].question = e.target.value; setSavFaq(n); }} placeholder="Question" className="flex-1 h-9 text-sm" />
                    <Button variant="ghost" size="sm" className="h-9 w-9 text-red-500 shrink-0" onClick={() => setSavFaq(savFaq.filter((_, idx) => idx !== i))}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                  <Input value={f.answer} onChange={e => { const n = [...savFaq]; n[i].answer = e.target.value; setSavFaq(n); }} placeholder="Réponse" className="h-9 text-sm" />
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
            {saving ? 'Enregistrement...' : 'Enregistrer les paramètres SAV'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminScreen({ adminView, setAdminView, lots, loadLots, setCurrentScreen, currentUser }: any) {
  // Stats state
  const [stats, setStats] = useState({ available: 0, reserved: 0, pending: 0, revenue: 0, userCount: 0, reservationCount: 0, totalLots: 0, paid: 0 });
  const [statsLoading, setStatsLoading] = useState(false);

  // Payments state
  const [payments, setPayments] = useState<any[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);

  // New lot state
  const [newLot, setNewLot] = useState({ name: '', surface: '', block: '', priceRes: '', priceNon: '' });

  // Load stats from API
  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats({
          available: data.available || 0,
          reserved: (data.reserved || 0) + (data.paid || 0),
          pending: data.pendingPayments || 0,
          revenue: data.revenue || 0,
          userCount: data.userCount || 0,
          reservationCount: data.reservationCount || 0,
          totalLots: data.totalLots || 0,
          paid: data.paid || 0,
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Load payments from API
  const loadPayments = async () => {
    setPaymentsLoading(true);
    try {
      const response = await fetch('/api/admin/payments');
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      }
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setPaymentsLoading(false);
    }
  };

  // Handle add lot
  const handleAddLot = async () => {
    if (!newLot.name || !newLot.surface || !newLot.block || !newLot.priceRes || !newLot.priceNon) {
      toast.error('Remplissez tous les champs');
      return;
    }

    try {
      const response = await fetch('/api/lots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newLot.name,
          surface: newLot.surface,
          block: newLot.block,
          priceRes: parseInt(newLot.priceRes),
          priceNon: parseInt(newLot.priceNon),
        }),
      });

      if (response.ok) {
        toast.success(`Lot ${newLot.name} ajouté !`);
        setNewLot({ name: '', surface: '', block: '', priceRes: '', priceNon: '' });
        loadLots();
      } else {
        toast.error('Erreur lors de l\'ajout du lot');
      }
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du lot');
    }
  };

  // Handle validate payment (accept payment)
  const handleValidatePayment = async (reservationId: string) => {
    const amount = prompt('Montant à valider (FCFA):');
    if (!amount) return;

    try {
      const response = await fetch('/api/admin/payments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservationId,
          amount: parseInt(amount),
          status: 'VALIDATED',
        }),
      });

      if (response.ok) {
        toast.success('Paiement validé avec succès !');
        loadPayments();
        loadStats();
        loadLots();
      } else {
        toast.error('Erreur lors de la validation');
      }
    } catch (error) {
      toast.error('Erreur lors de la validation');
    }
  };

  // Handle delete reservation
  const handleDeleteReservation = async (reservationId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) return;

    try {
      const response = await fetch(`/api/admin/payments?id=${reservationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Réservation supprimée !');
        loadPayments();
        loadStats();
        loadLots();
      } else {
        toast.error('Erreur lors de la suppression');
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  // Load data when view changes
  useEffect(() => {
    if (adminView === 'stats') {
      loadStats();
      // Auto-refresh every 10 seconds
      const interval = setInterval(loadStats, 10000);
      return () => clearInterval(interval);
    } else if (adminView === 'payments') {
      loadPayments();
    }
  }, [adminView]);

  return (
    <div className="flex-1 flex flex-col bg-card">
      <PageNav
        onBack={() => adminView ? setAdminView(null) : setCurrentScreen('home')}
        onHome={() => setCurrentScreen('home')}
        title={adminView ? 'Admin' : undefined}
        titleRight={currentUser?.id ? (
          <CommitteeNotificationBell
            userId={currentUser.id}
            onNavigate={() => setCurrentScreen('espace-cgl')}
          />
        ) : undefined}
      />
      <div className="p-6 pt-2">
      {!adminView && (
        <div className="flex items-center justify-center mb-6">
          <h2 className="text-2xl font-bold text-red-600 flex items-center justify-center">
            <Shield className="mr-2 h-6 w-6" />
            Administration
          </h2>
        </div>
      )}

      {!adminView && (
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-card p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition h-[100px]" onClick={() => setAdminView('dashboard')}>
            <CardContent className="p-0 text-center flex flex-col items-center justify-center h-full">
              <ChartLine className="text-[#10B981] h-8 w-8 mb-2" />
              <p className="text-sm font-bold">Tableau de Bord Global</p>
            </CardContent>
          </Card>
          <Card className="bg-card p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition h-[100px]" onClick={() => setAdminView('payments')}>
            <CardContent className="p-0 text-center flex flex-col items-center justify-center h-full">
              <CheckCircle className="text-blue-500 dark:text-blue-400 h-8 w-8 mb-2" />
              <p className="text-sm font-bold">Valider Paiements</p>
            </CardContent>
          </Card>
          <Card className="bg-card p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition h-[100px]" onClick={() => setAdminView('add-lots')}>
            <CardContent className="p-0 text-center flex flex-col items-center justify-center h-full">
              <PlusCircle className="text-[#8B5E3C] dark:text-[#A5785C] h-8 w-8 mb-2" />
              <p className="text-sm font-bold">Ajouter Lots</p>
            </CardContent>
          </Card>
          <Card className="bg-card p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition h-[100px]" onClick={() => setAdminView('logo')}>
            <CardContent className="p-0 text-center flex flex-col items-center justify-center h-full">
              <FileText className="text-orange-500 dark:text-orange-400 h-8 w-8 mb-2" />
              <p className="text-sm font-bold">Éditer le Logo</p>
            </CardContent>
          </Card>
          <Card className="bg-card p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition h-[100px]" onClick={() => setAdminView('hero-image')}>
            <CardContent className="p-0 text-center flex flex-col items-center justify-center h-full">
              <ImageIcon className="text-pink-500 dark:text-pink-400 h-8 w-8 mb-2" />
              <p className="text-sm font-bold">Image de Fond</p>
            </CardContent>
          </Card>
          <Card className="bg-card p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition h-[100px]" onClick={() => setAdminView('committee')}>
            <CardContent className="p-0 text-center flex flex-col items-center justify-center h-full">
              <Shield className="text-purple-600 dark:text-purple-400 h-8 w-8 mb-2" />
              <p className="text-sm font-bold">Gestion du Comité</p>
            </CardContent>
          </Card>
          <Card className="bg-card p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition h-[100px]" onClick={() => setAdminView('flash-infos')}>
            <CardContent className="p-0 text-center flex flex-col items-center justify-center h-full">
              <FileText className="text-brand-blue h-8 w-8 mb-2" />
              <p className="text-sm font-bold">Flash Infos</p>
            </CardContent>
          </Card>
          <Card className="bg-card p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition h-[100px]" onClick={() => setAdminView('expert-applications')}>
            <CardContent className="p-0 text-center flex flex-col items-center justify-center h-full">
              <UserPlus className="text-emerald-500 dark:text-emerald-400 h-8 w-8 mb-2" />
              <p className="text-sm font-bold">Candidatures Experts</p>
            </CardContent>
          </Card>
          <Card className="bg-card p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition h-[100px]" onClick={() => setAdminView('users-monitor')}>
            <CardContent className="p-0 text-center flex flex-col items-center justify-center h-full">
              <Activity className="text-cyan-500 dark:text-cyan-400 h-8 w-8 mb-2" />
              <p className="text-sm font-bold">Surveillance Connexions</p>
            </CardContent>
          </Card>
          <Card className="bg-card p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition h-[100px]" onClick={() => setAdminView('user-management')}>
            <CardContent className="p-0 text-center flex flex-col items-center justify-center h-full">
              <Users className="text-blue-500 dark:text-blue-400 h-8 w-8 mb-2" />
              <p className="text-sm font-bold">Gestion Utilisateurs</p>
            </CardContent>
          </Card>
          <Card className="bg-card p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition h-[100px]" onClick={() => setAdminView('files')}>
            <CardContent className="p-0 text-center flex flex-col items-center justify-center h-full">
              <Upload className="text-brand-blue h-8 w-8 mb-2" />
              <p className="text-sm font-bold">Gérer Fichiers</p>
            </CardContent>
          </Card>
          <Card className="bg-card p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition h-[100px]" onClick={() => setAdminView('progress-updates')}>
            <CardContent className="p-0 text-center flex flex-col items-center justify-center h-full">
              <Construction className="text-orange-500 dark:text-orange-400 h-8 w-8 mb-2" />
              <p className="text-sm font-bold">Avancement Travaux</p>
            </CardContent>
          </Card>
          <Card className="bg-card p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition h-[100px]" onClick={() => setAdminView('subscriber-tracking')}>
            <CardContent className="p-0 text-center flex flex-col items-center justify-center h-full">
              <TrendingUp className="text-cyan-500 dark:text-cyan-400 h-8 w-8 mb-2" />
              <p className="text-sm font-bold">Suivi Souscripteurs</p>
            </CardContent>
          </Card>
          <Card className="bg-card p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition h-[100px]" onClick={() => setAdminView('sav-settings')}>
            <CardContent className="p-0 text-center flex flex-col items-center justify-center h-full">
              <Headset className="text-emerald-500 h-8 w-8 mb-2" />
              <p className="text-sm font-bold">Paramètres SAV</p>
            </CardContent>
          </Card>
          <Card className="bg-card p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition h-[100px]" onClick={() => setAdminView('cgl-permissions')}>
            <CardContent className="p-0 text-center flex flex-col items-center justify-center h-full">
              <Crown className="text-purple-600 dark:text-purple-400 h-8 w-8 mb-2" />
              <p className="text-sm font-bold">Permissions CGL</p>
            </CardContent>
          </Card>
        </div>
      )}

      {adminView === 'dashboard' && (
        <AdminDashboard setAdminView={setAdminView} />
      )}

      {adminView === 'stats' && (
        <div className="mt-4">
          {statsLoading ? (
            <Card className="bg-card p-6">
              <CardContent className="text-center text-muted-foreground">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 animate-pulse" />
                <p>Chargement...</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Card className="bg-card p-4 rounded-xl shadow-sm border-l-4 border-[#10B981]">
                  <p className="text-xs text-muted-foreground">Encaissé</p>
                  <h3 className="text-lg font-extrabold text-foreground">{stats.revenue.toLocaleString('fr-FR')} F</h3>
                </Card>
                <Card className="bg-card p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
                  <p className="text-xs text-muted-foreground">Disponibles</p>
                  <h3 className="text-lg font-extrabold text-foreground">{stats.available}</h3>
                </Card>
                <Card className="bg-card p-4 rounded-xl shadow-sm border-l-4 border-orange-500">
                  <p className="text-xs text-muted-foreground">Attente</p>
                  <h3 className="text-lg font-extrabold text-foreground">{stats.pending}</h3>
                </Card>
                <Card className="bg-card p-4 rounded-xl shadow-sm border-l-4 border-red-500">
                  <p className="text-xs text-muted-foreground">Réservés/Soldés</p>
                  <h3 className="text-lg font-extrabold text-foreground">{stats.reserved}</h3>
                </Card>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-card p-4 rounded-xl shadow-sm">
                  <p className="text-xs text-muted-foreground">Total Lots</p>
                  <h3 className="text-lg font-extrabold text-foreground">{stats.totalLots}</h3>
                </Card>
                <Card className="bg-card p-4 rounded-xl shadow-sm">
                  <p className="text-xs text-muted-foreground">Utilisateurs</p>
                  <h3 className="text-lg font-extrabold text-foreground">{stats.userCount}</h3>
                </Card>
              </div>
            </>
          )}
        </div>
      )}

      {adminView === 'add-lots' && (
        <div className="mt-4">
          <Card className="bg-card p-4 rounded-xl shadow-sm border border-border">
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm">Îlot</Label>
                <Input
                  value={newLot.block}
                  onChange={(e) => setNewLot({ ...newLot, block: e.target.value })}
                  placeholder="A"
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm">Numéro</Label>
                  <Input
                    value={newLot.name}
                    onChange={(e) => setNewLot({ ...newLot, name: e.target.value })}
                    placeholder="01"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm">Surface</Label>
                  <Input
                    value={newLot.surface}
                    onChange={(e) => setNewLot({ ...newLot, surface: e.target.value })}
                    placeholder="300m²"
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm">Prix Résident</Label>
                  <Input
                    type="number"
                    value={newLot.priceRes}
                    onChange={(e) => setNewLot({ ...newLot, priceRes: e.target.value })}
                    placeholder="100000"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm">Prix Non-Rés</Label>
                  <Input
                    type="number"
                    value={newLot.priceNon}
                    onChange={(e) => setNewLot({ ...newLot, priceNon: e.target.value })}
                    placeholder="150000"
                    className="mt-1"
                  />
                </div>
              </div>
              <Button
                onClick={handleAddLot}
                className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold"
              >
                Créer le Lot
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {adminView === 'payments' && (
        <div className="mt-4">
          {paymentsLoading ? (
            <Card className="bg-card p-6">
              <CardContent className="text-center text-muted-foreground">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 animate-pulse" />
                <p>Chargement...</p>
              </CardContent>
            </Card>
          ) : payments.length === 0 ? (
            <Card className="bg-card p-6">
              <CardContent className="text-center text-muted-foreground">
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                <p>Aucun paiement en attente.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {payments.map((payment: any) => {
                const progress = ((payment.paidAmount || 0) / (payment.totalPrice || 1)) * 100;
                const remaining = (payment.totalPrice || 0) - (payment.paidAmount || 0);
                const isPaid = payment.paidAmount >= payment.totalPrice;

                return (
                  <Card key={payment.id || `pay-${payment.lotId}`} className="bg-card rounded-xl shadow-sm border border-border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-foreground">Lot {payment.lot?.name || payment.lotName}</h3>
                          <p className="text-xs text-muted-foreground">{payment.user?.name || 'Utilisateur inconnu'}</p>
                        </div>
                        <Badge className={isPaid ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'}>
                          {isPaid ? 'Soldé' : 'En cours'}
                        </Badge>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Payé</span>
                          <span className="font-bold text-[#10B981]">{(payment.paidAmount || 0).toLocaleString('fr-FR')} F</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Total</span>
                          <span className="font-bold text-foreground">{(payment.totalPrice || 0).toLocaleString('fr-FR')} F</span>
                        </div>
                        {!isPaid && (
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Reste</span>
                            <span className="font-bold text-red-500 dark:text-red-400">{remaining.toLocaleString('fr-FR')} F</span>
                          </div>
                        )}
                        <div className="w-full bg-border rounded-full h-2">
                          <div className="bg-[#10B981] h-2 rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
                        </div>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          className="flex-1 bg-[#10B981] hover:bg-[#059669] text-white"
                          onClick={() => handleValidatePayment(payment.id)}
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Valider
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1"
                          onClick={() => handleDeleteReservation(payment.id)}
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Supprimer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {adminView === 'committee' && (
        <ManagementCommitteeManagement setAdminView={setAdminView} setCurrentScreen={setCurrentScreen} currentUser={currentUser} />
      )}

      {adminView === 'logo' && (
        <AdminLogo onClose={() => setAdminView('dashboard')} />
      )}

      {adminView === 'flash-infos' && (
        <FlashInfoAdmin onBack={() => setAdminView('dashboard')} />
      )}

      {adminView === 'files' && (
        <AdminFiles onBack={() => setAdminView('dashboard')} />
      )}

      {adminView === 'expert-applications' && (
        <ExpertApplicationsAdmin onBack={() => setAdminView('dashboard')} />
      )}

      {adminView === 'users-monitor' && (
        <UsersMonitorPanel />
      )}

      {adminView === 'user-management' && (
        <UserManagement />
      )}

      {adminView === 'progress-updates' && (
        <ProgressUpdatesAdmin />
      )}

      {adminView === 'subscriber-tracking' && (
        <SubscriberTrackingPanel setCurrentScreen={setCurrentScreen} currentUser={currentUser} />
      )}

      {adminView === 'sav-settings' && <SavSettingsAdmin />}

      {adminView === 'hero-image' && (
        <AdminHeroImage onBack={() => setAdminView('dashboard')} />
      )}

      {adminView === 'cgl-permissions' && (
        <CGLPermissionsManager setAdminView={setAdminView} />
      )}
      </div>
    </div>
  );
}
