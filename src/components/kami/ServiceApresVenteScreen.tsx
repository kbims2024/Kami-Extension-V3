'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
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
  Send,
  CheckCircle2,
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
import { motion, AnimatePresence } from 'framer-motion';

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
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [helpSubject, setHelpSubject] = useState('');
  const [helpMessage, setHelpMessage] = useState('');
  const [helpSubmitted, setHelpSubmitted] = useState(false);

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
          {/* Hero — Besoin d'aide ? */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Card
              className="border-emerald-200 dark:border-emerald-900/50 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-card overflow-hidden cursor-pointer"
              onClick={() => setShowHelpDialog(true)}
            >
              <CardContent className="p-5 text-center">
                <motion.div
                  className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30"
                  animate={{
                    boxShadow: [
                      '0 10px 15px -3px rgba(16,185,129,0.2)',
                      '0 10px 25px -3px rgba(16,185,129,0.4)',
                      '0 10px 15px -3px rgba(16,185,129,0.2)',
                    ],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Headset className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </motion.div>
                <h2 className="text-lg font-bold text-foreground mb-1">
                  Besoin d&apos;aide ?
                </h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Notre équipe vous accompagne pour vos paiements, vos documents
                  et toutes vos questions concernant votre lot.
                </p>
                <motion.div
                  className="mt-3"
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-500/25"
                  >
                    <Headset className="h-4 w-4 mr-2" />
                    Obtenir de l&apos;aide maintenant
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ── Dialog : Besoin d'aide ? ── */}
          <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
            <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden rounded-2xl">
              {/* En-tête vert */}
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 px-5 pt-5 pb-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full" />
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white rounded-full" />
                </div>
                <motion.div
                  className="relative z-10"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                >
                  <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Headset className="h-7 w-7 text-white" />
                  </div>
                  <DialogTitle className="text-white text-lg font-bold">
                    Comment pouvons-nous vous aider ?
                  </DialogTitle>
                  <p className="text-emerald-100 text-xs mt-1">
                    Décrivez votre besoin et nous vous répondrons rapidement.
                  </p>
                </motion.div>
              </div>

              <AnimatePresence mode="wait">
                {!helpSubmitted ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-5 space-y-4"
                  >
                    {/* Contact rapide en bandeau */}
                    <div className="flex gap-2">
                      <a href={SAV_CONTACTS.phoneHref} className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full h-11 text-xs font-bold border-emerald-200 hover:bg-emerald-50 hover:border-emerald-400"
                        >
                          <Phone className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
                          Appeler
                        </Button>
                      </a>
                      <a href={SAV_CONTACTS.whatsappHref} target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full h-11 text-xs font-bold border-green-200 hover:bg-green-50 hover:border-green-400"
                        >
                          <MessageCircle className="h-3.5 w-3.5 mr-1.5 text-green-600" />
                          WhatsApp
                        </Button>
                      </a>
                      <a href={SAV_CONTACTS.emailHref} className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full h-11 text-xs font-bold border-blue-200 hover:bg-blue-50 hover:border-blue-400"
                        >
                          <Mail className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
                          Écrire
                        </Button>
                      </a>
                    </div>

                    {/* Formulaire */}
                    <div>
                      <label className="text-xs font-bold text-foreground mb-1.5 block">
                        Sujet de votre demande
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          'Paiement',
                          'Documents',
                          'Visite de lot',
                          'Litige',
                          'Question générale',
                        ].map((subject) => (
                          <button
                            key={subject}
                            type="button"
                            onClick={() => setHelpSubject(subject)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
                              helpSubject === subject
                                ? 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-400 text-emerald-700 dark:text-emerald-300 shadow-sm'
                                : 'bg-muted/50 border-border text-muted-foreground hover:border-emerald-300 hover:text-foreground'
                            }`}
                          >
                            {subject}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-foreground mb-1.5 block">
                        Décrivez votre besoin
                      </label>
                      <Textarea
                        value={helpMessage}
                        onChange={(e) => setHelpMessage(e.target.value)}
                        placeholder="Ex : J'ai un problème avec mon paiement de janvier, la référence est..."
                        className="min-h-[100px] text-sm resize-none"
                      />
                    </div>

                    <Button
                      className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all"
                      onClick={() => {
                        if (!helpSubject || !helpMessage.trim()) {
                          toast.error(
                            'Veuillez choisir un sujet et décrire votre besoin.',
                          );
                          return;
                        }
                        setHelpSubmitted(true);
                        toast.success(
                          `Votre demande a été envoyée avec succès. Nous vous recontacterons sous 24h.`,
                          { duration: 5000 },
                        );
                      }}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Envoyer ma demande
                    </Button>

                    <p className="text-[10px] text-muted-foreground text-center">
                      En envoyant ce formulaire, vous acceptez que notre SAV
                      vous recontacte par téléphone ou email.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-8 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
                    >
                      <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-lg font-bold text-foreground mb-1">
                      Demande envoyée !
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
                      Notre service après-vente a bien reçu votre demande concernant «&nbsp;{helpSubject}&nbsp;». Nous vous recontacterons sous <strong className="text-foreground">24h ouvrées</strong>.
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setHelpSubject('');
                          setHelpMessage('');
                          setHelpSubmitted(false);
                        }}
                        className="text-xs font-bold"
                      >
                        Nouvelle demande
                      </Button>
                      <Button
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                        onClick={() => setShowHelpDialog(false)}
                      >
                        Fermer
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </DialogContent>
          </Dialog>

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
                className="relative overflow-hidden bg-amber-500 hover:bg-amber-600 text-white font-bold w-full shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02]"
              >
                {!showExperts && (
                  <motion.span
                    className="absolute inset-0"
                    animate={{
                      background: ['rgba(255,255,255,0)', 'rgba(255,255,255,0.15)', 'rgba(255,255,255,0)'],
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
                {showExperts ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-2" />
                    Masquer les experts
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-2" />
                    <motion.span
                      animate={{ scale: [1, 1.03, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      Voir nos experts disponibles
                    </motion.span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Grille des experts — très animée */}
          <AnimatePresence>
            {showExperts && (
              <motion.div
                key="experts-grid"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.08 },
                  },
                  exit: {
                    transition: { staggerChildren: 0.04, staggerDirection: -1 },
                  },
                }}
                className="space-y-2.5"
              >
                {/* Titre de section animé */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
                    exit: { opacity: 0, x: -10, transition: { duration: 0.2 } },
                  }}
                  className="flex items-center gap-2 px-1"
                >
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 0.6, delay: 0.2, ease: 'easeInOut' }}
                  >
                    <HardHat className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </motion.div>
                  <h3 className="text-sm font-bold text-foreground">
                    Nos partenaires qualifiés
                  </h3>
                  <motion.div
                    className="flex-1 h-px bg-gradient-to-r from-amber-300 to-transparent"
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  />
                </motion.div>

                {/* Cartes en cascade */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SAV_EXPERTS.map((expert) => {
                    const Icon = expert.icon;
                    return (
                      <motion.div
                        key={expert.id}
                        variants={{
                          hidden: { opacity: 0, y: 30, scale: 0.85, rotateX: -10 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            rotateX: 0,
                            transition: {
                              type: 'spring',
                              stiffness: 260,
                              damping: 18,
                              bounce: 0.4,
                            },
                          },
                          exit: {
                            opacity: 0,
                            y: -15,
                            scale: 0.9,
                            transition: { duration: 0.2 },
                          },
                        }}
                        whileHover={{
                          scale: 1.04,
                          y: -4,
                          boxShadow: `0 12px 30px ${expert.color}30`,
                          borderColor: expert.color,
                        }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Card
                          className="border-2 border-border cursor-pointer group"
                          onClick={() => handleRequestExpert(expert.title)}
                        >
                          <CardContent className="p-3.5">
                            <div className="flex items-center gap-3">
                              <motion.div
                                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                                style={{ backgroundColor: `${expert.color}18` }}
                                whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                                transition={{ duration: 0.4 }}
                              >
                                <Icon
                                  className="h-5 w-5"
                                  style={{ color: expert.color }}
                                />
                              </motion.div>
                              <div className="flex-1 min-w-0">
                                <p
                                  className="text-sm font-bold leading-tight"
                                  style={{ color: expert.color }}
                                >
                                  Je sollicite un {expert.title.toLowerCase()}
                                </p>
                                <motion.p
                                  className="text-[10px] text-muted-foreground leading-snug mt-0.5"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.35, duration: 0.4 }}
                                >
                                  {expert.subtitle}
                                </motion.p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Bandeau info animé */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: -40 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      transition: { type: 'spring', stiffness: 200, damping: 20, delay: 0.6 },
                    },
                    exit: { opacity: 0, x: 20, transition: { duration: 0.15 } },
                  }}
                  className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  </motion.div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Délai de mise en relation : <strong className="text-foreground">sous 24h</strong> ouvrées.
                    Nos partenaires sont sélectionnés pour leur professionnalisme et leur expérience
                    dans la construction en Côte d&apos;Ivoire.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

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
