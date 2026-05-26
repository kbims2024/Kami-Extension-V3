import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Menu, Map, CheckCircle, Home, Zap, Droplet, ShieldCheck, Users, TrendingUp, Clock, Award, Star, Wrench, Building2, ArrowRight } from 'lucide-react';

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
    { icon: Home, title: "Terrain Constructible", value: "100%" },
    { icon: Zap, title: "Électricité", value: "Oui" },
    { icon: Droplet, title: "Eau Potable", value: "Oui" },
    { icon: ShieldCheck, title: "Sécurité", value: "24/7" },
  ];

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-white sticky top-0 z-20 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#8B5E3C] to-[#A67C52] rounded-xl flex items-center justify-center shadow-sm">
            <Building2 className="text-white h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">KAMI-EXTENSION</h1>
            <p className="text-xs text-gray-500">Devenez propriétaire</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMenuOpen(true)}
          className="hover:bg-gray-100"
        >
          <Menu className="h-6 w-6 text-gray-700" />
        </Button>
      </header>

      {/* Hero Section - Modern Design */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L2c+PC9zdmc+')] opacity-50" />

        <div className="relative z-10 container mx-auto px-6 py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-6">
              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse" />
              <span className="text-sm font-medium">
                {availableCount} lots disponibles
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Construisez votre
              <span className="text-emerald-400 block">avenir à KAMI</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
              Le nouveau quartier moderne et discipliné. Réservez votre terrain dès maintenant à partir de
              <span className="text-white font-semibold"> 100 000 FCFA</span>.
            </p>

            {/* Stats */}
            <div className="flex gap-8 mb-8">
              <div>
                <p className="text-3xl font-bold text-white">{availableCount}</p>
                <p className="text-sm text-gray-400">Lots disponibles</p>
              </div>
              <div className="w-px bg-gray-700" />
              <div>
                <p className="text-3xl font-bold text-white">{sellRate}%</p>
                <p className="text-sm text-gray-400">Déjà réservés</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={onReserveClick}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 px-8 rounded-xl text-base shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all"
              >
                Réserver mon terrain
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={() => setCurrentScreen('map')}
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 font-semibold py-4 px-8 rounded-xl text-base backdrop-blur-sm transition-all"
              >
                <Map className="mr-2 h-5 w-5" />
                Voir le plan
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Pricing Cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Choisissez votre offre
            </h2>
            <p className="text-gray-600">
              Des tarifs adaptés à votre situation
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Resident Card */}
            <Card className="border-2 border-emerald-500 bg-white shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Résident KAMI</h3>
                    <p className="text-sm text-gray-500">Prix préférentiel</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Home className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-emerald-600">100 000</span>
                  <span className="text-xl text-gray-600 ml-1">FCFA</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    "Prix réservé aux résidents",
                    "Paiement en tranches",
                    "Support personnalisé",
                    "Accès prioritaire"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mr-3 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={onReserveClick}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl"
                >
                  Choisir cette offre
                </Button>
              </CardContent>
            </Card>

            {/* Non-Resident Card */}
            <Card className="border-2 border-gray-200 bg-white shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Non-Résident</h3>
                    <p className="text-sm text-gray-500">Tarif standard</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-orange-600">150 000</span>
                  <span className="text-xl text-gray-600 ml-1">FCFA</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    "Terrain viabilisé",
                    "Paiement flexible",
                    "Documentation complète",
                    "Support dédié"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-orange-500 mr-3 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={onReserveClick}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-xl"
                >
                  Choisir cette offre
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Tout est inclus
            </h2>
            <p className="text-gray-600">
              Votre terrain est livré avec tous les services essentiels
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon;
              return (
                <Card key={index} className="border-0 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-7 w-7 text-gray-700" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{advantage.title}</h3>
                    <p className="text-sm text-gray-500">{advantage.value}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Pourquoi choisir KAMI-EXTENSION ?
            </h2>

            <div className="space-y-4">
              {[
                { icon: TrendingUp, title: "Valorisation rapide", desc: "Votre terrain prend de la valeur rapidement" },
                { icon: Award, title: "Titre foncier garanti", desc: "Documentation légale complète et sécurisée" },
                { icon: Clock, title: "Disponibilité immédiate", desc: "Aucune attente, votre terrain est prêt" },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <Card key={index} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à devenir propriétaire ?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Ne manquez pas cette opportunité unique
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={onReserveClick}
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 px-10 rounded-xl text-lg shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all"
              >
                Réserver maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={() => setIsMenuOpen(true)}
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 font-semibold py-4 px-10 rounded-xl text-lg backdrop-blur-sm transition-all"
              >
                En savoir plus
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
