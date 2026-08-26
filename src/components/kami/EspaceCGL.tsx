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
import { CGL_ADMIN_FEATURES } from '@/lib/cgl-features';

interface FeatureDef {
  id: string;
  label: string;
  icon: any;
  color: string;
  adminView: string;
}

const ALL_FEATURES = CGL_ADMIN_FEATURES;

interface EspaceCGLProps {
  setCurrentScreen: (screen: string) => void;
  setAdminView?: (view: string) => void;
  goToAdminScreen?: (view: string) => void;
  onBack?: () => void;
}

export function EspaceCGL({ setCurrentScreen, goToAdminScreen, onBack }: EspaceCGLProps) {
  const [enabledFeatures, setEnabledFeatures] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [pendingPaymentsCount, setPendingPaymentsCount] = useState(0);
  const [expertApplicationsCount, setExpertApplicationsCount] = useState(0);
  const [progressUpdatesCount, setProgressUpdatesCount] = useState(0);

  useEffect(() => {
    loadPermissions();
    loadUnreadCount();
    loadNotifications();

    const handlePermissionsChanged = (event: Event) => {
      const detail = (event as CustomEvent).detail as Record<string, boolean> | undefined;
      if (detail) {
        setEnabledFeatures(Object.keys(detail).filter((key) => detail[key] === true));
      }
      loadPermissions();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('cgl-permissions-changed', handlePermissionsChanged);
    }

    // Rafraîchir les permissions toutes les 5 secondes pour détecter les changements
    const permInterval = setInterval(loadPermissions, 5000);
    
    const interval = setInterval(() => {
      loadUnreadCount();
      loadNotifications();
    }, 15000);
    
    return () => {
      clearInterval(interval);
      clearInterval(permInterval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('cgl-permissions-changed', handlePermissionsChanged);
      }
    };
  }, []);

  const loadUnreadCount = async () => {
    try {
      const res = await fetch('/api/committee-chat');
      if (res.ok) {
        const data = await res.json();
        const count = data.reduce((acc: number, conv: any) => acc + (conv.unreadCount > 0 ? 1 : 0), 0);
        setUnreadChatCount(count);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadNotifications = async () => {
    try {
      // Charger les paiements non validés
      const paymentsRes = await fetch('/api/admin/payments-list?status=PENDING', { cache: 'no-store' });
      if (paymentsRes.ok) {
        const payments = await paymentsRes.json();
        setPendingPaymentsCount(Array.isArray(payments) ? payments.filter((payment: any) => payment.status === 'PENDING').length : 0);
      }

      // Charger les candidatures d'experts
      const expertRes = await fetch('/api/expert-applications?status=pending');
      if (expertRes.ok) {
        const experts = await expertRes.json();
        setExpertApplicationsCount(Array.isArray(experts) ? experts.length : 0);
      }

      // Charger les mises à jour de progression non approuvées
      const progressRes = await fetch('/api/progress-updates?status=pending');
      if (progressRes.ok) {
        const updates = await progressRes.json();
        setProgressUpdatesCount(Array.isArray(updates) ? updates.length : 0);
      }
    } catch (e) {
      console.error('Error loading notifications:', e);
    }
  };

  const loadPermissions = async () => {
    try {
      const res = await fetch('/api/cgl-permissions', {
        cache: 'no-store',
        headers: { 'pragma': 'no-cache', 'cache-control': 'no-cache' }
      });
      if (res.ok) {
        const data = await res.json();
        console.log('CGL Permissions loaded:', data);
        setEnabledFeatures(data.enabledFeatures || []);
      } else {
        console.error('Failed to load CGL permissions:', res.status);
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

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col bg-card">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
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
            className="bg-gradient-to-br from-blue-600 to-indigo-700 p-3 rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-all active:scale-[0.97] h-[100px] border-0 relative overflow-hidden"
            onClick={() => setCurrentScreen('committee-chat')}
          >
            {unreadChatCount > 0 && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-bounce">
                {unreadChatCount} discussion{unreadChatCount > 1 ? 's' : ''}
              </div>
            )}
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
              let notificationCount = 0;

              // Déterminer le nombre de notifications selon le type de bouton
              if (feature.id === 'payments') {
                notificationCount = pendingPaymentsCount;
              } else if (feature.id === 'expert-applications') {
                notificationCount = expertApplicationsCount;
              } else if (feature.id === 'progress-updates') {
                notificationCount = progressUpdatesCount;
              }

              return (
                <Card
                  key={feature.id}
                  className="bg-card p-3 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-all active:scale-[0.97] h-[100px] relative overflow-hidden"
                  onClick={() => handleFeatureClick(feature)}
                >
                  {notificationCount > 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-bounce">
                      {notificationCount}
                    </div>
                  )}
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
