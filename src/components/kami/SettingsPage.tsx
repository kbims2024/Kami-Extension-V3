'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Home, Settings, Shield, Palette, AlertCircle } from 'lucide-react';

interface SettingsPageProps {
  onBack: () => void;
  onHome?: () => void;
}

export function SettingsPage({ onBack, onHome }: SettingsPageProps) {
  // Settings
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  // Security settings
  const [secureConnection, setSecureConnection] = useState(true);
  const [adminMode, setAdminMode] = useState(false);

  // Password dialog state
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedAnimations = localStorage.getItem('settings-animations');
    const savedSecure = localStorage.getItem('settings-secure');
    const savedAdmin = localStorage.getItem('settings-admin');

    if (savedAnimations !== null) setAnimationsEnabled(savedAnimations === 'true');
    if (savedSecure !== null) setSecureConnection(savedSecure === 'true');
    if (savedAdmin !== null) setAdminMode(savedAdmin === 'true');
  }, []);

  // Save settings to localStorage when changed
  useEffect(() => {
    localStorage.setItem('settings-animations', animationsEnabled.toString());
    document.body.classList.toggle('no-animations', !animationsEnabled);
  }, [animationsEnabled]);

  useEffect(() => {
    localStorage.setItem('settings-secure', secureConnection.toString());
  }, [secureConnection]);

  useEffect(() => {
    localStorage.setItem('settings-admin', adminMode.toString());
  }, [adminMode]);

  // Handle admin mode toggle
  const handleAdminToggle = (checked: boolean) => {
    if (checked) {
      // Ask for password when enabling
      setShowPasswordDialog(true);
      setPasswordError('');
    } else {
      // Disable without password
      setAdminMode(false);
    }
  };

  // Handle password submission
  const handlePasswordSubmit = () => {
    const ADMIN_PASSWORD = 'admin123'; // In production, this should be stored securely on server

    if (adminPassword === ADMIN_PASSWORD) {
      setAdminMode(true);
      setShowPasswordDialog(false);
      setAdminPassword('');
      setPasswordError('');
    } else {
      setPasswordError('Mot de passe incorrect');
    }
  };

  // Handle password dialog close
  const handlePasswordDialogClose = () => {
    setShowPasswordDialog(false);
    setAdminPassword('');
    setPasswordError('');
  };

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
        {onHome && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-0 left-10"
            onClick={onHome}
          >
            <Home className="h-5 w-5 text-muted-foreground" />
          </Button>
        )}

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
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Animations fluides</p>
                <p className="text-sm text-muted-foreground">Transitions animées entre les pages</p>
              </div>
              <Switch
                checked={animationsEnabled}
                onCheckedChange={setAnimationsEnabled}
                className="data-[state=checked]:bg-purple-500"
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
                onCheckedChange={handleAdminToggle}
                className="data-[state=checked]:bg-red-500"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Password Dialog for Admin Mode */}
      <Dialog open={showPasswordDialog} onOpenChange={handlePasswordDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-500" />
              Mot de passe administrateur
            </DialogTitle>
            <DialogDescription>
              Entrez le mot de passe administrateur pour activer le mode admin
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="admin-password">Mot de passe</Label>
              <Input
                id="admin-password"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Entrez le mot de passe"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handlePasswordSubmit();
                  }
                }}
                autoFocus
              />
            </div>
            {passwordError && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {passwordError}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handlePasswordDialogClose}>
              Annuler
            </Button>
            <Button onClick={handlePasswordSubmit}>
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}