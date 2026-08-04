'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Upload, X, Eye, Palette, Type, Image as ImageIcon, Check, ArrowLeft, Home } from 'lucide-react';

export interface LogoData {
  id?: string;
  text: string;
  imageUrl: string | null;
  textColor: string;
  backgroundColor: string;
}

interface AdminLogoProps {
  onClose?: () => void;
  onHome?: () => void;
}

export function AdminLogo({ onClose, onHome }: AdminLogoProps) {
  const [logo, setLogo] = useState<LogoData>({
    text: 'KAMI-EXTENSION',
    imageUrl: null,
    textColor: '#8B5E3C',
    backgroundColor: '#ffffff',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<'text' | 'image'>('text');
  const [logoType, setLogoType] = useState<'text' | 'image'>('text');

  useEffect(() => {
    loadLogo();
  }, []);

  const loadLogo = async () => {
    try {
      const response = await fetch('/api/logo');
      if (response.ok) {
        const data = await response.json();
        setLogo(data);
        setLogoType(data.imageUrl ? 'image' : 'text');
        setPreviewMode(data.imageUrl ? 'image' : 'text');
      }
    } catch (error) {
      console.error('Error loading logo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/logo', {
        method: logo.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...logo,
          // Clear imageUrl if in text mode
          imageUrl: logoType === 'image' ? logo.imageUrl : null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setLogo(data);
        toast.success('Logo enregistré avec succès !');
      } else {
        toast.error('Erreur lors de l\'enregistrement du logo');
      }
    } catch (error) {
      console.error('Error saving logo:', error);
      toast.error('Erreur lors de l\'enregistrement du logo');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Le fichier doit être une image');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'LOGO');

    try {
      const response = await fetch('/api/admin-files', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setLogo({ ...logo, imageUrl: data.file?.url || null });
        toast.success('Image téléchargée avec succès !');
      } else {
        toast.error('Erreur lors du téléchargement de l\'image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Erreur lors du téléchargement de l\'image');
    }
  };

  const handleRemoveImage = () => {
    setLogo({ ...logo, imageUrl: null });
    setLogoType('text');
    setPreviewMode('text');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B5E3C]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {(onClose || onHome) && (
        <div className="flex items-center gap-1">
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          {onHome && (
            <Button variant="ghost" size="icon" onClick={onHome} className="text-muted-foreground">
              <Home className="h-5 w-5" />
            </Button>
          )}
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Configuration du Logo
          </CardTitle>
          <CardDescription>
            Personnalisez le logo de votre plateforme KAMI-EXTENSION
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={logoType} onValueChange={(v) => setLogoType(v as 'text' | 'image')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">
                <Type className="h-4 w-4 mr-2" />
                Logo Texte
              </TabsTrigger>
              <TabsTrigger value="image">
                <ImageIcon className="h-4 w-4 mr-2" />
                Logo Image
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="logo-text">Texte du Logo</Label>
                <Input
                  id="logo-text"
                  value={logo.text}
                  onChange={(e) => setLogo({ ...logo, text: e.target.value })}
                  placeholder="KAMI-EXTENSION"
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="text-color" className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Couleur du texte
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="text-color"
                      type="color"
                      value={logo.textColor}
                      onChange={(e) => setLogo({ ...logo, textColor: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={logo.textColor}
                      onChange={(e) => setLogo({ ...logo, textColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bg-color" className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Couleur de fond
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="bg-color"
                      type="color"
                      value={logo.backgroundColor}
                      onChange={(e) => setLogo({ ...logo, backgroundColor: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={logo.backgroundColor}
                      onChange={(e) => setLogo({ ...logo, backgroundColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="image" className="space-y-4 mt-4">
              {logo.imageUrl ? (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-4">
                    <img
                      src={logo.imageUrl}
                      alt="Logo preview"
                      className="max-h-40 mx-auto object-contain"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    onClick={handleRemoveImage}
                    className="w-full"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Supprimer l'image
                  </Button>
                </div>
              ) : (
                <div>
                  <Label>Uploader une image</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 mt-2 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Glissez-déposez ou cliquez pour uploader
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Format: JPG, PNG, GIF (max 5MB)
                    </p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="mt-4"
                    />
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 mt-6">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-[#10B981] hover:bg-[#059669]"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
              <Check className="h-4 w-4 ml-2" />
            </Button>
            {onClose && (
              <Button
                variant="outline"
                onClick={onClose}
                disabled={saving}
              >
                Annuler
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Aperçu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="p-6 rounded-lg border-2 border-dashed border-border flex items-center justify-center min-h-24"
            style={{ backgroundColor: logo.backgroundColor }}
          >
            {logoType === 'text' || !logo.imageUrl ? (
              <h1 className="text-2xl font-extrabold" style={{ color: logo.textColor }}>
                {logo.text}
              </h1>
            ) : (
              <img src={logo.imageUrl} alt="Logo" className="max-h-16 object-contain" crossOrigin="anonymous" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Ce sera le logo affiché sur toute la plateforme
          </p>
        </CardContent>
      </Card>
    </div>
  );
}