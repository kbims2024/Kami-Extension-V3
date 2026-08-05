'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageNav } from './PageNav';
import {
  ChartLine, CheckCircle, PlusCircle, FileText, Image as ImageIcon,
  Shield, Zap, UserPlus, Activity, Upload, Construction, TrendingUp,
  Headset, Crown, Home, Loader2, MessageSquare,
} from 'lucide-react';

interface FeatureDef {
  id: string;
  label: string;
  icon: any;
  color: string;
  adminView: string;
}

const ALL_FEATURES: FeatureDef[] = [
  { id: 'dashboard', label: 'Tableau de Bord', icon: ChartLine, color: 'text-[#10B981]', adminView: 'dashboard' },
  { id: 'payments', label: 'Valider Paiements', icon: CheckCircle, color: 'text-blue-500 dark:text-blue-400', adminView: 'payments' },
  { id: 'add-lots', label: 'Ajouter Lots', icon: PlusCircle, color: 'text-[#8B5E3C] dark:text-[#A5785C]', adminView: 'add-lots' },
  { id: 'logo', label: 'Éditer le Logo', icon: FileText, color: 'text-orange-500 dark:text-orange-400', adminView: 'logo' },
  { id: 'hero-image', label: 'Image de Fond', icon: ImageIcon, color: 'text-pink-500 dark:text-pink-400', adminView: 'hero-image' },
  { id: 'committee', label: 'Gestion du Comité', icon: Shield, color: 'text-purple-600 dark:text-purple-400', adminView: 'committee' },
  { id: 'flash-infos', label: 'Flash Infos', icon: Zap, color: 'text-brand-blue', adminView: 'flash-infos' },
  { id: 'expert-applications', label: 'Candidatures Experts', icon: UserPlus, color: 'text-emerald-500 dark:text-emerald-400', adminView: 'expert-applications' },
  { id: 'users-monitor', label: 'Surveillance Connexions', icon: Activity, color: 'text-cyan-500 dark:text-cyan-400', adminView: 'users-monitor' },
  { id: 'files', label: 'Gérer Fichiers', icon: Upload, color: 'text-brand-blue', adminView: 'files' },
  { id: 'progress-updates', label: 'Avancement Travaux', icon: Construction, color: 'text-orange-500 dark:text-orange-400', adminView: 'progress-updates' },
  { id: 'subscriber-tracking', label: 'Suivi Souscripteurs', icon: TrendingUp, color: 'text-cyan-500 dark:text-cyan-400', adminView: 'subscriber-tracking' },
  { id: 'sav-settings', label: 'Paramètres SAV', icon: Headset, color: 'text-emerald-500', adminView: 'sav-settings' },
];

interface EspaceCGLProps {
  setCurrentScreen: (screen: string) => void;
  setAdminView?: (view: string) => void;
  goToAdminScreen?: (view: string) => void;
  onBack?: () => void;
}

export function EspaceCGL({ setCurrentScreen, goToAdminScreen, onBack }: EspaceCGLProps) {
  const [enabledFeatures, setEnabledFeatures] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      const res = await fetch('/api/cgl-permissions');
      if (res.ok) {
        const data = await res.json();
        setEnabledFeatures(data.enabledFeatures || []);
      }
    } catch (error) {
      console.error('Error loading CGL permissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeatureClick = (feature: FeatureDef) => {
    if (goToAdminScreen) {
      goToAdminScreen(feature.adminView);
    }
  };

  const availableFeatures = ALL_FEATURES.filter((f) =>
    enabledFeatures.includes(f.id)
  );

  const isAccessAllowed = enabledFeatures.includes('committee');

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col bg-card">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!isAccessAllowed) {
    return (
      <div className="flex-1 flex flex-col bg-card">
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <Shield className="h-12 w-12 text-purple-600 dark:text-purple-400 mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Accès refusé</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Votre compte n'a pas la permission d'accéder à cet espace. Seul l'administrateur peut activer cette fonctionnalité.
          </p>
          <Button
            variant="outline"
            onClick={onBack || (() => setCurrentScreen('home'))}
            className="px-5"
          >
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-card">
      <PageNav
        onBack={onBack || (() => setCurrentScreen('home'))}
        onHome={() => setCurrentScreen('home')}
        title="Espace CGL"
      />

      <div className="flex-1 px-4 pb-6">
        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-3">
            <Crown className="h-7 w-7 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Espace CGL</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Comité de Gestion des Lots
          </p>
        </div>

        {/* ─── Permanent Discussion Button (always visible) ─── */}
        <div className="mb-5">
          <Card
            className="bg-gradient-to-br from-blue-600 to-indigo-700 p-3 rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-all active:scale-[0.97] h-[100px] border-0"
            onClick={() => setCurrentScreen('committee-chat')}
          >
            <CardContent className="p-0 text-center flex flex-col items-center justify-center h-full">
              <MessageSquare className="h-7 w-7 mb-2 text-white" />
              <p className="text-xs font-bold leading-tight text-white">Gestion de Discussion</p>
            </CardContent>
          </Card>
        </div>

        {/* ─── Admin-controlled features ─── */}
        {availableFeatures.length === 0 ? (
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="p-8 text-center">
              <Crown className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                Aucune autre fonctionnalité accessible
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                L&apos;administrateur n&apos;a pas encore activé de fonctionnalités supplémentaires.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {availableFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.id}
                  className="bg-card p-3 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-all active:scale-[0.97] h-[100px]"
                  onClick={() => handleFeatureClick(feature)}
                >
                  <CardContent className="p-0 text-center flex flex-col items-center justify-center h-full">
                    <Icon className={`${feature.color} h-7 w-7 mb-2`} />
                    <p className="text-xs font-bold leading-tight">{feature.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Info footer */}
        <p className="text-[11px] text-center text-muted-foreground mt-6">
          Les fonctionnalités accessibles sont définies par l&apos;administrateur.
        </p>
      </div>
    </div>
  );
}
