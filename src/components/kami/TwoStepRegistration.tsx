import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, CheckCircle, Home, Users, Building2, Menu } from 'lucide-react';

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
    confirmPassword: ''
  });

  const residentBenefits = [
    "Prix préférentiel : 100 000 FCFA",
    "Paiement en plusieurs tranches possible",
    "Accès prioritaire aux nouveaux blocs",
    "Support personnalisé dédié"
  ];

  const nonResidentBenefits = [
    "Terrain constructible viabilisé",
    "Prix attractif : 150 000 FCFA",
    "Paiement flexible disponible",
    "Documentation complète incluse"
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
      <div className="bg-[#8B5E3C] text-white p-6 relative">
        {setIsMenuOpen && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 text-white hover:bg-white/20"
          onClick={step === 1 ? onBack : () => setStep(1)}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="max-w-md mx-auto text-center pt-8">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Créer votre compte</h1>
          <p className="text-sm opacity-90">
            {step === 1 ? 'Choisissez votre statut' : 'Complétez vos informations'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mt-6 gap-2">
          <div className={`h-1 w-12 rounded-full ${step >= 1 ? 'bg-white' : 'bg-white/30'}`} />
          <div className={`h-1 w-12 rounded-full ${step >= 2 ? 'bg-white' : 'bg-white/30'}`} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-md mx-auto">
          {step === 1 ? (
            <div className="space-y-4">
              <p className="text-center text-gray-600 mb-6">
                Sélectionnez votre statut pour bénéficier d'un tarif adapté
              </p>

              {/* Resident Option */}
              <Card
                className={`border-2 cursor-pointer transition-all hover:shadow-lg ${
                  isResident === true
                    ? 'border-[#10B981] bg-emerald-50 shadow-lg'
                    : 'border-gray-200 bg-white'
                }`}
                onClick={() => setIsResident(true)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isResident === true ? 'bg-[#10B981]' : 'bg-gray-100'
                      }`}>
                        <Home className={`h-6 w-6 ${isResident === true ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Résident de KAMI</CardTitle>
                        <CardDescription>Pour les habitants du village</CardDescription>
                      </div>
                    </div>
                    {isResident === true && <CheckCircle className="h-6 w-6 text-[#10B981]" />}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <span className="text-4xl font-extrabold text-[#10B981]">100 000</span>
                    <span className="text-gray-600 text-xl"> FCFA</span>
                  </div>
                  <ul className="space-y-2">
                    {residentBenefits.map((benefit, i) => (
                      <li key={i} className="flex items-start text-sm">
                        <CheckCircle className="h-4 w-4 text-[#10B981] mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Non-Resident Option */}
              <Card
                className={`border-2 cursor-pointer transition-all hover:shadow-lg ${
                  isResident === false
                    ? 'border-[#8B5E3C] bg-orange-50 shadow-lg'
                    : 'border-gray-200 bg-white'
                }`}
                onClick={() => setIsResident(false)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isResident === false ? 'bg-[#8B5E3C]' : 'bg-gray-100'
                      }`}>
                        <Users className={`h-6 w-6 ${isResident === false ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Non-Résident</CardTitle>
                        <CardDescription>Pour les extérieurs au village</CardDescription>
                      </div>
                    </div>
                    {isResident === false && <CheckCircle className="h-6 w-6 text-[#8B5E3C]" />}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <span className="text-4xl font-extrabold text-[#8B5E3C]">150 000</span>
                    <span className="text-gray-600 text-xl"> FCFA</span>
                  </div>
                  <ul className="space-y-2">
                    {nonResidentBenefits.map((benefit, i) => (
                      <li key={i} className="flex items-start text-sm">
                        <CheckCircle className="h-4 w-4 text-[#8B5E3C] mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Button
                onClick={handleStep1Submit}
                className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold py-4 rounded-xl text-lg"
                disabled={isResident === null}
              >
                Continuer
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Card */}
              <Card className="border-2 border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isResident ? (
                        <Home className="h-6 w-6 text-[#10B981]" />
                      ) : (
                        <Users className="h-6 w-6 text-[#8B5E3C]" />
                      )}
                      <div>
                        <p className="text-sm text-gray-500">Votre statut</p>
                        <p className="font-bold text-gray-800">
                          {isResident ? 'Résident de KAMI' : 'Non-Résident'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Prix du lot</p>
                      <p className="font-extrabold text-gray-800">
                        {isResident ? '100 000' : '150 000'} FCFA
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Form */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-base font-bold">Nom complet</Label>
                    <p className="text-xs text-gray-500 mb-2">Comme il apparaît sur votre pièce d'identité</p>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Ex: Jean Koné"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-12 text-lg"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-base font-bold">Numéro de téléphone</Label>
                    <p className="text-xs text-gray-500 mb-2">Pour vous contacter et confirmer votre réservation</p>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Ex: 07 58 42 10"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="h-12 text-lg"
                    />
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                    <p className="text-sm text-gray-700">
                      ✓ Paiement flexible à partir de <strong>10 000 FCFA</strong>
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      ✓ Vous pourrez réserver votre lot immédiatement après l'inscription
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleStep2Submit}
                className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold py-4 rounded-xl text-lg"
              >
                Créer mon compte et réserver
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <p className="text-xs text-center text-gray-500">
                En continuant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
