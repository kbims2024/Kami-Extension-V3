'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, LogIn, Building2, Menu, Eye, EyeOff, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { PasswordResetDialog } from './PasswordResetDialog';

interface LoginScreenProps {
  onLogin: (name: string, phone: string, password?: string) => void;
  onBack: () => void;
  setIsMenuOpen?: (open: boolean) => void;
}

export function LoginScreen({ onLogin, onBack, setIsMenuOpen }: LoginScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (formData.phone.length < 8) {
      toast.error('Veuillez entrer un numéro de téléphone valide');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          password: formData.password || undefined,
        }),
      });

      if (response.ok) {
        const user = await response.json();
        onLogin(formData.name, formData.phone, formData.password);
      } else {
        const data = await response.json();
        toast.error(data.error || 'Erreur de connexion');
      }
    } catch (error) {
      console.error('Login error:', error);
      onLogin(formData.name, formData.phone, formData.password);
    } finally {
      setIsLoading(false);
    }
  };

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
            <h1 className="text-lg font-bold text-foreground leading-tight">Se connecter</h1>
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
          <div className="text-center mb-8 pt-4">
            <div className="w-16 h-16 bg-gradient-to-br from-brand-blue to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-blue/30">
              <Building2 className="h-8 w-8 text-brand-yellow" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              Bon retour !
            </h2>
            <p className="text-foreground text-sm">
              Entrez vos informations pour vous connecter
            </p>
          </div>

          {/* Form Card */}
          <Card className="border-border">
            <CardContent className="p-6 space-y-5">
              <div>
                <Label htmlFor="name" className="text-sm font-semibold text-foreground mb-2 block">
                  Nom complet
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ex: Jean Koné"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-11 text-base border-border focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-semibold text-foreground mb-2 block">
                  Numéro de téléphone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Ex: 07 58 42 10"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-11 text-base border-border focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-semibold text-foreground mb-2 block">
                  Mot de passe {formData.password ? '' : <span className="text-muted-foreground">(optionnel)</span>}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 6 caractères"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="h-11 text-base border-border focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-11 w-11 hover:bg-transparent"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 dark:from-blue-500 to-blue-700 dark:to-blue-600 hover:from-blue-700 dark:hover:from-blue-600 hover:to-blue-800 dark:hover:to-blue-700 text-white font-semibold py-4 rounded-xl text-base shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20 transition-all hover:scale-[1.02]"
              >
                <LogIn className="mr-2 h-5 w-5" />
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </CardContent>
          </Card>

          {/* Info */}
          <div className="mt-6 text-center text-sm">
            <Button
              variant="ghost"
              onClick={() => setShowResetDialog(true)}
              className="text-brand-blue dark:text-brand-blue/80 hover:underline p-0 h-auto font-normal"
            >
              <Lock className="mr-1 h-3 w-3" />
              Mot de passe oublié ?
            </Button>
          </div>

          <PasswordResetDialog open={showResetDialog} onOpenChange={setShowResetDialog} />
        </div>
      </div>
    </div>
  );
}