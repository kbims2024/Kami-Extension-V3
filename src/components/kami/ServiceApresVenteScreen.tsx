'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
  Download,
  Receipt,
  Ticket,
  MessageSquareText,
  ShieldCheck,
  FileCheck,
  Search,
  Star,
  Calendar,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { ExpertDetailPanel } from './ExpertDetailPanel';

interface ServiceApresVenteScreenProps {
  onBack: () => void;
  setIsMenuOpen?: (open: boolean) => void;
  onLoginClick?: () => void;
}

// Default contact info (used as fallback)
const DEFAULT_SAV_CONTACTS = {
  phone: '+225 27 22 49 00 00',
  phoneHref: 'tel:+2252722490000',
  whatsapp: '+225 07 58 42 10 00',
  whatsappHref: 'https://wa.me/2250758421000',
  email: 'sav@kami-extension.com',
  emailHref: 'mailto:sav@kami-extension.com',
};

const DEFAULT_SAV_HORAIRES = [
  { day: 'Lundi - Vendredi', hours: '08h00 - 18h00' },
  { day: 'Samedi', hours: '09h00 - 13h00' },
  { day: 'Dimanche & jours fériés', hours: 'Fermé' },
];

const DEFAULT_SAV_FAQ = [
  {
    question: "Comment suivre l'avancée de mon paiement ?",
    answer:
      "Connectez-vous à votre espace client pour voir l'historique complet de vos versements et le solde restant. Vous pouvez aussi contacter notre SAV par téléphone ou WhatsApp.",
  },
  {
    question: 'Comment obtenir mon reçu de paiement ?',
    answer:
      'Les reçus sont disponibles dans la section « Documents & attestations » de votre espace client. Vous pouvez les télécharger en PDF ou demander une copie physique au bureau.',
  },
  {
    question: 'Quand recevrai-je mes documents de propriété ?',
    answer:
      "Après le paiement intégral du lot, les documents sont préparés sous 15 à 30 jours. Vous serez notifié par message dès qu'ils seront disponibles au retrait.",
  },
  {
    question: "Que faire si j'ai un litige ou une réclamation ?",
    answer:
      "Adressez votre réclamation par email au service après-vente ou via WhatsApp. Un conseiller vous recontactera sous 48h ouvrées avec un accusé de réception et un numéro de ticket.",
  },
];

const SAV_EXPERTS = [
  {
    id: 'electricien',
    title: 'Électricien',
    subtitle: 'Installation électrique complète, mise aux normes NFC, dépannage.',
    icon: Zap,
    color: '#F59E0B',
  },
  {
    id: 'plombier',
    title: 'Plombier',
    subtitle: 'Alimentation en eau, installation sanitaire, réparation de fuites.',
    icon: Droplets,
    color: '#3B82F6',
  },
  {
    id: 'macon',
    title: 'Maçon',
    subtitle: 'Fondations, murs, dalle et tous travaux en gros œuvre.',
    icon: Hammer,
    color: '#EF4444',
  },
  {
    id: 'menuisier',
    title: 'Menuisier',
    subtitle: 'Portes, fenêtres, volets, placards et agencement sur mesure.',
    icon: Paintbrush,
    color: '#8B5E3C',
  },
  {
    id: 'carreleur',
    title: 'Carreleur',
    subtitle: 'Carrelage au sol et faïence murale, finitions soignées.',
    icon: Grid3X3,
    color: '#6366F1',
  },
  {
    id: 'peintre',
    title: 'Peintre',
    subtitle: 'Peinture intérieure et extérieure, préparation, finitions.',
    icon: PaintBucket,
    color: '#10B981',
  },
  {
    id: 'conducteur_travaux',
    title: 'Conducteur de travaux',
    subtitle: 'Supervise et coordonne votre chantier de A à Z.',
    icon: HardHat,
    color: '#0EA5E9',
  },
  {
    id: 'geometre',
    title: 'Géomètre',
    subtitle: 'Bornage, topographie et délimitation précise de votre terrain.',
    icon: UserCheck,
    color: '#D946EF',
  },
];

// Données des documents disponibles au téléchargement
const SAV_DOCUMENTS = [
  {
    id: 'recu-paiement',
    title: 'Reçu de paiement',
    description: 'Reçu officiel de chaque versement effectué',
    icon: Receipt,
    color: '#10B981',
    requiresAuth: true,
  },
  {
    id: 'attestation-reservation',
    title: 'Attestation de réservation',
    description: 'Document prouvant votre réservation de lot',
    icon: FileCheck,
    color: '#3B82F6',
    requiresAuth: true,
  },
  {
    id: 'titre-foncier',
    title: 'Titre foncier',
    description: 'Titre de propriété après paiement intégral',
    icon: ShieldCheck,
    color: '#D946EF',
    requiresAuth: true,
    requiresFullPayment: true,
  },
  {
    id: 'plan-lot',
    title: 'Plan du lot',
    description: 'Plan cadastré et délimitation de votre terrain',
    icon: MapPin,
    color: '#F59E0B',
    requiresAuth: true,
  },
  {
    id: 'contrat-reservation',
    title: 'Contrat de réservation',
    description: 'Contrat signé lors de la réservation du lot',
    icon: FileText,
    color: '#EF4444',
    requiresAuth: true,
  },
  {
    id: 'certificat-non-reclamation',
    title: 'Certificat de non-réclamation',
    description: 'Certificat attestant l\'absence de litige',
    icon: FileCheck,
    color: '#0EA5E9',
    requiresAuth: true,
  },
];

