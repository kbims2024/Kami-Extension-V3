'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Home, Upload, FileText, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface AdminFilesProps {
  onBack: () => void;
  onHome?: () => void;
}

export function AdminFiles({ onBack, onHome }: AdminFilesProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [currentFile, setCurrentFile] = useState<{ filename: string; mimeType: string; size: number; path: string; url?: string } | null>(null);

  useEffect(() => {
    loadCurrentFile();
  }, []);

  const loadCurrentFile = async () => {
    try {
      const response = await fetch('/api/admin-files?type=PLAN');
      if (response.ok) {
        const data = await response.json();
        if (data.file) {
          setCurrentFile(data.file);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg'];

      if (!validTypes.includes(selectedFile.type)) {
        toast.error('Type de fichier non supporté. Veuillez choisir un PDF, PNG ou JPEG.');
        return;
      }

      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('Le fichier est trop volumineux. Maximum 10 Mo.');
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Veuillez sélectionner un fichier');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'PLAN');

      const response = await fetch('/api/admin-files', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Fichier uploadé avec succès !');
        setFile(null);
        loadCurrentFile();
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
    if (!currentFile) return;

    try {
      const response = await fetch('/api/admin-files?type=PLAN', {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Fichier supprimé avec succès !');
        setCurrentFile(null);
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
        Gestion des Fichiers
      </h2>

      <div className="max-w-2xl mx-auto w-full space-y-6">
        {/* Fichier actuel */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Plan du Village
            </h3>

            {currentFile ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                    <div>
                      <p className="font-semibold text-foreground">{currentFile.filename}</p>
                      <p className="text-sm text-foreground mt-1">
                        {formatFileSize(currentFile.size)} • {currentFile.mimeType}
                      </p>
                      <a
                        href={currentFile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                      >
                        Voir le fichier →
                      </a>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDelete}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-muted-foreground" />
                  <p className="text-sm text-foreground">
                    Aucun fichier n'a été uploadé
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
              Uploader un nouveau fichier
            </h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="plan-file">Fichier du plan (PDF, PNG ou JPEG)</Label>
                <Input
                  id="plan-file"
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Taille maximale : 10 Mo
                </p>
              </div>

              {file && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
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
                {uploading ? 'Upload en cours...' : 'Uploader le fichier'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}