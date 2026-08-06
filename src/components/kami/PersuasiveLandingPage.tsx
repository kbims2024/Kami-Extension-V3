'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { FlashInfoBand } from '@/components/flash-info-band';
import { Menu, Map, TrendingUp, Clock, Award, ArrowRight, ChevronRight, Headset, Building2, X } from 'lucide-react';
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { PublicProgressSection } from './PublicProgressSection';

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
  const [heroBackground, setHeroBackground] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isProjectWindowOpen, setIsProjectWindowOpen] = useState(false);

  const btnContainerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  };

  const btnChildVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0 },
  };

  const firstBtnRef = useRef<HTMLDivElement | null>(null);
  const [firstBtnWidth, setFirstBtnWidth] = useState<number | null>(null);

  useLayoutEffect(() => {
    function measure() {
      if (firstBtnRef.current) setFirstBtnWidth(firstBtnRef.current.offsetWidth);
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const handleViewPlan = () => {
    window.location.href = '/view-plan';
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

  // Charger le logo depuis la base
  useEffect(() => {
    const loadLogo = async () => {
      try {
        const response = await fetch('/api/logo');
        if (response.ok) {
          const data = await response.json();
          if (data.imageUrl) setLogoUrl(data.imageUrl);
        }
      } catch (error) {
        console.error('Erreur chargement logo:', error);
      }
    };
    loadLogo();
  }, []);

  // Charger l'image de fond HERO depuis les paramètres
  useEffect(() => {
    const loadHeroImage = async () => {
      try {
        const response = await fetch('/api/admin-files?type=HERO');
        if (response.ok) {
          const data = await response.json();
          if (data.file && data.file.url) {
            setHeroBackground(data.file.url);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'image de fond:', error);
      }
    };
    loadHeroImage();
  }, []);

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
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="KAMI-EXTENSION"
                  className="h-10 w-auto object-contain rounded-xl"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-brand-blue/30">
                  <Building2 className="text-white h-5 w-5" />
                </div>
              )}
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
      <section className="relative flex flex-col overflow-hidden bg-gradient-to-br from-slate-100 via-white to-slate-50 dark:from-brand-blue dark:via-blue-700 dark:to-brand-blue"
        style={{ minHeight: 'calc(100vh - 73px)' }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-5 w-48 h-48 bg-yellow-400/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-5 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 h-full pt-20">
          <div className="max-w-4xl mx-auto text-center w-full flex min-h-[calc(100vh-240px)] flex-col justify-between gap-6 pb-6">

            {/* Badge — HORS de l'image de fond */}
            <div className="inline-flex items-center bg-white/90 dark:bg-slate-900/90 border border-border px-4 md:px-4 py-2 rounded-full mt-14 mb-5 md:mt-16 md:mb-6 text-slate-900 dark:text-white shadow-sm shadow-slate-200/30 dark:shadow-black/40">
              <div className="w-2 h-2 md:w-2 md:h-2 bg-yellow-400 rounded-full mr-2 animate-pulse" />
              <span className="text-sm md:text-sm font-medium text-yellow-300">
                Opportunité unique à KAMI
              </span>
            </div>

            {/* ===== Image de fond : titre + sous-titre uniquement ===== */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={heroBackground ? {
                backgroundImage: `url(${heroBackground})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              } : undefined}
            >
              {heroBackground && (
                <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/55 via-blue-700/55 to-brand-blue/55" />
              )}

              <div className="relative z-10 py-6 md:py-10 px-4 md:px-10">
                {/* Main Heading */}
                <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight text-slate-900 dark:text-white">
                  Construisez Votre
                  <span className="text-yellow-400 block">Avenir à KAMI</span>
                </h1>

                {/* Subtitle */}
                <div className="text-base md:text-xl lg:text-2xl text-slate-900 dark:text-slate-100 leading-relaxed max-w-2xl mx-auto">
                  Le nouveau village moderne.
                </div>
                <div className="text-base md:text-xl lg:text-2xl text-slate-900 dark:text-slate-100 leading-relaxed max-w-2xl mx-auto">
                  Réservez votre lot.
                </div>
              </div>
            </div>

            {/* Stats — hors de l'image de fond (alignés côte à côte) */}
            <div className="flex flex-row gap-2 md:gap-8 justify-center items-center mt-5 md:mt-8 mb-5 md:mb-8 w-full">
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl md:rounded-2xl px-4 md:px-8 py-4 md:py-6 border border-border flex-1 max-w-[320px] text-center">
                <p className="text-xl md:text-4xl font-bold text-yellow-400">{animatedNumbers.available}</p>
                <p className="text-[10px] md:text-sm text-slate-700 dark:text-slate-300 mt-1">Disponibles</p>
              </div>
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl md:rounded-2xl px-4 md:px-8 py-4 md:py-6 border border-border flex-1 max-w-[320px] text-center">
                <p className="text-xl md:text-4xl font-bold text-yellow-400">{animatedNumbers.reservedRate}%</p>
                <p className="text-[10px] md:text-sm text-slate-700 dark:text-slate-300 mt-1">Réservés</p>
              </div>
              <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl md:rounded-2xl px-4 md:px-8 py-4 md:py-6 border border-border flex-1 max-w-[320px] text-center">
                <p className="text-xl md:text-4xl font-bold text-yellow-400">{animatedNumbers.purchasedRate}%</p>
                <p className="text-[10px] md:text-sm text-slate-700 dark:text-slate-300 mt-1">Achetés</p>
              </div>
            </div>

            {/* CTA Buttons — uniform size and shape */}
            <motion.div variants={btnContainerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 md:flex flex-row flex-wrap items-center justify-center gap-3 md:gap-4 w-full">
              <motion.div ref={firstBtnRef} variants={btnChildVariants} className="inline-block">
                <Button
                  onClick={handleViewPlan}
                  className="inline-flex items-center bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 font-semibold py-3 md:py-4 px-6 md:px-8 rounded-lg md:rounded-xl text-sm md:text-base backdrop-blur-sm transition-all"
                >
                  <Map className="mr-2 h-5 w-5" />
                  Voir le plan de lotissement
                </Button>
              </motion.div>

              <motion.div variants={btnChildVariants} className="" style={firstBtnWidth ? { width: firstBtnWidth } : undefined} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
                <Button
                  onClick={onReserveClick}
                  className="w-full bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 dark:from-amber-500 dark:via-orange-500 dark:to-orange-500 text-slate-900 font-bold py-3 md:py-4 px-6 md:px-8 rounded-lg md:rounded-xl text-sm md:text-base shadow-2xl shadow-amber-400/30 dark:shadow-amber-500/30 transition-all"
                >
                  Je réserve mon lot
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>

              <motion.div variants={btnChildVariants} className="" style={firstBtnWidth ? { width: firstBtnWidth } : undefined}>
                <Button
                  onClick={() => setIsProjectWindowOpen(true)}
                  className="w-full bg-slate-900/95 dark:bg-white/10 hover:bg-slate-800 dark:hover:bg-white/20 text-white dark:text-white border border-white/10 font-semibold py-3 md:py-4 px-6 md:px-8 rounded-lg md:rounded-xl text-sm md:text-base backdrop-blur-sm transition-all"
                >
                  <Building2 className="mr-2 h-5 w-5" />
                  Notre village prend vie
                </Button>
              </motion.div>

              <motion.div variants={btnChildVariants} className="" style={firstBtnWidth ? { width: firstBtnWidth } : undefined}>
                <Button
                  onClick={() => setCurrentScreen('sav')}
                  className="w-full bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-lg md:rounded-xl text-sm md:text-base shadow-2xl shadow-emerald-500/40 dark:shadow-emerald-500/30 transition-all"
                >
                  <Headset className="mr-2 h-5 w-5" />
                  Service après-vente
                </Button>
              </motion.div>
            </motion.div>

            {/* Scroll Indicator - only on desktop */}
            <div className="hidden md:block absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
              <ChevronRight className="h-6 w-6 text-blue-300 rotate-90" />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isProjectWindowOpen && (
            <motion.div
              className="fixed inset-0 z-50 bg-slate-950/95 text-white backdrop-blur-sm overflow-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <motion.div
                className="relative mx-auto min-h-screen max-w-[1600px] px-4 py-6 lg:px-10 lg:py-10"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <button
                  type="button"
                  onClick={() => setIsProjectWindowOpen(false)}
                  className="absolute top-5 right-5 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="rounded-3xl border border-white/10 bg-slate-950/95 shadow-2xl shadow-black/40">
                  <PublicProgressSection />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Comment ça marche ?
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Un processus simple et transparent pour devenir propriétaire
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="group animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <Card className="border-0 bg-card shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 rounded-xl overflow-hidden">
                  <div className="bg-gradient-to-br from-brand-blue to-blue-700 p-3">
                    <span className="text-2xl font-bold text-brand-yellow opacity-50">{feature.number}</span>
                  </div>
                  <CardContent className="p-3">
                    <h3 className="text-sm font-bold text-foreground mb-1 group-hover:text-brand-blue transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {feature.desc}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
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
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Pourquoi choisir KAMI-EXTENSION ?
            </h2>
            <p className="text-sm text-blue-200 max-w-xl mx-auto">
              Une opportunité d'investissement unique
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-3xl mx-auto">
            {[
              { icon: TrendingUp, title: "Valorisation rapide", desc: "Votre terrain prend de la valeur rapidement" },
              { icon: Award, title: "Titre foncier garanti", desc: "Documentation légale complète et sécurisée" },
              { icon: Clock, title: "Disponibilité immédiate", desc: "Votre terrain est prêt à être construit" },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <CardContent className="p-3 text-center">
                    <div className="w-10 h-10 bg-yellow-400/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Icon className="h-5 w-5 text-yellow-400" />
                    </div>
                    <h3 className="text-sm font-bold mb-1">{item.title}</h3>
                    <p className="text-xs text-blue-200">{item.desc}</p>
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

    </div>
  );
}
