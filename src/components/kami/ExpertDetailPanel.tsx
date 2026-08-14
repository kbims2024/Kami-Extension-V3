'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  Star,
  MapPin,
  Clock,
  Award,
  CheckCircle2,
  ChevronRight,
  Users,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  UserPlus,
  Send,
} from 'lucide-react';
import { toast } from 'sonner';
import { PartnerExpertApplicationForm } from './PartnerExpertApplicationForm';

// ── Types ──
interface Expert {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  reviewCount: number;
  phone: string;
  whatsapp: string;
  image: string;
  bio: string;
  location: string;
  certifications: string[];
  availability: string;
  projects: number;
}

interface ExpertCategory {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  experts: Expert[];
}

// ── Expert data ──
export const EXPERT_CATEGORIES: ExpertCategory[] = [
  {
    id: 'electricien',
    title: 'Électriciens',
    icon: '⚡',
    color: '#F59E0B',
    description: 'Installation électrique, mise aux normes NFC 15-100, dépannage.',
    experts: [
      {
        id: 'electricien-1',
        name: 'Kouassi Yao',
        specialty: 'Installation électrique résidentielle',
        experience: '12 ans',
        rating: 4.8,
        reviewCount: 47,
        phone: '+225 07 12 34 56 78',
        whatsapp: 'https://wa.me/2250712345678',
        image: '/experts/electricien-1.png',
        bio: 'Électricien certifié avec 12 ans d\'expérience dans l\'installation résidentielle et tertiaire en Côte d\'Ivoire. Spécialiste des mises aux normes NFC 15-100.',
        location: 'Abidjan, Cocody',
        certifications: ['Certification NFC 15-100', ' habilitation électrique', 'Diplôme BTS Électrotechnique'],
        availability: 'Disponible sous 48h',
        projects: 156,
      },
      {
        id: 'electricien-2',
        name: 'Diarra Moussa',
        specialty: 'Mise aux normes & dépannage',
        experience: '8 ans',
        rating: 4.6,
        reviewCount: 32,
        phone: '+225 05 98 76 54 32',
        whatsapp: 'https://wa.me/2250598765432',
        image: '/experts/electricien-2.png',
        bio: 'Dépanneur électricien expérimenté, intervention rapide 7j/7 pour les urgences. Expert en diagnostic de défauts et remise aux normes.',
        location: 'Abidjan, Yopougon',
        certifications: ['Certification NFC 15-100', 'Habilitation B2V', 'Formé en photovoltaïque'],
        availability: 'Urgences : même jour',
        projects: 98,
      },
    ],
  },
  {
    id: 'plombier',
    title: 'Plombiers',
    icon: '🔧',
    color: '#3B82F6',
    description: 'Alimentation en eau, sanitaire, réparation de fuites.',
    experts: [
      {
        id: 'plombier-1',
        name: 'Koné Ibrahim',
        specialty: 'Plomberie sanitaire complète',
        experience: '15 ans',
        rating: 4.9,
        reviewCount: 63,
        phone: '+225 01 23 45 67 89',
        whatsapp: 'https://wa.me/2250123456789',
        image: '/experts/plombier-1.png',
        bio: 'Expert en plomberie sanitaire avec 15 ans d\'expérience. Maîtrise les installations complexes, le raccordement réseau d\'eau et la rénovation complète.',
        location: 'Abidjan, Marcory',
        certifications: ['Certification Plomberie Professionnelle', 'Technicien supérieur', 'Expert en détection de fuites'],
        availability: 'Disponible sous 24h',
        projects: 210,
      },
      {
        id: 'plombier-2',
        name: 'Traoré Amadou',
        specialty: 'Raccordement & viabilisation',
        experience: '10 ans',
        rating: 4.7,
        reviewCount: 38,
        phone: '+225 07 55 44 33 22',
        whatsapp: 'https://wa.me/2250755443322',
        image: '/experts/plombier-2.png',
        bio: 'Spécialiste du raccordement au réseau d\'eau potable et de la viabilisation de lots. Expérience confirmée dans les chantiers résidentiels.',
        location: 'Abidjan, Treichville',
        certifications: ['Certification SODECI', 'Technicien raccordement', 'Gestionnaire de chantier'],
        availability: 'Disponible sous 48h',
        projects: 134,
      },
    ],
  },
  {
    id: 'macon',
    title: 'Maçons',
    icon: '🏗️',
    color: '#EF4444',
    description: 'Fondations, murs, dalle et travaux en gros œuvre.',
    experts: [
      {
        id: 'macon-1',
        name: 'Bamba Adama',
        specialty: 'Gros œuvre & fondations',
        experience: '18 ans',
        rating: 4.8,
        reviewCount: 52,
        phone: '+225 05 11 22 33 44',
        whatsapp: 'https://wa.me/2250511223344',
        image: '/experts/macon-1.png',
        bio: 'Maçon chevronné spécialisé dans le gros œuvre. Expert en fondations, dallage et construction de murs porteurs. Travaille sur des chantiers de toutes tailles.',
        location: 'Abidjan, Plateau',
        certifications: ['Maître d\'œuvre certifié', 'BP Maçonnerie', 'Gestion de chantier niveau II'],
        availability: 'Disponible sous 72h',
        projects: 178,
      },
      {
        id: 'macon-2',
        name: 'Soro Moussa',
        specialty: 'Construction & rénovation',
        experience: '11 ans',
        rating: 4.5,
        reviewCount: 29,
        phone: '+225 07 66 77 88 99',
        whatsapp: 'https://wa.me/2250766778899',
        image: '/experts/macon-2.png',
        bio: 'Maçon polyvalent expérimenté dans les constructions neuves et les rénovations lourdes. Capacité à gérer des équipes de 5 à 15 ouvriers.',
        location: 'Bingerville',
        certifications: ['CAP Maçonnerie', 'Chef d\'équipe certifié', 'Technique de béton armé'],
        availability: 'Disponible sous 48h',
        projects: 112,
      },
    ],
  },
  {
    id: 'menuisier',
    title: 'Menuisiers',
    icon: '🪟',
    color: '#8B5E3C',
    description: 'Portes, fenêtres, volets, placards et agencement.',
    experts: [
      {
        id: 'menuisier-1',
        name: 'Cissé Alassane',
        specialty: 'Menuiserie bois & aluminium',
        experience: '14 ans',
        rating: 4.7,
        reviewCount: 41,
        phone: '+225 01 44 55 66 77',
        whatsapp: 'https://wa.me/2250144556677',
        image: '/experts/menuisier-1.png',
        bio: 'Menuisier artisan spécialisé dans les travaux sur mesure en bois et aluminium. Portes, fenêtres, volets roulants et agencement intérieur.',
        location: 'Abidjan, Adjamé',
        certifications: ['Certification Artisan Menuisier', 'Formation aluminium', 'Décorateur d\'intérieur'],
        availability: 'Disponible sous 3 jours',
        projects: 145,
      },
      {
        id: 'menuisier-2',
        name: 'Dembélé Karim',
        specialty: 'Agencement & mobilier sur mesure',
        experience: '9 ans',
        rating: 4.6,
        reviewCount: 27,
        phone: '+225 07 33 22 11 00',
        whatsapp: 'https://wa.me/2250733221100',
        image: '/experts/menuisier-2.png',
        bio: 'Menuisier créatif spécialisé en mobilier sur mesure et agencement. Cuisine, dressing, bureau — je crée des espaces fonctionnels et esthétiques.',
        location: 'Abidjan, Cocody',
        certifications: ['BTS Productique bois', 'Designer mobilier', 'Certification sécurité'],
        availability: 'Disponible sous 5 jours',
        projects: 87,
      },
    ],
  },
  {
    id: 'carreleur',
    title: 'Carreleurs',
    icon: '🔲',
    color: '#6366F1',
    description: 'Carrelage au sol et faïence murale, finitions soignées.',
    experts: [
      {
        id: 'carreleur-1',
        name: 'Ouattara Dramane',
        specialty: 'Carrelage sol & mur',
        experience: '13 ans',
        rating: 4.8,
        reviewCount: 44,
        phone: '+225 05 66 77 88 99',
        whatsapp: 'https://wa.me/2250566778899',
        image: '/experts/carreleur-1.png',
        bio: 'Carreleur expert maîtrisant toutes les techniques de pose : droit, diagonal, mosaïque, marbre. Finitions irréprochables pour un résultat professionnel.',
        location: 'Abidjan, Abobo',
        certifications: ['Certification Carreleur professionnel', 'Pose marbre & granit', 'Technique joints'],
        availability: 'Disponible sous 48h',
        projects: 162,
      },
      {
        id: 'carreleur-2',
        name: 'Konaté Seydou',
        specialty: 'Faïence & mosaïque décorative',
        experience: '10 ans',
        rating: 4.7,
        reviewCount: 33,
        phone: '+225 07 22 33 44 55',
        whatsapp: 'https://wa.me/2250722334455',
        image: '/experts/carreleur-2.png',
        bio: 'Spécialiste de la faïence murale et des créations en mosaïque. Je transforme vos salles de bain et cuisines en véritables espaces design.',
        location: 'Abidjan, Koumassi',
        certifications: ['CAP Carreleur', 'Spécialiste mosaïque', 'Pose piscine'],
        availability: 'Disponible sous 72h',
        projects: 118,
      },
    ],
  },
  {
    id: 'peintre',
    title: 'Peintres',
    icon: '🎨',
    color: '#10B981',
    description: 'Peinture intérieure et extérieure, préparation, finitions.',
    experts: [
      {
        id: 'peintre-1',
        name: 'Diallo Fatoumata',
        specialty: 'Peinture décorative & finitions',
        experience: '11 ans',
        rating: 4.9,
        reviewCount: 55,
        phone: '+225 01 77 88 99 00',
        whatsapp: 'https://wa.me/2250177889900',
        image: '/experts/peintre-1.png',
        bio: 'Peintre professionnelle spécialisée dans les finitions haut de gamme. Techniques décoratives, effets et faux finis pour un rendu exceptionnel.',
        location: 'Abidjan, Zone 4',
        certifications: ['Certification Peintre décorateur', 'Formation faux finis', 'Technique rodéo'],
        availability: 'Disponible sous 48h',
        projects: 189,
      },
      {
        id: 'peintre-2',
        name: 'Coulibaly Bakary',
        specialty: 'Peinture extérieure & ravalement',
        experience: '16 ans',
        rating: 4.6,
        reviewCount: 36,
        phone: '+225 07 11 22 33 44',
        whatsapp: 'https://wa.me/2250711223344',
        image: '/experts/peintre-2.png',
        bio: 'Expert en peinture extérieure et ravalement de façades. Travaille avec des peintures de qualité professionnelle résistant au climat tropical.',
        location: 'Abidjan, Bingerville',
        certifications: ['Certification ravalement façade', 'Peinture industrielle', 'Expert humidité'],
        availability: 'Disponible sous 3 jours',
        projects: 156,
      },
    ],
  },
  {
    id: 'conducteur_travaux',
    title: 'Conducteurs de travaux',
    icon: '👷',
    color: '#0EA5E9',
    description: 'Supervise et coordonne votre chantier de A à Z.',
    experts: [
      {
        id: 'conducteur-1',
        name: 'N\'Guessan Roland',
        specialty: 'Coordination & suivi de chantier',
        experience: '20 ans',
        rating: 4.9,
        reviewCount: 58,
        phone: '+225 05 99 88 77 66',
        whatsapp: 'https://wa.me/2250599887766',
        image: '/experts/conducteur-1.png',
        bio: 'Ingénieur en génie civil avec 20 ans d\'expérience en conduite de travaux. Gère des chantiers résidentiels et commerciaux jusqu\'à 500M FCFA.',
        location: 'Abidjan, Plateau',
        certifications: ['Ingénieur Génie Civil', 'PMP certifié', 'Expert bâtiment tropical'],
        availability: 'Disponible sous 1 semaine',
        projects: 89,
      },
      {
        id: 'conducteur-2',
        name: 'Aka Jean-Marc',
        specialty: 'Gestion de projet résidentiel',
        experience: '12 ans',
        rating: 4.7,
        reviewCount: 34,
        phone: '+225 07 44 55 66 77',
        whatsapp: 'https://wa.me/2250744556677',
        image: '/experts/conducteur-2.png',
        bio: 'Conducteur de travaux spécialisé dans les projets résidentiels. Coordination des corps de métiers, planning, budget et qualité.',
        location: 'Abidjan, Cocody',
        certifications: ['BTS Bâtiment', 'Chef de chantier certifié', 'Gestion planning MS Project'],
        availability: 'Disponible sous 72h',
        projects: 67,
      },
    ],
  },
  {
    id: 'geometre',
    title: 'Géomètres',
    icon: '📐',
    color: '#D946EF',
    description: 'Bornage, topographie et délimitation de terrain.',
    experts: [
      {
        id: 'geometre-1',
        name: 'Yao Kouamé',
        specialty: 'Bornage & topographie foncière',
        experience: '22 ans',
        rating: 4.9,
        reviewCount: 71,
        phone: '+225 01 55 66 77 88',
        whatsapp: 'https://wa.me/2250155667788',
        image: '/experts/geometre-1.png',
        bio: 'Géomètre-expert agréé avec 22 ans d\'expérience. Bornage, délimitation, implantation et topographie. Certifié par l\'Ordre des Géomètres.',
        location: 'Abidjan, Cocody',
        certifications: ['Géomètre-expert agréé', 'Ordre des Géomètres CI', 'Expert foncier certifié'],
        availability: 'Disponible sous 5 jours',
        projects: 320,
      },
      {
        id: 'geometre-2',
        name: 'Essis Emmanuel',
        specialty: 'Délimitation & plan cadastral',
        experience: '14 ans',
        rating: 4.7,
        reviewCount: 45,
        phone: '+225 07 88 99 00 11',
        whatsapp: 'https://wa.me/2250788990011',
        image: '/experts/geometre-2.png',
        bio: 'Géomètre spécialisé dans la délimitation parcellaire et l\'établissement de plans cadastraux. Intervention précise et rapide.',
        location: 'Abidjan, Treichville',
        certifications: ['Licence Géomatique', 'Géomètre agréé', 'SIG & GPS avancé'],
        availability: 'Disponible sous 3 jours',
        projects: 198,
      },
    ],
  },
];

