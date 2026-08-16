'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

// ─── Limites métier (alignées avec l'API /api/messages/audio) ───
export const MAX_VOICE_DURATION = 120; // secondes (2 min max)
export const MIN_VOICE_DURATION = 1; // seconde (en-dessous : trop court)
export const MAX_VOICE_SIZE = 10 * 1024 * 1024; // 10 Mo (limite serveur)
export const VOICE_AUDIO_BITRATE = 96000; // bits/s (bon compromis qualité/poids)

export interface RecordedVoice {
  blob: Blob;
  mimeType: string;
  duration: number;
  size: number;
}

export interface VoiceAttachment {
  type: 'audio';
  url: string;
  mimeType: string;
  size: number;
  duration?: number;
  name?: string;
}

export type VoiceErrorReason =
  | 'unsupported'
  | 'permission'
  | 'device'
  | 'busy'
  | 'security'
  | 'start-failed'
  | 'recording-error'
  | 'too-short'
  | 'empty'
  | 'cancelled';

export interface VoiceStartResult {
  ok: boolean;
  reason?: VoiceErrorReason;
  message?: string;
}

export type VoiceRecorderResult =
  | { ok: true; voice: RecordedVoice }
  | { ok: false; reason: VoiceErrorReason; message: string };

interface UseAudioRecorderOptions {
  maxDuration?: number;
  minDuration?: number;
  onAutoStop?: (voice: RecordedVoice) => void;
}

const isBrowser = () => typeof window !== 'undefined';

const isRecorderSupported = () =>
  isBrowser() &&
  typeof window.MediaRecorder !== 'undefined' &&
  typeof navigator !== 'undefined' &&
  !!navigator.mediaDevices?.getUserMedia;

/** Traduit les erreurs getUserMedia en message explicite pour l'utilisateur. */
function describeMicError(error: unknown): { reason: VoiceErrorReason; message: string } {
  const name = (error as any)?.name || '';
  if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
    return {
      reason: 'permission',
      message: "Accès au micro refusé. Autorisez le micro dans les paramètres de votre navigateur puis réessayez.",
    };
  }
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
    return { reason: 'device', message: "Aucun microphone détecté sur cet appareil." };
  }
  if (name === 'NotReadableError' || name === 'TrackStartError') {
    return { reason: 'busy', message: "Le microphone est utilisé par une autre application." };
  }
  if (name === 'SecurityError') {
    return { reason: 'security', message: "L'enregistrement est bloqué dans ce contexte de sécurité." };
  }
  if (name === 'OverconstrainedError') {
    return { reason: 'start-failed', message: "Le microphone demandé ne répond pas aux exigences d'enregistrement." };
  }
  return { reason: 'start-failed', message: "Impossible de démarrer l'enregistrement vocal." };
}

/**
 * Enregistreur de messages vocaux professionnel basé sur l'API MediaRecorder.
 *
 * Garanties :
 * - Durée limitée (arrêt automatique à `maxDuration`, défaut 2 min).
 * - Messages trop courts (< `minDuration`) ou vides rejetés.
 * - Erreurs de permission/device traduites en messages clairs.
 * - Flux micro toujours libéré (fin, annulation, erreur, démontage).
 * - Aucun chevauchement : un enregistrement à la fois, état `starting` pendant
 *   la demande d'autorisation.
 * - `mimeType` normalisé (codecs retirés) pour rester compatible avec le
 *   serveur d'upload.
 */
