'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Home,
  CheckCircle2,
  XCircle,
  Clock,
  UserPlus,
  Phone,
  MessageCircle,
  MapPin,
  Briefcase,
  Award,
  GraduationCap,
  ShieldCheck,
  Star,
  Loader2,
  AlertCircle,
  Filter,
  ChevronDown,
  ChevronUp,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';

interface ExpertApplication {
  id: string;
  fullName: string;
  phone: string;
  whatsapp: string | null;
  categoryId: string;
  specialty: string;
  experience: string;
  location: string;
  certifications: string[];
  bio: string;
  availability: string;
  status: string;
  rejectReason: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  profileImage?: string | null;
}

interface ExpertApplicationsAdminProps {
  onBack: () => void;
  onHome?: () => void;
}

const CATEGORY_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  electricien: { label: 'Électricien', icon: '⚡', color: '#F59E0B' },
  plombier: { label: 'Plombier', icon: '🔧', color: '#3B82F6' },
  macon: { label: 'Maçon', icon: '🏗️', color: '#EF4444' },
  menuisier: { label: 'Menuisier', icon: '🪟', color: '#8B5E3C' },
  carreleur: { label: 'Carreleur', icon: '🔲', color: '#6366F1' },
  peintre: { label: 'Peintre', icon: '🎨', color: '#10B981' },
  conducteur_travaux: { label: 'Conducteur de travaux', icon: '👷', color: '#0EA5E9' },
  geometre: { label: 'Géomètre', icon: '📐', color: '#D946EF' },
};