// ── Fallback avatar with initials ──
function ExpertAvatar({ expert, size = 'lg' }: { expert: Expert; size?: 'sm' | 'lg' }) {
  const [imgError, setImgError] = useState(false);
  const initials = expert.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const sizeClass = size === 'lg' ? 'w-20 h-20 text-2xl' : 'w-12 h-12 text-sm';

  if (imgError || !expert.image) {
    return (
      <div
        className={`${sizeClass} rounded-full flex items-center justify-center font-bold text-white shrink-0 shadow-lg`}
        style={{ backgroundColor: EXPERT_CATEGORIES.find((c) => c.experts.some((e) => e.id === expert.id))?.color || '#6B7280' }}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={expert.image}
      alt={expert.name}
      className={`${sizeClass} rounded-full object-cover shrink-0 shadow-lg border-2 border-white/50`}
      onError={() => setImgError(true)}
    />
  );
}

// ── Star rating component ──
function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`h-3.5 w-3.5 ${s <= Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-amber-400/30'}`}
          />
        ))}
      </div>
      <span className="text-[11px] font-bold text-foreground">{rating}</span>
      <span className="text-[10px] text-muted-foreground">({count} avis)</span>
    </div>
  );
}

// ── Expert category card ──
function CategoryCard({
  category,
  onSelect,
}: {
  category: ExpertCategory;
  onSelect: (cat: ExpertCategory) => void;
}) {
  return (
    <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
      <Card
        className="border-2 border-border cursor-pointer group hover:shadow-lg transition-all overflow-hidden"
        onClick={() => onSelect(category)}
      >
        <CardContent className="p-3.5">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-xl"
              style={{ backgroundColor: `${category.color}18` }}
            >
              {category.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground leading-tight">{category.title}</p>
              <p className="text-[10px] text-muted-foreground leading-snug mt-0.5 line-clamp-2">
                {category.description}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Badge
                variant="secondary"
                className="text-[10px] font-bold px-2 py-0.5"
                style={{ backgroundColor: `${category.color}15`, color: category.color }}
              >
                {category.experts.length} dispo
              </Badge>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Expert card in list view ──
function ExpertCard({
  expert,
  color,
  onSelect,
}: {
  expert: Expert;
  color: string;
  onSelect: (e: Expert) => void;
}) {
  return (
    <motion.div whileHover={{ scale: 1.01, y: -1 }} whileTap={{ scale: 0.99 }}>
      <Card
        className="border-border cursor-pointer group hover:shadow-md transition-all"
        onClick={() => onSelect(expert)}
      >
        <CardContent className="p-3.5">
          <div className="flex items-start gap-3">
            <ExpertAvatar expert={expert} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-foreground truncate">{expert.name}</p>
                <span className="text-[10px] font-semibold text-muted-foreground shrink-0">{expert.experience}</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{expert.specialty}</p>
              <div className="mt-1.5">
                <StarRating rating={expert.rating} count={expert.reviewCount} />
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">{expert.location}</span>
                </div>
                <span className="text-muted-foreground/30">·</span>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Briefcase className="h-3 w-3 shrink-0" />
                  <span>{expert.projects} projets</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Expert detail view ──
function ExpertDetailView({
  expert,
  color,
  onBack,
}: {
  expert: Expert;
  color: string;
  onBack: () => void;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={expert.id}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="space-y-3"
      >
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground px-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Retour aux experts
        </Button>

        {/* Profile header */}
        <Card className="border-border overflow-hidden">
          <div
            className="px-4 pt-5 pb-6 text-center relative"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)` }}
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-6 -right-6 w-28 h-28 bg-white rounded-full" />
              <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-white rounded-full" />
            </div>
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
              >
                <ExpertAvatar expert={expert} size="lg" />
              </motion.div>
              <motion.h3
                className="text-lg font-bold text-white mt-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {expert.name}
              </motion.h3>
              <motion.p
                className="text-white/80 text-xs mt-0.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {expert.specialty}
              </motion.p>
              <motion.div
                className="flex justify-center mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <StarRating rating={expert.rating} count={expert.reviewCount} />
              </motion.div>
            </div>
          </div>

          <CardContent className="p-4 space-y-4">
            {/* Bio */}
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <GraduationCap className="h-4 w-4" style={{ color }} />
                <h4 className="text-xs font-bold text-foreground">À propos</h4>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{expert.bio}</p>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50 border border-border">
                <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Expérience</p>
                  <p className="text-xs font-bold text-foreground">{expert.experience}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50 border border-border">
                <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Projets réalisés</p>
                  <p className="text-xs font-bold text-foreground">{expert.projects}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50 border border-border col-span-2">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Zone d&apos;intervention</p>
                  <p className="text-xs font-bold text-foreground">{expert.location}</p>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div
              className="flex items-center gap-2 p-2.5 rounded-lg border"
              style={{ backgroundColor: `${color}10`, borderColor: `${color}30` }}
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color }} />
              <p className="text-[11px] font-semibold" style={{ color }}>
                {expert.availability}
              </p>
            </div>

            {/* Certifications */}
            {expert.certifications.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Award className="h-4 w-4" style={{ color }} />
                  <h4 className="text-xs font-bold text-foreground">Certifications</h4>
                </div>
                <div className="space-y-1.5">
                  {expert.certifications.map((cert, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="flex items-center gap-2 text-[11px]"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 shrink-0" style={{ color }} />
                      <span className="text-muted-foreground">{cert}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact buttons */}
            <div className="space-y-2 pt-1">
              <a href={`tel:${expert.phone.replace(/\s/g, '')}`} className="block">
                <Button className="w-full h-11 text-xs font-bold text-white transition-all hover:scale-[1.02]" style={{ backgroundColor: color }}>
                  <Phone className="h-4 w-4 mr-2" />
                  Appeler {expert.name.split(' ')[0]}
                </Button>
              </a>
              <a href={expert.whatsapp} target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="outline" className="w-full h-11 text-xs font-bold border-green-200 hover:bg-green-50 hover:border-green-400 transition-all hover:scale-[1.02]">
                  <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
                  Contacter par WhatsApp
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Main ExpertDetailPanel component ──
interface ExpertDetailPanelProps {
  initialCategoryId?: string;
  onBack: () => void;
}

type PanelView = 'categories' | 'categoryExperts' | 'expertDetail';

export function ExpertDetailPanel({ initialCategoryId, onBack }: ExpertDetailPanelProps) {
  const [currentView, setCurrentView] = useState<PanelView>(
    initialCategoryId ? 'categoryExperts' : 'categories'
  );
  const [selectedCategory, setSelectedCategory] = useState<ExpertCategory | null>(
    initialCategoryId ? EXPERT_CATEGORIES.find((c) => c.id === initialCategoryId) || null : null
  );
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [dynamicCategories, setDynamicCategories] = useState<ExpertCategory[]>([]);
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);

  // Fetch approved experts from DB and merge into categories
  useEffect(() => {
    async function loadApprovedExperts() {
      try {
        const res = await fetch('/api/approved-experts');
        if (res.ok) {
          const data = await res.json();
          const approved: Expert[] = data.experts.map((e: any) => ({
            ...e,
            reviewCount: e.reviewCount || 0,
            rating: e.rating || 0,
            projects: e.projects || 0,
            image: e.image || '',
            whatsapp: e.whatsapp || '',
            certifications: e.certifications || [],
          }));

          // Group by categoryId
          const grouped = new Map<string, Expert[]>();
          for (const expert of approved) {
            const catId = (expert as any).categoryId || expert.specialty?.toLowerCase() || 'other';
            if (!grouped.has(catId)) grouped.set(catId, []);
            grouped.get(catId)!.push(expert);
          }

          // Build dynamic categories with approved experts merged
          const merged: ExpertCategory[] = EXPERT_CATEGORIES.map((cat) => {
            const extraExperts = grouped.get(cat.id) || [];
            if (extraExperts.length > 0) {
              return { ...cat, experts: [...cat.experts, ...extraExperts] };
            }
            return cat;
          });
          setDynamicCategories(merged);
        }
      } catch (err) {
        // Silently fail - we just show the static experts
      }
    }
    loadApprovedExperts();
  }, []);

  // Use dynamic categories (with approved experts merged) or fall back to static
  const displayCategories = dynamicCategories.length > 0 ? dynamicCategories : EXPERT_CATEGORIES;

  const handleCategorySelect = (category: ExpertCategory) => {
    setSelectedCategory(category);
    setSelectedExpert(null);
    setCurrentView('categoryExperts');
  };

  const handleExpertSelect = (expert: Expert) => {
    setSelectedExpert(expert);
    setCurrentView('expertDetail');
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedExpert(null);
    setCurrentView('categories');
  };

  const handleBackToExperts = () => {
    setSelectedExpert(null);
    setCurrentView('categoryExperts');
  };



  const currentColor = selectedCategory?.color || '#6B7280';

  // Expert detail view
  if (currentView === 'expertDetail' && selectedExpert) {
    return (
      <div className="space-y-0">
        <ExpertDetailView
          expert={selectedExpert}
          color={currentColor}
          onBack={handleBackToExperts}
        />
      </div>
    );
  }

  // Category experts list view
  if (currentView === 'categoryExperts' && selectedCategory) {
    return (
      <div className="space-y-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackToCategories}
          className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground px-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Retour aux catégories
        </Button>

        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-base"
            style={{ backgroundColor: `${currentColor}18` }}
          >
            {selectedCategory.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-foreground">{selectedCategory.title}</h3>
            <p className="text-[10px] text-muted-foreground leading-snug">{selectedCategory.description}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[10px] font-bold text-muted-foreground">{selectedCategory.experts.length} experts</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory.id}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
              exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
            }}
            className="space-y-2"
          >
            {selectedCategory.experts.map((expert) => (
              <motion.div
                key={expert.id}
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } },
                  exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } },
                }}
              >
                <ExpertCard expert={expert} color={currentColor} onSelect={handleExpertSelect} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Trust banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-start gap-2 p-3 rounded-xl border"
          style={{ backgroundColor: `${currentColor}08`, borderColor: `${currentColor}25` }}
        >
          <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" style={{ color: currentColor }} />
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Tous nos experts sont vérifiés et sélectionnés pour leur professionnalisme. KAMI-EXTENSION assure la mise en relation.
          </p>
        </motion.div>
      </div>
    );
  }

  // Main categories list
  return (
    <>
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground px-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Retour au SAV
        </Button>
      </div>

      <div className="text-center mb-1">
        <h3 className="text-base font-bold text-foreground">Nos experts partenaires</h3>
        <p className="text-[11px] text-muted-foreground mt-0.5 max-w-md mx-auto leading-relaxed">
          Sélectionnez un métier pour consulter nos experts disponibles et leurs profils détaillés.
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06 } },
          }}
          className="space-y-2"
        >
          {displayCategories.map((category) => (
            <motion.div
              key={category.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
              }}
            >
              <CategoryCard category={category} onSelect={handleCategorySelect} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center justify-around p-3 rounded-xl bg-muted/30 border border-border"
      >
        <div className="text-center">
          <p className="text-sm font-bold text-foreground">{displayCategories.length}</p>
          <p className="text-[10px] text-muted-foreground">Métiers</p>
        </div>
        <div className="w-px h-6 bg-border" />
        <div className="text-center">
          <p className="text-sm font-bold text-foreground">
            {displayCategories.reduce((acc, c) => acc + c.experts.length, 0)}
          </p>
          <p className="text-[10px] text-muted-foreground">Experts</p>
        </div>
        <div className="w-px h-6 bg-border" />
        <div className="text-center">
          <p className="text-sm font-bold text-emerald-600">Vérifiés</p>
          <p className="text-[10px] text-muted-foreground">Certifiés</p>
        </div>
      </motion.div>

      {/* CTA - Je veux devenir expert partenaire */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card
          className="border-2 border-dashed border-emerald-300 dark:border-emerald-700 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-card overflow-hidden hover:shadow-lg transition-all"
        >
          <CardContent className="p-4 text-center">
            <motion.div
              className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center mx-auto mb-2.5 shadow-md"
              animate={{
                boxShadow: [
                  '0 4px 6px -1px rgba(16,185,129,0.2)',
                  '0 10px 15px -3px rgba(16,185,129,0.4)',
                  '0 4px 6px -1px rgba(16,185,129,0.2)',
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <UserPlus className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </motion.div>
            <h3 className="text-xs font-bold text-foreground mb-0.5">
              Je veux faire partie des experts partenaires
            </h3>
            <p className="text-[10px] text-muted-foreground max-w-xs mx-auto leading-relaxed mb-3">
              Vous êtes professionnel du bâtiment ? Postulez pour rejoindre notre réseau d&apos;experts vérifiés.
            </p>
            <Button
              className="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/25 transition-all hover:scale-[1.02] h-10"
              onClick={(e) => {
                e.stopPropagation();
                setShowApplicationDialog(true);
              }}
            >
              <motion.span
                className="absolute inset-0"
                animate={{
                  background: ['rgba(255,255,255,0)', 'rgba(255,255,255,0.15)', 'rgba(255,255,255,0)'],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <Send className="h-4 w-4 mr-2" />
              <span>Postuler maintenant</span>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>

      {/* Application Dialog - opens as new window */}
      <PartnerExpertApplicationForm
        open={showApplicationDialog}
        onOpenChange={setShowApplicationDialog}
      />
    </>
  );
}
