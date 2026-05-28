'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, LogIn, UserPlus, Building2, Menu } from 'lucide-react';

interface AuthChoiceScreenProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onBack: () => void;
  setIsMenuOpen?: (open: boolean) => void;
}

export function AuthChoiceScreen({ onLoginClick, onRegisterClick, onBack, setIsMenuOpen }: AuthChoiceScreenProps) {
  return (
    <div className="flex-1 flex flex-col bg-card min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-card border-b border-border sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:bg-blue-50"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-foreground leading-tight">Bienvenue</h1>
            <p className="text-xs text-muted-foreground">KAMI-EXTENSION</p>
          </div>
        </div>
        {setIsMenuOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(true)}
            className="hover:bg-blue-50"
          >
            <Menu className="h-6 w-6 text-foreground" />
          </Button>
        )}
      </header>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-lg mx-auto">
          {/* Logo */}
          <div className="text-center mb-8 pt-8">
            <div className="w-20 h-20 bg-gradient-to-br from-brand-blue to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-blue/30">
              <Building2 className="h-10 w-10 text-brand-yellow" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Réservez votre terrain
            </h2>
            <p className="text-foreground">
              Connectez-vous ou créez un compte pour commencer
            </p>
          </div>

          {/* Choice Cards */}
          <div className="space-y-4">
            {/* Login Card */}
            <Card
              className="border-2 border-border bg-card cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 hover:border-blue-400"
              onClick={onLoginClick}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <LogIn className="h-7 w-7 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-1">
                      Se connecter
                    </h3>
                    <p className="text-sm text-foreground">
                      Vous avez déjà un compte ?
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                    <ArrowLeft className="h-4 w-4 text-blue-600 rotate-180" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Register Card */}
            <Card
              className="border-2 border-brand-blue/30 bg-gradient-to-br from-brand-blue/5 to-white cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 hover:border-brand-blue"
              onClick={onRegisterClick}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-brand-blue rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-blue/30">
                    <UserPlus className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-1">
                      Créer un compte
                    </h3>
                    <p className="text-sm text-foreground">
                      Nouveau à KAMI-EXTENSION ?
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-brand-blue/10 rounded-full flex items-center justify-center">
                    <ArrowLeft className="h-4 w-4 text-brand-blue rotate-180" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5">
            <div className="text-sm">
              <p className="font-medium text-foreground mb-2">Pourquoi créer un compte ?</p>
              <ul className="space-y-1.5 text-foreground">
                <li>✓ Réservez votre terrain en quelques clics</li>
                <li>✓ Suivez vos paiements en temps réel</li>
                <li>✓ Recevez les notifications importantes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}