// Données des catégories de réclamation
const RECLAMATION_CATEGORIES = [
  { id: 'paiement', label: 'Paiement', icon: Wallet, color: '#10B981' },
  { id: 'document', label: 'Document', icon: FileText, color: '#3B82F6' },
  { id: 'lot', label: 'Lot / Terrain', icon: MapPin, color: '#F59E0B' },
  { id: 'service', label: 'Service client', icon: Headset, color: '#D946EF' },
  { id: 'travaux', label: 'Travaux / Viabilisation', icon: Wrench, color: '#EF4444' },
  { id: 'autre', label: 'Autre', icon: AlertCircle, color: '#6B7280' },
];

// Données des catégories d'assistance technique
const ASSISTANCE_TOPICS = [
  { id: 'borne-limits', label: 'Bornage & limites', icon: MapPin },
  { id: 'raccordement-eau', label: 'Raccordement eau', icon: Droplets },
  { id: 'raccordement-electrique', label: 'Raccordement électricité', icon: Zap },
  { id: 'viabilisation', label: 'Viabilisation du lot', icon: HardHat },
  { id: 'plan-masse', label: 'Plan de masse', icon: FileText },
  { id: 'acces-terrain', label: 'Accès au terrain', icon: MapPin },
  { id: 'construction', label: 'Règles de construction', icon: ShieldCheck },
  { id: 'autre', label: 'Autre question', icon: MessageSquareText },
];

// Données des 4 services du SAV
const SAV_SERVICES = [
  {
    title: 'Suivi des paiements',
    description: 'Consultez vos versements, le solde restant et obtenez vos reçus.',
    icon: Wallet,
    color: '#10B981',
  },
  {
    title: 'Documents & attestations',
    description: 'Téléchargez vos contrats, attestations et documents de propriété.',
    icon: Download,
    color: '#3B82F6',
  },
  {
    title: 'Réclamations & litiges',
    description: 'Soumettez une réclamation et suivez sa résolution.',
    icon: MessageSquareText,
    color: '#EF4444',
  },
  {
    title: 'Assistance technique',
    description: 'Obtenez de l\'aide pour le bornage, raccordements et viabilisation.',
    icon: Wrench,
    color: '#F59E0B',
  },
];

