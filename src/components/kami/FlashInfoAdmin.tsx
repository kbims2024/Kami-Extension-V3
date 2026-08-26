'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Home, Plus, Edit, Trash2, Save, X, MoveUp, MoveDown, Star, Heart, Settings, Sliders, RotateCw, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface FlashInfoItem {
  id: string;
  icon: string;
  text: string;
  textColor: string;
  bgColor: string;
  urgent?: boolean;
  position: number;
}

interface FlashInfoData {
  items: FlashInfoItem[];
  settings: {
    scrollSpeed: number;
    bgColor: string;
    textColor: string;
  };
}

interface ColorFavorite {
  id: string;
  name: string;
  value: string;
  type: 'text' | 'background';
  createdAt: string;
}

interface SettingPreset {
  id: string;
  name: string;
  settings: {
    scrollSpeed: number;
    bgColor: string;
    textColor: string;
  };
  createdAt: string;
}

const iconOptions = [
  { value: 'AlertCircle', label: '⚠️ Alerte' },
  { value: 'TrendingUp', label: '📈 Tendance' },
  { value: 'Calendar', label: '📅 Calendrier' },
  { value: 'Users', label: '👥 Utilisateurs' },
  { value: 'Star', label: '⭐ Étoile' },
  { value: 'Info', label: 'ℹ️ Information' },
  { value: 'Bell', label: '🔔 Notification' },
  { value: 'Flame', label: '🔥 Flamme' },
  { value: 'Sparkles', label: '✨ Étoiles' }
];

