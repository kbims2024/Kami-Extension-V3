'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Map, Loader2 } from 'lucide-react';

export default function ViewPlanPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBack = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Bouton de retour avec animation */}
      <div
        className={`fixed top-4 left-4 z-50 transition-all duration-500 ease-out ${
          mounted
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4'
        }`}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="bg-white/90 dark:bg-gray-900/90 shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110 active:scale-95"
          title="Retour à l'accueil"
        >
          <ArrowLeft className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:-translate-x-0.5" />
        </Button>
      </div>

      {/* Titre avec animation */}
      <div
        className={`fixed top-4 right-4 z-50 bg-white/90 dark:bg-gray-900/90 shadow-lg px-4 py-2 rounded-lg transition-all duration-500 ease-out delay-100 ${
          mounted
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4'
        }`}
      >
        <div className="flex items-center gap-2">
          <Map className={`h-5 w-5 text-blue-600 dark:text-blue-400 transition-transform duration-500 ${mounted ? 'rotate-0' : '-rotate-180'}`} />
          <span className="text-sm font-medium text-foreground">Plan du Village</span>
        </div>
      </div>

      {/* Overlay de chargement */}
      <div
        className={`fixed inset-0 z-40 flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-opacity duration-500 ${
          mounted ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Chargement du plan...</p>
        </div>
      </div>

      {/* Contenu principal - PDF en plein écran via iframe avec animation */}
      <div
        className={`h-screen bg-gray-100 dark:bg-gray-900 transition-all duration-700 ease-out ${
          mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <iframe
          src="/api/plan-view"
          className="w-full h-full border-0"
          title="Plan du village"
          style={{ animation: 'fadeIn 1s ease-out' }}
        />
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}