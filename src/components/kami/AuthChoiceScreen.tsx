'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, LogIn, UserPlus, Menu } from 'lucide-react';
import { LogoDisplay } from '@/components/kami/LogoDisplay';

interface AuthChoiceScreenProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onBack: () => void;
  setIsMenuOpen?: (open: boolean) => void;
}

export function AuthChoiceScreen({ onLoginClick, onRegisterClick, onBack, setIsMenuOpen }: AuthChoiceScreenProps) {
  return (
    <div className="flex-1 flex flex-col bg-card h-screen">
      {/* Header */}
      <header className="flex justify-between items-center px-3 py-2 bg-card border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:bg-blue-50 h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4 text-foreground" />
          </Button>
          <h1 className="text-sm font-bold text-foreground leading-tight">Bienvenue</h1>
        </div>
        {setIsMenuOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(true)}
            className="hover:bg-blue-50 h-8 w-8"
          >
            <Menu className="h-4 w-4 text-foreground" />
          </Button>
        )}
      </header>

      {/* Content */}
      <div className="flex-1 p-3 overflow-hidden flex flex-col">
        <div className="max-w-lg mx-auto w-full flex flex-col">
          {/* Logo - very compact */}
          <div className="text-center mb-3 pt-1 shrink-0">
            <div className="mb-2">
              <LogoDisplay size="xl" showBackground={true} />
            </div>
            <h2 className="text-base font-bold text-foreground mb-0.5">
              Réservez votre terrain
            </h2>
            <p className="text-[11px] text-foreground">
              Connectez-vous ou créez un compte
            </p>
          </div>

          {/* Choice Cards - minimal spacing */}
          <div className="space-y-2 shrink-0">
            {/* Login Card */}
            <Card
              className="border-2 border-border bg-card cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 hover:border-blue-400"
              onClick={onLoginClick}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <LogIn className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-foreground mb-0.5 truncate">
                      Se connecter
                    </h3>
                    <p className="text-xs text-foreground truncate">
                      Vous avez déjà un compte ?
                    </p>
                  </div>
                  <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                    <ArrowLeft className="h-3 w-3 text-blue-600 rotate-180" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Register Card */}
            <Card
              className="border-2 border-brand-blue/30 bg-gradient-to-br from-brand-blue/5 to-white cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 hover:border-brand-blue"
              onClick={onRegisterClick}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-brand-blue rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-blue/30">
                    <UserPlus className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-foreground mb-0.5 truncate">
                      Créer un compte
                    </h3>
                    <p className="text-xs text-foreground truncate">
                      Nouveau ici ? Créez votre compte
                    </p>
                  </div>
                  <div className="w-6 h-6 bg-brand-blue/10 rounded-full flex items-center justify-center shrink-0">
                    <ArrowLeft className="h-3 w-3 text-brand-blue rotate-180" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Box - very compact at bottom */}
          <div className="mt-auto pt-2 shrink-0">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-2.5">
              <div className="text-[11px]">
                <p className="font-medium text-foreground mb-1 text-xs">Pourquoi créer un compte ?</p>
                <ul className="space-y-0.5 text-foreground">
                  <li className="text-[10px] leading-tight">✓ Réservez votre terrain en quelques clics</li>
                  <li className="text-[10px] leading-tight">✓ Suivez vos paiements en temps réel</li>
                  <li className="text-[10px] leading-tight">✓ Recevez les notifications importantes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}