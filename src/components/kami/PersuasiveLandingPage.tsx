'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { FlashInfoBand } from '@/components/flash-info-band';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Menu, Map, CheckCircle, Home, Zap, Droplet, ShieldCheck, Users, TrendingUp, Clock, Award, Wrench, Building2, ArrowRight, ChevronRight, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

interface PersuasiveLandingPageProps {
  onReserveClick: () => void;
  lots: any[];
  setIsMenuOpen: (open: boolean) => void;
  setCurrentScreen: (screen: string) => void;
}

export function PersuasiveLandingPage({ onReserveClick, lots, setIsMenuOpen, setCurrentScreen }: PersuasiveLandingPageProps) {
  const { theme } = useTheme();
  const availableCount = lots.filter((l) => l.status === 'AVAILABLE').length;
  const reservedCount = lots.filter((l) => l.status === 'RESERVED').length;
  const paidCount = lots.filter((l) => l.status === 'PAID').length;
  const totalCount = lots.length;
  const reservedRate = totalCount > 0 ? Math.round((reservedCount / totalCount) * 100) : 0;
  const purchasedRate = totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 0;
  const [animatedNumbers, setAnimatedNumbers] = useState({ available: 0, reservedRate: 0, purchasedRate: 0 });
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);

  const handleViewPlan = () => {
    setCurrentScreen('plan');
  };

  // Animation des nombres
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedNumbers({
        available: Math.floor(availableCount * easeOut),
        reservedRate: Math.floor(reservedRate * easeOut),
        purchasedRate: Math.floor(purchasedRate * easeOut),
      });

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [availableCount, reservedRate, purchasedRate]);

  const advantages = [
    { icon: Home, title: "Terrain Constructible", desc: "Terrain viabilisé prêt à bâtir" },
    { icon: Zap, title: "Électricité", desc: "Réseau moderne installé" },
    { icon: Droplet, title: "Eau Potable", desc: "Adduction garantie" },
    { icon: ShieldCheck, title: "Sécurité", desc: "Quartier surveillé 24h/24" },
    { icon: Wrench, title: "Routes Pavées", desc: "Voies goudronnées" },
    { icon: Users, title: "Communauté", desc: "Voisinage unie" },
  ];

  const essentialServices = [
    {
      icon: Zap,
      title: "Électricité",
      desc: "Réseau électrique moderne et fiable, alimenté par SODECI. Transformateurs installés avec capacité suffisante pour tous les lots.",
      features: ["Alimentation continue", "Compteurs individuels", "Normes de sécurité", "Maintenance incluse"]
    },
    {
      icon: Droplet,
      title: "Eau Potable",
      desc: "Adduction d'eau potable via SODECI. Chaque lot dispose d'un branchement individuel avec compteur.",
      features: ["Eau potable 24h/24", "Branchement individuel", "Normes sanitaires", "Système de purification"]
    },
    {
      icon: ShieldCheck,
      title: "Sécurité",
      desc: "Quartier surveillé 24h/24 par une équipe de sécurité professionnelle et un système de surveillance moderne.",
      features: ["Gardiennage 24h/24", "Caméras de surveillance", "Éclairage public", "Contrôle d'accès"]
    }
  ];

  const features = [
    { number: "01", title: "Inscription Gratuite", desc: "Créez votre compte en quelques secondes sans frais" },
    { number: "02", title: "Choisissez Votre Lot", desc: "Sélectionnez parmi les terrains disponibles" },
    { number: "03", title: "Paiement Flexible", desc: "Payez selon vos possibilités, dès 10 000 FCFA" },
    { number: "04", title: "Devenez Propriétaire", desc: "Obtenez votre titre foncier et construisez" },
  ];

  return (
    <div className="flex-1 flex flex-col bg-background overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 dark:bg-background/90 backdrop-blur-md border-b border-border transition-all duration-300">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-brand-blue/30">
                <Building2 className="text-white h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground leading-tight">KAMI-EXTENSION</h1>
                <p className="text-xs text-muted-foreground">Devenez propriétaire</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button
                variant="ghost"
                onClick={() => setIsMenuOpen(true)}
                className="hover:bg-blue-50 dark:hover:bg-blue-950 text-foreground hidden md:flex"
              >
                Menu
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(true)}
                className="hover:bg-blue-50 dark:hover:bg-blue-950 md:hidden"
              >
                <Menu className="h-6 w-6" />
              </Button>
              <Button
                onClick={onReserveClick}
                className="bg-brand-yellow hover:bg-brand-yellow-hover text-gray-900 font-semibold px-6 py-2 rounded-xl shadow-lg hidden md:flex transition-all hover:scale-105"
              >
                Réserver
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Flash Info Band - Under header */}
      <div className="fixed top-[73px] left-0 right-0 z-40">
        <FlashInfoBand />
      </div>

      {/* Hero Section */}
      <section className="relative flex flex-col justify-center bg-gradient-to-br from-brand-blue via-blue-700 to-brand-blue text-white overflow-hidden" style={{ minHeight: 'calc(100vh - 73px)' }}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-5 w-48 h-48 bg-yellow-400/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-5 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 flex-1 flex flex-col justify-center">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center bg-yellow-400/10 border border-yellow-400/30 px-4 md:px-4 py-2 rounded-full mb-5 md:mb-6">
              <div className="w-2 h-2 md:w-2 md:h-2 bg-yellow-400 rounded-full mr-2 animate-pulse" />
              <span className="text-sm md:text-sm font-medium text-yellow-300">
                Opportunité unique à KAMI
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
              Construisez Votre
              <span className="text-yellow-400 block">Avenir à KAMI</span>
            </h1>

            {/* Subtitle - separated */}
            <div className="text-base md:text-xl lg:text-2xl text-blue-100 mb-2 leading-relaxed max-w-2xl mx-auto">
              Le nouveau village moderne.
            </div>
            <div className="text-base md:text-xl lg:text-2xl text-blue-100 pb-2 leading-relaxed max-w-2xl mx-auto">
              Réservez votre terrain.
            </div>

            {/* Stats */}
            <div className="flex flex-row gap-2 md:gap-8 justify-center mb-5 md:mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl px-3 md:px-8 py-2 md:py-6 border border-white/20 flex-1">
                <p className="text-xl md:text-4xl font-bold text-yellow-400">{animatedNumbers.available}</p>
                <p className="text-[10px] md:text-sm text-blue-200 mt-1">Disponibles</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl px-3 md:px-8 py-2 md:py-6 border border-white/20 flex-1">
                <p className="text-xl md:text-4xl font-bold text-yellow-400">{animatedNumbers.reservedRate}%</p>
                <p className="text-[10px] md:text-sm text-blue-200 mt-1">Réservés</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl px-3 md:px-8 py-2 md:py-6 border border-white/20 flex-1">
                <p className="text-xl md:text-4xl font-bold text-yellow-400">{animatedNumbers.purchasedRate}%</p>
                <p className="text-[10px] md:text-sm text-blue-200 mt-1">Achetés</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Button
                onClick={onReserveClick}
                className="bg-yellow-400 dark:bg-yellow-500 hover:bg-yellow-500 dark:hover:bg-yellow-600 text-gray-900 dark:text-gray-900 font-bold py-3 md:py-4 px-8 md:px-10 rounded-lg md:rounded-xl text-base md:text-lg shadow-2xl shadow-yellow-400/40 dark:shadow-yellow-400/30 transition-all hover:scale-105 hover:shadow-yellow-400/50"
              >
                Réserver mon terrain
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={handleViewPlan}
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 font-semibold py-3 md:py-4 px-8 md:px-10 rounded-lg md:rounded-xl text-base md:text-lg backdrop-blur-sm transition-all hover:scale-105"
              >
                <Map className="mr-2 h-5 w-5" />
                Voir le plan
              </Button>
            </div>

            {/* Scroll Indicator - only on desktop */}
            <div className="hidden md:block absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
              <ChevronRight className="h-6 w-6 text-blue-300 rotate-90" />
            </div>
          </div>
        </div>

        {/* Wave Bottom */}
        <div className="hidden md:block absolute bottom-0 left-0 right-0 -mt-4">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-8 md:h-12">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" className="fill-background dark:fill-background"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Un processus simple et transparent pour devenir propriétaire
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <Card className="border-0 bg-card shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-br from-brand-blue to-blue-700 p-6">
                    <span className="text-5xl font-bold text-brand-yellow opacity-50">{feature.number}</span>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-brand-blue transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.desc}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50/50 to-background dark:from-blue-950/30 dark:to-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Tout est inclus
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Votre terrain est livré avec tous les services essentiels
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto mb-8">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon;
              return (
                <Card
                  key={index}
                  className="border-0 bg-card shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 rounded-2xl group"
                >
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand-blue to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-brand-blue/30">
                      <Icon className="h-8 w-8 text-brand-yellow" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{advantage.title}</h3>
                    <p className="text-muted-foreground">{advantage.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Bouton intelligent Électricité, Eau et Sécurité */}
          <div className="max-w-2xl mx-auto mt-12">
            <Button
              onClick={() => setIsServicesModalOpen(true)}
              className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 dark:from-blue-600 dark:via-cyan-600 dark:to-purple-600 hover:from-blue-600 hover:via-cyan-600 hover:to-purple-600 dark:hover:from-blue-700 dark:hover:via-cyan-700 dark:hover:to-purple-700 text-white font-bold py-6 px-8 rounded-2xl text-lg shadow-2xl transition-all hover:scale-105 hover:shadow-lg"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  <span>Électricité</span>
                </div>
                <span className="text-white/50">•</span>
                <div className="flex items-center gap-2">
                  <Droplet className="h-5 w-5" />
                  <span>Eau</span>
                </div>
                <span className="text-white/50">•</span>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  <span>Sécurité</span>
                </div>
                <ChevronRight className="h-5 w-5 ml-2" />
              </div>
            </Button>
            <p className="text-center text-sm text-muted-foreground mt-3">
              Cliquez pour voir les détails des services essentiels inclus
            </p>
          </div>
        </div>
      </section>


      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-brand-blue via-blue-700 to-brand-blue text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Pourquoi choisir KAMI-EXTENSION ?
            </h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto">
              Une opportunité d'investissement unique
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: TrendingUp, title: "Valorisation rapide", desc: "Votre terrain prend de la valeur rapidement avec le développement du quartier" },
              { icon: Award, title: "Titre foncier garanti", desc: "Documentation légale complète et sécurisée pour votre tranquillité" },
              { icon: Clock, title: "Disponibilité immédiate", desc: "Aucune attente, votre terrain est prêt à être construit" },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-yellow-400/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Icon className="h-8 w-8 text-yellow-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-blue-200">{item.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-brand-yellow to-yellow-500 text-gray-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Prêt à devenir propriétaire ?
            </h2>
            <p className="text-xl mb-8 text-gray-800 dark:text-gray-900">
              Ne manquez pas cette opportunité unique. Rejoignez les futurs résidents de KAMI-EXTENSION.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={onReserveClick}
                size="lg"
                className="bg-gray-900 hover:bg-black text-white font-bold py-5 px-12 rounded-xl text-xl shadow-2xl transition-all hover:scale-105"
              >
                Réserver maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={() => setIsMenuOpen(true)}
                variant="outline"
                className="bg-white/20 hover:bg-white/30 text-gray-900 border-2 border-white/40 font-bold py-5 px-12 rounded-xl text-xl backdrop-blur-sm transition-all hover:scale-105"
              >
                En savoir plus
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Modal - Électricité, Eau et Sécurité */}
      <Dialog open={isServicesModalOpen} onOpenChange={setIsServicesModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto m-auto rounded-2xl border-2 shadow-2xl">
          <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10 pb-4 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Services Essentiels Inclus
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsServicesModalOpen(false)}
                className="h-10 w-10"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <p className="text-muted-foreground mt-2">
              Tous les services essentiels sont déjà installés et inclus dans votre terrain
            </p>
          </div>

          <div className="space-y-6">
            {essentialServices.map((service, index) => {
              const Icon = service.icon;
              const colors = [
                'from-yellow-500 to-orange-500 dark:from-yellow-600 dark:to-orange-600',
                'from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600',
                'from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600'
              ];
              const bgColor = [
                'bg-yellow-50 dark:bg-yellow-950/30',
                'bg-blue-50 dark:bg-blue-950/30',
                'bg-purple-50 dark:bg-purple-950/30'
              ];

              return (
                <Card key={index} className={`border-0 shadow-lg ${bgColor[index]}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${colors[index]} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-2">
                          {service.title}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {service.desc}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {service.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                              <span className="text-sm text-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground text-center">
              ✓ Tous ces services sont inclus dans le prix de votre terrain sans frais supplémentaires
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
