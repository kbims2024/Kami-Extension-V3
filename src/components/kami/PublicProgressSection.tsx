'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Construction,
  Calendar,
  MapPin,
  Image as ImageIcon,
  Play,
  ChevronLeft,
  ChevronRight,
  Pin,
  X,
  ArrowLeft,
  Home as HomeIcon,
} from 'lucide-react';

interface PublicProgressSectionProps {
  onBack?: () => void;
  onHome?: () => void;
  setCurrentScreen?: (s: string) => void;
}

interface ProgressUpdate {
  id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  videos: string[];
  date: string;
  isPinned: boolean;
  createdAt: string;
}

const CATEGORIES = {
  TOAVAUX: { label: 'Travaux', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  TRAVAUX: { label: 'Travaux', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  EVENEMENT: { label: 'Événement', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  INFRASTRUCTURE: { label: 'Infrastructure', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  AUTRE: { label: 'Autre', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
};

const CATEGORY_FILTERS = [
  { key: 'TOUS', label: 'Tous' },
  { key: 'TRAVAUX', label: 'Travaux' },
  { key: 'EVENEMENT', label: 'Événements' },
  { key: 'INFRASTRUCTURE', label: 'Infrastructure' },
  { key: 'AUTRE', label: 'Autre' },
];

export function PublicProgressSection({ onBack, onHome, setCurrentScreen }: PublicProgressSectionProps) {
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleGoLogin = () => {
    if (setCurrentScreen) {
      setCurrentScreen('auth-choice');
      return;
    }
    if (typeof window !== 'undefined') {
      try {
        const evt = new CustomEvent('navigateToAuth');
        window.dispatchEvent(evt);
      } catch {}
    }
  };
  const [updates, setUpdates] = useState<ProgressUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('TOUS');
  const [selectedUpdate, setSelectedUpdate] = useState<ProgressUpdate | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadUpdates();
  }, [activeFilter]);

  const loadUpdates = async () => {
    setLoading(true);
    try {
      const params = activeFilter !== 'TOUS' ? `?category=${activeFilter}` : '';
      const response = await fetch(`/api/progress-updates${params}`);
      if (response.ok) {
        const data = await response.json();
        setUpdates(data);
      }
    } catch (error) {
      console.error('Error loading progress updates:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const handleOpenDetail = (update: ProgressUpdate) => {
    setSelectedUpdate(update);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedUpdate) {
      const total = selectedUpdate.images.length + selectedUpdate.videos.length;
      setCurrentImageIndex((prev) => (prev + 1) % total);
    }
  };

  const prevImage = () => {
    if (selectedUpdate) {
      const total = selectedUpdate.images.length + selectedUpdate.videos.length;
      setCurrentImageIndex((prev) => (prev - 1 + total) % total);
    }
  };

  const getCategoryInfo = (cat: string) => {
    return CATEGORIES[cat as keyof typeof CATEGORIES] || CATEGORIES.AUTRE;
  };

  return (
    <section className="min-h-screen py-16 bg-background relative">
      {/* Barre de navigation fixe */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border py-3 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onBack && (
              <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <h2 className="text-lg font-bold text-foreground">Notre village prend vie</h2>
          </div>
          {onHome && (
            <Button variant="ghost" size="icon" onClick={onHome} className="hover:bg-accent">
              <HomeIcon className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      <div className="container mx-auto px-6 mt-6">
        {/* Section Header */}
        <div className="text-center mb-8">
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Suivez en temps réel l&apos;évolution du village KAMI-EXTENSION et les événements marquants
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CATEGORY_FILTERS.map((filter) => (
            <Button
              key={filter.key}
              variant={activeFilter === filter.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter(filter.key)}
              className={
                activeFilter === filter.key
                  ? 'bg-brand-blue hover:bg-brand-blue text-white'
                  : 'hover:bg-brand-blue/10'
              }
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        {(!isOnline) ? (
          <div className="flex flex-col items-center justify-center py-24 px-6">
            <div className="w-full max-w-md bg-card border border-border rounded-xl p-6 text-center">
              <h3 className="text-lg font-bold mb-2">Connexion requise</h3>
              <p className="text-sm text-muted-foreground mb-4">Vous êtes hors-ligne. Connectez-vous pour accéder aux mises à jour complètes du village.</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => { setIsOnline(navigator.onLine); loadUpdates(); }} className="px-4">Réessayer</Button>
                <Button onClick={() => { handleGoLogin(); }} variant="outline" className="px-4">Se connecter</Button>
              </div>
            </div>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue" />
          </div>
        ) : updates.length === 0 ? (
          <div className="text-center py-16">
            <Construction className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground">Aucune publication pour le moment</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Les mises à jour de l&apos;avancement des travaux apparaîtront ici
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {updates.map((update) => {
              const catInfo = getCategoryInfo(update.category);
              const thumbnailUrl = update.images && update.images.length > 0 ? update.images[0] : null;

              return (
                <Card
                  key={update.id}
                  className="group overflow-hidden border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  onClick={() => handleOpenDetail(update)}
                >
                  {/* Image Preview */}
                  {thumbnailUrl ? (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={thumbnailUrl}
                        alt={update.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      {update.isPinned && (
                        <div className="absolute top-3 right-3">
                          <div className="bg-yellow-400 text-yellow-900 p-1.5 rounded-full shadow-lg">
                            <Pin className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      )}
                      {update.images && update.images.length > 1 && (
                        <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                          <ImageIcon className="h-3 w-3" />
                          {update.images.length}
                        </div>
                      )}
                      {update.videos && update.videos.length > 0 && (
                        <div className="absolute bottom-3 left-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                          <Play className="h-3 w-3" />
                          {update.videos.length}
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <Badge className={catInfo.color}>
                          {catInfo.label}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-brand-blue/10 to-brand-blue/5 flex items-center justify-center relative">
                      {update.isPinned && (
                        <div className="absolute top-3 right-3">
                          <div className="bg-yellow-400 text-yellow-900 p-1.5 rounded-full shadow-lg">
                            <Pin className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      )}
                      <div className="text-center">
                        <Construction className="h-10 w-10 text-brand-blue/30 mx-auto mb-2" />
                        <Badge className={catInfo.color}>
                          {catInfo.label}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatDate(update.date)}</span>
                    </div>
                    <h3 className="font-bold text-foreground mb-2 line-clamp-2 group-hover:text-brand-blue transition-colors">
                      {update.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {update.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedUpdate} onOpenChange={() => setSelectedUpdate(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
          {selectedUpdate && (
            <>
              {/* Image/Video Gallery */}
              {(selectedUpdate.images.length > 0 || selectedUpdate.videos.length > 0) && (
                <div className="relative bg-black">
                  <div className="relative h-64 sm:h-80 md:h-96 flex items-center justify-center overflow-hidden">
                    {/* Show current image */}
                    {currentImageIndex < selectedUpdate.images.length ? (
                      <img
                        src={selectedUpdate.images[currentImageIndex]}
                        alt={`${selectedUpdate.title} - ${currentImageIndex + 1}`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      /* Show current video */
                      selectedUpdate.videos[currentImageIndex - selectedUpdate.images.length] && (
                        <video
                          src={selectedUpdate.videos[currentImageIndex - selectedUpdate.images.length]}
                          controls
                          className="w-full h-full object-contain"
                        />
                      )
                    )}

                    {/* Navigation arrows */}
                    {(selectedUpdate.images.length + selectedUpdate.videos.length) > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-xs">
                          {currentImageIndex + 1} / {selectedUpdate.images.length + selectedUpdate.videos.length}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getCategoryInfo(selectedUpdate.category).color}>
                      {getCategoryInfo(selectedUpdate.category).label}
                    </Badge>
                    {selectedUpdate.isPinned && (
                      <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 text-xs">
                        <Pin className="h-3 w-3" />
                        <span>Épinglé</span>
                      </div>
                    )}
                  </div>
                  <DialogTitle className="text-xl">{selectedUpdate.title}</DialogTitle>
                </DialogHeader>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3 mb-4">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(selectedUpdate.date)}</span>
                </div>

                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedUpdate.description}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