export function useAudioRecorder({
  maxDuration = MAX_VOICE_DURATION,
  minDuration = MIN_VOICE_DURATION,
  onAutoStop,
}: UseAudioRecorderOptions = {}) {
  const [supported, setSupported] = useState(false);
  const [recording, setRecording] = useState(false);
  const [starting, setStarting] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const startTimeRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const maxTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingResolveRef = useRef<((r: VoiceRecorderResult) => void) | null>(null);
  const autoStoppedRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSupported(isRecorderSupported());
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const clearMaxTimer = useCallback(() => {
    if (maxTimerRef.current) {
      clearTimeout(maxTimerRef.current);
      maxTimerRef.current = null;
    }
  }, []);

  const releaseStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const cleanupRecorder = useCallback(() => {
    stopTimer();
    clearMaxTimer();
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    startTimeRef.current = 0;
    setRecordingTime(0);
  }, [stopTimer, clearMaxTimer]);

  const handleRecorderError = useCallback(() => {
    // Arrêt de secours en cas d'erreur MediaRecorder (piste coupée, etc.).
    stopTimer();
    clearMaxTimer();
    setRecording(false);
    releaseStream();
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    if (pendingResolveRef.current) {
      pendingResolveRef.current({
        ok: false,
        reason: 'recording-error',
        message: "L'enregistrement a été interrompu. Veuillez réessayer.",
      });
      pendingResolveRef.current = null;
    }
  }, [stopTimer, clearMaxTimer, releaseStream]);

  const buildVoice = useCallback(
    (): VoiceRecorderResult => {
      const duration = (Date.now() - startTimeRef.current) / 1000;
      const rawMime = mediaRecorderRef.current?.mimeType || 'audio/webm';
      const mimeType = (rawMime.split(';')[0] || 'audio/webm').trim();
      const blob = new Blob(chunksRef.current, { type: mimeType });

      releaseStream();
      mediaRecorderRef.current = null;

      if (blob.size === 0) {
        return { ok: false, reason: 'empty', message: 'Le message vocal est vide.' };
      }
      if (duration < minDuration) {
        return {
          ok: false,
          reason: 'too-short',
          message: `Le message est trop court (moins de ${minDuration} s). Réenregistrez s'il vous plaît.`,
        };
      }
      return {
        ok: true,
        voice: {
          blob,
          mimeType,
          duration: Math.max(1, Math.round(duration)),
          size: blob.size,
        },
      };
    },
    [minDuration, releaseStream]
  );

  const start = useCallback(async (): Promise<VoiceStartResult> => {
    if (!isRecorderSupported()) {
      return {
        ok: false,
        reason: 'unsupported',
        message: "L'enregistrement vocal n'est pas supporté par ce navigateur.",
      };
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      return { ok: false, reason: 'busy', message: 'Un enregistrement est déjà en cours.' };
    }

    setStarting(true);
    stopTimer();
    clearMaxTimer();
    autoStoppedRef.current = false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      const mimeCandidates = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg;codecs=opus',
      ];
      const mimeType = mimeCandidates.find((m) => MediaRecorder.isTypeSupported(m)) || '';

      let recorder: MediaRecorder;
      try {
        recorder = new MediaRecorder(stream, {
          ...(mimeType ? { mimeType } : {}),
          audioBitsPerSecond: VOICE_AUDIO_BITRATE,
        });
      } catch {
        // Certains navigateurs ignorent/refusent les options -> repli minimaliste.
        recorder = new MediaRecorder(stream);
      }

      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onerror = handleRecorderError;

      recorder.start(250); // timeslice : chunks réguliers, blob fiable à l'arrêt
      mediaRecorderRef.current = recorder;
      startTimeRef.current = Date.now();
      setRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 250);

      // Arrêt automatique à la durée maximale.
      maxTimerRef.current = setTimeout(() => {
        autoStoppedRef.current = true;
        const rec = mediaRecorderRef.current;
        if (rec && rec.state !== 'inactive') {
          const handleAutoStop = () => {
            const result = buildVoice();
            if (result.ok) {
              setRecording(false);
              onAutoStop?.(result.voice);
            } else {
              setRecording(false);
              if (pendingResolveRef.current) {
                pendingResolveRef.current(result);
                pendingResolveRef.current = null;
              }
            }
          };
          rec.onstop = handleAutoStop;
          try {
            rec.stop();
          } catch {
            // ignore
          }
        }
      }, maxDuration * 1000);

      return { ok: true };
    } catch (error) {
      console.error('[useAudioRecorder] Impossible de démarrer l’enregistrement:', error);
      const desc = describeMicError(error);
      releaseStream();
      return { ok: false, reason: desc.reason, message: desc.message };
    } finally {
      setStarting(false);
    }
  }, [maxDuration, stopTimer, clearMaxTimer, releaseStream, handleRecorderError, buildVoice, onAutoStop]);

  const stop = useCallback((): Promise<VoiceRecorderResult> => {
    const rec = mediaRecorderRef.current;
    if (!rec || rec.state === 'inactive') {
      return Promise.resolve({
        ok: false,
        reason: 'cancelled',
        message: "Aucun enregistrement en cours.",
      });
    }

    // L'arrêt automatique est déjà en cours : on le laisse finir.
    if (autoStoppedRef.current) {
      return Promise.resolve({ ok: false, reason: 'cancelled', message: 'Arrêt automatique en cours.' });
    }

    return new Promise((resolve) => {
      pendingResolveRef.current = resolve;

      rec.onstop = () => {
        const result = buildVoice();
        setRecording(false);
        stopTimer();
        clearMaxTimer();
        if (pendingResolveRef.current) {
          pendingResolveRef.current(result);
          pendingResolveRef.current = null;
        }
      };

      try {
        rec.stop();
      } catch (error) {
        console.error('[useAudioRecorder] Erreur à l’arrêt:', error);
        setRecording(false);
        stopTimer();
        clearMaxTimer();
        releaseStream();
        mediaRecorderRef.current = null;
        if (pendingResolveRef.current) {
          pendingResolveRef.current({
            ok: false,
            reason: 'recording-error',
            message: "Impossible d'arrêter l'enregistrement.",
          });
          pendingResolveRef.current = null;
        }
      }
    });
  }, [buildVoice, stopTimer, clearMaxTimer, releaseStream]);

  const cancel = useCallback(() => {
    stopTimer();
    clearMaxTimer();
    setRecording(false);
    setRecordingTime(0);
    const rec = mediaRecorderRef.current;
    if (rec && rec.state !== 'inactive') {
      rec.onstop = null; // silence volontaire : l'utilisateur annule
      try {
        rec.stop();
      } catch {
        // ignore
      }
    }
    releaseStream();
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    pendingResolveRef.current = null;
  }, [stopTimer, clearMaxTimer, releaseStream]);

  useEffect(() => {
    return () => {
      stopTimer();
      clearMaxTimer();
      releaseStream();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.onstop = null;
          mediaRecorderRef.current.stop();
        } catch {
          // ignore
        }
      }
      mediaRecorderRef.current = null;
      pendingResolveRef.current = null;
    };
  }, [stopTimer, clearMaxTimer, releaseStream]);

  return { supported, recording, starting, recordingTime, maxDuration, minDuration, start, stop, cancel };
}

