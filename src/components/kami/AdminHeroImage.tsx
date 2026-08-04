'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Home, Upload, Image as ImageIcon, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface AdminHeroImageProps {
  onBack: () => void;
  onHome?: () => void;
}

export function AdminHeroImage({ onBack, onHome }: AdminHeroImageProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [currentImage, setCurrentImage] = useState<{ filename: string; mimeType: string; size: number; url: string } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    loadCurrentImage();
  }, []);

  const loadCurrentImage = async () => {
    try {
      const response = await fetch('/api/admin-files?type=HERO');
      if (response.ok) {
        const data = await response.json();
        if (data.file) {
          setCurrentImage(data.file);
          setPreviewUrl(data.file.url);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

      if (!validTypes.includes(selectedFile.type)) {
        toast.error('Type de fichier non supporté. Veuillez choisir une image PNG, JPEG ou WEBP.');
        return;
      }

      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('Le fichier est trop volumineux. Maximum 10 Mo.');
        return;
      }

      setFile(selectedFile);
      // Create preview URL
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Veuillez sélectionner une image');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'HERO');

      const response = await fetch('/api/admin-files', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Image de fond mise à jour avec succès !');
        setFile(null);
        loadCurrentImage();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erreur lors de l\'upload');
      }
    } catch (error) {
      toast.error('Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentImage) return;

    try {
      const response = await fetch('/api/admin-files?type=HERO', {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Image de fond supprimée avec succès !');
        setCurrentImage(null);
        setPreviewUrl(null);
      } else {
        toast.error('Erreur lors de la suppression');
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="flex-1 flex flex-col bg-card p-6 pt-16 overflow-y-auto">
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
        Gestion de l'Image de Fond
      </h2>

      <div className="max-w-2xl mx-auto w-full space-y-6">
        {/* Image actuelle */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-blue-600" />
              Image de Fond de l'Accueil
            </h3>

            {previewUrl ? (
              <div className="space-y-4">
                {/* Preview */}
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-border">
                  <img
                    src={previewUrl}
                    alt="Aperçu de l'image de fond"
                    className="w-full h-48 object-cover"
                  />
                </div>

                {/* Info */}
                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                      <div>
                        {currentImage && (
                          <>
                            <p className="font-semibold text-foreground">{currentImage.filename}</p>
                            <p className="text-sm text-foreground mt-1">
                              {formatFileSize(currentImage.size)} • {currentImage.mimeType}
                            </p>
                          </>
                        )}
                        {file && (
                          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                            Nouveau fichier sélectionné (non uploadé)
                          </p>
                        )}
                        {currentImage && (
                          <a
                            href={currentImage.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                          >
                            Voir l'image →
                          </a>
                        )}
                      </div>
                    </div>
                    {currentImage && !file && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDelete}
                        className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-muted-foreground" />
                  <p className="text-sm text-foreground">
                    Aucune image de fond n'a été définie (le gradient par défaut sera utilisé)
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upload */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-600" />
              Uploader une nouvelle image
            </h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="hero-image-file">Image de fond (PNG, JPEG ou WEBP)</Label>
                <Input
                  id="hero-image-file"
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp"
                  onChange={handleFileChange}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Taille maximale : 10 Mo • Recommandé : 1920x1080 px ou plus
                </p>
              </div>

              {file && (
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">Fichier sélectionné :</span> {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              )}

              <Button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-3"
              >
                {uploading ? 'Upload en cours...' : 'Uploader l\'image'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3">💡 Informations</h3>
            <ul className="space-y-2 text-sm text-foreground">
              <li>• L'image de fond apparaîtra sur la page d'accueil avec un overlay bleu semi-transparent</li>
              <li>• Si aucune image n'est définie, un gradient bleu par défaut sera utilisé</li>
              <li>• L'image doit être de haute qualité pour un bon rendu sur tous les écrans</li>
              <li>• Les formats supportés : PNG, JPEG, WEBP</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}