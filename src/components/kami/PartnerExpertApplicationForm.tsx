'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Send,
  UserPlus,
  Phone,
  MessageCircle,
  MapPin,
  Briefcase,
  GraduationCap,
  Clock,
  Award,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

interface PartnerExpertApplicationFormProps {
  onBack: () => void;
  onSubmitted: () => void;
}

const EXPERT_CATEGORY_OPTIONS = [
  { id: 'electricien', label: 'Électricien', icon: '⚡', color: '#F59E0B' },
  { id: 'plombier', label: 'Plombier', icon: '🔧', color: '#3B82F6' },
  { id: 'macon', label: 'Maçon', icon: '🏗️', color: '#EF4444' },
  { id: 'menuisier', label: 'Menuisier', icon: '🪟', color: '#8B5E3C' },
  { id: 'carreleur', label: 'Carreleur', icon: '🔲', color: '#6366F1' },
  { id: 'peintre', label: 'Peintre', icon: '🎨', color: '#10B981' },
  { id: 'conducteur_travaux', label: 'Conducteur de travaux', icon: '👷', color: '#0EA5E9' },
  { id: 'geometre', label: 'Géomètre', icon: '📐', color: '#D946EF' },
];

export function PartnerExpertApplicationForm({ onBack, onSubmitted }: PartnerExpertApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [experience, setExperience] = useState('');
  const [location, setLocation] = useState('');
  const [certInput, setCertInput] = useState('');
  const [certifications, setCertifications] = useState<string[]>([]);
  const [bio, setBio] = useState('');
  const [availability, setAvailability] = useState('');

  const addCertification = () => {
    const trimmed = certInput.trim();
    if (trimmed && !certifications.includes(trimmed)) {
      setCertifications([...certifications, trimmed]);
      setCertInput('');
    }
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const handleKeyDownCert = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCertification();
    }
  };

  const handleSubmit = async () => {
    // Validate
    if (!fullName.trim() || !phone.trim() || !selectedCategory || !specialty.trim() || !experience.trim() || !location.trim() || !bio.trim()) {
      toast.error('Veuillez remplir tous les champs obligatoires (*)');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/expert-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          whatsapp: whatsapp || null,
          categoryId: selectedCategory,
          specialty,
          experience,
          location,
          certifications,
          bio,
          availability: availability || 'Disponible sous 72h',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Erreur lors de la soumission.');
        return;
      }

      toast.success(data.message, { duration: 6000 });
      setIsSubmitted(true);
      setTimeout(() => {
        onSubmitted();
      }, 3000);
    } catch (error) {
      toast.error('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="submitted"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4 text-center py-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto"
          >
            <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h3 className="text-base font-bold text-foreground">Candidature envoyée !</h3>
            <p className="text-[11px] text-muted-foreground mt-1.5 max-w-xs mx-auto leading-relaxed">
              Votre demande a été transmise au Comité de Gestion des Lots.
              Vous serez notifié après l&apos;analyse de votre dossier.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 justify-center p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50"
          >
            <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0" />
            <p className="text-[10px] text-muted-foreground">
              Le comité examine chaque candidature dans un délai de 5 jours ouvrés.
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  const catInfo = EXPERT_CATEGORY_OPTIONS.find((c) => c.id === selectedCategory);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground px-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Retour aux experts
        </Button>
      </div>

      {/* Title */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg shadow-emerald-500/30"
        >
          <UserPlus className="h-6 w-6 text-white" />
        </motion.div>
        <h3 className="text-sm font-bold text-foreground">Devenir expert partenaire</h3>
        <p className="text-[10px] text-muted-foreground mt-0.5 max-w-md mx-auto leading-relaxed">
          Remplissez le formulaire ci-dessous. Le Comité de Gestion des Lots analysera votre candidature.
        </p>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        {/* Category selection */}
        <Card className="border-border">
          <CardContent className="p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <Label className="text-xs font-bold text-foreground">Catégorie d&apos;expertise *</Label>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full h-10 text-xs">
                <SelectValue placeholder="Sélectionnez votre métier" />
              </SelectTrigger>
              <SelectContent>
                {EXPERT_CATEGORY_OPTIONS.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCategory && catInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center gap-2 p-2 rounded-lg"
                style={{ backgroundColor: `${catInfo.color}10`, borderColor: `${catInfo.color}30` }}
              >
                <span className="text-base">{catInfo.icon}</span>
                <span className="text-[10px] font-semibold" style={{ color: catInfo.color }}>
                  {catInfo.label}
                </span>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Personal info */}
        <Card className="border-border">
          <CardContent className="p-3.5 space-y-3">
            <div className="flex items-center gap-1.5 mb-0.5">
              <UserPlus className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold text-foreground">Informations personnelles</span>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold text-muted-foreground">
                Nom complet *
              </Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: Kouassi Yao Jean"
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" /> Téléphone *
                </Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+225 07 XX XX XX XX"
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" /> WhatsApp
                </Label>
                <Input
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+225 07 XX XX XX XX"
                  className="h-9 text-xs"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional info */}
        <Card className="border-border">
          <CardContent className="p-3.5 space-y-3">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Briefcase className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold text-foreground">Parcours professionnel</span>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold text-muted-foreground">
                Spécialité détaillée *
              </Label>
              <Input
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="Ex: Installation électrique résidentielle"
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Expérience *
                </Label>
                <Input
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="Ex: 10 ans"
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Localisation *
                </Label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex: Abidjan, Cocody"
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                <GraduationCap className="h-3 w-3" /> Disponibilité
              </Label>
              <Input
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                placeholder="Ex: Disponible sous 48h"
                className="h-9 text-xs"
              />
            </div>

            {/* Certifications */}
            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                <Award className="h-3 w-3" /> Certifications & diplômes
              </Label>
              <div className="flex gap-2">
                <Input
                  value={certInput}
                  onChange={(e) => setCertInput(e.target.value)}
                  onKeyDown={handleKeyDownCert}
                  placeholder="Tapez puis Entrée pour ajouter"
                  className="h-9 text-xs flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCertification}
                  className="h-9 text-xs px-3 shrink-0"
                >
                  Ajouter
                </Button>
              </div>
              {certifications.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {certifications.map((cert, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-semibold px-2.5 py-1 flex items-center gap-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
                        onClick={() => removeCertification(i)}
                      >
                        <ShieldCheck className="h-2.5 w-2.5" />
                        {cert}
                        <span className="ml-0.5 text-destructive/60">×</span>
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bio */}
        <Card className="border-border">
          <CardContent className="p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 mb-0.5">
              <GraduationCap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold text-foreground">À propos de vous</span>
            </div>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Décrivez votre parcours, vos compétences et ce qui vous distingue..."
              className="text-xs min-h-[80px] resize-none"
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full h-11 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Soumettre ma candidature
              </>
            )}
          </Button>
        </motion.div>

        {/* Info notice */}
        <div className="flex items-start gap-2 p-3 rounded-xl bg-muted/30 border border-border">
          <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            En soumettant ce formulaire, vous acceptez que vos informations soient transmises au Comité de Gestion des Lots
            qui analysera votre dossier et décidera de votre intégration comme expert partenaire KAMI-EXTENSION.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
