'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';

// Importations dynamiques pour éviter les crashs au démarrage
import dynamic from 'next/dynamic';

const PersuasiveLandingPage = dynamic(() => import('@/components/kami/PersuasiveLandingPage').then(m => m.PersuasiveLandingPage), { ssr: false });
const ModernSideMenu = dynamic(() => import('@/components/kami/ModernSideMenu').then(m => m.ModernSideMenu), { ssr: false });

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
    // Charger les données de base
    fetch('/api/lots').then(r => r.json()).then(data => setLots(data)).catch(() => {});
  }, []);

  if (!mounted) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2563EB', color: 'white' }}>
        <p>Chargement de KAMI...</p>
      </div>
    );
  }

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
        <PersuasiveLandingPage
          lots={lots}
          onReserveClick={() => setCurrentScreen(currentUser ? 'map' : 'auth-choice')}
          setIsMenuOpen={setIsMenuOpen}
          setCurrentScreen={setCurrentScreen}
        />
      </main>
    </div>
  );
}
