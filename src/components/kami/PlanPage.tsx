'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Map, ExternalLink, Loader2 } from 'lucide-react';

interface PlanPageProps {
  setCurrentScreen: (screen: string) => void;
  setIsMenuOpen: (open: boolean) => void;
}

export function PlanPage({ setCurrentScreen, setIsMenuOpen }: PlanPageProps) {
  const [planFile, setPlanFile] = useState<{ path: string; mimeType: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);

  // Charger le fichier du plan au montage
  useEffect(() => {
    loadPlanFile();
  }, []);

  // Ouvrir le PDF dans un nouvel onglet une fois chargé
  useEffect(() => {
    if (planFile && !loading && !opened) {
      setOpened(true);
      const newWindow = window.open(planFile.path, '_blank');
      if (newWindow) {
        newWindow.focus();
      }
    }
  }, [planFile, loading, opened]);

  const loadPlanFile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin-files?type=PLAN');
      if (response.ok) {
        const data = await response.json();
        if (data.file) {
          setPlanFile({
            path: `/api/serve-file?type=PLAN`,
            mimeType: data.file.mimeType
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement du plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setIsMenuOpen(true);
    setCurrentScreen('home');
  };

  const handleOpenAgain = () => {
    if (planFile) {
      const newWindow = window.open(planFile.path, '_blank');
      if (newWindow) {
        newWindow.focus();
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/90 dark:bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
            {planFile && !loading && (
              <Button
                onClick={handleOpenAgain}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">Ouvrir le PDF</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        {loading ? (
          <div className="text-center">
            <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-2">
              Chargement du plan...
            </p>
            <p className="text-sm text-muted-foreground">
              Le PDF s'ouvrira dans un nouvel onglet
            </p>
          </div>
        ) : planFile ? (
          <div className="text-center max-w-lg">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Map className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Plan ouvert dans un nouvel onglet
              </h2>
              <p className="text-muted-foreground mb-6">
                Le PDF du plan du village a été ouvert dans un nouvel onglet de votre navigateur.
                Vous pouvez y utiliser les outils natifs de navigation et de zoom.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={handleOpenAgain}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Ouvrir à nouveau
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
                <strong>Conseil :</strong> Utilisez les contrôles de votre navigateur dans le nouvel onglet
                pour zoomer, dézoomer et naviguer dans le PDF.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center p-8">
            <Map className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-2">
              Le plan n'est pas disponible
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Veuillez contacter l'administration.
            </p>
            <Button onClick={handleBack} variant="outline">
              Retour à l'accueil
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}