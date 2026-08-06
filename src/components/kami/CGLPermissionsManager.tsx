'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  ChartLine, CheckCircle, PlusCircle, FileText, Image as ImageIcon,
  Shield, Zap, UserPlus, Activity, Upload, Construction, TrendingUp,
  Headset, Crown, Loader2, Save, ArrowLeft, Home, ToggleLeft, ToggleRight,
} from 'lucide-react';
import { toast } from 'sonner';

const ALL_FEATURES = [
  { id: 'dashboard', label: 'Tableau de Bord', icon: ChartLine, color: 'text-[#10B981]' },
  { id: 'payments', label: 'Valider Paiements', icon: CheckCircle, color: 'text-blue-500 dark:text-blue-400' },
  { id: 'add-lots', label: 'Ajouter Lots', icon: PlusCircle, color: 'text-[#8B5E3C] dark:text-[#A5785C]' },
  { id: 'logo', label: 'Éditer le Logo', icon: FileText, color: 'text-orange-500 dark:text-orange-400' },
  { id: 'hero-image', label: 'Image de Fond', icon: ImageIcon, color: 'text-pink-500 dark:text-pink-400' },
  { id: 'committee', label: 'Gestion du Comité', icon: Shield, color: 'text-purple-600 dark:text-purple-400' },
  { id: 'flash-infos', label: 'Flash Infos', icon: Zap, color: 'text-brand-blue' },
  { id: 'expert-applications', label: 'Candidatures Experts', icon: UserPlus, color: 'text-emerald-500 dark:text-emerald-400' },
  { id: 'users-monitor', label: 'Surveillance Connexions', icon: Activity, color: 'text-cyan-500 dark:text-cyan-400' },
  { id: 'files', label: 'Gérer Fichiers', icon: Upload, color: 'text-brand-blue' },
  { id: 'progress-updates', label: 'Avancement Travaux', icon: Construction, color: 'text-orange-500 dark:text-orange-400' },
  { id: 'subscriber-tracking', label: 'Suivi Souscripteurs', icon: TrendingUp, color: 'text-cyan-500 dark:text-cyan-400' },
  { id: 'sav-settings', label: 'Paramètres SAV', icon: Headset, color: 'text-emerald-500' },
];

interface CGLPermissionsManagerProps {
  setAdminView?: (view: string | null) => void;
}

export function CGLPermissionsManager({ setAdminView }: CGLPermissionsManagerProps) {
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      const res = await fetch('/api/admin/cgl-permissions');
      if (res.ok) {
        const data = await res.json();
        setPermissions(data.permissions || {});
      }
    } catch (error) {
      console.error('Error loading CGL permissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePermission = (featureId: string) => {
    setPermissions((prev) => ({
      ...prev,
      [featureId]: !prev[featureId],
    }));
  };

  const savePermissions = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/cgl-permissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success('Permissions du comité mises à jour avec succès');
      } else {
        toast.error(data?.error || 'Erreur lors de la mise à jour');
      }
    } catch {
      toast.error('Erreur serveur');
    } finally {
      setIsSaving(false);
    }
  };

  const enableAll = () => {
    const all: Record<string, boolean> = {};
    ALL_FEATURES.forEach((f) => { all[f.id] = true; });
    setPermissions(all);
  };

  const disableAll = () => {
    setPermissions({});
  };

  const enabledCount = Object.values(permissions).filter(Boolean).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-3">
          <Crown className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-lg font-bold text-foreground">
          Permissions Espace CGL
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Choisissez les fonctionnalités accessibles aux membres du comité
        </p>
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-between bg-muted/50 rounded-lg px-4 py-2.5">
        <span className="text-sm text-muted-foreground">
          <span className="font-bold text-foreground">{enabledCount}</span> / {ALL_FEATURES.length} fonctionnalités activées
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs h-7" onClick={enableAll}>
            <ToggleRight className="h-3.5 w-3.5 mr-1" />
            Tout activer
          </Button>
          <Button variant="outline" size="sm" className="text-xs h-7" onClick={disableAll}>
            <ToggleLeft className="h-3.5 w-3.5 mr-1" />
            Tout désactiver
          </Button>
        </div>
      </div>

      {/* Feature toggles */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {ALL_FEATURES.map((feature) => {
              const Icon = feature.icon;
              const isEnabled = permissions[feature.id] === true;

              return (
                <div
                  key={feature.id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`h-5 w-5 ${feature.color}`} />
                    </div>
                    <span className="text-sm font-medium text-foreground">{feature.label}</span>
                  </div>
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={() => togglePermission(feature.id)}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Save button */}
      <Button
        onClick={savePermissions}
        disabled={isSaving}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3"
      >
        {isSaving ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Save className="h-4 w-4 mr-2" />
        )}
        {isSaving ? 'Enregistrement...' : 'Enregistrer les permissions'}
      </Button>
    </div>
  );
}
