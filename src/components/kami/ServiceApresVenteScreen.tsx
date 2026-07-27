'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowLeft,
  Menu,
  Headset,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  ChevronDown,
  HelpCircle,
  Wrench,
  FileText,
  Wallet,
  AlertCircle,
  Zap,
  Droplets,
  Hammer,
  Paintbrush,
  Grid3X3,
  PaintBucket,
  HardHat,
  ChevronUp,
  UserCheck,
} from 'lucide-react';
import { toast } from 'sonner';

interface ServiceApresVenteScreenProps {
  onBack: () => void;
  setIsMenuOpen?: (open: boolean) => void;
  onLoginClick?: () => void;
}

// Informations de contact du service après-vente
// (à ajuster par l'administrateur selon les coordonnées réelles)
const SAV_CONTACTS = {
  phone: '+225 27 22 49 00 00',
  phoneHref: 'tel:+2252722490000',
  whatsapp: '+225 07 58 42 10 00',
  whatsappHref: 'https://wa.me/2250758421000',
  email: 'sav@kami-extension.com',
  emailHref: 'mailto:sav@kami-extension.com',
};

const SAV_HORAIRES = [
  { day: 'Lundi - Vendredi', hours: '08h00 - 18h00' },
  { day: 'Samedi', hours: '09h00 - 13h00' },
  { day: 'Dimanche & jours fériés', hours: 'Fermé' },
];

const SAV_FAQ = [
  {
    question: 'Comment suivre l\'avancée de mon paiement ?',
    answer:
      'Connectez-vous à votre compte, puis rendez-vous dans « Mes réservations ». Vous y verrez le montant total, les paiements déjà validés et le reste à payer pour chaque lot.',
  },
  {
    question: 'Quels sont les moyens de paiement acceptés ?',
    answer:
      'Nous acceptons Wave, Orange Money, Moov Money et MTN Money. Le paiement automatique en ligne est en cours de déploiement ; en attendant, contactez le service après-vente pour valider votre paiement manuellement.',
  },
  {
    question: 'Puis-je visiter mon lot avant de payer ?',
    answer:
      'Oui. Contactez le service après-vente pour convenir d\'une visite guidée du site avec un de nos conseillers.',
  },
  {
    question: 'Quand recevrai-je mes documents de propriété ?',
    answer:
      'Après le paiement intégral du lot, les documents sont préparés sous 15 à 30 jours. Vous serez notifié par message dès qu\'ils seront disponibles au retrait.',
  },
  {
    question: 'Que faire si j\'ai un litige ou une réclamation ?',
    answer:
      'Adressez votre réclamation par email au service après-vente ou via WhatsApp. Un conseiller vous recontactera sous 48h ouvrées avec un accusé de réception et un numéro de ticket.',
  },
];

const SAV_EXPERTS = [
  {
    id: 'electricien',
    title: 'Électricien',
    subtitle: 'Réalise l\'installation électrique complète de votre habitation, la mise aux normes NFC et le dépannage en cas de panne.',
    icon: Zap,
    color: '#F59E0B',
  },
  {
    id: 'plombier',
    title: 'Plombier',
    subtitle: 'Prend en charge l\'alimentation en eau, l\'installation sanitaire, les évacuations et la réparation de fuites.',
    icon: Droplets,
    color: '#3B82F6',
  },
  {
    id: 'macon',
    title: 'Maçon',
    subtitle: 'Construit les fondations, élève les murs, réalise la dalle et tous les travaux en gros œuvre de votre maison.',
    icon: Hammer,
    color: '#EF4444',
  },
  {
    id: 'menuisier',
    title: 'Menuisier',
    subtitle: 'Fabrique et pose les portes, fenêtres, volets, placards et tout agencement sur mesure en bois ou dérivé.',
    icon: Paintbrush,
    color: '#8B5E3C',
  },
  {
    id: 'carreleur',
    title: 'Carreleur',
    subtitle: 'Pose le carrelage au sol et la faïence murale dans vos pièces, salles de bain et cuisines avec une finition soignée.',
    icon: Grid3X3,
    color: '#6366F1',
  },
  {
    id: 'peintre',
    title: 'Peintre',
    subtitle: 'Assure la peinture intérieure et extérieure de votre habitation : préparation des supports, finitions et décoration.',
    icon: PaintBucket,
    color: '#10B981',
  },
  {
    id: 'conducteur_travaux',
    title: 'Conducteur de travaux',
    subtitle: 'Supervise et coordonne l\'ensemble de votre chantier de A à Z en respectant le budget et les délais convenus.',
    icon: HardHat,
    color: '#0EA5E9',
  },
  {
    id: 'geometre',
    title: 'Géomètre',
    subtitle: 'Réalise le bornage, la topographie et la délimitation précise de votre terrain pour sécuriser votre propriété.',
    icon: UserCheck,
    color: '#D946EF',
  },
];