const colorPresets = [
  { name: 'Bleu foncé', value: '#1e40af' },
  { name: 'Bleu clair', value: '#3b82f6' },
  { name: 'Vert', value: '#22c55e' },
  { name: 'Rouge', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Noir', value: '#000000' },
  { name: 'Gris foncé', value: '#374151' }
];

const textColorPresets = [
  { name: 'Blanc', value: '#ffffff' },
  { name: 'Jaune', value: '#fbbf24' },
  { name: 'Vert clair', value: '#86efac' },
  { name: 'Orange clair', value: '#fdba74' }
];

interface FlashInfoAdminProps {
  onBack: () => void;
  onHome?: () => void;
}

export function FlashInfoAdmin({ onBack, onHome }: FlashInfoAdminProps) {
  const [data, setData] = useState<FlashInfoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [formData, setFormData] = useState({
    text: '',
    icon: 'AlertCircle',
    textColor: '#ffffff',
    bgColor: '#1e40af',
    urgent: false,
    position: 0
  });
  const [settingsData, setSettingsData] = useState({
    scrollSpeed: 30,
    bgColor: '#1e40af',
    textColor: '#ffffff'
  });
  const [emojiInput, setEmojiInput] = useState('');
  const [colorFavorites, setColorFavorites] = useState<ColorFavorite[]>([]);
  const [showFavoriteName, setShowFavoriteName] = useState<{ type: 'text' | 'background'; value: string } | null>(null);
  const [favoriteNameInput, setFavoriteNameInput] = useState('');
  const [settingPresets, setSettingPresets] = useState<SettingPreset[]>([]);
  const [showPresetName, setShowPresetName] = useState(false);
  const [presetNameInput, setPresetNameInput] = useState('');

  useEffect(() => {
    loadFlashInfo();
    loadColorFavorites();
    loadSettingPresets();
  }, []);

  const loadFlashInfo = async () => {
    try {
      const response = await fetch('/api/flash-info');
      if (response.ok) {
        const flashData = await response.json();
        const items = [...(flashData.items || [])].sort((a, b) => a.position - b.position);
        setData({ ...flashData, items });
        setSettingsData(flashData.settings);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadColorFavorites = async () => {
    try {
      const response = await fetch('/api/color-favorites');
      if (response.ok) {
        const favorites = await response.json();
        setColorFavorites(favorites);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des favoris de couleurs:', error);
    }
  };

  const loadSettingPresets = async () => {
    try {
      const response = await fetch('/api/flash-info-presets');
      if (response.ok) {
        const presets = await response.json();
        setSettingPresets(presets);
      } else if (response.status === 404) {
        // API doesn't exist yet, create empty array
        setSettingPresets([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des préréglages:', error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/flash-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: formData.text,
          icon: formData.icon,
          textColor: formData.textColor,
          bgColor: formData.bgColor,
          urgent: formData.urgent
        })
      });

      if (response.ok) {
        toast.success('Flash info ajouté avec succès !');
        setShowAddForm(false);
        setFormData({
          text: '',
          icon: 'AlertCircle',
          textColor: '#ffffff',
          bgColor: '#1e40af',
          urgent: false,
          position: 0
        });
        setEmojiInput('');
        loadFlashInfo();
      } else {
        toast.error('Erreur lors de l\'ajout');
      }
    } catch (error) {
      toast.error('Erreur lors de l\'ajout');
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const response = await fetch('/api/flash-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          text: formData.text,
          icon: formData.icon,
          textColor: formData.textColor,
          bgColor: formData.bgColor,
          urgent: formData.urgent
        })
      });

      if (response.ok) {
        toast.success('Flash info mis à jour avec succès !');
        setEditingId(null);
        loadFlashInfo();
      } else {
        toast.error('Erreur lors de la mise à jour');
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce flash info ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/flash-info?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Flash info supprimé avec succès !');
        loadFlashInfo();
      } else {
        toast.error('Erreur lors de la suppression');
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleEdit = (item: FlashInfoItem) => {
    setFormData({
      text: item.text,
      icon: item.icon,
      textColor: item.textColor,
      bgColor: item.bgColor,
      urgent: item.urgent || false,
      position: item.position
    });
    setEditingId(item.id);
    setShowAddForm(true);
  };

  const handleMove = async (id: string, direction: 'up' | 'down') => {
    if (!data) return;

    const index = data.items.findIndex((item) => item.id === id);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= data.items.length) return;

    // Persister les positions échangées des deux éléments concernés.
    const movedItem = data.items[index];
    const swappedItem = data.items[newIndex];

    try {
      const results = await Promise.all([
        fetch('/api/flash-info', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: movedItem.id, position: newIndex })
        }),
        fetch('/api/flash-info', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: swappedItem.id, position: index })
        })
      ]);

      if (results.every((res) => res.ok)) {
        loadFlashInfo();
      } else {
        toast.error('Erreur lors du déplacement');
      }
    } catch (error) {
      toast.error('Erreur lors du déplacement');
    }
  };

  const addEmojiToText = (emoji: string) => {
    setFormData(prev => ({ ...prev, text: prev.text + emoji }));
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormData({
      text: '',
      icon: 'AlertCircle',
      textColor: '#ffffff',
      bgColor: '#1e40af',
      urgent: false,
      position: 0
    });
    setEmojiInput('');
  };

  const commonEmojis = ['🎉', '📈', '📅', '👥', '⚡', '🔥', '✨', '🎁', '💰', '🏠', '📍', '🚀', '💡', '📢', '🏆'];

  const handleSaveColorFavorite = async () => {
    if (!favoriteNameInput.trim() || !showFavoriteName) {
      toast.error('Veuillez entrer un nom pour le favori');
      return;
    }

    try {
      const response = await fetch('/api/color-favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: favoriteNameInput.trim(),
          value: showFavoriteName.value,
          type: showFavoriteName.type
        })
      });

      if (response.ok) {
        toast.success('Couleur ajoutée aux favoris !');
        setShowFavoriteName(null);
        setFavoriteNameInput('');
        loadColorFavorites();
      } else {
        toast.error('Erreur lors de l\'ajout du favori');
      }
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du favori');
    }
  };

  const handleDeleteColorFavorite = async (id: string) => {
    try {
      const response = await fetch(`/api/color-favorites?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Favori supprimé !');
        loadColorFavorites();
      } else {
        toast.error('Erreur lors de la suppression');
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const textColorFavorites = colorFavorites.filter(f => f.type === 'text');
  const bgColorFavorites = colorFavorites.filter(f => f.type === 'background');

  const handleSaveSettings = async () => {
    try {
      const response = await fetch('/api/flash-info/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsData)
      });

      if (response.ok) {
        toast.success('Paramètres sauvegardés !');
        loadFlashInfo();
      } else {
        toast.error('Erreur lors de la sauvegarde des paramètres');
      }
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde des paramètres');
    }
  };

  const handleSaveSettingsAsPreset = async () => {
    if (!presetNameInput.trim()) {
      toast.error('Veuillez entrer un nom pour le préréglage');
      return;
    }

    try {
      const response = await fetch('/api/flash-info-presets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: presetNameInput.trim(),
          settings: settingsData
        })
      });

      if (response.ok) {
        toast.success('Configuration sauvegardée comme préréglage !');
        setShowPresetName(false);
        setPresetNameInput('');
        loadSettingPresets();
      } else {
        toast.error('Erreur lors de la sauvegarde du préréglage');
      }
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde du préréglage');
    }
  };

  const handleApplyPreset = (preset: SettingPreset) => {
    setSettingsData(preset.settings);
    toast.success(`Préréglage "${preset.name}" appliqué !`);
  };

  const handleDeletePreset = async (id: string) => {
    try {
      const response = await fetch(`/api/flash-info-presets?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Préréglage supprimé !');
        loadSettingPresets();
      } else {
        toast.error('Erreur lors de la suppression');
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col bg-card p-6 pt-16">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-card p-6 pt-16">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4"
        onClick={onBack}
      >
        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
      </Button>
      {onHome && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-16"
          onClick={onHome}
        >
          <Home className="h-5 w-5 text-muted-foreground" />
        </Button>
      )}

      <h2 className="text-2xl font-bold text-center text-foreground mb-6">
        Gestion des Flash Infos
      </h2>

      {/* Bouton Paramètres */}
      <div className="mb-4 flex justify-center">
        <Button
          variant="outline"
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2"
        >
          <Settings className="h-5 w-5" />
          Paramètres de la barre
          {showSettings ? <RotateCw className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </Button>
      </div>

      {/* Section Paramètres de la Barre */}
      {showSettings && (
        <Card className="mb-6 border-2 border-brand-blue bg-brand-blue/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-brand-blue">
              <Sliders className="h-5 w-5" />
              Configuration de la Barre Flash Info
            </CardTitle>
            <CardDescription>
              Personnalisez l'apparence et le comportement de la barre de défilement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Vitesse de défilement */}
            <div>
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="scrollSpeed">Vitesse de défilement</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="scrollSpeedValue"
                    type="number"
                    min={10}
                    max={120}
                    step={5}
                    value={settingsData.scrollSpeed}
                    onChange={(e) => setSettingsData(prev => ({ ...prev, scrollSpeed: Math.min(120, Math.max(10, parseInt(e.target.value) || 10)) }))}
                    className="w-20"
                    aria-label="Durée du défilement en secondes"
                  />
                  <span className="text-sm text-muted-foreground">secondes</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xs text-muted-foreground">Rapide</span>
                <input
                  type="range"
                  id="scrollSpeed"
                  min={10}
                  max={120}
                  step={5}
                  value={settingsData.scrollSpeed}
                  onChange={(e) => setSettingsData(prev => ({ ...prev, scrollSpeed: parseInt(e.target.value) }))}
                  className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: '#3b82f6' }}
                />
                <span className="text-xs text-muted-foreground">Lent</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Plus la valeur est basse, plus le défilement est rapide (10s = très rapide, 120s = très lent)
              </p>
            </div>

            {/* Couleur de fond globale */}
            <div>
              <Label htmlFor="bgColor">Couleur de fond de la barre</Label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {colorPresets.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSettingsData(prev => ({ ...prev, bgColor: color.value }))}
                    className={`w-10 h-10 rounded-full border-2 ${settingsData.bgColor === color.value ? 'border-gray-900' : 'border-border'}`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>

              {/* Favoris de fond */}
              {bgColorFavorites.length > 0 && (
                <div className="mt-2">
                  <Label className="text-xs text-muted-foreground">Favoris de fond</Label>
                  <div className="flex gap-2 mt-1 flex-wrap items-center">
                    {bgColorFavorites.map((fav) => (
                      <div key={fav.id} className="relative group">
                        <button
                          onClick={() => setSettingsData(prev => ({ ...prev, bgColor: fav.value }))}
                          className={`w-8 h-8 rounded-full border-2 ${settingsData.bgColor === fav.value ? 'border-gray-900' : 'border-border'}`}
                          style={{ backgroundColor: fav.value }}
                          title={fav.name}
                        />
                        <button
                          onClick={() => handleDeleteColorFavorite(fav.id)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Supprimer le favori"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-2">
                <Input
                  type="color"
                  value={settingsData.bgColor}
                  onChange={(e) => setSettingsData(prev => ({ ...prev, bgColor: e.target.value }))}
                  className="w-20"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFavoriteName({ type: 'background', value: settingsData.bgColor })}
                  className="flex-1"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Ajouter aux favoris
                </Button>
              </div>
            </div>

            {/* Couleur de texte par défaut */}
            <div>
              <Label htmlFor="textColor">Couleur de texte par défaut</Label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {textColorPresets.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSettingsData(prev => ({ ...prev, textColor: color.value }))}
                    className={`w-10 h-10 rounded-full border-2 ${settingsData.textColor === color.value ? 'border-gray-900' : 'border-border'}`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>

              {/* Favoris de texte */}
              {textColorFavorites.length > 0 && (
                <div className="mt-2">
                  <Label className="text-xs text-muted-foreground">Favoris de texte</Label>
                  <div className="flex gap-2 mt-1 flex-wrap items-center">
                    {textColorFavorites.map((fav) => (
                      <div key={fav.id} className="relative group">
                        <button
                          onClick={() => setSettingsData(prev => ({ ...prev, textColor: fav.value }))}
                          className={`w-8 h-8 rounded-full border-2 ${settingsData.textColor === fav.value ? 'border-gray-900' : 'border-border'}`}
                          style={{ backgroundColor: fav.value }}
                          title={fav.name}
                        />
                        <button
                          onClick={() => handleDeleteColorFavorite(fav.id)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Supprimer le favori"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-2">
                <Input
                  type="color"
                  value={settingsData.textColor}
                  onChange={(e) => setSettingsData(prev => ({ ...prev, textColor: e.target.value }))}
                  className="w-20"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFavoriteName({ type: 'text', value: settingsData.textColor })}
                  className="flex-1"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Ajouter aux favoris
                </Button>
              </div>
            </div>

            {/* Préréglages sauvegardés */}
            <div>
              <Label>Préréglages sauvegardés</Label>
              <div className="mt-2 space-y-2">
                {settingPresets.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">
                    Aucun préréglage sauvegardé. Sauvegardez votre configuration actuelle comme préréglage pour la réutiliser facilement.
                  </p>
                ) : (
                  settingPresets.map((preset) => (
                    <div
                      key={preset.id}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:border-brand-blue transition-colors"
                    >
                      <div className="flex gap-2">
                        <div
                          className="w-8 h-8 rounded border-2"
                          style={{ backgroundColor: preset.settings.bgColor }}
                        />
                        <div
                          className="w-8 h-8 rounded-full border-2"
                          style={{ backgroundColor: preset.settings.textColor }}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{preset.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Vitesse: {preset.settings.scrollSpeed}s
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApplyPreset(preset)}
                        title="Appliquer ce préréglage"
                      >
                        <RotateCw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeletePreset(preset.id)}
                        title="Supprimer"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>

              <Button
                variant="outline"
                onClick={() => setShowPresetName(true)}
                className="w-full mt-2"
              >
                <Star className="h-4 w-4 mr-2" />
                Sauvegarder la configuration actuelle comme préréglage
              </Button>
            </div>

            {/* Aperçu en temps réel */}
            <div>
              <Label>Aperçu en temps réel</Label>
              <div className="mt-2 border-2 rounded-lg overflow-hidden">
                <div className="bg-orange-500 px-3 md:px-4 py-2 md:py-3 border-2 border-red-600 flex-shrink-0">
                  <span className="hidden md:inline text-sm font-bold text-white">FLASH</span>
                  <span className="text-xs md:text-sm font-bold text-white">INFO</span>
                </div>
                <div
                  className="overflow-hidden py-3"
                  style={{ backgroundColor: settingsData.bgColor }}
                >
                  <div
                    className="flex items-center gap-12"
                    style={{ animation: 'scroll ' + settingsData.scrollSpeed + 's linear infinite' }}
                  >
                    {data?.items.slice(0, 3).map((item, idx) => (
                      <div key={`preview-${item.id}-${idx}`} className="flex items-center gap-2 flex-shrink-0 whitespace-nowrap">
                        <span style={{ color: '#fbbf24' }}>
                          {iconOptions.find(o => o.value === item.icon)?.label.split(' ')[0] || '⚠️'}
                        </span>
                        <span className="text-sm font-medium" style={{ color: settingsData.textColor }}>
                          {item.text}
                        </span>
                        <span className="mx-4 opacity-50">•</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSaveSettings} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder les paramètres
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowSettings(false)}
                className="flex-1"
              >
                Fermer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal pour nommer le préréglage */}
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {editingId ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              {editingId ? 'Modifier le flash info' : 'Ajouter un flash info'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Texte avec émoticônes */}
            <div>
              <Label htmlFor="text">Texte du message</Label>
              <Input
                id="text"
                value={formData.text}
                onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Entrez votre message..."
                className="mt-2"
              />
            </div>

            {/* Émoticônes rapides */}
            <div>
              <Label>Émoticônes rapides</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {commonEmojis.map((emoji) => (
                  <Button
                    key={emoji}
                    variant="outline"
                    size="sm"
                    onClick={() => addEmojiToText(emoji)}
                    className="text-xl"
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>

            {/* Émoticône personnalisée */}
            <div>
              <Label>Ajouter une émoticône personnalisée</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={emojiInput}
                  onChange={(e) => setEmojiInput(e.target.value)}
                  placeholder="Collez ou tapez une émoticône"
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    if (emojiInput) {
                      addEmojiToText(emojiInput);
                      setEmojiInput('');
                    }
                  }}
                  disabled={!emojiInput}
                >
                  Ajouter
                </Button>
              </div>
            </div>

            {/* Icône */}
            <div>
              <Label htmlFor="icon">Icône</Label>
              <select
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                className="mt-2 w-full px-3 py-2 border rounded-md"
              >
                {iconOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Couleur du texte avec favoris */}
            <div>
              <Label htmlFor="textColor">Couleur du texte</Label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {textColorPresets.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setFormData(prev => ({ ...prev, textColor: color.value }))}
                    className={`w-10 h-10 rounded-full border-2 ${formData.textColor === color.value ? 'border-gray-900' : 'border-border'}`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>

              {/* Favoris de couleurs de texte */}
              {textColorFavorites.length > 0 && (
                <div className="mt-2">
                  <Label className="text-xs text-muted-foreground">Favoris de texte</Label>
                  <div className="flex gap-2 mt-1 flex-wrap items-center">
                    {textColorFavorites.map((fav) => (
                      <div key={fav.id} className="relative group">
                        <button
                          onClick={() => setFormData(prev => ({ ...prev, textColor: fav.value }))}
                          className={`w-8 h-8 rounded-full border-2 ${formData.textColor === fav.value ? 'border-gray-900' : 'border-border'}`}
                          style={{ backgroundColor: fav.value }}
                          title={fav.name}
                        />
                        <button
                          onClick={() => handleDeleteColorFavorite(fav.id)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Supprimer le favori"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-2">
                <Input
                  type="color"
                  value={formData.textColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, textColor: e.target.value }))}
                  className="w-20"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFavoriteName({ type: 'text', value: formData.textColor })}
                  className="flex-1"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Ajouter aux favoris
                </Button>
              </div>
            </div>

            {/* Couleur de fond avec favoris */}
            <div>
              <Label htmlFor="bgColor">Couleur de fond</Label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {colorPresets.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setFormData(prev => ({ ...prev, bgColor: color.value }))}
                    className={`w-10 h-10 rounded-full border-2 ${formData.bgColor === color.value ? 'border-gray-900' : 'border-border'}`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>

              {/* Favoris de couleurs de fond */}
              {bgColorFavorites.length > 0 && (
                <div className="mt-2">
                  <Label className="text-xs text-muted-foreground">Favoris de fond</Label>
                  <div className="flex gap-2 mt-1 flex-wrap items-center">
                    {bgColorFavorites.map((fav) => (
                      <div key={fav.id} className="relative group">
                        <button
                          onClick={() => setFormData(prev => ({ ...prev, bgColor: fav.value }))}
                          className={`w-8 h-8 rounded-full border-2 ${formData.bgColor === fav.value ? 'border-gray-900' : 'border-border'}`}
                          style={{ backgroundColor: fav.value }}
                          title={fav.name}
                        />
                        <button
                          onClick={() => handleDeleteColorFavorite(fav.id)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Supprimer le favori"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-2">
                <Input
                  type="color"
                  value={formData.bgColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, bgColor: e.target.value }))}
                  className="w-20"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFavoriteName({ type: 'background', value: formData.bgColor })}
                  className="flex-1"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Ajouter aux favoris
                </Button>
              </div>
            </div>

            {/* Urgent */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="urgent"
                checked={formData.urgent}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, urgent: checked as boolean }))}
              />
              <Label htmlFor="urgent">Marquer comme urgent</Label>
            </div>

            {/* Boutons */}
            <div className="flex gap-2 pt-2">
              <Button onClick={editingId ? () => handleUpdate(editingId) : handleSave}>
                <Save className="h-4 w-4 mr-2" />
                {editingId ? 'Mettre à jour' : 'Sauvegarder'}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal pour nommer le préréglage */}
      {showPresetName && (
        <Card className="mb-6 border-2 border-brand-blue bg-brand-blue/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-brand-blue">
              <Star className="h-5 w-5" />
              Sauvegarder comme Préréglage
            </CardTitle>
            <CardDescription>
              Donnez un nom à cette configuration pour la retrouver facilement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              value={presetNameInput}
              onChange={(e) => setPresetNameInput(e.target.value)}
              placeholder="Ex: Mode urgent, Promo Noël, Fin d'année, etc."
            />
            <div className="flex gap-2">
              <Button onClick={handleSaveSettingsAsPreset} className="flex-1">
                <Star className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
              <Button variant="outline" onClick={() => { setShowPresetName(false); setPresetNameInput(''); }}>
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal pour nommer le favori de couleur */}
      {showFavoriteName && (
        <Card className="mb-6 border-2 border-yellow-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <Heart className="h-5 w-5" />
              Nommer le favori de couleur
            </CardTitle>
            <CardDescription>
              Donnez un nom à cette couleur pour la retrouver facilement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg border-2" style={{ backgroundColor: showFavoriteName.value }} />
              <div className="flex-1">
                <Label htmlFor="favoriteName">Nom du favori</Label>
                <Input
                  id="favoriteName"
                  value={favoriteNameInput}
                  onChange={(e) => setFavoriteNameInput(e.target.value)}
                  placeholder="Ex: Vert promo, Bleu urgent, etc."
                  className="mt-2"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveColorFavorite} className="flex-1">
                <Star className="h-4 w-4 mr-2" />
                Sauvegarder comme favori
              </Button>
              <Button variant="outline" onClick={() => { setShowFavoriteName(null); setFavoriteNameInput(''); }}>
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des flash infos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Flash infos actuels</CardTitle>
              <CardDescription>
                Gérez les messages qui défilent sur la page d'accueil
              </CardDescription>
            </div>
            {!showAddForm && (
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {data && data.items.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucun flash info. Cliquez sur "Ajouter" pour en créer un.
            </p>
          ) : (
            <div className="space-y-3">
              {data?.items.map((item, index) => (
                <div
                  key={item.id || `item-${index}`}
                  className="flex items-center gap-3 p-4 border rounded-lg"
                  style={{ backgroundColor: item.bgColor }}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span style={{ color: '#fbbf24' }}>
                      {iconOptions.find(o => o.value === item.icon)?.label.split(' ')[0] || '⚠️'}
                    </span>
                    <span
                      className="text-sm font-medium truncate"
                      style={{ color: item.textColor }}
                    >
                      {item.text}
                    </span>
                    {item.urgent && (
                      <span className="inline-flex items-center bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex-shrink-0">
                        URGENT
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleMove(item.id, 'up')}
                      disabled={index === 0}
                      className="h-8 w-8"
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleMove(item.id, 'down')}
                      disabled={index === data.items.length - 1}
                      className="h-8 w-8"
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(item)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Aperçu en direct */}
      {data && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Aperçu en direct</CardTitle>
            <CardDescription>
              Prévisualisation des flash infos tels qu'ils apparaîtront sur la page d'accueil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="w-full text-white overflow-hidden rounded-lg"
              style={{ backgroundColor: data.settings.bgColor }}
            >
              <div className="overflow-hidden py-3">
                <div
                  className="flex items-center gap-12"
                  style={{ animation: 'scroll 30s linear infinite' }}
                >
                  {data.items.map((item, index) => (
                    <div key={item.id || `marquee-${index}`} className="flex items-center gap-2 flex-shrink-0 whitespace-nowrap">
                      {item.urgent && (
                        <span className="inline-flex items-center bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          URGENT
                        </span>
                      )}
                      <span style={{ color: '#fbbf24' }}>
                        {iconOptions.find(o => o.value === item.icon)?.label.split(' ')[0] || '⚠️'}
                      </span>
                      <span
                        className="text-sm font-medium"
                        style={{ color: item.textColor }}
                      >
                        {item.text}
                      </span>
                      <span className="mx-4 opacity-50">•</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <style jsx global>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  );
}