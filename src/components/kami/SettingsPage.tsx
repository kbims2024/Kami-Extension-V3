'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { ArrowLeft, Settings, Zap, Shield, Palette } from 'lucide-react';

interface SettingsPageProps {
  onBack: () => void;
}

export function SettingsPage({ onBack }: SettingsPageProps) {
  return (
    <div className="flex-1 flex flex-col bg-card p-6 pt-16 animate-fade-in-up">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4"
        onClick={onBack}
      >
        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
      </Button>

      <h2 className="text-2xl font-bold text-center text-foreground mb-6 flex items-center justify-center">
        <Settings className="mr-2 h-6 w-6" />
        Paramètres de l'Application
      </h2>

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
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Animations fluides</p>
                <p className="text-sm text-muted-foreground">Transitions animées entre les pages</p>
              </div>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">Activé</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-rafraîchissement</p>
                <p className="text-sm text-muted-foreground">Mise à jour automatique des données</p>
              </div>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">Activé</span>
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
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Connexion sécurisée</p>
                <p className="text-sm text-muted-foreground">Communication cryptée avec le serveur</p>
              </div>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">Activé</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Mode admin</p>
                <p className="text-sm text-muted-foreground">Accès aux fonctionnalités d'administration</p>
              </div>
              <span className="text-sm text-muted-foreground">Disponible pour les admins</span>
            </div>
          </CardContent>
        </Card>

        {/* Informations supplémentaires */}
        <Card className="border-2 border-dashed border-muted bg-muted/30">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              <Shield className="inline h-4 w-4 mr-1" />
              Les autres paramètres sont gérés par l'administrateur
            </p>
            <p className="text-xs text-muted-foreground">
              Contactez votre administrateur pour modifier les Flash Infos, l'image de fond ou le logo
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}