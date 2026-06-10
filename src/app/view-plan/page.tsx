'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Map, Loader2 } from 'lucide-react';

export default function ViewPlanPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Simuler un petit délai pour que le bouton de retour soit visible
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

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

      {/* Contenu principal - PDF en plein écran */}
      <div className="flex-1 bg-gray-100 dark:bg-gray-900 pt-16">
        <object
          data="/api/plan-view#toolbar=1&navpanes=1&scrollbar=1"
          type="application/pdf"
          className="w-full h-full"
        >
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-center max-w-lg">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Map className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-4">
                Votre navigateur ne peut pas afficher ce PDF
              </h2>
              <p className="text-muted-foreground mb-6">
                Vous pouvez le télécharger en cliquant sur le bouton ci-dessous.
              </p>
              <a
                href="/api/plan-view"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                <Map className="h-4 w-4" />
                Ouvrir le PDF
              </a>
            </div>
          </div>
        </object>
      </div>
    </div>
  );
}