import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Map, CheckCircle, Home, Zap, Droplet, ShieldCheck, Users, TrendingUp, Clock, Award, Star, Wrench } from 'lucide-react';

interface PersuasiveLandingPageProps {
  onReserveClick: () => void;
  lots: any[];
}

export function PersuasiveLandingPage({ onReserveClick, lots }: PersuasiveLandingPageProps) {
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
    { icon: TrendingUp, title: "Valorisation Rapide", description: "Votre terrain prend de la valeur rapidement" },
    { icon: Clock, title: "Immédiat", description: "Terrain disponible sans attente" },
    { icon: Award, title: "Titre Foncier", description: "Documentation légale garantie" },
    { icon: Star, title: "Localisation Idéale", description: "À proximité des commodités" },
  ];

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#8B5E3C] via-[#A67C52] to-[#8B5E3C] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItMiAyLTRzLTItMi00IDJjMCAyIDIgMiA0IDJzMi0yIDItNHptMC0yYzAgMiAyIDIgNCAycy0yIDItNCAyYzAtMi0yLTItNC0ycy0yIDItMiA0em0wLTIgMGMwIDItMiAyLTQgMnMtMi0yLTItNGMwIDIgMiAyIDQgMnMyLTItMi00em0wLTJjMC0yLTItMi00LTJzLTItMi00IDJjMCAyIDIgMiA0IDJzMi0yIDItNHptMC0yYzAgMiAyIDIgNCAycy0yIDItNCAyYzAtMi0yLTItNC0ycy0yIDItMiA0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        
        <div className="relative z-10 container mx-auto px-6 py-12 md:py-20">
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
            
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              Devenez Propriétaire d'un Terrain à <span className="text-[#10B981]">KAMI</span>
            </h1>
            
            <p className="text-xl md:text-2xl opacity-90 mb-8 leading-relaxed">
              Le nouveau quartier moderne, propre et discipliné de Kami. 
              <br className="hidden md:block" />
              Réservez votre lot dès maintenant à partir de 100 000 FCFA !
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button
                onClick={onReserveClick}
                className="bg-[#10B981] hover:bg-[#059669] text-white font-bold py-6 px-10 rounded-full text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all"
              >
                <Home className="mr-3 h-6 w-6" />
                Réserver Mon Lot
              </Button>
              <Button
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 font-bold py-6 px-10 rounded-full text-lg backdrop-blur-sm"
              >
                <Map className="mr-3 h-6 w-6" />
                Voir le Plan
              </Button>
            </div>

            <p className="text-sm opacity-75">
              ✓ Paiement flexible à partir de 10 000 FCFA • ✓ Titre foncier garanti • ✓ Livraison immédiate
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Choisissez Votre Statut
            </h2>
            <p className="text-gray-600 text-lg">
              Des prix adaptés à votre situation
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Resident Card */}
            <Card className="border-2 border-[#10B981] bg-white shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="h-8 w-8 text-[#10B981]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Résident de KAMI</h3>
                <div className="mb-6">
                  <span className="text-5xl font-extrabold text-[#10B981]">100 000</span>
                  <span className="text-gray-600 text-xl"> FCFA</span>
                </div>
                <ul className="space-y-3 mb-6 text-left">
                  {[
                    "Prix préférentiel réservé aux résidents",
                    "Paiement en plusieurs tranches possible",
                    "Accès prioritaire aux nouveaux blocs",
                    "Support personnalisé"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-[#10B981] mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={onReserveClick}
                  className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold py-4 rounded-xl"
                >
                  Réserver en tant que Résident
                </Button>
              </CardContent>
            </Card>

            {/* Non-Resident Card */}
            <Card className="border-2 border-[#8B5E3C] bg-white shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-[#8B5E3C]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Non-Résident</h3>
                <div className="mb-6">
                  <span className="text-5xl font-extrabold text-[#8B5E3C]">150 000</span>
                  <span className="text-gray-600 text-xl"> FCFA</span>
                </div>
                <ul className="space-y-3 mb-6 text-left">
                  {[
                    "Terrain constructible viabilisé",
                    "Paiement flexible disponible",
                    "Documentation complète incluse",
                    "Support dédié"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-[#8B5E3C] mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={onReserveClick}
                  className="w-full bg-[#8B5E3C] hover:bg-[#6B472C] text-white font-bold py-4 rounded-xl"
                >
                  Réserver en tant que Non-Résident
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Ce Que Vous Obtenez
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Chaque lot KAMI-EXTENSION est livré avec tous les services essentiels
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon;
              return (
                <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                      index % 2 === 0 ? 'bg-emerald-100' : 'bg-blue-100'
                    }`}>
                      <Icon className={`h-7 w-7 ${
                        index % 2 === 0 ? 'text-emerald-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{advantage.title}</h3>
                    <p className="text-gray-600 text-sm">{advantage.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gradient-to-br from-[#8B5E3C] to-[#A67C52] text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pourquoi Choisir KAMI-EXTENSION ?
            </h2>
            <p className="opacity-90 text-lg">
              Une opportunité d'investissement unique
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {whyChooseUs.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm opacity-80">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-[#10B981] to-[#059669] border-0 text-white">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ne Ratez Pas Cette Opportunité !
              </h2>
              <p className="text-xl opacity-90 mb-8">
                {availableCount} lots encore disponibles. Réservez le vôtre maintenant !
              </p>
              <Button
                onClick={onReserveClick}
                size="lg"
                className="bg-white text-[#10B981] hover:bg-gray-100 font-bold py-6 px-12 rounded-full text-xl shadow-2xl transform hover:scale-105 transition-all"
              >
                <Home className="mr-3 h-6 w-6" />
                Réserver Mon Lot Maintenant
              </Button>
              <p className="text-sm mt-6 opacity-80">
                ✓ Sans engagement • ✓ Paiement sécurisé • ✓ Support client 7j/7
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
