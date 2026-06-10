'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Map, ZoomIn, ZoomOut, Minimize, Maximize } from 'lucide-react';

interface PlanPageProps {
  setCurrentScreen: (screen: string) => void;
  setIsMenuOpen: (open: boolean) => void;
}

export function PlanPage({ setCurrentScreen, setIsMenuOpen }: PlanPageProps) {
  const [planFile, setPlanFile] = useState<{ path: string; mimeType: string } | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [loading, setLoading] = useState(true);

  // Charger le fichier du plan au montage
  useEffect(() => {
    loadPlanFile();
  }, []);

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

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 300));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  const handleMaximize = () => {
    setZoomLevel(200);
  };

  const handleBack = () => {
    setIsMenuOpen(true);
    setCurrentScreen('home');
  };

  // Gestion du zoom avec la roulette de la souris
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Si Ctrl est pressé, c'est un zoom avec roulette
      if (e.ctrlKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          handleZoomIn();
        } else {
          handleZoomOut();
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

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
          </div>
        </div>
      </header>

      {/* Contrôles de zoom */}
      <div className="fixed top-20 right-4 z-40">
        <div className="bg-white/90 dark:bg-gray-900/90 px-4 py-3 rounded-2xl shadow-2xl flex flex-col items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            disabled={zoomLevel >= 300}
            title="Zoomer"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <div className="flex flex-col items-center min-w-[60px]">
            <span className="text-xl font-bold">
              {zoomLevel}%
            </span>
            <span className="text-[10px] text-gray-500">Zoom</span>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            disabled={zoomLevel <= 50}
            title="Dézoomer"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <div className="w-8 h-px bg-gray-300 dark:bg-gray-700" />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleResetZoom}
            title="Réinitialiser le zoom"
          >
            <Minimize className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleMaximize}
            title="Agrandir"
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Contenu du plan */}
      <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 overflow-auto">
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-muted-foreground">Chargement du plan...</p>
          </div>
        ) : planFile ? (
          <div
            className="transition-transform duration-200 ease-out"
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'center center',
              maxWidth: '100%',
              maxHeight: 'calc(100vh - 200px)',
            }}
          >
            {planFile.mimeType === 'application/pdf' ? (
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
                <object
                  data={`${planFile.path}#toolbar=0&navpanes=0&scrollbar=0`}
                  type="application/pdf"
                  className="block"
                  style={{
                    width: '800px',
                    height: '600px',
                    maxWidth: '80vw',
                    maxHeight: '70vh'
                  }}
                >
                  <div className="p-8 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Le PDF ne peut pas être affiché dans votre navigateur.
                    </p>
                    <Button
                      onClick={() => window.open(planFile.path, '_blank')}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Ouvrir le PDF dans un nouvel onglet
                    </Button>
                  </div>
                </object>
              </div>
            ) : (
              <img
                src={planFile.path}
                alt="Plan du village"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            )}
          </div>
        ) : (
          <div className="text-center p-8">
            <Map className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-2">
              Le plan n'est pas disponible
            </p>
            <p className="text-sm text-muted-foreground">
              Veuillez contacter l'administration.
            </p>
          </div>
        )}
      </div>

      {/* Raccourcis clavier pour desktop */}
      <div className="fixed bottom-4 left-4 z-40 hidden md:block">
        <div className="bg-white/90 dark:bg-gray-900/90 px-4 py-2 rounded-lg shadow-lg text-xs text-gray-600">
          <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Ctrl</kbd> + <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">↑</kbd> / <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">↓</kbd>
          <span className="ml-2">pour zoomer</span>
        </div>
      </div>
    </div>
  );
}