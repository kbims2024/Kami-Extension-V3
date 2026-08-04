'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
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
  Camera,
  X,
  ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';

interface PartnerExpertApplicationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function PartnerExpertApplicationForm({ open, onOpenChange }: PartnerExpertApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleProfileImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast.error('Format d\'image non supporté (JPEG, PNG, WebP ou GIF).');
      return;
    }

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 5 Mo.');
      return;
    }

    setProfileFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const removeProfileImage = () => {
    setProfileFile(null);
    setProfilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDialogChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form when closing
      setIsSubmitted(false);
      setSelectedCategory('');
      setProfileFile(null);
      setProfilePreview(null);
      setFullName('');
      setPhone('');
      setWhatsapp('');
      setSpecialty('');
      setExperience('');
      setLocation('');
      setCertInput('');
      setCertifications([]);
      setBio('');
      setAvailability('');
    }
    onOpenChange(newOpen);
  };

  const handleSubmit = async () => {
    // Validate mandatory fields including photo
    if (!profileFile) {
      toast.error('La photo de profil est obligatoire.');
      return;
    }
    if (!fullName.trim() || !phone.trim() || !selectedCategory || !specialty.trim() || !experience.trim() || !location.trim() || !bio.trim()) {
      toast.error('Veuillez remplir tous les champs obligatoires (*)');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('profileImage', profileFile);
      formData.append('fullName', fullName);
      formData.append('phone', phone);
      if (whatsapp) formData.append('whatsapp', whatsapp);
      formData.append('categoryId', selectedCategory);
      formData.append('specialty', specialty);
      formData.append('experience', experience);
      formData.append('location', location);
      formData.append('certifications', JSON.stringify(certifications));
      formData.append('bio', bio);
      formData.append('availability', availability || 'Disponible sous 72h');

      const res = await fetch('/api/expert-applications', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Erreur lors de la soumission.');
        return;
      }

      toast.success(data.message, { duration: 6000 });
      setIsSubmitted(true);
    } catch (error) {
      toast.error('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const catInfo = EXPERT_CATEGORY_OPTIONS.find((c) => c.id === selectedCategory);

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="max-w-md p-0 gap-0 max-h-[90vh] overflow-y-auto">
        {isSubmitted ? (
          <motion.div
            key="submitted"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-8 px-4 text-center space-y-4"
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
            <Button
              onClick={() => handleDialogChange(false)}
              className="mt-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-xs"
            >
              Fermer
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <DialogHeader className="sr-only">
              <DialogTitle>Devenir expert partenaire</DialogTitle>
              <DialogDescription>Remplissez le formulaire pour postuler comme expert partenaire KAMI-EXTENSION.</DialogDescription>
            </DialogHeader>

            {/* Header */}
            <div className="px-5 pt-5 pb-3 text-center border-b border-border">
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

            <div className="p-4 space-y-3">
              {/* Profile photo - MANDATORY */}
              <Card className="border-border">
                <CardContent className="p-3.5 space-y-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Camera className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <Label className="text-xs font-bold text-foreground">
                      Photo de profil <span className="text-red-500">*</span>
                    </Label>
                  </div>

                  {profilePreview ? (
                    <div className="relative w-24 h-24 mx-auto">
                      <img
                        src={profilePreview}
                        alt="Photo de profil"
                        className="w-24 h-24 rounded-full object-cover border-2 border-emerald-400 shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={removeProfileImage}
                        className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-md transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-emerald-300 dark:border-emerald-700 rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors"
                    >
                      <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center">
                        <ImageIcon className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                        Cliquez pour ajouter votre photo
                      </p>
                      <p className="text-[9px] text-muted-foreground">
                        JPEG, PNG, WebP ou GIF — Max. 5 Mo
                      </p>
                    </motion.div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleProfileImageChange}
                    className="hidden"
                  />
                  {!profileFile && (
                    <p className="text-[9px] text-red-500 font-semibold text-center">
                      La photo de profil est obligatoire
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Category selection */}
              <Card className="border-border">
                <CardContent className="p-3.5 space-y-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <Label className="text-xs font-bold text-foreground">
                      Catégorie d&apos;expertise <span className="text-red-500">*</span>
                    </Label>
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
                      Nom complet <span className="text-red-500">*</span>
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
                        <Phone className="h-3 w-3" /> Téléphone <span className="text-red-500">*</span>
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
                      Spécialité détaillée <span className="text-red-500">*</span>
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
                        <Clock className="h-3 w-3" /> Expérience <span className="text-red-500">*</span>
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
                        <MapPin className="h-3 w-3" /> Localisation <span className="text-red-500">*</span>
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

              {/* Info notice */}
              <div className="flex items-start gap-2 p-3 rounded-xl bg-muted/30 border border-border">
                <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  En soumettant ce formulaire, vous acceptez que vos informations soient transmises au Comité de Gestion des Lots
                  qui analysera votre dossier et décidera de votre intégration comme expert partenaire KAMI-EXTENSION.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
