'use client';

import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  ShieldCheck,
  TrendingUp,
  Clock,
  Users,
  Phone,
  Mail,
  Building2,
  CheckCircle2,
  Home,
  Zap,
  Droplet,
  Wrench,
  X,
  FileText,
  Award,
  ArrowRight
} from 'lucide-react';

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate?: (screen: string) => void;
  onReserveClick?: () => void;
}

export function AboutDialog({ open, onOpenChange, onNavigate, onReserveClick }: AboutDialogProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-border bg-gradient-to-br from-brand-blue to-blue-700 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Building2 className="h-7 w-7 text-brand-yellow" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">À propos de KAMI-EXTENSION</h2>
                <p className="text-sm text-blue-100">Le village moderne et discipliné</p>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Présentation */}
          <section>
            <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-brand-blue" />
              Notre Vision
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              KAMI-EXTENSION est un projet de développement urbain innovant qui vise à créer un village moderne, propre et discipliné.
              Nous offrons des terrains viabilisés prêts à construire, équipés de tous les services essentiels pour un confort optimal.
            </p>
          </section>

          <Separator />

          {/* Localisation */}
          <section>
            <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-brand-blue" />
              Localisation Stratégique
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-brand-blue/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="h-4 w-4 text-brand-blue" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Accessibilité</p>
                  <p className="text-xs text-muted-foreground">Proche des axes routiers principaux</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-brand-blue/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="h-4 w-4 text-brand-blue" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Quartier en plein essor</p>
                  <p className="text-xs text-muted-foreground">Valorisation rapide de votre bien</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-brand-blue/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="h-4 w-4 text-brand-blue" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Environnement sécurisé</p>
                  <p className="text-xs text-muted-foreground">Communauté unie et solidaire</p>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          {/* Équipements Inclus */}
          <section>
            <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <Zap className="h-5 w-5 text-brand-blue" />
              Équipements Inclus
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card border border-border rounded-xl p-3 text-center">
                <Home className="h-6 w-6 mx-auto mb-2 text-brand-blue" />
                <p className="text-xs font-medium text-foreground">Terrain Viabilisé</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-3 text-center">
                <Zap className="h-6 w-6 mx-auto mb-2 text-brand-blue" />
                <p className="text-xs font-medium text-foreground">Électricité</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-3 text-center">
                <Droplet className="h-6 w-6 mx-auto mb-2 text-brand-blue" />
                <p className="text-xs font-medium text-foreground">Eau Potable</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-3 text-center">
                <Wrench className="h-6 w-6 mx-auto mb-2 text-brand-blue" />
                <p className="text-xs font-medium text-foreground">Routes Pavées</p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Tarification Avantageuse */}
          <section>
            <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <Award className="h-5 w-5 text-brand-blue" />
              Tarification Avantageuse
            </h3>
            <div className="space-y-3">
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-emerald-600" />
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">Résident KAMI</span>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">-33%</Badge>
                </div>
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">100 000 FCFA</p>
                <p className="text-xs text-muted-foreground mt-1">Prix spécial pour les habitants du village</p>
              </div>

              <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-orange-600" />
                    <span className="font-bold text-orange-700 dark:text-orange-400">Non-Résident</span>
                  </div>
                  <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">Standard</Badge>
                </div>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">150 000 FCFA</p>
                <p className="text-xs text-muted-foreground mt-1">Tarif attractif pour tous</p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Processus Simplifié */}
          <section>
            <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <Clock className="h-5 w-5 text-brand-blue" />
              Processus de Réservation
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
                <div>
                  <p className="text-sm font-medium text-foreground">Créez votre compte</p>
                  <p className="text-xs text-muted-foreground">Inscription gratuite en quelques secondes</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
                <div>
                  <p className="text-sm font-medium text-foreground">Choisissez votre lot</p>
                  <p className="text-xs text-muted-foreground">Consultez le plan et sélectionnez votre terrain</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
                <div>
                  <p className="text-sm font-medium text-foreground">Effectuez un paiement</p>
                  <p className="text-xs text-muted-foreground">Dès 10 000 FCFA pour réserver</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">4</div>
                <div>
                  <p className="text-sm font-medium text-foreground">Devenez propriétaire</p>
                  <p className="text-xs text-muted-foreground">Obtenez votre titre foncier et construisez</p>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          {/* Avantages */}
          <section>
            <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-brand-blue" />
              Pourquoi Nous Choisir ?
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 text-brand-blue flex-shrink-0" />
                <span>Titre foncier garanti et sécurisé</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 text-brand-blue flex-shrink-0" />
                <span>Paiement flexible adapté à votre budget</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 text-brand-blue flex-shrink-0" />
                <span>Valorisation rapide de votre investissement</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 text-brand-blue flex-shrink-0" />
                <span>Support client disponible et réactif</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 text-brand-blue flex-shrink-0" />
                <span>Communauté de propriétaires unie et solidaire</span>
              </div>
            </div>
          </section>

          <Separator />

          {/* Règlement */}
          <section>
            <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-brand-blue" />
              Règlement Intérieur
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Pour garantir un environnement de vie harmonieux, KAMI-EXTENSION a mis en place un règlement intérieur strict sur :
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• <strong>Propreté :</strong> Maintenir le lot et les abords propres</p>
              <p>• <strong>Urbanisme :</strong> Respecter les normes architecturales</p>
              <p>• <strong>Voisinage :</strong> Respect mutuel et tranquillité</p>
              <p>• <strong>Discipline :</strong> Respect du règlement intérieur</p>
            </div>
            {onNavigate && (
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => {
                  onOpenChange(false);
                  onNavigate('rules');
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                Lire le règlement complet
              </Button>
            )}
          </section>

          <Separator />

          {/* Contact */}
          <section>
            <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-brand-blue" />
              Contactez-nous
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-9 h-9 bg-brand-blue/10 rounded-lg flex items-center justify-center">
                  <Phone className="h-4 w-4 text-brand-blue" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Téléphone</p>
                  <p className="font-medium text-foreground">+225 XX XX XX XX</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-9 h-9 bg-brand-blue/10 rounded-lg flex items-center justify-center">
                  <Mail className="h-4 w-4 text-brand-blue" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">contact@kami-extension.com</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              className="w-full sm:w-auto bg-brand-blue hover:bg-blue-700 text-white font-semibold"
              onClick={() => {
                onOpenChange(false);
                onReserveClick?.();
              }}
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Réserver mon terrain
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => onOpenChange(false)}
            >
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}