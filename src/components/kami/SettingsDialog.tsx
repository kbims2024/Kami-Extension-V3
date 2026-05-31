'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Settings,
  Palette,
  Bell,
  Globe,
  Info,
  Shield,
  FileText,
  ChevronRight,
  Moon,
  Sun,
  X
} from 'lucide-react';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [language, setLanguage] = useState('fr');

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-0 gap-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-blue/10 rounded-xl flex items-center justify-center">
                <Settings className="h-5 w-5 text-brand-blue" />
              </div>
              Paramètres
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
          {/* Apparence */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Palette className="h-4 w-4" />
              <span>Apparence</span>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center">
                    <Sun className="h-4 w-4 text-foreground" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Mode sombre/clair</Label>
                    <p className="text-xs text-muted-foreground">Changez le thème de l'application</p>
                  </div>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </div>

          <Separator />

          {/* Notifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </div>

            <div className="bg-card border border-border rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-brand-blue/10 rounded-lg flex items-center justify-center">
                    <Bell className="h-4 w-4 text-brand-blue" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Notifications push</Label>
                    <p className="text-xs text-muted-foreground">Recevoir des alertes sur votre appareil</p>
                  </div>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>

              <Separator className="my-3" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-brand-yellow/10 rounded-lg flex items-center justify-center">
                    <Bell className="h-4 w-4 text-brand-yellow" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Alertes nouveaux lots</Label>
                    <p className="text-xs text-muted-foreground">Être notifié des nouvelles disponibilités</p>
                  </div>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Langue */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Globe className="h-4 w-4" />
              <span>Langue</span>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <div className="grid grid-cols-2 gap-3">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      language === lang.code
                        ? 'border-brand-blue bg-brand-blue/5'
                        : 'border-border hover:border-brand-blue/30'
                    }`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span className={`text-sm font-medium ${
                      language === lang.code ? 'text-brand-blue' : 'text-foreground'
                    }`}>
                      {lang.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Informations */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Info className="h-4 w-4" />
              <span>Informations</span>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <button className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-brand-blue/10 rounded-lg flex items-center justify-center">
                    <Info className="h-4 w-4 text-brand-blue" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">À propos</p>
                    <p className="text-xs text-muted-foreground">Version 1.0.0</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>

              <Separator />

              <button className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-brand-green/10 rounded-lg flex items-center justify-center">
                    <Shield className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Politique de confidentialité</p>
                    <p className="text-xs text-muted-foreground">Comment nous protégeons vos données</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>

              <Separator />

              <button className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-brand-yellow/10 rounded-lg flex items-center justify-center">
                    <FileText className="h-4 w-4 text-brand-yellow" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Conditions d'utilisation</p>
                    <p className="text-xs text-muted-foreground">Règles et réglementations</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30">
          <p className="text-xs text-center text-muted-foreground">
            KAMI-EXTENSION v1.0.0 • © 2024
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}