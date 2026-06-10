'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Building2, Map, Home, Wallet, Users, User, Shield, ArrowLeft, Menu, LogOut, LogIn, CheckCircle, XCircle, AlertCircle, ChartLine, CreditCard, UserPlus, PlusCircle, Wrench, Zap, Droplet, ShieldCheck, FileText, Copy, ClipboardCheck, Upload } from 'lucide-react';
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
import { CongratulationNotification } from '@/components/kami/CongratulationNotification';
import { ChatPage } from '@/components/kami/ChatPage';
import { AdminChatPage } from '@/components/kami/AdminChatPage';

export default function KamiExtensionPage() {
  const [mounted, setMounted] = useState(false);

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

  useEffect(() => {
    setMounted(true);
    loadLots();
    if (currentUser?.id) {
      loadMyReservations();
      checkCongratulationNotifications();
    }
  }, [currentUser]);

  const loadLots = async () => {
    try {
      const response = await fetch('/api/lots');
      if (response.ok) {
        const data = await response.json();
        setLots(data);
      }
    } catch (error) {
      console.error('Error loading lots:', error);
      // Use demo data if API fails
      setLots([
        { id: '1', name: 'A-01', surface: '300m²', priceRes: 100000, priceNon: 150000, status: 'AVAILABLE' },
        { id: '2', name: 'A-02', surface: '350m²', priceRes: 100000, priceNon: 150000, status: 'AVAILABLE' },
        { id: '3', name: 'B-01', surface: '400m²', priceRes: 150000, priceNon: 200000, status: 'AVAILABLE' },
      ]);
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

  const handleLogin = async (name: string, phone: string, password?: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          password: password || undefined,
        }),
      });

      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user);
        toast.success(`Bienvenue ${user.name} !`);
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
    setPaymentAmount('');
    setAgreeRules(false);
    setIsReservationModalOpen(true);
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

  const handleRegistrationComplete = async (userData: { name: string; phone: string; isResident: boolean; password: string }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          phone: userData.phone,
          isResident: userData.isResident,
          password: userData.password,
        }),
      });

      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user);
        toast.success(`Bienvenue ${user.name} ! Votre compte est créé.`);
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

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
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
      )}

      {/* Écran d'inscription en 2 étapes */}
      {!currentUser && currentScreen === 'register' && (
        <TwoStepRegistration
          onComplete={handleRegistrationComplete}
          onBack={() => setCurrentScreen('home')}
          setIsMenuOpen={setIsMenuOpen}
        />
      )}

      {/* Écran de choix d'authentification */}
      {!currentUser && currentScreen === 'auth-choice' && (
        <AuthChoiceScreen
          onLoginClick={() => setCurrentScreen('login-screen')}
          onRegisterClick={() => setCurrentScreen('register')}
          onBack={() => setCurrentScreen('home')}
          setIsMenuOpen={setIsMenuOpen}
        />
      )}

      {/* Écran de connexion */}
      {!currentUser && currentScreen === 'login-screen' && (
        <LoginScreen
          onLogin={(name, phone) => handleLogin(name, phone)}
          onBack={() => setCurrentScreen('auth-choice')}
          setIsMenuOpen={setIsMenuOpen}
        />
      )}

      {/* Écran de connexion (ancien, pour compatibilité) */}
      {!currentUser && currentScreen === 'login' && (
        <AuthChoiceScreen
          onLoginClick={() => setCurrentScreen('login-screen')}
          onRegisterClick={() => setCurrentScreen('register')}
          onBack={() => setCurrentScreen('home')}
          setIsMenuOpen={setIsMenuOpen}
        />
      )}

      {currentScreen === 'map' && (
        <EnhancedMapScreen
          lots={lots}
          handleOpenReservation={handleOpenReservation}
          setCurrentScreen={setCurrentScreen}
          setIsMenuOpen={setIsMenuOpen}
        />
      )}

      {currentScreen === 'dashboard' && (
        <UserDashboard
          currentUser={currentUser}
          setCurrentScreen={setCurrentScreen}
          setIsMenuOpen={setIsMenuOpen}
        />
      )}

      {currentScreen === 'profile' && (
        <ProfileScreen
          currentUser={currentUser}
          copyReferralLink={copyReferralLink}
          setCurrentScreen={setCurrentScreen}
          setIsMenuOpen={setIsMenuOpen}
        />
      )}

      {currentScreen === 'affiliation' && (
        <AffiliationScreen
          currentUser={currentUser}
          copyReferralLink={copyReferralLink}
          setCurrentScreen={setCurrentScreen}
          setIsMenuOpen={setIsMenuOpen}
        />
      )}

      {currentScreen === 'rules' && (
        <RulesScreen
          setCurrentScreen={setCurrentScreen}
          setIsMenuOpen={setIsMenuOpen}
        />
      )}

      {currentScreen === 'admin' && (
        <AdminScreen
          adminView={adminView}
          setAdminView={setAdminView}
          lots={lots}
          loadLots={loadLots}
          setCurrentScreen={setCurrentScreen}
        />
      )}

      {currentScreen === 'admin-flash-infos' && (
        <FlashInfoAdmin onBack={() => setCurrentScreen('home')} />
      )}

      {currentScreen === 'settings' && (
        <SettingsPage onBack={() => setCurrentScreen('home')} />
      )}

      {currentScreen === 'chat' && (
        <ChatPage
          setCurrentScreen={setCurrentScreen}
          setIsMenuOpen={setIsMenuOpen}
        />
      )}

      {currentScreen === 'admin-chat' && (
        <AdminChatPage
          setCurrentScreen={setCurrentScreen}
          setIsMenuOpen={setIsMenuOpen}
        />
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


      {/* Footer */}
      <footer className="mt-auto bg-card border-t border-border py-4 px-6 text-center text-sm text-muted-foreground">
        <p>© 2024 KAMI-EXTENSION - Tous droits réservés</p>
      </footer>

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
        <div className="w-24 h-24 rounded-full bg-[#8B5E3C] flex items-center justify-center mb-4 shadow-lg">
          <Building2 className="text-white h-10 w-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#8B5E3C]">KAMI-EXTENSION</h1>
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
        <h1 className="text-xl font-extrabold text-[#8B5E3C]">KAMI-EXTENSION</h1>
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
              <p className="text-xs text-muted-foreground">Discipline et propreté</p>
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
              <Card key={reservation.id} className="bg-card rounded-2xl shadow-sm border border-border mb-4">
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
function ProfileScreen({ currentUser, copyReferralLink, setCurrentScreen, setIsMenuOpen }: any) {
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

      <h2 className="text-2xl font-bold text-center text-[#8B5E3C] mb-6">Mon Profil</h2>

      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
          <User className="h-10 w-10 text-[#10B981]" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">{currentUser?.name || 'Non connecté'}</h2>
        <p className="text-muted-foreground">{currentUser?.phone || ''}</p>
      </div>

      <div className="space-y-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Nom complet</p>
              <p className="font-bold text-foreground">{currentUser?.name || '-'}</p>
            </div>
            <User className="h-5 w-5 text-[#8B5E3C]" />
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Téléphone</p>
              <p className="font-bold text-foreground">{currentUser?.phone || '-'}</p>
            </div>
            <User className="h-5 w-5 text-[#8B5E3C]" />
          </CardContent>
        </Card>

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

        {currentUser?.referralCode && (
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-2">Code de parrainage</p>
              <div className="flex items-center bg-card border rounded-lg p-2">
                <input
                  type="text"
                  value={`kami.app/ref/${currentUser.referralCode}`}
                  readOnly
                  className="flex-1 text-sm outline-none text-foreground font-semibold bg-transparent"
                />
                <Button
                  onClick={copyReferralLink}
                  size="sm"
                  className="bg-[#8B5E3C] hover:bg-[#6B472C] text-white"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Affiliation Screen Component
function AffiliationScreen({ currentUser, copyReferralLink, setCurrentScreen, setIsMenuOpen }: any) {
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

      <h2 className="text-2xl font-bold text-center text-[#8B5E3C] mb-6">Parrainage</h2>

      <Card className="bg-emerald-50 p-6 rounded-2xl text-center border border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800 mb-6">
        <p className="text-foreground text-sm">Vos gains totaux</p>
        <h3 className="text-4xl font-extrabold text-[#10B981] dark:text-emerald-400 mt-2">
          0 <span className="text-lg">FCFA</span>
        </h3>
      </Card>

      <Card className="bg-card p-4 rounded-xl mb-6">
        <p className="text-sm text-muted-foreground mb-2">Partagez votre lien :</p>
        <div className="flex items-center bg-card border rounded-lg p-2">
          <input
            type="text"
            value={currentUser?.referralCode ? `kami.app/ref/${currentUser.referralCode}` : 'Non connecté'}
            readOnly
            className="flex-1 text-sm outline-none text-foreground font-semibold bg-transparent"
          />
          <Button
            onClick={copyReferralLink}
            size="sm"
            className="bg-[#8B5E3C] hover:bg-[#6B472C] text-white"
            disabled={!currentUser?.referralCode}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <p className="text-xs text-muted-foreground text-center">
        Gagnez des commissions quand vos filleuls achètent un lot.
      </p>
    </div>
  );
}

// Rules Screen Component
function RulesScreen({ setCurrentScreen, setIsMenuOpen }: any) {
  return (
    <div className="flex-1 flex flex-col bg-card p-6 pt-16">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4"
        onClick={() => setCurrentScreen('home')}
      >
        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
      </Button>

      <h2 className="text-2xl font-bold text-center text-[#8B5E3C] mb-6">Règlement Intérieur</h2>

      <div className="space-y-4 text-foreground text-sm leading-relaxed">
        <div className="flex items-start">
          <Wrench className="text-[#10B981] mt-1 mr-3 h-5 w-5" />
          <p>
            <strong>Propreté :</strong> Maintenir le lot et les abords propres.
          </p>
        </div>
        <div className="flex items-start">
          <Map className="text-[#10B981] mt-1 mr-3 h-5 w-5" />
          <p>
            <strong>Urbanisme :</strong> Respecter les normes architecturales.
          </p>
        </div>
        <div className="flex items-start">
          <Users className="text-[#10B981] mt-1 mr-3 h-5 w-5" />
          <p>
            <strong>Voisinage :</strong> Respect mutuel et tranquillité.
          </p>
        </div>
        <div className="flex items-start">
          <ShieldCheck className="text-[#10B981] mt-1 mr-3 h-5 w-5" />
          <p>
            <strong>Discipline :</strong> Les manquements sont sanctionnés.
          </p>
        </div>
      </div>
    </div>
  );
}

// Admin Screen Component
function AdminScreen({ adminView, setAdminView, lots, loadLots, setCurrentScreen }: any) {
  // Stats state
  const [stats, setStats] = useState({ available: 0, reserved: 0, pending: 0, revenue: 0, userCount: 0, reservationCount: 0, totalLots: 0, paid: 0 });
  const [statsLoading, setStatsLoading] = useState(false);

  // Payments state
  const [payments, setPayments] = useState<any[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);

  // Users state
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

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

  // Load users from API
  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setUsersLoading(false);
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

  // Handle delete user
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

    try {
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Utilisateur supprimé !');
        loadUsers();
        loadStats();
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
    } else if (adminView === 'users') {
      loadUsers();
    }
  }, [adminView]);

  return (
    <div className="flex-1 flex flex-col bg-card p-6 pt-16">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4"
        onClick={() => setCurrentScreen('home')}
      >
        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
      </Button>

      <h2 className="text-2xl font-bold text-center text-red-600 mb-6 flex items-center justify-center">
        <Shield className="mr-2 h-6 w-6" />
        Admin
      </h2>

      {!adminView && (
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-card p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition" onClick={() => setAdminView('dashboard')}>
            <CardContent className="p-0 text-center">
              <ChartLine className="text-[#10B981] h-8 w-8 mx-auto mb-2" />
              <p className="text-sm font-bold">Tableau de Bord</p>
            </CardContent>
          </Card>
          <Card className="bg-card p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition" onClick={() => setAdminView('payments')}>
            <CardContent className="p-0 text-center">
              <CheckCircle className="text-blue-500 dark:text-blue-400 h-8 w-8 mx-auto mb-2" />
              <p className="text-sm font-bold">Valider Paiements</p>
            </CardContent>
          </Card>
          <Card className="bg-card p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition" onClick={() => setAdminView('users')}>
            <CardContent className="p-0 text-center">
              <UserPlus className="text-purple-500 dark:text-purple-400 h-8 w-8 mx-auto mb-2" />
              <p className="text-sm font-bold">Gérer Utilisateurs</p>
            </CardContent>
          </Card>
          <Card className="bg-card p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition" onClick={() => setAdminView('add-lots')}>
            <CardContent className="p-0 text-center">
              <PlusCircle className="text-[#8B5E3C] dark:text-[#A5785C] h-8 w-8 mx-auto mb-2" />
              <p className="text-sm font-bold">Ajouter Lots</p>
            </CardContent>
          </Card>
          <Card className="bg-card p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition" onClick={() => setAdminView('logo')}>
            <CardContent className="p-0 text-center">
              <FileText className="text-orange-500 dark:text-orange-400 h-8 w-8 mx-auto mb-2" />
              <p className="text-sm font-bold">Éditer le Logo</p>
            </CardContent>
          </Card>
          <Card className="bg-card p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition" onClick={() => setAdminView('flash-infos')}>
            <CardContent className="p-0 text-center">
              <FileText className="text-brand-blue h-8 w-8 mx-auto mb-2" />
              <p className="text-sm font-bold">Flash Infos</p>
            </CardContent>
          </Card>
          <Card className="bg-card p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition col-span-2" onClick={() => setAdminView('files')}>
            <CardContent className="p-0 text-center py-4">
              <Upload className="text-brand-blue h-8 w-8 mx-auto mb-2" />
              <p className="text-sm font-bold">Gérer Fichiers (Plan du village)</p>
            </CardContent>
          </Card>
        </div>
      )}

      {adminView === 'dashboard' && (
        <div className="mt-6">
          <Button variant="ghost" onClick={() => setAdminView(null)} className="mb-4 text-muted-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <AdminDashboard onBack={() => setAdminView(null)} />
        </div>
      )}

      {adminView === 'stats' && (
        <div className="mt-6">
          <Button variant="ghost" onClick={() => setAdminView(null)} className="mb-4 text-muted-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
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
        <div className="mt-6">
          <Button variant="ghost" onClick={() => setAdminView(null)} className="mb-4 text-muted-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
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
        <div className="mt-6">
          <Button variant="ghost" onClick={() => setAdminView(null)} className="mb-4 text-muted-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
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
                  <Card key={payment.id} className="bg-card rounded-xl shadow-sm border border-border">
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

      {adminView === 'users' && (
        <div className="mt-6">
          <Button variant="ghost" onClick={() => setAdminView(null)} className="mb-4 text-muted-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          {usersLoading ? (
            <Card className="bg-card p-6">
              <CardContent className="text-center text-muted-foreground">
                <User className="h-8 w-8 mx-auto mb-2 animate-pulse" />
                <p>Chargement...</p>
              </CardContent>
            </Card>
          ) : users.length === 0 ? (
            <Card className="bg-card p-6">
              <CardContent className="text-center text-muted-foreground">
                <User className="h-8 w-8 mx-auto mb-2" />
                <p>Aucun utilisateur enregistré.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {users.map((user: any) => (
                <Card key={user.id} className="bg-card rounded-xl shadow-sm border border-border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground">{user.name}</h3>
                        <p className="text-xs text-muted-foreground mb-1">{user.phone}</p>
                        <div className="flex items-center gap-2">
                          <Badge className={user.isResident ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'}>
                            {user.isResident ? 'Résident' : 'Non-Résident'}
                          </Badge>
                          {user.createdAt && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {adminView === 'logo' && (
        <div className="mt-6">
          <Button variant="ghost" onClick={() => setAdminView(null)} className="mb-4 text-muted-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <AdminLogo />
        </div>
      )}

      {adminView === 'flash-infos' && (
        <FlashInfoAdmin onBack={() => setAdminView(null)} />
      )}

      {adminView === 'files' && (
        <AdminFiles onBack={() => setAdminView(null)} />
      )}
    </div>
  );
}