export function ExpertApplicationsAdmin({ onBack, onHome }: ExpertApplicationsAdminProps) {
  const [applications, setApplications] = useState<ExpertApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const loadApplications = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = statusFilter !== 'ALL'
        ? `/api/expert-applications?status=${statusFilter}`
        : '/api/expert-applications';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      toast.error('Erreur de chargement des candidatures.');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const handleApprove = async (id: string, name: string) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/expert-applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'APPROVE' }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        loadApplications();
      } else {
        toast.error(data.error || 'Erreur.');
      }
    } catch {
      toast.error('Erreur de connexion.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string, name: string) => {
    if (!rejectReason.trim() || rejectReason.trim().length < 5) {
      toast.error('Veuillez fournir une raison de rejet (min. 5 caractères).');
      return;
    }
    setProcessingId(id);
    try {
      const res = await fetch(`/api/expert-applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'REJECT', rejectReason: rejectReason.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setRejectingId(null);
        setRejectReason('');
        setExpandedId(null);
        loadApplications();
      } else {
        toast.error(data.error || 'Erreur.');
      }
    } catch {
      toast.error('Erreur de connexion.');
    } finally {
      setProcessingId(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const pendingCount = applications.filter((a) => a.status === 'PENDING').length;
  const approvedCount = applications.filter((a) => a.status === 'APPROVED').length;
  const rejectedCount = applications.filter((a) => a.status === 'REJECTED').length;

  const statusFilters = [
    { value: 'ALL', label: 'Toutes', count: applications.length },
    { value: 'PENDING', label: 'En attente', count: pendingCount },
    { value: 'APPROVED', label: 'Approuvées', count: approvedCount },
    { value: 'REJECTED', label: 'Rejetées', count: rejectedCount },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge variant="outline" className="text-[10px] font-bold bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800">
            <Clock className="h-2.5 w-2.5 mr-1" /> En attente
          </Badge>
        );
      case 'APPROVED':
        return (
          <Badge variant="outline" className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800">
            <CheckCircle2 className="h-2.5 w-2.5 mr-1" /> Approuvée
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="outline" className="text-[10px] font-bold bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800">
            <XCircle className="h-2.5 w-2.5 mr-1" /> Rejetée
          </Badge>
        );
      default:
        return <Badge variant="outline" className="text-[10px]">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground px-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour admin
          </Button>
          {onHome && (
            <Button variant="ghost" size="icon" onClick={onHome} className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <Home className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          Candidatures Experts
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Comité de gestion des lots — Analyse et validation des demandes
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-amber-200 dark:border-amber-800/50">
          <CardContent className="p-3 text-center">
            <p className="text-lg font-bold text-amber-600">{pendingCount}</p>
            <p className="text-[10px] text-muted-foreground">En attente</p>
          </CardContent>
        </Card>
        <Card className="border-emerald-200 dark:border-emerald-800/50">
          <CardContent className="p-3 text-center">
            <p className="text-lg font-bold text-emerald-600">{approvedCount}</p>
            <p className="text-[10px] text-muted-foreground">Approuvées</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 dark:border-red-800/50">
          <CardContent className="p-3 text-center">
            <p className="text-lg font-bold text-red-600">{rejectedCount}</p>
            <p className="text-[10px] text-muted-foreground">Rejetées</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="h-9 text-xs gap-1.5"
          >
            <Filter className="h-3.5 w-3.5" />
            {statusFilters.find((f) => f.value === statusFilter)?.label}
            <ChevronDown className="h-3 w-3" />
          </Button>
          <AnimatePresence>
            {showFilterDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 0.95 }}
                className="absolute top-full left-0 mt-1 z-50 bg-card border border-border rounded-lg shadow-lg overflow-hidden min-w-[160px]"
              >
                {statusFilters.map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => {
                      setStatusFilter(filter.value);
                      setShowFilterDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors flex items-center justify-between ${
                      statusFilter === filter.value ? 'bg-muted font-bold' : ''
                    }`}
                  >
                    <span>{filter.label}</span>
                    <span className="text-muted-foreground">{filter.count}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Applications list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-xs text-muted-foreground">Chargement...</span>
        </div>
      ) : applications.length === 0 ? (
        <Card className="border-border">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-bold text-foreground">Aucune candidature</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {statusFilter === 'ALL'
                ? 'Aucune candidature soumise pour le moment.'
                : `Aucune candidature avec le statut "${statusFilters.find((f) => f.value === statusFilter)?.label?.toLowerCase()}".`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {applications.map((app) => {
              const cat = CATEGORY_LABELS[app.categoryId] || { label: app.categoryId, icon: '🔧', color: '#6B7280' };
              const isExpanded = expandedId === app.id;
              const isRejecting = rejectingId === app.id;

              return (
                <motion.div
                  key={app.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Card className={`border overflow-hidden transition-all ${isExpanded ? 'shadow-md' : 'hover:shadow-sm'}`}>
                    {/* Summary row */}
                    <button
                      type="button"
                      onClick={() => toggleExpand(app.id)}
                      className="w-full text-left p-3 flex items-center gap-3 hover:bg-muted/30 transition-colors"
                    >
                      {/* Profile avatar */}
                      {app.profileImage ? (
                        <img
                          src={app.profileImage}
                          alt={app.fullName}
                          className="w-10 h-10 rounded-lg object-cover shrink-0 border border-border"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-base font-bold text-white"
                          style={{ backgroundColor: `${cat.color}` }}
                        >
                          {app.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-foreground truncate">{app.fullName}</p>
                          {getStatusBadge(app.status)}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-muted-foreground">{cat.label}</span>
                          <span className="text-muted-foreground/40">·</span>
                          <span className="text-[10px] text-muted-foreground">{app.specialty}</span>
                          <span className="text-muted-foreground/40">·</span>
                          <span className="text-[10px] text-muted-foreground">{app.experience}</span>
                        </div>
                        <p className="text-[9px] text-muted-foreground/70 mt-0.5">
                          {new Date(app.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="shrink-0">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    {/* Expanded details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="px-3 pb-3">
                            <Separator className="mb-3" />

                            {/* Profile photo in expanded view */}
                            <div className="flex items-center gap-3 mb-3">
                              {app.profileImage ? (
                                <img
                                  src={app.profileImage}
                                  alt={app.fullName}
                                  className="w-16 h-16 rounded-xl object-cover shrink-0 border-2 border-border shadow-md"
                                />
                              ) : (
                                <div
                                  className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0 text-xl font-bold text-white shadow-md"
                                  style={{ backgroundColor: `${cat.color}` }}
                                >
                                  {app.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-bold text-foreground">{app.fullName}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] font-semibold" style={{ color: cat.color }}>{cat.label}</span>
                                  <span className="text-muted-foreground/40">·</span>
                                  <span className="text-[10px] text-muted-foreground">{app.specialty}</span>
                                </div>
                              </div>
                            </div>

                            {/* Details grid */}
                            <div className="grid grid-cols-2 gap-2 mb-3">
                              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                                <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                <div>
                                  <p className="text-[9px] text-muted-foreground">Téléphone</p>
                                  <p className="text-[11px] font-semibold text-foreground">{app.phone}</p>
                                </div>
                              </div>
                              {app.whatsapp && (
                                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                                  <MessageCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                  <div>
                                    <p className="text-[9px] text-muted-foreground">WhatsApp</p>
                                    <p className="text-[11px] font-semibold text-foreground">{app.whatsapp}</p>
                                  </div>
                                </div>
                              )}
                              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                                <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                <div>
                                  <p className="text-[9px] text-muted-foreground">Localisation</p>
                                  <p className="text-[11px] font-semibold text-foreground">{app.location}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                                <Briefcase className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                <div>
                                  <p className="text-[9px] text-muted-foreground">Expérience</p>
                                  <p className="text-[11px] font-semibold text-foreground">{app.experience}</p>
                                </div>
                              </div>
                            </div>

                            {/* Availability */}
                            <div className="flex items-center gap-2 p-2 rounded-lg mb-3" style={{ backgroundColor: `${cat.color}10`, border: `1px solid ${cat.color}25` }}>
                              <Clock className="h-3.5 w-3.5 shrink-0" style={{ color: cat.color }} />
                              <p className="text-[11px] font-semibold" style={{ color: cat.color }}>
                                {app.availability}
                              </p>
                            </div>

                            {/* Certifications */}
                            {app.certifications && app.certifications.length > 0 && (
                              <div className="mb-3">
                                <p className="text-[10px] font-bold text-muted-foreground mb-1.5 flex items-center gap-1">
                                  <Award className="h-3 w-3" /> Certifications
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {app.certifications.map((cert, i) => (
                                    <Badge key={i} variant="secondary" className="text-[9px] font-semibold px-2 py-0.5 flex items-center gap-0.5">
                                      <ShieldCheck className="h-2.5 w-2.5" style={{ color: cat.color }} />
                                      {cert}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Bio */}
                            <div className="mb-3">
                              <p className="text-[10px] font-bold text-muted-foreground mb-1 flex items-center gap-1">
                                <GraduationCap className="h-3 w-3" /> Biographie
                              </p>
                              <p className="text-[11px] text-muted-foreground leading-relaxed bg-muted/20 rounded-lg p-2.5">
                                {app.bio}
                              </p>
                            </div>

                            {/* Rejection reason (if rejected) */}
                            {app.status === 'REJECTED' && app.rejectReason && (
                              <div className="mb-3 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50">
                                <p className="text-[10px] font-bold text-red-600 dark:text-red-400 mb-1 flex items-center gap-1">
                                  <XCircle className="h-3 w-3" /> Raison du rejet
                                </p>
                                <p className="text-[11px] text-red-700 dark:text-red-300 leading-relaxed">{app.rejectReason}</p>
                              </div>
                            )}

                            {/* Actions */}
                            {app.status === 'PENDING' && (
                              <div className="space-y-2">
                                {isRejecting ? (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-2"
                                  >
                                    <div>
                                      <Label className="text-[10px] font-bold text-muted-foreground">Raison du rejet *</Label>
                                      <Textarea
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                        placeholder="Expliquez pourquoi cette candidature est rejetée..."
                                        className="text-xs min-h-[60px] resize-none mt-1"
                                        rows={2}
                                      />
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1 h-9 text-xs"
                                        onClick={() => {
                                          setRejectingId(null);
                                          setRejectReason('');
                                        }}
                                      >
                                        Annuler
                                      </Button>
                                      <Button
                                        size="sm"
                                        className="flex-1 h-9 text-xs bg-red-600 hover:bg-red-700 text-white"
                                        onClick={() => handleReject(app.id, app.fullName)}
                                        disabled={processingId === app.id}
                                      >
                                        {processingId === app.id ? (
                                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        ) : (
                                          <XCircle className="h-3.5 w-3.5 mr-1" />
                                        )}
                                        Confirmer le rejet
                                      </Button>
                                    </div>
                                  </motion.div>
                                ) : (
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      className="flex-1 h-10 text-xs font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md shadow-emerald-500/20"
                                      onClick={() => handleApprove(app.id, app.fullName)}
                                      disabled={processingId === app.id}
                                    >
                                      {processingId === app.id ? (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                      ) : (
                                        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                                      )}
                                      Approuver
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="flex-1 h-10 text-xs font-bold border-red-200 hover:bg-red-50 hover:border-red-400 text-red-600 dark:border-red-800 dark:hover:bg-red-950/30"
                                      onClick={() => {
                                        setRejectingId(app.id);
                                        setRejectReason('');
                                      }}
                                    >
                                      <XCircle className="h-3.5 w-3.5 mr-1.5" />
                                      Rejeter
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// Needed for the reject form
function Label({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <label className={`block text-xs font-semibold text-muted-foreground ${className || ''}`}>
      {children}
    </label>
  );
}
