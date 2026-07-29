'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Plus,
  Trash2,
  Pin,
  Image as ImageIcon,
  Video,
  ArrowLeft,
  Upload,
  Construction,
  Calendar,
} from 'lucide-react';

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

interface ProgressUpdatesAdminProps {
  onBack?: () => void;
}

export function ProgressUpdatesAdmin({ onBack }: ProgressUpdatesAdminProps) {
  const [updates, setUpdates] = useState<ProgressUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('TRAVAUX');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [isPinned, setIsPinned] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadUpdates();
  }, []);

  const loadUpdates = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/progress-updates?limit=100');
      if (response.ok) {
        const data = await response.json();
        setUpdates(data);
      }
    } catch (error) {
      console.error('Error loading updates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files) return;
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        try {
          const res = await fetch('/api/admin-files', {
            method: 'POST',
            body: formData,
          });
          if (res.ok) {
            const data = await res.json();
            setImages((prev) => [...prev, data.path]);
          }
        } catch (err) {
          console.error('Upload error:', err);
        }
      }
    };
    input.click();
  };

  const handleAddVideo = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files) return;
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        try {
          const res = await fetch('/api/admin-files', {
            method: 'POST',
            body: formData,
          });
          if (res.ok) {
            const data = await res.json();
            setVideos((prev) => [...prev, data.path]);
          }
        } catch (err) {
          console.error('Upload error:', err);
        }
      }
    };
    input.click();
  };

  const handleSubmit = async () => {
    if (!title || !description || !category || !date) {
      toast.error('Remplissez tous les champs obligatoires');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/progress-updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, category, date, images, videos, isPinned }),
      });

      if (response.ok) {
        toast.success('Publication ajoutée avec succès !');
        setTitle('');
        setDescription('');
        setCategory('TRAVAUX');
        setDate(new Date().toISOString().split('T')[0]);
        setImages([]);
        setVideos([]);
        setIsPinned(false);
        setShowForm(false);
        loadUpdates();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Erreur lors de la publication');
      }
    } catch (error) {
      toast.error('Erreur lors de la publication');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette publication ?')) return;
    try {
      const response = await fetch(`/api/progress-updates/${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Publication supprimée');
        loadUpdates();
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleTogglePin = async (update: ProgressUpdate) => {
    try {
      const response = await fetch(`/api/progress-updates/${update.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinned: !update.isPinned }),
      });
      if (response.ok) {
        toast.success(update.isPinned ? 'Publication désépinglée' : 'Publication épinglée');
        loadUpdates();
      }
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const CATEGORY_LABELS: Record<string, string> = {
    TRAVAUX: 'Travaux',
    EVENEMENT: 'Événement',
    INFRASTRUCTURE: 'Infrastructure',
    AUTRE: 'Autre',
  };

  return (
    <div className="space-y-6">
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Construction className="h-5 w-5 text-brand-blue" />
            Publications — Avancement des Travaux
          </h2>
          <p className="text-sm text-muted-foreground">Gérez les publications publiques de progression</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-brand-blue hover:bg-brand-blue text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle publication
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Nouvelle publication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm">Titre *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Avancement du terrassement Îlot A"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm">Description *</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez l'avancement..."
                rows={4}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm">Catégorie *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TRAVAUX">Travaux</SelectItem>
                    <SelectItem value="EVENEMENT">Événement</SelectItem>
                    <SelectItem value="INFRASTRUCTURE">Infrastructure</SelectItem>
                    <SelectItem value="AUTRE">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm">Date *</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm flex items-center gap-1">
                    <Pin className="h-3.5 w-3.5" /> Épingler
                  </span>
                </label>
              </div>
            </div>

            {/* Images */}
            <div>
              <Label className="text-sm">Images</Label>
              <div className="flex items-center gap-2 mt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddImage}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Ajouter des images
                </Button>
                <span className="text-xs text-muted-foreground">{images.length} image(s)</span>
              </div>
              {images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {images.map((img, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Videos */}
            <div>
              <Label className="text-sm">Vidéos</Label>
              <div className="flex items-center gap-2 mt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddVideo}
                >
                  <Video className="mr-2 h-4 w-4" />
                  Ajouter des vidéos
                </Button>
                <span className="text-xs text-muted-foreground">{videos.length} vidéo(s)</span>
              </div>
              {videos.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {videos.map((vid, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                      <Video className="h-6 w-6 text-muted-foreground" />
                      <button
                        onClick={() => setVideos((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-brand-blue hover:bg-brand-blue text-white flex-1"
              >
                {submitting ? 'Publication...' : 'Publier'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Toutes les publications ({updates.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue" />
            </div>
          ) : updates.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Construction className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Aucune publication</p>
            </div>
          ) : (
            <ScrollArea className="max-h-[500px]">
              <div className="space-y-3 pr-4">
                {updates.map((update) => (
                  <div
                    key={update.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors"
                  >
                    {/* Thumbnail */}
                    {update.images && update.images.length > 0 ? (
                      <img
                        src={update.images[0]}
                        alt=""
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-foreground text-sm truncate">{update.title}</h4>
                            {update.isPinned && (
                              <Pin className="h-3.5 w-3.5 text-yellow-500 flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs py-0 px-1.5">
                              {CATEGORY_LABELS[update.category] || update.category}
                            </Badge>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(update.date)}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            {update.images.length > 0 && (
                              <span className="flex items-center gap-1">
                                <ImageIcon className="h-3 w-3" /> {update.images.length}
                              </span>
                            )}
                            {update.videos.length > 0 && (
                              <span className="flex items-center gap-1">
                                <Video className="h-3 w-3" /> {update.videos.length}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleTogglePin(update)}
                            title={update.isPinned ? 'Désépingler' : 'Épingler'}
                          >
                            <Pin className={`h-4 w-4 ${update.isPinned ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600"
                            onClick={() => handleDelete(update.id)}
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
