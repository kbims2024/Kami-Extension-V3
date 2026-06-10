'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Map, Loader2 } from 'lucide-react';

interface PlanPageProps {
  setCurrentScreen: (screen: string) => void;
  setIsMenuOpen: (open: boolean) => void;
}

export function PlanPage({ setCurrentScreen, setIsMenuOpen }: PlanPageProps) {
  const [opened, setOpened] = useState(false);

  // Ouvrir le PDF dans le navigateur dès l'arrivée sur la page
  useEffect(() => {
    if (!opened) {
      setOpened(true);
      // Ouvrir le PDF directement dans le navigateur
      window.open('/view-plan', '_blank');
    }
  }, [opened]);

  const handleBack = () => {
    setIsMenuOpen(true);
    setCurrentScreen('home');
  };

  const handleOpenAgain = () => {
    window.open('/view-plan', '_blank');
  };

  return (
    <div className="flex-1 flex flex-col bg-background min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/90 dark:bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="hover:bg-blue-50 dark:hover:bg-blue-950"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Map className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h1 className="text-lg font-bold text-foreground">Plan du Village</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="text-center max-w-lg">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Map className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Plan ouvert dans le navigateur
            </h2>
            <p className="text-muted-foreground mb-6">
              Le PDF du plan du village a été ouvert dans le navigateur. Utilisez les contrôles natifs pour zoomer et naviguer.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handleOpenAgain}
                className="flex items-center gap-2"
              >
                <Map className="h-4 w-4" />
                Ouvrir le PDF
              </Button>
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour à l'accueil
              </Button>
            </div>
          </div>

          {/* Message informatif */}
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Conseil :</strong> Utilisez les contrôles de votre navigateur dans l'onglet du PDF
              pour zoomer, dézoomer et naviguer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}