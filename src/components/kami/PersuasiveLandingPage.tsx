import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Menu, Map, CheckCircle, Home, Zap, Droplet, ShieldCheck, Users, TrendingUp, Clock, Award, Star, Wrench, Building2 } from 'lucide-react';

interface PersuasiveLandingPageProps {
  onReserveClick: () => void;
  lots: any[];
  setIsMenuOpen: (open: boolean) => void;
  setCurrentScreen: (screen: string) => void;
}

export function PersuasiveLandingPage({ onReserveClick, lots, setIsMenuOpen, setCurrentScreen }: PersuasiveLandingPageProps) {
  const availableCount = lots.filter((l) => l.status === 'AVAILABLE').length;
  const totalCount = lots.length;
  const sellRate = totalCount > 0 ? Math.round(((totalCount - availableCount) / totalCount) * 100) : 0;

  const advantages = [
    { icon: Home, title: "Terrain Constructible", description: "Terrain viabilisé et prêt à construire" },
    { icon: Zap, title: "Électricité", description: "Réseau électrique moderne installé" },
    { icon: Droplet, title: "Eau Potable", description: "Adduction d'eau courante garantie" },
    { icon: ShieldCheck, title: "Sécurité", description: "Quartier sécurisé 24h/24" },
    { icon: Wrench, title: "Routes Pavées", description: "Voies d'accès goudronnées" },
    { icon: Users, title: "Communauté", description: "Un voisinage discipliné et unie" },
  ];

  const whyChooseUs = [
    { icon: TrendingUp, title: "Valorisation", description: "Votre terrain prend de la valeur rapidement" },
    { icon: Clock, title: "Immédiat", description: "Terrain disponible sans attente" },
    { icon: Award, title: "Titre Foncier", description: "Documentation légale garantie" },
    { icon: Star, title: "Localisation", description: "À proximité des commodités" },
  ];

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#8B5E3C] rounded-full flex items-center justify-center">
            <Building2 className="text-white h-5 w-5" />
          </div>
          <h1 className="text-xl font-extrabold text-[#8B5E3C]">KAMI-EXTENSION</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)}>
          <Menu className="h-6 w-6 text-gray-700" />
        </Button>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#8B5E3C] via-[#A67C52] to-[#8B5E3C] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItMiAyLTRzLTItMi00IDJjMCAyIDIgMiA0IDJzMi0yIDItNHptMC0yYzAgMiAyIDIgNCAycy0yIDItNCAyYzAtMi0yLTItNC0ycy0yIDItMiA0em0wLTIgMGMwIDItMiAyLTQgMnMtMi0yLTItNGMwIDIgMiAyIDQgMnMyLTItMi00em0wLTJjMC0yLTItMi00LTJzLTItMi00IDJjMCAyIDI 2 4 2sMi0yIDItNHptMC0yYzAgMiAyIDIgNCAycy0yIDItNCAyYzAtMi0yLTItNC0ycy0yIDItMiA0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

        <div className="relative z-10 container mx-auto px-6 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <span className="flex h-2 w-2 relative mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-medium">
                {availableCount} lots disponibles • {sellRate}% déjà réservés
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
              Devenez Propriétaire d'un Terrain à <span className="text-[#10B981]">KAMI</span>
            </h1>

            <p className="text-lg md:text-xl opacity-90 mb-6 leading-relaxed">
              Le nouveau quartier moderne, propre et discipliné de Kami.
              <br className="hidden md:block" />
              Réservez votre lot dès maintenant à partir de 100 000 FCFA !
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
              <Button
                onClick={onReserveClick}
                className="bg-[#10B981] hover:bg-[#059669] text-white font-bold py-5 px-8 rounded-full text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all"
              >
                <Home className="mr-2 h-5 w-5" />
                Réserver Mon Lot
              </Button>
              <Button
                onClick={() => setCurrentScreen('map')}
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 font-bold py-5 px-8 rounded-full text-lg backdrop-blur-sm"
              >
                <Map className="mr-2 h-5 w-5" />
                Voir le Plan
              </Button>
            </div>

            <p className="text-xs opacity-75">
              ✓ Paiement flexible à partir de 10 000 FCFA • ✓ Titre foncier garanti
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Pricing Summary */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Tarifs Exclusifs
            </h2>
            <p className="text-gray-600 text-sm">
              Découvrez les offres détaillées dans le menu
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Resident Card - Simplified */}
            <Card className="border-2 border-[#10B981] bg-white shadow-md">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Résident KAMI</h3>
                <div className="mb-4">
                  <span className="text-3xl font-extrabold text-[#10B981]">100 000</span>
                  <span className="text-gray-600 text-lg"> FCFA</span>
                </div>
                <p className="text-xs text-gray-500 mb-4">Prix préférentiel</p>
                <Button
                  onClick={onReserveClick}
                  className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold py-3 rounded-lg text-sm"
                >
                  Réserver
                </Button>
              </CardContent>
            </Card>

            {/* Non-Resident Card - Simplified */}
            <Card className="border-2 border-[#8B5E3C] bg-white shadow-md">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Non-Résident</h3>
                <div className="mb-4">
                  <span className="text-3xl font-extrabold text-[#8B5E3C]">150 000</span>
                  <span className="text-gray-600 text-lg"> FCFA</span>
                </div>
                <p className="text-xs text-gray-500 mb-4">Tarif standard</p>
                <Button
                  onClick={onReserveClick}
                  className="w-full bg-[#8B5E3C] hover:bg-[#6B472C] text-white font-bold py-3 rounded-lg text-sm"
                >
                  Réserver
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Advantages - Simplified */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Avantages Inclus
            </h2>
            <p className="text-gray-600 text-sm">
              Voir tous les détails dans le menu
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
            {advantages.slice(0, 6).map((advantage, index) => {
              const Icon = advantage.icon;
              return (
                <Card key={index} className="border-0 shadow-sm">
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 ${
                      index % 2 === 0 ? 'bg-emerald-100' : 'bg-blue-100'
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        index % 2 === 0 ? 'text-emerald-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 mb-1">{advantage.title}</h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="text-center mt-6">
            <Button
              variant="outline"
              onClick={() => setIsMenuOpen(true)}
              className="border-[#8B5E3C] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white"
            >
              Voir plus dans le menu
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Simplified */}
      <section className="py-10 bg-gradient-to-br from-[#8B5E3C] to-[#A67C52] text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">
              Pourquoi KAMI-EXTENSION ?
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {whyChooseUs.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-bold mb-1">{item.title}</h3>
                  <p className="text-xs opacity-80">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section - Simplified */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-6">
          <Card className="max-w-3xl mx-auto bg-gradient-to-r from-[#10B981] to-[#059669] border-0 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-3">
                Prêt à devenir propriétaire ?
              </h2>
              <p className="text-lg opacity-90 mb-6">
                {availableCount} lots disponibles
              </p>
              <Button
                onClick={onReserveClick}
                size="lg"
                className="bg-white text-[#10B981] hover:bg-gray-100 font-bold py-4 px-10 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all"
              >
                <Home className="mr-2 h-5 w-5" />
                Réserver Mon Lot
              </Button>
              <p className="text-xs mt-4 opacity-80">
                ✓ Paiement flexible • ✓ Titre foncier • ✓ Support client
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
