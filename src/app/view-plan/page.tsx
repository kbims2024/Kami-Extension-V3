'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Map, Download, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ViewPlanPage() {
  const router = useRouter();
  const [planUrl, setPlanUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Charger le fichier du plan
    const loadPlanFile = async () => {
      try {
        const response = await fetch('/api/admin-files?type=PLAN');
        if (response.ok) {
          const data = await response.json();
          if (data.file) {
            setPlanUrl(`/api/serve-file?type=PLAN`);
          } else {
            setError(true);
          }
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Erreur lors du chargement du plan:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadPlanFile();
  }, []);

  const handleBack = () => {
    router.push('/');
  };

  const handleDownload = () => {
    if (planUrl) {
      window.open(planUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Bouton de retour - même style que les autres pages */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 z-50"
        onClick={handleBack}
      >
        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
      </Button>

      {/* Contenu principal - PDF Viewer */}
      <div className="h-screen pt-16">
        {loading ? (
          <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">Chargement du plan...</p>
            </div>
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                Plan non disponible
              </h2>
              <p className="text-muted-foreground mb-6">
                Une erreur s'est produite lors du chargement du plan. Veuillez contacter l'administration.
              </p>
              <Button onClick={handleBack} variant="outline">
                Retour à l'accueil
              </Button>
            </div>
          </div>
        ) : planUrl ? (
          <div className="h-full w-full bg-gray-100 dark:bg-gray-900">
            <object
              data={`${planUrl}#toolbar=1&navpanes=1&scrollbar=1`}
              type="application/pdf"
              className="w-full h-full"
            >
              <div className="h-full flex items-center justify-center p-8">
                <div className="text-center max-w-lg">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Map className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    Navigateur non compatible
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Votre navigateur ne peut pas afficher le PDF directement. Cliquez sur le bouton ci-dessous pour le télécharger.
                  </p>
                  <Button onClick={handleDownload} className="mb-4">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger le PDF
                  </Button>
                  <div>
                    <Button onClick={handleBack} variant="outline">
                      Retour à l'accueil
                    </Button>
                  </div>
                </div>
              </div>
            </object>
          </div>
        ) : null}
      </div>
    </div>
  );
}