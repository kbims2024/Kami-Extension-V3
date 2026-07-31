'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ShieldCheck, Eye, EyeOff, Loader2, Lock, Phone, User } from 'lucide-react';
import { toast } from 'sonner';

interface AdminLoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdminLoginSuccess: (user: any) => void;
}

type LoginMethod = 'pseudo' | 'phone';

export function AdminLoginDialog({ open, onOpenChange, onAdminLoginSuccess }: AdminLoginDialogProps) {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('pseudo');
  const [formData, setFormData] = useState({
    pseudo: '',
    phone: '',
    password: '',
    adminCode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminCode, setShowAdminCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    // Validations
    if (!formData.adminCode.trim()) {
      toast.error('Veuillez entrer le code d\'accès administrateur');
      return;
    }

    if (loginMethod === 'pseudo' && !formData.pseudo.trim()) {
      toast.error('Veuillez entrer votre pseudo');
      return;
    }

    if (loginMethod === 'phone' && !formData.phone.trim()) {
      toast.error('Veuillez entrer votre numéro de téléphone');
      return;
    }

    if (!formData.password) {
      toast.error('Veuillez entrer votre mot de passe');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pseudo: loginMethod === 'pseudo' ? formData.pseudo.trim() : undefined,
          phone: loginMethod === 'phone' ? formData.phone.trim() : undefined,
          password: formData.password,
          adminCode: formData.adminCode.trim(),
        }),
      });

      if (response.ok) {
        const user = await response.json();
        onAdminLoginSuccess(user);
        onOpenChange(false);
        // Reset form
        setFormData({ pseudo: '', phone: '', password: '', adminCode: '' });
        toast.success(`Bienvenue administrateur ${user.pseudo || user.name} !`);
      } else {
        const data = await response.json();
        toast.error(data.error || 'Erreur de connexion admin');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md mx-4 p-0 gap-0 overflow-hidden">
        {/* Header gradient */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-6 py-5 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white text-lg">
              <ShieldCheck className="h-5 w-5" />
              Accès Administration
            </DialogTitle>
            <DialogDescription className="text-purple-100 text-sm mt-1">
              Connexion sécurisée réservée aux administrateurs
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-4">
          {/* Code d'accès admin */}
          <div>
            <Label htmlFor="adminCode" className="text-sm font-semibold text-foreground mb-2 block">
              <Lock className="h-3.5 w-3.5 inline mr-1.5 text-purple-600" />
              Code d&apos;accès administrateur <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="adminCode"
                type={showAdminCode ? 'text' : 'password'}
                placeholder="Entrez le code secret admin"
                value={formData.adminCode}
                onChange={(e) => setFormData({ ...formData, adminCode: e.target.value })}
                className="h-11 text-base border-purple-300 focus:border-purple-500 focus:ring-purple-500 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowAdminCode(!showAdminCode)}
                className="absolute right-0 top-0 h-11 w-11 hover:bg-transparent"
              >
                {showAdminCode ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          {/* Séparateur */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium">Identifiants de connexion</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Méthode de connexion */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={loginMethod === 'pseudo' ? 'default' : 'outline'}
              onClick={() => setLoginMethod('pseudo')}
              className={`flex-1 text-sm ${loginMethod === 'pseudo' ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
            >
              <User className="h-3.5 w-3.5 mr-1.5" />
              Pseudo
            </Button>
            <Button
              type="button"
              variant={loginMethod === 'phone' ? 'default' : 'outline'}
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 text-sm ${loginMethod === 'phone' ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
            >
              <Phone className="h-3.5 w-3.5 mr-1.5" />
              Téléphone
            </Button>
          </div>

          {/* Champ pseudo ou téléphone */}
          {loginMethod === 'pseudo' ? (
            <div>
              <Label htmlFor="adminPseudo" className="text-sm font-semibold text-foreground mb-2 block">
                Pseudo
              </Label>
              <Input
                id="adminPseudo"
                type="text"
                placeholder="Ex: admin"
                value={formData.pseudo}
                onChange={(e) => setFormData({ ...formData, pseudo: e.target.value })}
                className="h-11 text-base border-border focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          ) : (
            <div>
              <Label htmlFor="adminPhone" className="text-sm font-semibold text-foreground mb-2 block">
                Numéro de téléphone
              </Label>
              <Input
                id="adminPhone"
                type="tel"
                placeholder="Ex: 07 58 42 10"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="h-11 text-base border-border focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          )}

          {/* Mot de passe */}
          <div>
            <Label htmlFor="adminPassword" className="text-sm font-semibold text-foreground mb-2 block">
              Mot de passe
            </Label>
            <div className="relative">
              <Input
                id="adminPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Votre mot de passe"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="h-11 text-base border-border focus:border-purple-500 focus:ring-purple-500 pr-10"
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

          {/* Bouton de connexion */}
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-semibold py-3 rounded-xl text-base shadow-lg shadow-purple-500/30 transition-all hover:scale-[1.02] mt-2"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <ShieldCheck className="mr-2 h-5 w-5" />
            )}
            {isLoading ? 'Connexion...' : 'Se connecter en tant qu\'admin'}
          </Button>

          <p className="text-[11px] text-center text-muted-foreground">
            Accès restreint. Toute tentative non autorisée est enregistrée.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}