const SAV_SERVICES = [
  {
    icon: Wallet,
    title: 'Suivi des paiements',
    description: 'Consultez vos versements et solde restant à payer.',
    color: '#10B981',
  },
  {
    icon: FileText,
    title: 'Documents & attestations',
    description: 'Retrait de reçus, attestations de paiement et titres.',
    color: '#3B82F6',
  },
  {
    icon: Wrench,
    title: 'Réclamations & litiges',
    description: 'Signalez un problème, nous ouvrons un ticket suivi.',
    color: '#F59E0B',
  },
  {
    icon: AlertCircle,
    title: 'Assistance technique',
    description: 'Questions sur votre lot, bornage, raccordements.',
    color: '#EF4444',
  },
];

export function ServiceApresVenteScreen({
  onBack,
  setIsMenuOpen,
  onLoginClick,
}: ServiceApresVenteScreenProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showExperts, setShowExperts] = useState(false);

  const handleRequestExpert = (expertTitle: string) => {
    toast.info(
      `Votre demande de mise en relation avec un ${expertTitle} a été envoyée. Notre service après-vente vous contactera sous 24h.`,
      { duration: 5000 }
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-background min-h-screen">
      {/* Header */}
      <header className="flex items-center gap-2 px-3 py-2 bg-card border-b border-border shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="hover:bg-emerald-50 dark:hover:bg-emerald-950/30 h-9 w-9"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Button>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex items-center justify-center shrink-0">
            <Headset className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-bold text-foreground leading-tight truncate">
              Service après-vente
            </h1>
            <p className="text-[11px] text-muted-foreground leading-tight">
              Nous sommes à votre écoute
            </p>
          </div>
        </div>
        {setIsMenuOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(true)}
            className="hover:bg-emerald-50 dark:hover:bg-emerald-950/30 h-9 w-9"
          >
            <Menu className="h-5 w-5 text-foreground" />
          </Button>
        )}
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto w-full p-4 space-y-5">
          {/* Hero */}
          <Card className="border-emerald-200 dark:border-emerald-900/50 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-card overflow-hidden">
            <CardContent className="p-5 text-center">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30">
                <Headset className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-lg font-bold text-foreground mb-1">
                Besoin d&apos;aide ?
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                Notre équipe vous accompagne pour vos paiements, vos documents
                et toutes vos questions concernant votre lot.
              </p>
            </CardContent>
          </Card>

          {/* Méthodes de contact rapides */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-2.5 px-1">
              Contactez-nous
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Téléphone */}
              <a
                href={SAV_CONTACTS.phoneHref}
                className="block group"
              >
                <Card className="border-2 border-border cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 hover:border-emerald-400 h-full">
                  <CardContent className="p-3.5 flex flex-col items-center text-center gap-1.5">
                    <div className="w-11 h-11 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Phone className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-xs font-bold text-foreground">Appeler</p>
                    <p className="text-[10px] text-muted-foreground leading-tight break-all">
                      {SAV_CONTACTS.phone}
                    </p>
                  </CardContent>
                </Card>
              </a>

              {/* WhatsApp */}
              <a
                href={SAV_CONTACTS.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <Card className="border-2 border-border cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 hover:border-green-500 h-full">
                  <CardContent className="p-3.5 flex flex-col items-center text-center gap-1.5">
                    <div className="w-11 h-11 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-xs font-bold text-foreground">WhatsApp</p>
                    <p className="text-[10px] text-muted-foreground leading-tight break-all">
                      {SAV_CONTACTS.whatsapp}
                    </p>
                  </CardContent>
                </Card>
              </a>

              {/* Email */}
              <a
                href={SAV_CONTACTS.emailHref}
                className="block group"
              >
                <Card className="border-2 border-border cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 hover:border-blue-400 h-full">
                  <CardContent className="p-3.5 flex flex-col items-center text-center gap-1.5">
                    <div className="w-11 h-11 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-xs font-bold text-foreground">Écrire</p>
                    <p className="text-[10px] text-muted-foreground leading-tight break-all">
                      {SAV_CONTACTS.email}
                    </p>
                  </CardContent>
                </Card>
              </a>
            </div>
          </div>

          {/* Nos services */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-2.5 px-1">
              Nos services
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SAV_SERVICES.map((service) => {
                const Icon = service.icon;
                return (
                  <Card key={service.title} className="border-border">
                    <CardContent className="p-3.5 flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${service.color}1A` }}
                      >
                        <Icon
                          className="h-5 w-5"
                          style={{ color: service.color }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground mb-0.5">
                          {service.title}
                        </p>
                        <p className="text-xs text-muted-foreground leading-snug">
                          {service.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Besoin d’un expert pour votre projet ? */}
          <Card className="border-amber-200 dark:border-amber-900/50 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-card overflow-hidden">
            <CardContent className="p-4 text-center">
              <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/40 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-200/50 dark:shadow-amber-900/30">
                <HardHat className="h-7 w-7 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1">
                Besoin d&apos;un expert pour votre projet ?
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed mb-3">
                Choisissez l&apos;un de nos partenaires qualifiés et nous vous
                mettrons en relation rapidement.
              </p>
              <Button
                onClick={() => setShowExperts(!showExperts)}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold w-full shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02]"
              >
                {showExperts ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-2" />
                    Masquer les experts
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Voir nos experts disponibles
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Grille des experts */}
          {showExperts && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 px-1">
                <HardHat className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <h3 className="text-sm font-bold text-foreground">
                  Nos partenaires qualifiés
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SAV_EXPERTS.map((expert) => {
                  const Icon = expert.icon;
                  return (
                    <Card
                      key={expert.id}
                      className={`border-2 border-border cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 group`}
                      style={{
                        ['--hover-color' as string]: expert.color,
                      }}
                      onClick={() => handleRequestExpert(expert.title)}
                    >
                      <CardContent className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                            style={{
                              backgroundColor: `${expert.color}18`,
                            }}
                          >
                            <Icon
                              className="h-5 w-5"
                              style={{ color: expert.color }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-sm font-bold leading-tight"
                              style={{ color: expert.color }}
                            >
                              Je sollicite un {expert.title.toLowerCase()}
                            </p>
                            <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">
                              {expert.subtitle}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50">
                <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Délai de mise en relation : <strong className="text-foreground">sous 24h</strong> ouvrées.
                  Nos partenaires sont sélectionnés pour leur professionnalisme et leur expérience
                  dans la construction en Côte d&apos;Ivoire.
                </p>
              </div>
            </div>
          )}

          {/* Horaires */}
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-foreground">
                  Horaires d&apos;ouverture
                </h3>
              </div>
              <div className="space-y-2">
                {SAV_HORAIRES.map((h) => (
                  <div
                    key={h.day}
                    className="flex justify-between items-center text-xs py-1.5 border-b border-border last:border-0"
                  >
                    <span className="text-muted-foreground font-medium">
                      {h.day}
                    </span>
                    <span
                      className={
                        h.hours === 'Fermé'
                          ? 'text-red-500 font-bold'
                          : 'text-foreground font-bold'
                      }
                    >
                      {h.hours}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <div>
            <div className="flex items-center gap-2 mb-2.5 px-1">
              <HelpCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-foreground">
                Questions fréquentes
              </h3>
            </div>
            <div className="space-y-2">
              {SAV_FAQ.map((item, index) => {
                const isOpen = openFaq === index;
                return (
                  <Card
                    key={index}
                    className={`border-border transition-all ${
                      isOpen ? 'border-emerald-300 dark:border-emerald-800' : ''
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full text-left p-3.5 flex items-center justify-between gap-3"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm font-bold text-foreground flex-1">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-3.5 pb-3.5 -mt-1">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>

          {/* CTA : se connecter pour suivre sa demande */}
          {onLoginClick && (
            <Card className="border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20">
              <CardContent className="p-4 text-center">
                <p className="text-sm font-bold text-foreground mb-1">
                  Déjà client ?
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  Connectez-vous pour suivre vos demandes et l&apos;avancée de
                  vos paiements en temps réel.
                </p>
                <Button
                  onClick={onLoginClick}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold w-full"
                >
                  Se connecter à mon espace
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Note de bas de page */}
          <div className="text-center pb-2 pt-1">
            <p className="text-[11px] text-muted-foreground">
              KAMI-EXTENSION · Service après-vente à votre service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
