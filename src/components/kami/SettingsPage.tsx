'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { ArrowLeft, Settings, Info, Zap, Shield, Palette, Image as ImageIcon } from 'lucide-react';
import { FlashInfoAdmin } from './FlashInfoAdmin';
import { AdminHeroImage } from './AdminHeroImage';

interface SettingsPageProps {
  onBack: () => void;
}

export function SettingsPage({ onBack }: SettingsPageProps) {
  const [activeSection, setActiveSection] = useState<'main' | 'flash-info' | 'hero-image'>('main');

  return (
    <div className="flex-1 flex flex-col bg-card p-6 pt-16">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4"
        onClick={onBack}
      >
        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
      </Button>

      {activeSection === 'main' ? (
        <>
          <h2 className="text-2xl font-bold text-center text-foreground mb-6 flex items-center justify-center">
            <Settings className="mr-2 h-6 w-6" />
            Paramètres de l'Application
          </h2>

          <div className="space-y-4 max-w-2xl mx-auto">
            {/* Apparence */}
            <Card className="border-l-4 border-purple-500">
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

            {/* Flash Info Settings */}
            <Card
              className="border-l-4 border-blue-500 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveSection('flash-info')}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                  <Info className="h-5 w-5" />
                  Barre Flash Info
                </CardTitle>
                <CardDescription>
                  Gérez les messages d'information défilants, les couleurs et la vitesse
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <Info className="mr-2 h-4 w-4" />
                  Gérer les Flash Infos
                </Button>
              </CardContent>
            </Card>

            {/* Hero Image Settings */}
            <Card
              className="border-l-4 border-orange-500 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveSection('hero-image')}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                  <ImageIcon className="h-5 w-5" />
                  Image de Fond de l'Accueil
                </CardTitle>
                <CardDescription>
                  Définissez l'image de fond personnalisée pour la section d'accueil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Gérer l'image de fond
                </Button>
              </CardContent>
            </Card>

            {/* Performance */}
            <Card className="border-l-4 border-yellow-500">
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
                    <p className="font-medium">Auto-rafraîchissement</p>
                    <p className="text-sm text-muted-foreground">Mise à jour automatique des données</p>
                  </div>
                  <span className="text-sm text-muted-foreground">Activé</span>
                </div>
              </CardContent>
            </Card>

            {/* Sécurité */}
            <Card className="border-l-4 border-red-500">
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
                    <p className="font-medium">Mode admin</p>
                    <p className="text-sm text-muted-foreground">Accès aux fonctionnalités d'administration</p>
                  </div>
                  <span className="text-sm text-muted-foreground">Disponible</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : activeSection === 'flash-info' ? (
        <FlashInfoAdmin onBack={() => setActiveSection('main')} />
      ) : activeSection === 'hero-image' ? (
        <AdminHeroImage onBack={() => setActiveSection('main')} />
      ) : null}
    </div>
  );
}