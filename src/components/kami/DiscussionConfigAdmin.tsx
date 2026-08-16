'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, Loader2, Save, AlertCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import { DISCUSSION_CONFIG_DEFAULTS, DiscussionConfig } from '@/lib/discussion-config';

export function DiscussionConfigAdmin() {
  const [config, setConfig] = useState<DiscussionConfig>({ ...DISCUSSION_CONFIG_DEFAULTS });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch(`/api/admin/discussion-config?t=${Date.now()}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        if (data?.config) setConfig(data.config);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/discussion-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        if (data?.config) setConfig(data.config);
        toast.success('Configuration des discussions enregistrée !');
      } else {
        toast.error(data?.error || 'Erreur lors de la sauvegarde');
      }
    } catch {
      toast.error('Erreur de connexion');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-card p-6 mt-4">
        <CardContent className="text-center text-muted-foreground">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 animate-pulse" />
          <p>Chargement...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-lg font-bold text-foreground">Configuration des discussions</h2>
      </div>
      <p className="text-xs text-muted-foreground">
        Paramètres du chat utilisateur ↔ CGL (Comité de Gestion des Lots).
      </p>

      <Card className="bg-card p-4">
        <CardContent className="p-0 space-y-5">
          {/* Activation */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <Label className="text-sm font-bold">Discussions activées</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Si désactivé, l&apos;entrée « Discussions » disparaît du menu et l&apos;envoi
                de messages est bloqué côté utilisateur.
              </p>
            </div>
            <Switch
              checked={config.enabled}
              onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, enabled: checked }))}
            />
          </div>

          <Separator />

          {/* Nom du CGL */}
          <div>
            <Label className="text-sm font-bold">Nom du CGL</Label>
            <Input
              value={config.cglName}
              onChange={(e) => setConfig((prev) => ({ ...prev, cglName: e.target.value }))}
              placeholder={DISCUSSION_CONFIG_DEFAULTS.cglName}
              className="mt-1"
              maxLength={80}
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              Affiché dans l&apos;en-tête du chat utilisateur.
            </p>
          </div>

          {/* Délai de réponse */}
          <div>
            <Label className="text-sm font-bold">Texte de délai de réponse</Label>
            <Input
              value={config.responseTimeText}
              onChange={(e) => setConfig((prev) => ({ ...prev, responseTimeText: e.target.value }))}
              placeholder={DISCUSSION_CONFIG_DEFAULTS.responseTimeText}
              className="mt-1"
              maxLength={120}
            />
          </div>

          <Separator />

          {/* Réponse automatique */}
          <div>
            <Label className="text-sm font-bold">Réponse automatique</Label>
            <Textarea
              value={config.autoReply}
              onChange={(e) => setConfig((prev) => ({ ...prev, autoReply: e.target.value }))}
              placeholder={DISCUSSION_CONFIG_DEFAULTS.autoReply}
              className="mt-1 min-h-[110px]"
              maxLength={4000}
            />
            <div className="flex items-start gap-1.5 mt-1">
              <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground">
                Envoyée automatiquement à l&apos;utilisateur lorsqu&apos;il écrit pour la
                première fois au CGL. Laissez vide pour désactiver.
              </p>
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saving ? 'Enregistrement...' : 'Enregistrer la configuration'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
