'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, LogIn, Building2, Menu } from 'lucide-react';
import { toast } from 'sonner';

interface LoginScreenProps {
  onLogin: (name: string, phone: string) => void;
  onBack: () => void;
  setIsMenuOpen?: (open: boolean) => void;
}

export function LoginScreen({ onLogin, onBack, setIsMenuOpen }: LoginScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.phone) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (formData.phone.length < 8) {
      toast.error('Veuillez entrer un numéro de téléphone valide');
      return;
    }

    onLogin(formData.name, formData.phone);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:bg-blue-50"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Se connecter</h1>
            <p className="text-xs text-gray-500">KAMI-EXTENSION</p>
          </div>
        </div>
        {setIsMenuOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(true)}
            className="hover:bg-blue-50"
          >
            <Menu className="h-6 w-6 text-gray-700" />
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
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Bon retour !
            </h2>
            <p className="text-gray-600 text-sm">
              Entrez vos informations pour vous connecter
            </p>
          </div>

          {/* Form Card */}
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
                  className="h-11 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                  className="h-11 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 rounded-xl text-base shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02]"
              >
                <LogIn className="mr-2 h-5 w-5" />
                Se connecter
              </Button>
            </CardContent>
          </Card>

          {/* Info */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Vous avez oublié vos informations ?</p>
            <p className="text-gray-500 mt-1">Contactez le support pour assistance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}