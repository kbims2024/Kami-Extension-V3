'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, CheckCircle, Home, Users, Shield, Eye, EyeOff, Menu } from 'lucide-react';

interface TwoStepRegistrationProps {
  onComplete: (userData: { name: string; pseudo: string; phone: string; isResident: boolean; password: string; quartier?: string }) => void;
  onBack: () => void;
  setIsMenuOpen?: (open: boolean) => void;
}

export function TwoStepRegistration({ onComplete, onBack, setIsMenuOpen }: TwoStepRegistrationProps) {
  const [step, setStep] = useState(1);
  const [isResident, setIsResident] = useState<boolean | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [quartier, setQuartier] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    pseudo: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const quartiersKami = ['ASSAKLA', "N'GLOH", "N'ZOKLOH", "N'GUOUAH"];

  const residentBenefits = [
    { icon: Home, text: "Prix : 100 000 FCFA" },
    { icon: Shield, text: "Sécurisé par mot de passe" },
  ];

  const nonResidentBenefits = [
    { icon: Users, text: "Prix : 150 000 FCFA" },
    { icon: Shield, text: "Sécurisé par mot de passe" },
  ];

  const handleStep1Submit = () => {
    if (isResident === null) {
      alert('Veuillez choisir votre statut');
      return;
    }
    setStep(2);
  };

  const handleStep2Submit = () => {
    if (!formData.name || !formData.pseudo || !formData.phone || !formData.password) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    if (formData.pseudo.trim().length < 2) {
      alert('Le pseudo doit contenir au moins 2 caractères');
      return;
    }

    if (isResident && !quartier) {
      alert('Veuillez sélectionner votre quartier');
      return;
    }

    if (formData.phone.length < 8) {
      alert('Veuillez entrer un numéro de téléphone valide');
      return;
    }

    if (formData.password.length < 6) {
      alert('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    onComplete({
      name: formData.name,
      pseudo: formData.pseudo.trim(),
      phone: formData.phone,
      isResident: isResident!,
      password: formData.password,
      quartier: isResident ? quartier : undefined,
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-card min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-card border-b border-border sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={step === 1 ? onBack : () => setStep(1)}
            className="hover:bg-blue-50"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-foreground leading-tight">Créer un compte</h1>
            <p className="text-xs text-muted-foreground">
              {step === 1 ? 'Étape 1 sur 2' : 'Étape 2 sur 2'}
            </p>
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

      {/* Progress Bar */}
      <div className="bg-card px-6 py-3 border-b border-border">
        <div className="flex gap-2 max-w-md">
          <div className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-blue-600 dark:bg-blue-500' : 'bg-card'}`} />
          <div className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-blue-600 dark:bg-blue-500' : 'bg-card'}`} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-lg mx-auto">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Quel est votre statut ?
                </h2>
                <p className="text-foreground">
                  Sélectionnez votre situation pour bénéficier du tarif adapté
                </p>
              </div>

              {/* Resident Card */}
              <Card
                className={`border-2 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${
                  isResident === true
                    ? 'border-blue-600 bg-blue-50/50 shadow-md'
                    : 'border-border bg-card hover:border-blue-400'
                }`}
                onClick={() => setIsResident(true)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        isResident === true ? 'bg-blue-600 dark:bg-blue-500' : 'bg-background'
                      }`}>
                        <Home className={`h-6 w-6 ${isResident === true ? 'text-white' : 'text-foreground'}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">Résident KAMI</h3>
                        <p className="text-sm text-muted-foreground">Habitant du village</p>
                      </div>
                    </div>
                    {isResident === true && (
                      <div className="w-6 h-6 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">100 000</span>
                    <span className="text-lg text-foreground ml-1">FCFA</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {residentBenefits.map((benefit, i) => {
                      const Icon = benefit.icon;
                      return (
                        <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                          <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                          <span>{benefit.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Non-Resident Card */}
              <Card
                className={`border-2 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${
                  isResident === false
                    ? 'border-blue-600 bg-blue-50/50 shadow-md'
                    : 'border-border bg-card hover:border-blue-400'
                }`}
                onClick={() => setIsResident(false)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        isResident === false ? 'bg-blue-600 dark:bg-blue-500' : 'bg-background'
                      }`}>
                        <Users className={`h-6 w-6 ${isResident === false ? 'text-white' : 'text-foreground'}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">Non-Résident</h3>
                        <p className="text-sm text-muted-foreground">Extérieur au village</p>
                      </div>
                    </div>
                    {isResident === false && (
                      <div className="w-6 h-6 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <span className="text-3xl font-bold text-foreground">150 000</span>
                    <span className="text-lg text-foreground ml-1">FCFA</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {nonResidentBenefits.map((benefit, i) => {
                      const Icon = benefit.icon;
                      return (
                        <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                          <Icon className="h-4 w-4 text-foreground flex-shrink-0" />
                          <span>{benefit.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleStep1Submit}
                className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-4 rounded-xl text-base shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02]"
                disabled={isResident === null}
              >
                Continuer
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Vos informations
                </h2>
                <p className="text-foreground">
                  Complétez votre profil pour finaliser l'inscription
                </p>
              </div>

              {/* Selected Status Card */}
              <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-card border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isResident ? (
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <Home className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center">
                          <Users className="h-5 w-5 text-foreground" />
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-muted-foreground">Votre statut</p>
                        <p className="font-bold text-foreground">
                          {isResident ? 'Résident KAMI' : 'Non-Résident'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Prix du lot</p>
                      <p className="font-bold text-blue-600">
                        {isResident ? '100 000' : '150 000'} FCFA
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Form */}
              <Card className="border-border">
                <CardContent className="p-6 space-y-5">
                  <div>
                    <Label htmlFor="name" className="text-sm font-semibold text-foreground mb-2 block">
                      Nom complet <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Ex: Jean Koné"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-11 text-base border-border focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="pseudo" className="text-sm font-semibold text-foreground mb-2 block">
                      Pseudo <span className="text-red-500">*</span>
                    </Label>
                    <p className="text-xs text-muted-foreground mb-2">Ce pseudo sera visible par tous sur la plateforme (réservations, etc.)</p>
                    <Input
                      id="pseudo"
                      type="text"
                      placeholder="Ex: JeanK"
                      value={formData.pseudo}
                      onChange={(e) => setFormData({ ...formData, pseudo: e.target.value })}
                      className="h-11 text-base border-border focus:border-blue-500 focus:ring-blue-500"
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

                  {isResident && (
                    <div>
                      <Label className="text-sm font-semibold text-foreground mb-2 block">
                        Quartier <span className="text-red-500">*</span>
                      </Label>
                      <Select value={quartier} onValueChange={setQuartier}>
                        <SelectTrigger className="h-11 text-base border-border focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Sélectionnez votre quartier" />
                        </SelectTrigger>
                        <SelectContent>
                          {quartiersKami.map((q) => (
                            <SelectItem key={q} value={q}>{q}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="password" className="text-sm font-semibold text-foreground mb-2 block">
                      Mot de passe
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

                  <div>
                    <Label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground mb-2 block">
                      Confirmer le mot de passe
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirmer votre mot de passe"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="h-11 text-base border-border focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 pr-10"
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

                  {/* Info Box */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-foreground mb-1">Ce qui vous attend :</p>
                        <ul className="space-y-1 text-foreground">
                          <li>• Paiement flexible à partir de <strong>10 000 FCFA</strong></li>
                          <li>• Accès immédiat au plan des lots</li>
                          <li>• Support client disponible</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleStep2Submit}
                className="w-full bg-gradient-to-r from-blue-600 dark:from-blue-500 to-blue-700 dark:to-blue-600 hover:from-blue-700 dark:hover:from-blue-600 hover:to-blue-800 dark:hover:to-blue-700 text-white font-semibold py-4 rounded-xl text-base shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20 transition-all hover:scale-[1.02]"
              >
                Créer mon compte
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                onClick={() => setStep(1)}
                variant="ghost"
                className="w-full text-foreground hover:text-foreground font-medium"
              >
                Retour
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
