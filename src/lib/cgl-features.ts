import {
  ChartLine,
  CheckCircle,
  PlusCircle,
  FileText,
  Image as ImageIcon,
  Shield,
  Zap,
  UserPlus,
  Activity,
  Users,
  Upload,
  Construction,
  TrendingUp,
  Headset,
  Crown,
} from 'lucide-react';

export interface CglFeatureDef {
  id: string;
  label: string;
  adminView: string;
  icon: any;
  color: string;
}

export const CGL_ADMIN_FEATURES: CglFeatureDef[] = [
  { id: 'dashboard', label: 'Tableau de Bord', adminView: 'dashboard', icon: ChartLine, color: 'text-[#10B981]' },
  { id: 'payments', label: 'Valider Paiements', adminView: 'payments', icon: CheckCircle, color: 'text-blue-500 dark:text-blue-400' },
  { id: 'add-lots', label: 'Ajouter Lots', adminView: 'add-lots', icon: PlusCircle, color: 'text-[#8B5E3C] dark:text-[#A5785C]' },
  { id: 'logo', label: 'Éditer le Logo', adminView: 'logo', icon: FileText, color: 'text-orange-500 dark:text-orange-400' },
  { id: 'hero-image', label: 'Image de Fond', adminView: 'hero-image', icon: ImageIcon, color: 'text-pink-500 dark:text-pink-400' },
  { id: 'committee', label: 'Gestion du Comité', adminView: 'committee', icon: Shield, color: 'text-purple-600 dark:text-purple-400' },
  { id: 'flash-infos', label: 'Flash Infos', adminView: 'flash-infos', icon: Zap, color: 'text-brand-blue' },
  { id: 'expert-applications', label: 'Candidatures Experts', adminView: 'expert-applications', icon: UserPlus, color: 'text-emerald-500 dark:text-emerald-400' },
  { id: 'users-monitor', label: 'Surveillance Connexions', adminView: 'users-monitor', icon: Activity, color: 'text-cyan-500 dark:text-cyan-400' },
  { id: 'user-management', label: 'Gestion Utilisateurs', adminView: 'user-management', icon: Users, color: 'text-blue-500 dark:text-blue-400' },
  { id: 'files', label: 'Gérer Fichiers', adminView: 'files', icon: Upload, color: 'text-brand-blue' },
  { id: 'progress-updates', label: 'Avancement Travaux', adminView: 'progress-updates', icon: Construction, color: 'text-orange-500 dark:text-orange-400' },
  { id: 'subscriber-tracking', label: 'Suivi Souscripteurs', adminView: 'subscriber-tracking', icon: TrendingUp, color: 'text-cyan-500 dark:text-cyan-400' },
  { id: 'sav-settings', label: 'Paramètres SAV', adminView: 'sav-settings', icon: Headset, color: 'text-emerald-500' },
  { id: 'cgl-permissions', label: 'Permissions CGL', adminView: 'cgl-permissions', icon: Crown, color: 'text-purple-600 dark:text-purple-400' },
];

export const CGL_ADMIN_FEATURE_IDS = CGL_ADMIN_FEATURES.map((feature) => feature.id);
