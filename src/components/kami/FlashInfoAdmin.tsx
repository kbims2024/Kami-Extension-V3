'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Plus, Edit, Trash2, Save, X, MoveUp, MoveDown } from 'lucide-react';
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
}

export function FlashInfoAdmin({ onBack }: FlashInfoAdminProps) {
  const [data, setData] = useState<FlashInfoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    text: '',
    icon: 'AlertCircle',
    textColor: '#ffffff',
    bgColor: '#1e40af',
    urgent: false,
    position: 0
  });
  const [emojiInput, setEmojiInput] = useState('');

  useEffect(() => {
    loadFlashInfo();
  }, []);

  const loadFlashInfo = async () => {
    try {
      const response = await fetch('/api/flash-info');
      if (response.ok) {
        const flashData = await response.json();
        setData(flashData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/flash-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
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
        body: JSON.stringify({ id, ...formData })
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

    // Swap positions
    const newItems = [...data.items];
    [newItems[index].position, newItems[newIndex].position] =
      [newItems[newIndex].position, newItems[index].position];

    newItems.sort((a, b) => a.position - b.position);

    try {
      const response = await fetch('/api/flash-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: newItems[index].id, position: newItems[index].position })
      });

      if (response.ok) {
        loadFlashInfo();
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

  if (loading) {
    return (
      <div className="flex-1 flex flex-col bg-gray-50 p-6 pt-16">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 p-6 pt-16">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4"
        onClick={onBack}
      >
        <ArrowLeft className="h-5 w-5 text-gray-500" />
      </Button>

      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
        Gestion des Flash Infos
      </h2>

      {/* Formulaire d'ajout/édition */}
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

            {/* Couleur du texte */}
            <div>
              <Label htmlFor="textColor">Couleur du texte</Label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {textColorPresets.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setFormData(prev => ({ ...prev, textColor: color.value }))}
                    className={`w-10 h-10 rounded-full border-2 ${formData.textColor === color.value ? 'border-gray-900' : 'border-gray-300'}`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
              <Input
                type="color"
                value={formData.textColor}
                onChange={(e) => setFormData(prev => ({ ...prev, textColor: e.target.value }))}
                className="mt-2 w-20"
              />
            </div>

            {/* Couleur de fond */}
            <div>
              <Label htmlFor="bgColor">Couleur de fond</Label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {colorPresets.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setFormData(prev => ({ ...prev, bgColor: color.value }))}
                    className={`w-10 h-10 rounded-full border-2 ${formData.bgColor === color.value ? 'border-gray-900' : 'border-gray-300'}`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
              <Input
                type="color"
                value={formData.bgColor}
                onChange={(e) => setFormData(prev => ({ ...prev, bgColor: e.target.value }))}
                className="mt-2 w-20"
              />
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
            <p className="text-center text-gray-500 py-8">
              Aucun flash info. Cliquez sur "Ajouter" pour en créer un.
            </p>
          ) : (
            <div className="space-y-3">
              {data?.items.map((item, index) => (
                <div
                  key={item.id}
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
                  {data.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 flex-shrink-0 whitespace-nowrap">
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