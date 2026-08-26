'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, Home, Image as ImageIcon, Upload, Trash2 } from 'lucide-react';

interface AdminPaymentMethodLogosProps {
  onClose?: () => void;
  onHome?: () => void;
}

const METHOD_DEFS = [
  { id: 'wave', label: 'Wave', defaultLogo: '/images/wave.png' },
  { id: 'orange_money', label: 'Orange Money', defaultLogo: '/images/orange-money.png' },
  { id: 'moov_money', label: 'Moov Money', defaultLogo: '/images/moov-money.png' },
  { id: 'mtn_money', label: 'MTN Money', defaultLogo: '/images/mtn-money.png' },
];

const DEFAULT_NUMBERS: Record<string, string> = {
  wave: '0140252521',
  orange_money: '0749615456',
  moov_money: '0140916502',
  mtn_money: '0505623221',
};

export function AdminPaymentMethodLogos({ onClose, onHome }: AdminPaymentMethodLogosProps) {
  const [logos, setLogos] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [numbers, setNumbers] = useState(DEFAULT_NUMBERS);
  const [savingNumbers, setSavingNumbers] = useState(false);

  useEffect(() => {
    loadLogos();
  }, []);

  const loadLogos = async () => {
    try {
      const res = await fetch('/api/admin/payment-methods');
      if (!res.ok) {
        toast.error('Impossible de charger les logos de paiement');
        return;
      }

      const data = await res.json();
      setLogos(data.logos || {});
      setNumbers({ ...DEFAULT_NUMBERS, ...(data.numbers || {}) });
    } catch (error) {
      console.error('Error loading payment method logos:', error);
      toast.error('Erreur lors du chargement des logos');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNumbers = async () => {
    setSavingNumbers(true);
    try {
      const res = await fetch('/api/admin/payment-methods', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numbers }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la sauvegarde');
      setNumbers({ ...DEFAULT_NUMBERS, ...(data.numbers || {}) });
      toast.success('Numéros marchands enregistrés');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la sauvegarde');
    } finally {
      setSavingNumbers(false);
    }
  };

  const handleUpload = async (methodId: string, file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Le fichier doit être une image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('L’image ne doit pas dépasser 5 Mo');
      return;
    }

    setUploadingId(methodId);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', `PAYMENT_${methodId}`);

      const res = await fetch('/api/admin-files', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Erreur upload' }));
        toast.error(data.error || 'Erreur lors du téléchargement');
        return;
      }

      await loadLogos();
      toast.success('Logo mis à jour avec succès');
    } catch (error) {
      console.error('Error uploading payment logo:', error);
      toast.error('Erreur lors du téléchargement du logo');
    } finally {
      setUploadingId(null);
    }
  };

  const handleDelete = async (methodId: string) => {
    try {
      const res = await fetch(`/api/admin-files?type=PAYMENT_${methodId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        toast.error('Erreur lors de la suppression');
        return;
      }

      await loadLogos();
      toast.success('Logo supprimé');
    } catch (error) {
      console.error('Error deleting payment logo:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
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
            Logos des moyens de paiement
          </CardTitle>
          <CardDescription>
            Modifiez les logos affichés pour chaque méthode de paiement.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="border border-emerald-200 dark:border-emerald-900 rounded-xl p-4 space-y-3">
            <div>
              <p className="font-semibold">Numéros marchands</p>
              <p className="text-xs text-muted-foreground">Ces numéros seront proposés aux utilisateurs.</p>
            </div>
            {METHOD_DEFS.map((method) => (
              <div key={method.id} className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] items-center gap-3">
                <Label className="text-sm">{method.label}</Label>
                <Input
                  value={numbers[method.id] || ''}
                  onChange={(e) => setNumbers((prev) => ({ ...prev, [method.id]: e.target.value }))}
                  inputMode="numeric"
                  placeholder={DEFAULT_NUMBERS[method.id]}
                />
              </div>
            ))}
            <Button type="button" onClick={handleSaveNumbers} disabled={savingNumbers} className="w-full">
              {savingNumbers ? 'Enregistrement...' : 'Enregistrer les numéros marchands'}
            </Button>
          </div>

          {METHOD_DEFS.map((method) => {
            const currentLogo = logos[method.id] || method.defaultLogo;
            return (
              <div key={method.id} className="border rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg border bg-muted/30 flex items-center justify-center overflow-hidden">
                    <img src={currentLogo} alt={method.label} className="w-10 h-10 object-contain" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{method.label}</p>
                    <p className="text-xs text-muted-foreground">Logo actuel</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Label className="flex-1 cursor-pointer">
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingId === method.id}
                      onChange={(e) => handleUpload(method.id, e.target.files?.[0] || null)}
                    />
                    <span className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-dashed px-3 py-2 text-sm font-medium hover:bg-muted/50">
                      <Upload className="h-4 w-4" />
                      {uploadingId === method.id ? 'Téléchargement...' : 'Télécharger'}
                    </span>
                  </Label>

                  {logos[method.id] && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleDelete(method.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Retirer
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
