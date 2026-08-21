'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import dynamic from 'next/dynamic';

const PersuasiveLandingPage = dynamic(() => import('@/components/kami/PersuasiveLandingPage').then(m => m.PersuasiveLandingPage), { ssr: false });
const ModernSideMenu = dynamic(() => import('@/components/kami/ModernSideMenu').then(m => m.ModernSideMenu), { ssr: false });

export default function KamiExtensionPage() {
  const [mounted, setMounted] = useState(false);
  const {
    currentUser,
    currentScreen,
    setCurrentScreen,
    lots,
    setLots,
    isMenuOpen,
    setIsMenuOpen,
    logout
  } = useAppStore();

  useEffect(() => {
    setMounted(true);
    fetch('/api/lots').then(r => r.json()).then(data => setLots(data)).catch(() => {});
  }, []);

  if (!mounted) {
    return <div style={{ height: '100vh', backgroundColor: '#2563EB' }} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ModernSideMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        currentUser={currentUser}
        onNavigate={setCurrentScreen}
        onLogout={() => { logout(); }}
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
