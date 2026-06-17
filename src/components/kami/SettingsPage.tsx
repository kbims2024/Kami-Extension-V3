'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Settings, Zap, Shield, Palette } from 'lucide-react';

interface SettingsPageProps {
  onBack: () => void;
}

export function SettingsPage({ onBack }: SettingsPageProps) {
  // Performance settings
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);

  // Security settings
  const [secureConnection, setSecureConnection] = useState(true);
  const [adminMode, setAdminMode] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedAnimations = localStorage.getItem('settings-animations');
    const savedAutoRefresh = localStorage.getItem('settings-autorefresh');
    const savedSecure = localStorage.getItem('settings-secure');
    const savedAdmin = localStorage.getItem('settings-admin');

    if (savedAnimations !== null) setAnimationsEnabled(savedAnimations === 'true');
    if (savedAutoRefresh !== null) setAutoRefreshEnabled(savedAutoRefresh === 'true');
    if (savedSecure !== null) setSecureConnection(savedSecure === 'true');
    if (savedAdmin !== null) setAdminMode(savedAdmin === 'true');
  }, []);

  // Save settings to localStorage when changed
  useEffect(() => {
    localStorage.setItem('settings-animations', animationsEnabled.toString());
    document.body.classList.toggle('no-animations', !animationsEnabled);
  }, [animationsEnabled]);

  useEffect(() => {
    localStorage.setItem('settings-autorefresh', autoRefreshEnabled.toString());
  }, [autoRefreshEnabled]);

  useEffect(() => {
    localStorage.setItem('settings-secure', secureConnection.toString());
  }, [secureConnection]);

  useEffect(() => {
    localStorage.setItem('settings-admin', adminMode.toString());
  }, [adminMode]);

  return (
    <div className="flex-1 flex flex-col bg-background p-6 pt-16 animate-fade-in-up">
      <div className="relative w-full">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-0 left-0 -ml-2"
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </Button>

        <h2 className="text-2xl font-bold text-center text-foreground mb-6 flex items-center justify-center">
          <Settings className="mr-2 h-6 w-6" />
          Paramètres de l'Application
        </h2>
      </div>

      <div className="space-y-4 max-w-2xl mx-auto">
        {/* Apparence */}
        <Card className="border-l-4 border-purple-500 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
              <Palette className="h-5 w-5" />
              Apparence
            </CardTitle>
            <CardDescription>
              Personnalisez l'apparence de l'application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Mode sombre/clair</p>
                <p className="text-sm text-muted-foreground">Changez le thème de l'application</p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        {/* Performance */}
        <Card className="border-l-4 border-yellow-500 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
              <Zap className="h-5 w-5" />
              Performance
            </CardTitle>
            <CardDescription>
              Optimisez les performances de l'application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Animations fluides</p>
                <p className="text-sm text-muted-foreground">Transitions animées entre les pages</p>
              </div>
              <Switch
                checked={animationsEnabled}
                onCheckedChange={setAnimationsEnabled}
                className="data-[state=checked]:bg-yellow-500"
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Auto-rafraîchissement</p>
                <p className="text-sm text-muted-foreground">Mise à jour automatique des données</p>
              </div>
              <Switch
                checked={autoRefreshEnabled}
                onCheckedChange={setAutoRefreshEnabled}
                className="data-[state=checked]:bg-yellow-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Sécurité */}
        <Card className="border-l-4 border-red-500 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <Shield className="h-5 w-5" />
              Sécurité
            </CardTitle>
            <CardDescription>
              Paramètres de sécurité et de confidentialité
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Connexion sécurisée</p>
                <p className="text-sm text-muted-foreground">Communication cryptée avec le serveur</p>
              </div>
              <Switch
                checked={secureConnection}
                onCheckedChange={setSecureConnection}
                className="data-[state=checked]:bg-red-500"
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Mode admin</p>
                <p className="text-sm text-muted-foreground">Accès aux fonctionnalités d'administration</p>
              </div>
              <Switch
                checked={adminMode}
                onCheckedChange={setAdminMode}
                className="data-[state=checked]:bg-red-500"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}