export function ServiceApresVenteScreen({
  onBack,
  setIsMenuOpen,
  onLoginClick,
}: ServiceApresVenteScreenProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showExpertPanel, setShowExpertPanel] = useState(false);
  const [selectedExpertCategoryId, setSelectedExpertCategoryId] = useState<string | undefined>(undefined);

  // ── Dynamic SAV settings ──
  const [savContacts, setSavContacts] = useState(DEFAULT_SAV_CONTACTS);
  const [savHoraires, setSavHoraires] = useState(DEFAULT_SAV_HORAIRES);
  const [savFaq, setSavFaq] = useState(DEFAULT_SAV_FAQ);

  useEffect(() => {
    fetch('/api/sav-settings')
      .then(r => r.json())
      .then(data => {
        if (data.savPhone) {
          setSavContacts(prev => ({
            ...prev,
            phone: data.savPhone,
            phoneHref: `tel:${data.savPhone.replace(/\s/g, '')}`,
            whatsapp: data.savWhatsapp,
            whatsappHref: `https://wa.me/${data.savWhatsapp.replace(/\s/g, '')}`,
            email: data.savEmail,
            emailHref: `mailto:${data.savEmail}`,
          }));
        }
        if (data.savHoraires) setSavHoraires(data.savHoraires);
        if (data.savFaq) setSavFaq(data.savFaq);
      })
      .catch(() => {});
  }, []);

  // ── Dialog : Besoin d'aide ? ──
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [helpSubject, setHelpSubject] = useState('');
  const [helpMessage, setHelpMessage] = useState('');
  const [helpSubmitted, setHelpSubmitted] = useState(false);

  // ── Dialog : Suivi des paiements ──
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentPhone, setPaymentPhone] = useState('');
  const [paymentPassword, setPaymentPassword] = useState('');
  const [showPaymentPassword, setShowPaymentPassword] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [paymentStats, setPaymentStats] = useState<any>(null);
  const [paymentLoginError, setPaymentLoginError] = useState('');

  // ── Dialog : Documents ──
  const [showDocsDialog, setShowDocsDialog] = useState(false);

  // ── Dialog : Réclamations ──
  const [showReclamationDialog, setShowReclamationDialog] = useState(false);
  const [reclamationCategory, setReclamationCategory] = useState('');
  const [reclamationDescription, setReclamationDescription] = useState('');
  const [reclamationName, setReclamationName] = useState('');
  const [reclamationPhone, setReclamationPhone] = useState('');
  const [reclamationSubmitted, setReclamationSubmitted] = useState(false);
  const [reclamationTicket, setReclamationTicket] = useState('');

  // ── Dialog : Assistance technique ──
  const [showAssistanceDialog, setShowAssistanceDialog] = useState(false);
  const [assistanceTopic, setAssistanceTopic] = useState('');
  const [assistanceMessage, setAssistanceMessage] = useState('');
  const [assistanceSubmitted, setAssistanceSubmitted] = useState(false);

  // ── Dialog : Sollicitation expert ──
  const [showExpertDialog, setShowExpertDialog] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<typeof SAV_EXPERTS[number] | null>(null);
  const [expertName, setExpertName] = useState('');
  const [expertPhone, setExpertPhone] = useState('');
  const [expertNeed, setExpertNeed] = useState('');
  const [expertUrgency, setExpertUrgency] = useState('');
  const [expertSubmitted, setExpertSubmitted] = useState(false);

  // Générer un numéro de ticket aléatoire
  const generateTicket = (prefix: string) => {
    const num = Math.floor(100000 + Math.random() * 900000);
    return `${prefix}-${num}`;
  };

  // ── Handlers ──

  const handleRequestExpert = (expert: typeof SAV_EXPERTS[number]) => {
    setSelectedExpertCategoryId(expert.id);
    setShowExpertPanel(true);
  };

  const handleOpenExpertPanel = (categoryId?: string) => {
    setSelectedExpertCategoryId(categoryId);
    setShowExpertPanel(true);
  };

  const handleBackFromExpertPanel = () => {
    setShowExpertPanel(false);
    setSelectedExpertCategoryId(undefined);
  };

  const handleSubmitExpert = () => {
    if (!expertName.trim() || !expertPhone.trim() || !expertNeed.trim() || !expertUrgency) {
      toast.error('Veuillez remplir tous les champs.');
      return;
    }
    const ticket = generateTicket('EXP');
    toast.success(
      `Demande envoyée ! Ticket ${ticket}. Notre ${selectedExpert?.title.toLowerCase()} vous contactera sous 24h.`,
      { duration: 6000 },
    );
    setExpertSubmitted(true);
  };

  const handleSubmitPayment = async () => {
    if (!paymentPassword.trim()) {
      toast.error('Veuillez entrer votre mot de passe.');
      return;
    }
    setPaymentLoading(true);
    setPaymentLoginError('');
    try {
      // 1. Login
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: paymentPhone || undefined, password: paymentPassword }),
      });
      if (!loginRes.ok) {
        const err = await loginRes.json();
        setPaymentLoginError(err.error || 'Erreur de connexion');
        setPaymentLoading(false);
        return;
      }
      const user = await loginRes.json();

      // 2. Fetch payments & stats in parallel
      const [paymentsRes, statsRes] = await Promise.all([
        fetch(`/api/user/payments?userId=${user.id}`),
        fetch(`/api/user/stats?userId=${user.id}`),
      ]);
      const paymentsData = paymentsRes.ok ? await paymentsRes.json() : [];
      const statsData = statsRes.ok ? await statsRes.json() : null;

      setPaymentData(Array.isArray(paymentsData) ? paymentsData : []);
      setPaymentStats(statsData);
      setPaymentSubmitted(true);
    } catch {
      setPaymentLoginError('Erreur de connexion au serveur.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleSubmitReclamation = () => {
    if (!reclamationName.trim() || !reclamationPhone.trim() || !reclamationCategory || !reclamationDescription.trim()) {
      toast.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    const ticket = generateTicket('REC');
    setReclamationTicket(ticket);
    toast.success(
      `Réclamation enregistrée ! Ticket ${ticket}. Suivi sous 48h ouvrées.`,
      { duration: 6000 },
    );
    setReclamationSubmitted(true);
  };

  const handleSubmitAssistance = () => {
    if (!assistanceTopic || !assistanceMessage.trim()) {
      toast.error('Veuillez choisir un sujet et décrire votre besoin.');
      return;
    }
    toast.success(
      'Votre demande d\'assistance a été envoyée. Notre équipe technique vous recontactera rapidement.',
      { duration: 5000 },
    );
    setAssistanceSubmitted(true);
  };

  // ── Render ──

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
        <div className="max-w-2xl mx-auto w-full px-4 pt-3 pb-4 space-y-3.5">
          {/* Hero — Besoin d'aide ? */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Card
              className="border-emerald-200 dark:border-emerald-900/50 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-card overflow-hidden cursor-pointer"
              onClick={() => {
                setHelpSubject('');
                setHelpMessage('');
                setHelpSubmitted(false);
                setShowHelpDialog(true);
              }}
            >
              <CardContent className="p-4 text-center">
                <motion.div
                  className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/40 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30"
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
                <h2 className="text-base font-bold text-foreground mb-0.5">
                  Besoin d&apos;aide ?
                </h2>
                <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Notre équipe vous accompagne pour vos paiements, vos documents
                  et toutes vos questions concernant votre lot.
                </p>
                <motion.div
                  className="mt-2.5"
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 h-10"
                  >
                    <Headset className="h-4 w-4 mr-1.5" />
                    Obtenir de l&apos;aide maintenant
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ═══════════════════════════════════════════════
              DIALOG : Besoin d'aide ? (formulaire général)
              ═══════════════════════════════════════════════ */}
          <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
            <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden rounded-2xl">
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
                    <div className="flex gap-2">
                      <a href={savContacts.phoneHref} className="flex-1">
                        <Button variant="outline" className="w-full h-11 text-xs font-bold border-emerald-200 hover:bg-emerald-50 hover:border-emerald-400">
                          <Phone className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
                          Appeler
                        </Button>
                      </a>
                      <a href={savContacts.whatsappHref} target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button variant="outline" className="w-full h-11 text-xs font-bold border-green-200 hover:bg-green-50 hover:border-green-400">
                          <MessageCircle className="h-3.5 w-3.5 mr-1.5 text-green-600" />
                          WhatsApp
                        </Button>
                      </a>
                      <a href={savContacts.emailHref} className="flex-1">
                        <Button variant="outline" className="w-full h-11 text-xs font-bold border-blue-200 hover:bg-blue-50 hover:border-blue-400">
                          <Mail className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
                          Écrire
                        </Button>
                      </a>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-foreground mb-1.5 block">Sujet de votre demande</label>
                      <div className="flex flex-wrap gap-1.5">
                        {['Paiement', 'Documents', 'Visite de lot', 'Litige', 'Question générale'].map((subject) => (
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
                      <label className="text-xs font-bold text-foreground mb-1.5 block">Décrivez votre besoin</label>
                      <Textarea
                        value={helpMessage}
                        onChange={(e) => setHelpMessage(e.target.value)}
                        placeholder="Ex : J'ai un problème avec mon paiement de janvier..."
                        className="min-h-[100px] text-sm resize-none"
                      />
                    </div>
                    <Button
                      className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all"
                      onClick={() => {
                        if (!helpSubject || !helpMessage.trim()) {
                          toast.error('Veuillez choisir un sujet et décrire votre besoin.');
                          return;
                        }
                        setHelpSubmitted(true);
                        toast.success('Votre demande a été envoyée avec succès. Nous vous recontacterons sous 24h.', { duration: 5000 });
                      }}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Envoyer ma demande
                    </Button>
                    <p className="text-[10px] text-muted-foreground text-center">
                      En envoyant ce formulaire, vous acceptez que notre SAV vous recontacte par téléphone ou email.
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
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}>
                      <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-lg font-bold text-foreground mb-1">Demande envoyée !</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
                      Notre SAV a bien reçu votre demande concernant «&nbsp;{helpSubject}&nbsp;». Nous vous recontacterons sous <strong className="text-foreground">24h ouvrées</strong>.
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" onClick={() => { setHelpSubject(''); setHelpMessage(''); setHelpSubmitted(false); }} className="text-xs font-bold">
                        Nouvelle demande
                      </Button>
                      <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold" onClick={() => setShowHelpDialog(false)}>
                        Fermer
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </DialogContent>
          </Dialog>

          {/* ═══════════════════════════════════════════════
              DIALOG : Suivi des paiements
              ═══════════════════════════════════════════════ */}
          <Dialog open={showPaymentDialog} onOpenChange={(open) => {
            setShowPaymentDialog(open);
            if (!open) { setPaymentSubmitted(false); setPaymentPhone(''); setPaymentPassword(''); setPaymentLoginError(''); setPaymentData(null); setPaymentStats(null); }
          }}>
            <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden rounded-2xl">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-700 px-5 pt-5 pb-5 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full" />
                </div>
                <motion.div className="relative z-10" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Wallet className="h-6 w-6 text-white" />
                  </div>
                  <DialogTitle className="text-white text-base font-bold">Suivi de vos paiements</DialogTitle>
                  <p className="text-emerald-100 text-[11px] mt-1">Connectez-vous pour voir vos réservations et paiements.</p>
                </motion.div>
              </div>
              <AnimatePresence mode="wait">
                {!paymentSubmitted ? (
                  <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-5 space-y-4">
                    <div className="flex gap-2 items-center p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50">
                      <Lock className="h-4 w-4 text-emerald-600 shrink-0" />
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Entrez votre mot de passe pour accéder à vos données de paiement.
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-foreground mb-1 block">Téléphone <span className="text-muted-foreground font-normal">(optionnel)</span></label>
                      <Textarea
                        value={paymentPhone}
                        onChange={(e) => setPaymentPhone(e.target.value)}
                        placeholder="Optionnel"
                        className="min-h-[40px] text-sm resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-foreground mb-1 block">Mot de passe <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <Input
                          value={paymentPassword}
                          onChange={(e) => setPaymentPassword(e.target.value)}
                          placeholder="Votre mot de passe"
                          type={showPaymentPassword ? 'text' : 'password'}
                          className="h-10 text-sm pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPaymentPassword(!showPaymentPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPaymentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    {paymentLoginError && (
                      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50">
                        <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                        <p className="text-[11px] text-red-600 dark:text-red-400">{paymentLoginError}</p>
                      </div>
                    )}
                    <Button
                      className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/20"
                      onClick={handleSubmitPayment}
                      disabled={paymentLoading}
                    >
                      {paymentLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                      {paymentLoading ? 'Connexion...' : 'Voir mes paiements'}
                    </Button>
                    <div className="flex items-center justify-center gap-4">
                      <a href={savContacts.whatsappHref} target="_blank" rel="noopener noreferrer" className="text-[11px] text-emerald-600 font-semibold hover:underline flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        Demander par WhatsApp
                      </a>
                      <a href={savContacts.phoneHref} className="text-[11px] text-emerald-600 font-semibold hover:underline flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        Appeler le SAV
                      </a>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                    {/* Summary stats */}
                    {paymentStats && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-900/50">
                          <p className="text-[10px] text-muted-foreground">Total versé</p>
                          <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">{paymentStats.totalPaid?.toLocaleString('fr-FR')} F</p>
                        </div>
                        <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-3 border border-orange-200 dark:border-orange-900/50">
                          <p className="text-[10px] text-muted-foreground">Reste à payer</p>
                          <p className="text-sm font-bold text-orange-700 dark:text-orange-300">{paymentStats.totalRemaining?.toLocaleString('fr-FR')} F</p>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 border border-blue-200 dark:border-blue-900/50">
                          <p className="text-[10px] text-muted-foreground">Lots réservés</p>
                          <p className="text-sm font-bold text-blue-700 dark:text-blue-300">{paymentStats.totalReserved}</p>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-3 border border-purple-200 dark:border-purple-900/50">
                          <p className="text-[10px] text-muted-foreground">Progression</p>
                          <p className="text-sm font-bold text-purple-700 dark:text-purple-300">{paymentStats.paymentProgress?.toFixed(1)}%</p>
                        </div>
                      </div>
                    )}
                    {/* Per-reservation detail */}
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-bold text-foreground">Vos réservations</h4>
                      {paymentData && paymentData.length > 0 ? paymentData.map((p: any, idx: number) => (
                        <Card key={idx} className="border-border">
                          <CardContent className="p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-bold text-foreground">{p.lotName || 'Lot inconnu'}</p>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${p.status === 'VALIDATED' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'}`}>{p.status === 'VALIDATED' ? 'Validé' : p.status}</span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                              <span className="text-muted-foreground">Montant : <strong className="text-foreground">{p.amount?.toLocaleString('fr-FR')} F</strong></span>
                              <span className="text-muted-foreground">{p.createdAt ? new Date(p.createdAt).toLocaleDateString('fr-FR') : ''}</span>
                            </div>
                          </CardContent>
                        </Card>
                      )) : (
                        <p className="text-xs text-muted-foreground text-center py-4">Aucun paiement enregistré.</p>
                      )}
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button variant="outline" onClick={() => { setPaymentSubmitted(false); setPaymentPassword(''); setPaymentLoginError(''); }} className="flex-1 text-xs font-bold">
                        Retour
                      </Button>
                      <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold" onClick={() => setShowPaymentDialog(false)}>
                        Fermer
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </DialogContent>
          </Dialog>

          {/* ═══════════════════════════════════════════════
              DIALOG : Documents & attestations
              ═══════════════════════════════════════════════ */}
          <Dialog open={showDocsDialog} onOpenChange={setShowDocsDialog}>
            <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden rounded-2xl">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-700 px-5 pt-5 pb-5 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full" />
                </div>
                <motion.div className="relative z-10" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mx-auto mb-2">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <DialogTitle className="text-white text-base font-bold">Documents & attestations</DialogTitle>
                  <p className="text-blue-100 text-[11px] mt-1">Téléchargez vos documents officiels.</p>
                </motion.div>
              </div>
              <div className="p-4 space-y-2.5 max-h-[60vh] overflow-y-auto">
                {SAV_DOCUMENTS.map((doc, i) => {
                  const Icon = doc.icon;
                  return (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.3 }}
                    >
                      <Card className="border-border hover:border-blue-300 dark:hover:border-blue-800 transition-all cursor-pointer group" onClick={() => {
                        if (doc.requiresAuth) {
                          toast.info(`Pour télécharger "${doc.title}", connectez-vous à votre espace client.`, { duration: 4000 });
                        }
                      }}>
                        <CardContent className="p-3 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${doc.color}18` }}>
                            <Icon className="h-4.5 w-4.5" style={{ color: doc.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-foreground">{doc.title}</p>
                            <p className="text-[10px] text-muted-foreground leading-snug">{doc.description}</p>
                            {doc.requiresFullPayment && (
                              <span className="inline-flex items-center gap-1 mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                <Lock className="h-2.5 w-2.5" />
                                Après paiement intégral
                              </span>
                            )}
                          </div>
                          <Download className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 shrink-0 transition-colors" />
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
                <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 mt-2">
                  <p className="text-[11px] text-muted-foreground leading-relaxed text-center">
                    <strong className="text-foreground">Besoin d&apos;aide ?</strong> Contactez le SAV par{' '}
                    <a href={savContacts.whatsappHref} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline">WhatsApp</a> ou{' '}
                    <a href={savContacts.phoneHref} className="text-blue-600 font-semibold hover:underline">téléphone</a>.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* ═══════════════════════════════════════════════
              DIALOG : Réclamations & litiges
              ═══════════════════════════════════════════════ */}
          <Dialog open={showReclamationDialog} onOpenChange={(open) => {
            setShowReclamationDialog(open);
            if (!open) { setReclamationSubmitted(false); setReclamationCategory(''); setReclamationDescription(''); setReclamationName(''); setReclamationPhone(''); }
          }}>
            <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden rounded-2xl">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 px-5 pt-5 pb-5 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full" />
                </div>
                <motion.div className="relative z-10" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mx-auto mb-2">
                    <AlertCircle className="h-6 w-6 text-white" />
                  </div>
                  <DialogTitle className="text-white text-base font-bold">Réclamations & litiges</DialogTitle>
                  <p className="text-amber-100 text-[11px] mt-1">Signalez un problème, nous ouvrons un ticket suivi.</p>
                </motion.div>
              </div>
              <AnimatePresence mode="wait">
                {!reclamationSubmitted ? (
                  <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-5 space-y-4">
                    <div>
                      <label className="text-xs font-bold text-foreground mb-1 block">Votre nom <span className="text-red-500">*</span></label>
                      <Textarea value={reclamationName} onChange={(e) => setReclamationName(e.target.value)} placeholder="Nom complet" className="min-h-[40px] text-sm resize-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-foreground mb-1 block">Téléphone <span className="text-red-500">*</span></label>
                      <Textarea value={reclamationPhone} onChange={(e) => setReclamationPhone(e.target.value)} placeholder="+225 07 XX XX XX XX" className="min-h-[40px] text-sm resize-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-foreground mb-1.5 block">Catégorie de réclamation <span className="text-red-500">*</span></label>
                      <div className="flex flex-wrap gap-1.5">
                        {RECLAMATION_CATEGORIES.map((cat) => {
                          const Icon = cat.icon;
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => setReclamationCategory(cat.id)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
                                reclamationCategory === cat.id
                                  ? 'border-amber-400 shadow-sm'
                                  : 'bg-muted/50 border-border text-muted-foreground hover:border-amber-300'
                              }`}
                              style={reclamationCategory === cat.id ? { backgroundColor: `${cat.color}18`, color: cat.color } : {}}
                            >
                              <Icon className="h-3 w-3" />
                              {cat.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-foreground mb-1 block">Décrivez votre réclamation <span className="text-red-500">*</span></label>
                      <Textarea
                        value={reclamationDescription}
                        onChange={(e) => setReclamationDescription(e.target.value)}
                        placeholder="Décrivez le problème en détail : date, circonstances, actions déjà entreprises..."
                        className="min-h-[100px] text-sm resize-none"
                      />
                    </div>
                    <Button
                      className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-lg shadow-amber-500/20"
                      onClick={handleSubmitReclamation}
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Envoyer ma réclamation
                    </Button>
                    <p className="text-[10px] text-muted-foreground text-center">
                      Un accusé de réception avec numéro de ticket vous sera envoyé par SMS.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="p-6 text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }}>
                      <CheckCircle2 className="h-14 w-14 text-amber-500 mx-auto mb-3" />
                    </motion.div>
                    <h3 className="text-base font-bold text-foreground mb-1">Réclamation enregistrée !</h3>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-800 my-2">
                      <Ticket className="h-3.5 w-3.5 text-amber-600" />
                      <span className="text-sm font-bold text-amber-700 dark:text-amber-300">{reclamationTicket}</span>
                    </div>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto mb-4 leading-relaxed">
                      Votre réclamation est prise en charge. Un conseiller vous recontactera sous <strong className="text-foreground">48h ouvrées</strong>.
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" onClick={() => { setReclamationSubmitted(false); setReclamationCategory(''); setReclamationDescription(''); }} className="text-xs font-bold">
                        Autre réclamation
                      </Button>
                      <Button className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold" onClick={() => setShowReclamationDialog(false)}>
                        Fermer
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </DialogContent>
          </Dialog>

          {/* ═══════════════════════════════════════════════
              DIALOG : Assistance technique
              ═══════════════════════════════════════════════ */}
          <Dialog open={showAssistanceDialog} onOpenChange={(open) => {
            setShowAssistanceDialog(open);
            if (!open) { setAssistanceSubmitted(false); setAssistanceTopic(''); setAssistanceMessage(''); }
          }}>
            <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden rounded-2xl">
              <div className="bg-gradient-to-br from-red-500 to-rose-700 px-5 pt-5 pb-5 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full" />
                </div>
                <motion.div className="relative z-10" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Wrench className="h-6 w-6 text-white" />
                  </div>
                  <DialogTitle className="text-white text-base font-bold">Assistance technique</DialogTitle>
                  <p className="text-red-100 text-[11px] mt-1">Questions sur votre lot, bornage, raccordements.</p>
                </motion.div>
              </div>
              <AnimatePresence mode="wait">
                {!assistanceSubmitted ? (
                  <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-5 space-y-4">
                    <div>
                      <label className="text-xs font-bold text-foreground mb-1.5 block">Quel est votre sujet ?</label>
                      <div className="flex flex-wrap gap-1.5">
                        {ASSISTANCE_TOPICS.map((topic) => {
                          const Icon = topic.icon;
                          return (
                            <button
                              key={topic.id}
                              type="button"
                              onClick={() => setAssistanceTopic(topic.id)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
                                assistanceTopic === topic.id
                                  ? 'bg-red-100 dark:bg-red-900/30 border-red-400 text-red-700 dark:text-red-300 shadow-sm'
                                  : 'bg-muted/50 border-border text-muted-foreground hover:border-red-300 hover:text-foreground'
                              }`}
                            >
                              <Icon className="h-3 w-3" />
                              {topic.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-foreground mb-1 block">Décrivez votre besoin</label>
                      <Textarea
                        value={assistanceMessage}
                        onChange={(e) => setAssistanceMessage(e.target.value)}
                        placeholder="Ex : Je souhaite connaître les démarches pour le raccordement à l'eau de mon lot B5..."
                        className="min-h-[100px] text-sm resize-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 h-11 bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-lg shadow-red-500/20"
                        onClick={handleSubmitAssistance}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Envoyer
                      </Button>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                      <a href={savContacts.phoneHref} className="text-[11px] text-red-500 font-semibold hover:underline flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        Appeler le SAV
                      </a>
                      <a href={savContacts.whatsappHref} target="_blank" rel="noopener noreferrer" className="text-[11px] text-red-500 font-semibold hover:underline flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        WhatsApp
                      </a>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="p-6 text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }}>
                      <CheckCircle2 className="h-14 w-14 text-red-500 mx-auto mb-3" />
                    </motion.div>
                    <h3 className="text-base font-bold text-foreground mb-1">Demande envoyée !</h3>
                    <p className="text-xs text-muted-foreground max-w-xs mx-auto mb-4 leading-relaxed">
                      Notre équipe technique a reçu votre demande et vous recontactera sous <strong className="text-foreground">24h ouvrées</strong>.
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" onClick={() => { setAssistanceSubmitted(false); setAssistanceTopic(''); setAssistanceMessage(''); }} className="text-xs font-bold">
                        Autre question
                      </Button>
                      <Button className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold" onClick={() => setShowAssistanceDialog(false)}>
                        Fermer
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </DialogContent>
          </Dialog>

          {/* ═══════════════════════════════════════════════
              DIALOG : Sollicitation expert
              ═══════════════════════════════════════════════ */}
          <Dialog open={showExpertDialog} onOpenChange={(open) => {
            setShowExpertDialog(open);
            if (!open) { setSelectedExpert(null); }
          }}>
            <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden rounded-2xl">
              {selectedExpert && (
                <>
                  <div
                    className="px-5 pt-5 pb-5 text-center relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${selectedExpert.color}, ${selectedExpert.color}cc)` }}
                  >
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full" />
                      <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white rounded-full" />
                    </div>
                    <motion.div className="relative z-10" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
                      <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mx-auto mb-2">
                        {(() => { const EIcon = selectedExpert.icon; return <EIcon className="h-6 w-6 text-white" />; })()}
                      </div>
                      <DialogTitle className="text-white text-base font-bold">
                        Solliciter un {selectedExpert.title.toLowerCase()}
                      </DialogTitle>
                      <p className="text-white/70 text-[11px] mt-1">{selectedExpert.subtitle}</p>
                    </motion.div>
                  </div>
                  <AnimatePresence mode="wait">
                    {!expertSubmitted ? (
                      <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-5 space-y-4">
                        <div className="flex gap-2">
                          <a href={savContacts.phoneHref} className="flex-1">
                            <Button variant="outline" className="w-full h-10 text-[11px] font-bold" style={{ borderColor: `${selectedExpert.color}40` }}>
                              <Phone className="h-3.5 w-3.5 mr-1" style={{ color: selectedExpert.color }} />
                              Appeler
                            </Button>
                          </a>
                          <a href={savContacts.whatsappHref} target="_blank" rel="noopener noreferrer" className="flex-1">
                            <Button variant="outline" className="w-full h-10 text-[11px] font-bold" style={{ borderColor: `${selectedExpert.color}40` }}>
                              <MessageCircle className="h-3.5 w-3.5 mr-1" style={{ color: selectedExpert.color }} />
                              WhatsApp
                            </Button>
                          </a>
                        </div>
                        <div className="h-px bg-border" />
                        <p className="text-[11px] text-muted-foreground text-center">ou remplissez le formulaire ci-dessous :</p>
                        <div>
                          <label className="text-xs font-bold text-foreground mb-1 block">Votre nom <span className="text-red-500">*</span></label>
                          <Textarea value={expertName} onChange={(e) => setExpertName(e.target.value)} placeholder="Nom complet" className="min-h-[40px] text-sm resize-none" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-foreground mb-1 block">Téléphone <span className="text-red-500">*</span></label>
                          <Textarea value={expertPhone} onChange={(e) => setExpertPhone(e.target.value)} placeholder="+225 07 XX XX XX XX" className="min-h-[40px] text-sm resize-none" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-foreground mb-1.5 block">Niveau d&apos;urgence <span className="text-red-500">*</span></label>
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              { id: 'normal', label: 'Normal', emoji: '🟢' },
                              { id: 'urgent', label: 'Urgent', emoji: '🟡' },
                              { id: 'tres-urgent', label: 'Très urgent', emoji: '🔴' },
                            ].map((u) => (
                              <button
                                key={u.id}
                                type="button"
                                onClick={() => setExpertUrgency(u.id)}
                                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all border ${
                                  expertUrgency === u.id
                                    ? 'border-foreground bg-foreground/5 shadow-sm'
                                    : 'bg-muted/50 border-border text-muted-foreground hover:border-foreground/30'
                                }`}
                              >
                                <span>{u.emoji}</span>
                                {u.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-foreground mb-1 block">Décrivez votre besoin <span className="text-red-500">*</span></label>
                          <Textarea
                            value={expertNeed}
                            onChange={(e) => setExpertNeed(e.target.value)}
                            placeholder={`Ex : J'ai besoin d'un ${selectedExpert.title.toLowerCase()} pour mon lot B5, travaux de...`}
                            className="min-h-[90px] text-sm resize-none"
                          />
                        </div>
                        <Button
                          className="w-full h-11 text-white font-bold text-xs shadow-lg transition-all"
                          style={{ backgroundColor: selectedExpert.color, '--tw-shadow-color': `${selectedExpert.color}40` } as React.CSSProperties}
                          onClick={handleSubmitExpert}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Envoyer ma demande
                        </Button>
                        <p className="text-[10px] text-muted-foreground text-center">
                          Mise en relation sous <strong className="text-foreground">24h ouvrées</strong>.
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="p-6 text-center">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }}>
                          <CheckCircle2 className="h-14 w-14 mx-auto mb-3" style={{ color: selectedExpert.color }} />
                        </motion.div>
                        <h3 className="text-base font-bold text-foreground mb-1">Demande envoyée !</h3>
                        <p className="text-xs text-muted-foreground max-w-xs mx-auto mb-4 leading-relaxed">
                          Votre demande de mise en relation avec un <strong className="text-foreground">{selectedExpert.title.toLowerCase()}</strong> a été enregistrée. Notre SAV vous contactera sous <strong className="text-foreground">24h ouvrées</strong>.
                        </p>
                        <div className="flex gap-2 justify-center">
                          <Button variant="outline" onClick={() => { setExpertSubmitted(false); setExpertName(''); setExpertPhone(''); setExpertNeed(''); setExpertUrgency(''); }} className="text-xs font-bold">
                            Autre demande
                          </Button>
                          <Button className="text-white text-xs font-bold" style={{ backgroundColor: selectedExpert.color }} onClick={() => setShowExpertDialog(false)}>
                            Fermer
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </DialogContent>
          </Dialog>

          {/* Méthodes de contact rapides */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-2 px-1">Contactez-nous</h3>
            <div className="grid grid-cols-3 gap-2">
              <a href={savContacts.phoneHref} className="block group">
                <Card className="border border-border cursor-pointer transition-all hover:shadow-md hover:border-emerald-400 h-full">
                  <CardContent className="p-2.5 flex flex-col items-center text-center gap-1">
                    <div className="w-9 h-9 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-[11px] font-bold text-foreground">Appeler</p>
                    <p className="text-[9px] text-muted-foreground leading-tight">{savContacts.phone}</p>
                  </CardContent>
                </Card>
              </a>
              <a href={savContacts.whatsappHref} target="_blank" rel="noopener noreferrer" className="block group">
                <Card className="border border-border cursor-pointer transition-all hover:shadow-md hover:border-green-500 h-full">
                  <CardContent className="p-2.5 flex flex-col items-center text-center gap-1">
                    <div className="w-9 h-9 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-[11px] font-bold text-foreground">WhatsApp</p>
                    <p className="text-[9px] text-muted-foreground leading-tight">{savContacts.whatsapp}</p>
                  </CardContent>
                </Card>
              </a>
              <a href={savContacts.emailHref} className="block group">
                <Card className="border border-border cursor-pointer transition-all hover:shadow-md hover:border-blue-400 h-full">
                  <CardContent className="p-2.5 flex flex-col items-center text-center gap-1">
                    <div className="w-9 h-9 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-[11px] font-bold text-foreground">Écrire</p>
                    <p className="text-[9px] text-muted-foreground leading-tight">{savContacts.email}</p>
                  </CardContent>
                </Card>
              </a>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════
              Nos services — 4 cartes cliquables
              ═══════════════════════════════════════════════ */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-2 px-1">Nos services</h3>
            <div className="grid grid-cols-2 gap-2">
              {SAV_SERVICES.map((service) => {
                const Icon = service.icon;
                return (
                  <motion.div key={service.title} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Card
                      className="border-border cursor-pointer group hover:shadow-md transition-all h-full"
                      onClick={() => {
                        switch (service.title) {
                          case 'Suivi des paiements':
                            setShowPaymentDialog(true);
                            break;
                          case 'Documents & attestations':
                            setShowDocsDialog(true);
                            break;
                          case 'Réclamations & litiges':
                            setShowReclamationDialog(true);
                            break;
                          case 'Assistance technique':
                            setShowAssistanceDialog(true);
                            break;
                        }
                      }}
                    >
                      <CardContent className="p-3 flex flex-col items-center text-center gap-1.5">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: `${service.color}20` }}
                        >
                          <Icon className="h-4.5 w-4.5" style={{ color: service.color }} />
                        </div>
                        <p className="text-[11px] font-bold text-foreground">{service.title}</p>
                        <p className="text-[10px] text-muted-foreground leading-snug">{service.description}</p>
                        <div className="mt-0.5 flex items-center gap-0.5 text-[9px] font-semibold" style={{ color: service.color }}>
                          <span>Ouvrir</span>
                          <ChevronDown className="h-2.5 w-2.5 group-hover:translate-y-0.5 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Besoin d'un expert pour votre projet ? */}
          <AnimatePresence mode="wait">
            {!showExpertPanel ? (
              <motion.div
                key="expert-cta"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-amber-200 dark:border-amber-900/50 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-card overflow-hidden cursor-pointer"
                  onClick={() => handleOpenExpertPanel()}
                >
                  <CardContent className="p-3.5 text-center">
                    <motion.div
                      className="w-11 h-11 bg-amber-100 dark:bg-amber-900/40 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md shadow-amber-200/50 dark:shadow-amber-900/30"
                      animate={{
                        boxShadow: [
                          '0 4px 6px -1px rgba(245,158,11,0.2)',
                          '0 10px 15px -3px rgba(245,158,11,0.4)',
                          '0 4px 6px -1px rgba(245,158,11,0.2)',
                        ],
                      }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <HardHat className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </motion.div>
                    <h3 className="text-xs font-bold text-foreground mb-0.5">
                      Besoin d&apos;un expert pour votre projet ?
                    </h3>
                    <p className="text-[10px] text-muted-foreground max-w-xs mx-auto leading-relaxed mb-2.5">
                      Choisissez l&apos;un de nos partenaires qualifiés et nous vous
                      mettrons en relation rapidement.
                    </p>
                    <Button
                      className="relative overflow-hidden bg-amber-500 hover:bg-amber-600 text-white font-bold w-full text-xs shadow-md shadow-amber-500/25 transition-all hover:scale-[1.02] h-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenExpertPanel();
                      }}
                    >
                      <motion.span
                        className="absolute inset-0"
                        animate={{
                          background: ['rgba(255,255,255,0)', 'rgba(255,255,255,0.15)', 'rgba(255,255,255,0)'],
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      <ChevronDown className="h-4 w-4 mr-2" />
                      <motion.span
                        animate={{ scale: [1, 1.03, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        Voir nos experts disponibles
                      </motion.span>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="expert-panel"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              >
                <ExpertDetailPanel
                  initialCategoryId={selectedExpertCategoryId}
                  onBack={handleBackFromExpertPanel}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Horaires */}
          <Card className="border-border">
            <CardContent className="p-3.5">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-foreground">Horaires d&apos;ouverture</h3>
              </div>
              <div className="space-y-1.5">
                {savHoraires.map((h) => (
                  <div key={h.day} className="flex justify-between items-center text-xs py-1.5 border-b border-border last:border-0">
                    <span className="text-muted-foreground font-medium">{h.day}</span>
                    <span className={h.hours === 'Fermé' ? 'text-red-500 font-bold' : 'text-foreground font-bold'}>
                      {h.hours}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <div>
            <div className="flex items-center gap-2 mb-2 px-1">
              <HelpCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-foreground">Questions fréquentes</h3>
            </div>
            <div className="space-y-1.5">
              {savFaq.map((item, index) => {
                const isOpen = openFaq === index;
                return (
                  <Card key={index} className={`border-border transition-all ${isOpen ? 'border-emerald-300 dark:border-emerald-800' : ''}`}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full text-left p-3 flex items-center justify-between gap-3"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm font-bold text-foreground flex-1">{item.question}</span>
                      <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-3 pb-3 -mt-1">
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{item.answer}</p>
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
              <CardContent className="p-3.5 text-center">
                <p className="text-sm font-bold text-foreground mb-0.5">Déjà client ?</p>
                <p className="text-[11px] text-muted-foreground mb-2.5">
                  Connectez-vous pour suivre vos demandes et l&apos;avancée de vos paiements en temps réel.
                </p>
                <Button onClick={onLoginClick} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold w-full h-10 text-xs">
                  Se connecter à mon espace
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Note de bas de page */}
          <div className="text-center pb-1 pt-0">
            <p className="text-[11px] text-muted-foreground">
              KAMI-EXTENSION · Service après-vente à votre service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
