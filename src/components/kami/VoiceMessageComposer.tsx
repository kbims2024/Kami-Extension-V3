'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, StopCircle, Trash2, Send, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useAudioRecorder, formatVoiceDuration, RecordedVoice } from '@/hooks/useAudioRecorder';
import { VoiceMessagePlayer } from './VoiceMessagePlayer';

interface VoiceMessageComposerProps {
  isDark?: boolean;
  sending?: boolean;
  disabled?: boolean;
  accentColor?: string;
  onActiveChange?: (active: boolean) => void;
  onSend: (voice: RecordedVoice) => Promise<boolean>;
}

/**
 * Enregistreur de message vocal en 3 étapes :
 *   1. Enregistrer (micro)
 *   2. Écouter le résultat (lecteur)
 *   3. Envoyer, réenregistrer ou annuler
 * Le message n'est envoyé qu'après écoute et validation par l'utilisateur.
 */
export function VoiceMessageComposer({
  isDark = false,
  sending = false,
  disabled = false,
  accentColor = '#2563EB',
  onActiveChange,
  onSend,
}: VoiceMessageComposerProps) {
  const voiceRec = useAudioRecorder();
  const [preview, setPreview] = useState<RecordedVoice | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  const active = voiceRec.recording || preview !== null;

  useEffect(() => {
    onActiveChange?.(active);
  }, [active, onActiveChange]);

  const previewUrl = useMemo(() => {
    if (!preview) return null;
    if (!previewUrlRef.current) {
      previewUrlRef.current = URL.createObjectURL(preview.blob);
    }
    return previewUrlRef.current;
  }, [preview]);

  // Libère l'URL objet au démontage.
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, []);

  const clearPreview = () => {
    setPreview(null);
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  };

  const handleMicClick = async () => {
    if (!voiceRec.supported) {
      toast.error("L'enregistrement vocal n'est pas supporté par ce navigateur");
      return;
    }

    if (voiceRec.recording) {
      const voice = await voiceRec.stop();
      if (voice) setPreview(voice);
      return;
    }

    const ok = await voiceRec.start();
    if (!ok) toast.error("Impossible de démarrer l'enregistrement vocal");
  };

  const handleSend = async () => {
    if (sending || !preview) return;
    const success = await onSend(preview);
    if (success) clearPreview();
  };

  const handleReRecord = async () => {
    clearPreview();
    const ok = await voiceRec.start();
    if (!ok) toast.error("Impossible de démarrer l'enregistrement vocal");
  };

  // ─── Étape 3 : écouter avant d'envoyer ───
  if (preview) {
    return (
      <>
        <div className="flex-1 min-w-0 flex justify-center">
          {previewUrl && (
            <VoiceMessagePlayer
              url={previewUrl}
              mimeType={preview.mimeType}
              duration={preview.duration}
              accentColor={accentColor}
              isDark={isDark}
            />
          )}
        </div>

        <Button
          type="button"
          onClick={handleSend}
          disabled={sending}
          className="rounded-full shrink-0"
          style={{ width: '46px', height: '46px', backgroundColor: '#2563EB', color: 'white' }}
          size="icon"
          title="Envoyer le message vocal"
        >
          {sending ? <RefreshCcw className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </Button>

        <Button
          type="button"
          onClick={handleReRecord}
          disabled={sending}
          className="rounded-full shrink-0"
          style={{ width: '42px', height: '42px', backgroundColor: '#E2E8F0', color: '#475569' }}
          size="icon"
          title="Réenregistrer"
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          onClick={clearPreview}
          disabled={sending}
          className="rounded-full shrink-0"
          style={{ width: '42px', height: '42px', backgroundColor: '#E2E8F0', color: '#ef4444' }}
          size="icon"
          title="Supprimer l'enregistrement"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </>
    );
  }

  // ─── Étape 2 : enregistrement en cours ───
  if (voiceRec.recording) {
    return (
      <>
        <Button
          type="button"
          onClick={handleMicClick}
          disabled={sending}
          className="rounded-full shrink-0"
          style={{ width: '46px', height: '46px', backgroundColor: '#ef4444', color: 'white' }}
          size="icon"
          title="Arrêter l'enregistrement"
        >
          <StopCircle className="h-5 w-5" />
        </Button>

        <div
          className="flex-1 flex items-center justify-center gap-2 rounded-full px-4 py-3 text-[14px] font-semibold"
          style={{ backgroundColor: isDark ? '#2A3942' : '#F0F0F0', color: '#ef4444' }}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
          </span>
          {formatVoiceDuration(voiceRec.recordingTime)}
        </div>

        <Button
          type="button"
          onClick={() => voiceRec.cancel()}
          className="rounded-full shrink-0"
          style={{ width: '42px', height: '42px', backgroundColor: '#E2E8F0', color: '#475569' }}
          size="icon"
          title="Annuler l'enregistrement"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </>
    );
  }

  // ─── Étape 1 : micro inactif ───
  return (
    <Button
      type="button"
      onClick={handleMicClick}
      disabled={disabled || sending}
      className="rounded-full shrink-0"
      style={{ width: '42px', height: '42px', backgroundColor: '#E2E8F0', color: '#475569' }}
      size="icon"
      title="Envoyer un message vocal"
    >
      <Mic className="h-4 w-4" />
    </Button>
  );
}
