'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';

// Importations dynamiques pour alléger le chargement initial et éviter les plantages
import dynamic from 'next/dynamic';

const PersuasiveLandingPage = dynamic(() => import('@/components/kami/PersuasiveLandingPage').then(m => m.PersuasiveLandingPage), { ssr: false });
const ModernSideMenu = dynamic(() => import('@/components/kami/ModernSideMenu').then(m => m.ModernSideMenu), { ssr: false });
const EnhancedMapScreen = dynamic(() => import('@/components/kami/EnhancedMapScreen').then(m => m.EnhancedMapScreen), { ssr: false });
const UserDashboard = dynamic(() => import('@/components/kami/UserDashboard').then(m => m.UserDashboard), { ssr: false });
const ChatPage = dynamic(() => import('@/components/kami/ChatPage').then(m => m.ChatPage), { ssr: false });
const EspaceCGL = dynamic(() => import('@/components/kami/EspaceCGL').then(m => m.EspaceCGL), { ssr: false });
const CommitteeChatView = dynamic(() => import('@/components/kami/CommitteeChatView').then(m => m.CommitteeChatView), { ssr: false });
const ServiceApresVenteScreen = dynamic(() => import('@/components/kami/ServiceApresVenteScreen').then(m => m.ServiceApresVenteScreen), { ssr: false });
const RegulationRulesScreen = dynamic(() => import('@/components/kami/RegulationRulesScreen').then(m => m.RegulationRulesScreen), { ssr: false });
const PublicProgressSection = dynamic(() => import('@/components/kami/PublicProgressSection').then(m => m.PublicProgressSection), { ssr: false });
const AuthChoiceScreen = dynamic(() => import('@/components/kami/AuthChoiceScreen').then(m => m.AuthChoiceScreen), { ssr: false });
const LoginScreen = dynamic(() => import('@/components/kami/LoginScreen').then(m => m.LoginScreen), { ssr: false });
const TwoStepRegistration = dynamic(() => import('@/components/kami/TwoStepRegistration').then(m => m.TwoStepRegistration), { ssr: false });
const PaymentMethodScreen = dynamic(() => import('@/components/kami/PaymentMethodScreen').then(m => m.PaymentMethodScreen), { ssr: false });

export default function KamiExtensionPage() {
  const [mounted, setMounted] = useState(false);
  const {
    currentUser,
    logout,
    currentScreen,
    setCurrentScreen,
    lots,
    setLots,
    isMenuOpen,
    setIsMenuOpen,
    selectedLot,
    setSelectedLot
  } = useAppStore();

  useEffect(() => {
    console.log('Page mounted');
    setMounted(true);
    loadLots();
  }, []);

  const loadLots = async () => {
    try {
      const response = await fetch('/api/lots');
      if (response.ok) {
        const data = await response.json();
        setLots(data);
      }
    } catch (error) {
      console.error('Error loading lots:', error);
    }
  };

  // Affichage de secours pendant le chargement initial
  if (!mounted) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2563EB',
        color: 'white',
        fontFamily: 'sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ margin: 0 }}>KAMI-EXTENSION</h1>
          <p>Initialisation de l&apos;application...</p>
        </div>
      </div>
    );
  }

  // Rendu conditionnel des écrans
  const renderScreen = () => {
    try {
      switch (currentScreen) {
        case 'home':
          return (
            <PersuasiveLandingPage
              lots={lots}
              onReserveClick={() => setCurrentScreen(currentUser ? 'map' : 'auth-choice')}
              setIsMenuOpen={setIsMenuOpen}
              setCurrentScreen={setCurrentScreen}
            />
          );
        case 'map':
          return (
            <EnhancedMapScreen
              lots={lots}
              handleOpenReservation={(lot) => { setSelectedLot(lot); setCurrentScreen('payment-method'); }}
              setCurrentScreen={setCurrentScreen}
              setIsMenuOpen={setIsMenuOpen}
            />
          );
        case 'dashboard':
          return <UserDashboard currentUser={currentUser} setCurrentScreen={setCurrentScreen} setIsMenuOpen={setIsMenuOpen} />;
        case 'chat':
          return <ChatPage setCurrentScreen={setCurrentScreen} setIsMenuOpen={setIsMenuOpen} />;
        case 'espace-cgl':
          return <EspaceCGL setCurrentScreen={setCurrentScreen} onBack={() => setCurrentScreen('home')} />;
        case 'committee-chat':
          return <CommitteeChatView setCurrentScreen={setCurrentScreen} onBack={() => setCurrentScreen('espace-cgl')} />;
        case 'sav':
          return <ServiceApresVenteScreen onBack={() => setCurrentScreen('home')} setIsMenuOpen={setIsMenuOpen} />;
        case 'rules':
          return <RegulationRulesScreen setCurrentScreen={setCurrentScreen} onHome={() => setCurrentScreen('home')} />;
        case 'progress':
          return <PublicProgressSection onBack={() => setCurrentScreen('home')} onHome={() => setCurrentScreen('home')} />;
        case 'auth-choice':
          return <AuthChoiceScreen onLoginClick={() => setCurrentScreen('login-screen')} onRegisterClick={() => setCurrentScreen('register')} onBack={() => setCurrentScreen('home')} setIsMenuOpen={setIsMenuOpen} />;
        case 'login-screen':
          return <LoginScreen onLogin={() => setCurrentScreen('home')} onBack={() => setCurrentScreen('auth-choice')} setIsMenuOpen={setIsMenuOpen} />;
        case 'payment-method':
          return selectedLot && currentUser ? <PaymentMethodScreen lot={selectedLot} user={currentUser} onBack={() => setCurrentScreen('map')} /> : <PersuasiveLandingPage lots={lots} onReserveClick={() => {}} setIsMenuOpen={setIsMenuOpen} setCurrentScreen={setCurrentScreen} />;
        default:
          return <PersuasiveLandingPage lots={lots} onReserveClick={() => {}} setIsMenuOpen={setIsMenuOpen} setCurrentScreen={setCurrentScreen} />;
      }
    } catch (err) {
      console.error('Screen render error:', err);
      return <div className="p-10 text-center">Une erreur est survenue lors de l&apos;affichage de cet écran.</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ModernSideMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        currentUser={currentUser}
        onNavigate={setCurrentScreen}
        onLogout={() => { logout(); toast.success('Déconnecté'); }}
      />
      <main className="flex-1 flex flex-col">
        {renderScreen()}
      </main>
    </div>
  );
}
