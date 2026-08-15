'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { PersuasiveLandingPage } from '@/components/kami/PersuasiveLandingPage';
import { ModernSideMenu } from '@/components/kami/ModernSideMenu';
import { toast } from 'sonner';

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
  } = useAppStore();

  useEffect(() => {
    setMounted(true);
    // Charger les lots au démarrage
    fetch('/api/lots').then(r => r.json()).then(data => setLots(data)).catch(() => {});
  }, []);

  if (!mounted) return <div className="min-h-screen bg-background" />;

  try {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <ModernSideMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          currentUser={currentUser}
          onNavigate={setCurrentScreen}
          onLogout={() => { logout(); toast.success('Déconnecté'); }}
        />

        <PersuasiveLandingPage
          lots={lots}
          onReserveClick={() => setCurrentScreen(currentUser ? 'map' : 'auth-choice')}
          setIsMenuOpen={setIsMenuOpen}
          setCurrentScreen={setCurrentScreen}
        />
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-xl font-bold mb-2">Chargement de KAMI...</h1>
          <p className="text-sm text-muted-foreground">Veuillez patienter quelques secondes ou rafraîchir.</p>
          <button onClick={() => window.location.reload()} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">Rafraîchir</button>
        </div>
      </div>
    );
  }
}
