'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, StopCircle, Trash2, Send, RefreshCcw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  useAudioRecorder,
  formatVoiceClock,
  RecordedVoice,
  VoiceRecorderResult,
} from '@/hooks/useAudioRecorder';
import { VoiceMessagePlayer } from './VoiceMessagePlayer';

const EQUALIZER_BARS = 7;

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
 *   1. Enregistrer (micro, durée limitée à 2 min, égaliseur + minuteur)
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
  const voiceRec = useAudioRecorder({
    onAutoStop: (voice) => {
      setPreviewVoice(voice);
      toast.info('Limite de durée atteinte : écoutez puis envoyez votre message.');
    },
  });
  const [preview, setPreview] = useState<RecordedVoice | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  const active = voiceRec.recording || preview !== null;

  useEffect(() => {
    onActiveChange?.(active);
  }, [active, onActiveChange]);

  // L'URL objet de l'aperçu est créée dans les gestionnaires d'événements
  // (jamais pendant le rendu) et libérée lors de l'effacement ou du démontage.
  const setPreviewVoice = (voice: RecordedVoice) => {
    const url = URL.createObjectURL(voice.blob);
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }
    previewUrlRef.current = url;
    setPreviewUrl(url);
    setPreview(voice);
  };

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, []);

  const clearPreview = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreview(null);
    setPreviewUrl(null);
  };

  const showError = (result: VoiceRecorderResult) => {
    // Annulation volontaire : pas de notification.
    if (!result.ok && result.reason !== 'cancelled') {
      toast.error(result.message);
    }
  };

  const handleMicClick = async () => {
    if (voiceRec.recording) {
      const result = await voiceRec.stop();
      if (result.ok) {
        setPreviewVoice(result.voice);
      } else {
        showError(result);
      }
      return;
    }

    if (!voiceRec.supported) {
      toast.error("L'enregistrement vocal n'est pas supporté par ce navigateur");
      return;
    }

    const result = await voiceRec.start();
    if (!result.ok) {
      toast.error(result.message || "Impossible de démarrer l'enregistrement vocal");
    }
  };

  const handleSend = async () => {
    if (sending || !preview) return;
    const success = await onSend(preview);
    if (success) clearPreview();
  };

  const handleReRecord = async () => {
    clearPreview();
    const result = await voiceRec.start();
    if (!result.ok) {
      toast.error(result.message || "Impossible de démarrer l'enregistrement vocal");
    }
  };

  const handleCancelRecording = () => {
    voiceRec.cancel();
  };

  const progress =
    voiceRec.maxDuration > 0
      ? Math.min(100, (voiceRec.recordingTime / voiceRec.maxDuration) * 100)
      : 0;

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
          style={{ width: '46px', height: '46px', backgroundColor: accentColor, color: 'white' }}
          size="icon"
          title="Envoyer le message vocal"
        >
          {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
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

        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <div
            className="flex items-center justify-center gap-2.5 rounded-full px-4 py-2"
            style={{ backgroundColor: isDark ? '#2A3942' : '#F0F0F0' }}
          >
            <span className="flex items-end gap-[3px] h-5" aria-hidden>
              {Array.from({ length: EQUALIZER_BARS }).map((_, i) => (
                <motion.span
                  key={i}
                  animate={{ height: ['30%', '95%', '50%', '80%', '35%'] }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    repeatType: 'mirror',
                    delay: i * 0.08,
                    ease: 'easeInOut',
                  }}
                  className="w-[3px] rounded-full"
                  style={{ backgroundColor: '#ef4444' }}
                />
              ))}
            </span>
            <span className="text-[14px] font-semibold tabular-nums" style={{ color: '#ef4444' }}>
              {formatVoiceClock(voiceRec.recordingTime)}
            </span>
            <span className="text-[12px] tabular-nums" style={{ color: isDark ? '#94A3B8' : '#64748B' }}>
              / {formatVoiceClock(voiceRec.maxDuration)}
            </span>
          </div>
          <div
            className="h-1 w-full rounded-full overflow-hidden"
            style={{ backgroundColor: isDark ? '#334155' : '#E2E8F0' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: '#ef4444' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'linear', duration: 0.25 }}
            />
          </div>
        </div>

        <Button
          type="button"
          onClick={handleCancelRecording}
          disabled={sending}
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
      disabled={disabled || sending || voiceRec.starting}
      className="rounded-full shrink-0"
      style={{
        width: '42px',
        height: '42px',
        backgroundColor: voiceRec.starting ? '#E2E8F0' : '#E2E8F0',
        color: '#475569',
      }}
      size="icon"
      title={voiceRec.starting ? 'Demande d’accès au micro…' : 'Envoyer un message vocal'}
    >
      {voiceRec.starting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
}