/** Téléverse l'audio enregistré et retourne la pièce jointe prête pour POST /api/messages. */
export async function uploadVoiceMessage(voice: RecordedVoice): Promise<VoiceAttachment | null> {
  if (!voice || !voice.blob) throw new Error('Message vocal invalide.');
  if (voice.size > MAX_VOICE_SIZE) {
    throw new Error('Le message vocal dépasse la taille maximale autorisée (10 Mo).');
  }

  try {
    // mimeType normalisé (sans codecs) pour rester compatible avec l'API.
    const baseMime = (voice.mimeType || 'audio/webm').split(';')[0].trim() || 'audio/webm';
    const ext = baseMime.includes('mp4') ? 'm4a' : baseMime.includes('ogg') ? 'ogg' : 'webm';
    const file = new File([voice.blob], `message-vocal-${Date.now()}.${ext}`, { type: baseMime });
    const form = new FormData();
    form.append('file', file);
    form.append('duration', String(voice.duration));

    const res = await fetch('/api/messages/audio', {
      method: 'POST',
      body: form,
      cache: 'no-store',
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.error || "Erreur lors de l'envoi du message vocal");
    }

    const data = await res.json();
    return {
      type: 'audio',
      url: data.url,
      mimeType: data.mimeType,
      size: data.size,
      duration: data.duration || voice.duration,
      name: file.name,
    };
  } catch (error) {
    console.error('[uploadVoiceMessage] Erreur:', error);
    throw error;
  }
}

/** Formate une durée en secondes vers m:ss (ex. 1:05). */
export function formatVoiceDuration(seconds?: number): string {
  if (!seconds || seconds <= 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** Formate une durée en secondes vers mm:ss à deux chiffres (ex. 01:05). */
export function formatVoiceClock(seconds?: number): string {
  if (!seconds || seconds <= 0) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
