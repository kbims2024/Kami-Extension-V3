'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock, ArrowRight, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface PasswordResetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = 'request' | 'reset';

export function PasswordResetDialog({ open, onOpenChange }: PasswordResetDialogProps) {
  const [step, setStep] = useState<Step>('request');
  const [phone, setPhone] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestReset = async () => {
    if (!phone) {
      toast.error('Veuillez entrer votre numéro de téléphone');
      return;
    }

    if (phone.length < 8) {
      toast.error('Veuillez entrer un numéro de téléphone valide');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (response.ok) {
        // For demo purposes, show the token
        // In production, this would be sent via SMS/email
        if (data.resetToken) {
          toast.success(`Code de réinitialisation: ${data.resetToken}`);
          setResetToken(data.resetToken);
        } else {
          toast.success('Code envoyé à votre numéro de téléphone');
        }
        setStep('reset');
      } else {
        toast.error(data.error || 'Erreur lors de la demande');
      }
    } catch (error) {
      toast.error('Erreur lors de la demande');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    if (!resetToken || !password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password, resetToken }),
      });

      if (response.ok) {
        toast.success('Mot de passe réinitialisé avec succès');
        onOpenChange(false);
        resetForm();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Erreur lors de la réinitialisation');
      }
    } catch (error) {
      toast.error('Erreur lors de la réinitialisation');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setPhone('');
    setResetToken('');
    setPassword('');
    setConfirmPassword('');
    setStep('request');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {step === 'request' ? 'Demander un code' : 'Réinitialiser le mot de passe'}
          </DialogTitle>
          <DialogDescription>
            {step === 'request'
              ? 'Entrez votre numéro de téléphone pour recevoir un code de réinitialisation'
              : 'Entrez le code reçu et votre nouveau mot de passe'
            }
          </DialogDescription>
        </DialogHeader>

        {step === 'request' ? (
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="reset-phone" className="text-sm font-semibold mb-2 block">
                Numéro de téléphone
              </Label>
              <Input
                id="reset-phone"
                type="tel"
                placeholder="Ex: 07 58 42 10"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-11"
              />
            </div>
            <Button
              onClick={handleRequestReset}
              disabled={isLoading}
              className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600"
            >
              {isLoading ? 'Envoi en cours...' : 'Envoyer le code'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="reset-token" className="text-sm font-semibold mb-2 block">
                Code de réinitialisation
              </Label>
              <Input
                id="reset-token"
                type="text"
                placeholder="Entrez le code reçu"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                className="h-11"
              />
            </div>

            <div>
              <Label htmlFor="new-password" className="text-sm font-semibold mb-2 block">
                Nouveau mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 caractères"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pr-10"
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

            <div>
              <Label htmlFor="confirm-new-password" className="text-sm font-semibold mb-2 block">
                Confirmer le mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="confirm-new-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirmer votre mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-11 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-0 h-11 w-11 hover:bg-transparent"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          {step === 'request' ? (
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Annuler
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => setStep('request')}
              className="flex-1"
            >
              <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
              Retour
            </Button>
          )}
          {step === 'reset' && (
            <Button
              onClick={handleReset}
              disabled={isLoading}
              className="flex-1 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600"
            >
              {isLoading ? 'Réinitialisation...' : 'Réinitialiser'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}