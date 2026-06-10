'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Map } from 'lucide-react';

export default function ViewPlanPage() {
  const handleBack = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Bouton de retour */}
      <div className="fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="bg-white/90 dark:bg-gray-900/90 shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
          title="Retour à l'accueil"
        >
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>

      {/* Titre en haut à droite */}
      <div className="fixed top-4 right-4 z-50 bg-white/90 dark:bg-gray-900/90 shadow-lg px-4 py-2 rounded-lg">
        <div className="flex items-center gap-2">
          <Map className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-foreground">Plan du Village</span>
        </div>
      </div>

      {/* Contenu principal - PDF en plein écran via iframe */}
      <div className="h-screen bg-gray-100 dark:bg-gray-900">
        <iframe
          src="/api/plan-view"
          className="w-full h-full border-0"
          title="Plan du village"
        />
      </div>
    </div>
  );
}