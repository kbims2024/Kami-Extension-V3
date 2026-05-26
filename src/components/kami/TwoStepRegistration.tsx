import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, CheckCircle, Home, Users, Building2, Menu, ShieldCheck, Clock, Star } from 'lucide-react';

interface TwoStepRegistrationProps {
  onComplete: (userData: { name: string; phone: string; isResident: boolean }) => void;
  onBack: () => void;
  setIsMenuOpen?: (open: boolean) => void;
}

export function TwoStepRegistration({ onComplete, onBack, setIsMenuOpen }: TwoStepRegistrationProps) {
  const [step, setStep] = useState(1);
  const [isResident, setIsResident] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });

  const residentBenefits = [
    { icon: Home, text: "Prix : 100 000 FCFA" },
    { icon: Clock, text: "Paiement en tranches" },
    { icon: Star, text: "Support prioritaire" },
    { icon: ShieldCheck, text: "Accès exclusif" },
  ];

  const nonResidentBenefits = [
    { icon: Home, text: "Prix : 150 000 FCFA" },
    { icon: Clock, text: "Paiement flexible" },
    { icon: Star, text: "Support dédié" },
    { icon: ShieldCheck, text: "Terrain viabilisé" },
  ];

  const handleStep1Submit = () => {
    if (isResident === null) {
      alert('Veuillez choisir votre statut');
      return;
    }
    setStep(2);
  };

  const handleStep2Submit = () => {
    if (!formData.name || !formData.phone) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    if (formData.phone.length < 8) {
      alert('Veuillez entrer un numéro de téléphone valide');
      return;
    }

    onComplete({
      name: formData.name,
      phone: formData.phone,
      isResident: isResident!
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={step === 1 ? onBack : () => setStep(1)}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Créer un compte</h1>
            <p className="text-xs text-gray-500">
              {step === 1 ? 'Étape 1 sur 2' : 'Étape 2 sur 2'}
            </p>
          </div>
        </div>
        {setIsMenuOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(true)}
            className="hover:bg-gray-100"
          >
            <Menu className="h-6 w-6 text-gray-700" />
          </Button>
        )}
      </header>

      {/* Progress Bar */}
      <div className="bg-white px-6 py-3 border-b border-gray-100">
        <div className="flex gap-2 max-w-md">
          <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? 'bg-emerald-500' : 'bg-gray-200'}`} />
          <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? 'bg-emerald-500' : 'bg-gray-200'}`} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-lg mx-auto">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Quel est votre statut ?
                </h2>
                <p className="text-gray-600">
                  Sélectionnez votre situation pour bénéficier du tarif adapté
                </p>
              </div>

              {/* Resident Card */}
              <Card
                className={`border-2 cursor-pointer transition-all hover:shadow-lg ${
                  isResident === true
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-emerald-300'
                }`}
                onClick={() => setIsResident(true)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isResident === true ? 'bg-emerald-500' : 'bg-gray-100'
                      }`}>
                        <Home className={`h-6 w-6 ${isResident === true ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Résident KAMI</h3>
                        <p className="text-sm text-gray-500">Habitant du village</p>
                      </div>
                    </div>
                    {isResident === true && (
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <span className="text-3xl font-bold text-emerald-600">100 000</span>
                    <span className="text-lg text-gray-600 ml-1">FCFA</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {residentBenefits.map((benefit, i) => {
                      const Icon = benefit.icon;
                      return (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                          <Icon className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                          <span>{benefit.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Non-Resident Card */}
              <Card
                className={`border-2 cursor-pointer transition-all hover:shadow-lg ${
                  isResident === false
                    ? 'border-orange-500 bg-orange-50/50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-orange-300'
                }`}
                onClick={() => setIsResident(false)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isResident === false ? 'bg-orange-500' : 'bg-gray-100'
                      }`}>
                        <Users className={`h-6 w-6 ${isResident === false ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Non-Résident</h3>
                        <p className="text-sm text-gray-500">Extérieur au village</p>
                      </div>
                    </div>
                    {isResident === false && (
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <span className="text-3xl font-bold text-orange-600">150 000</span>
                    <span className="text-lg text-gray-600 ml-1">FCFA</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {nonResidentBenefits.map((benefit, i) => {
                      const Icon = benefit.icon;
                      return (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                          <Icon className="h-4 w-4 text-orange-500 flex-shrink-0" />
                          <span>{benefit.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleStep1Submit}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 rounded-xl text-base shadow-lg transition-all"
                disabled={isResident === null}
              >
                Continuer
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Vos informations
                </h2>
                <p className="text-gray-600">
                  Complétez votre profil pour finaliser l'inscription
                </p>
              </div>

              {/* Selected Status Card */}
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isResident ? (
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <Home className="h-5 w-5 text-emerald-600" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Users className="h-5 w-5 text-orange-600" />
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-500">Votre statut</p>
                        <p className="font-bold text-gray-900">
                          {isResident ? 'Résident KAMI' : 'Non-Résident'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Prix du lot</p>
                      <p className="font-bold text-gray-900">
                        {isResident ? '100 000' : '150 000'} FCFA
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Form */}
              <Card className="border-gray-200">
                <CardContent className="p-6 space-y-5">
                  <div>
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-900 mb-2 block">
                      Nom complet
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Ex: Jean Koné"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-11 text-base border-gray-300 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-semibold text-gray-900 mb-2 block">
                      Numéro de téléphone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Ex: 07 58 42 10"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="h-11 text-base border-gray-300 focus:border-emerald-500"
                    />
                  </div>

                  {/* Info Box */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-gray-900 mb-1">Ce qui vous attend :</p>
                        <ul className="space-y-1 text-gray-700">
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
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 rounded-xl text-base shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all"
              >
                Créer mon compte
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                onClick={() => setStep(1)}
                variant="ghost"
                className="w-full text-gray-600 hover:text-gray-900 font-medium"
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
