'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

export interface RecordedVoice {
  blob: Blob;
  mimeType: string;
  duration: number;
}

export interface VoiceAttachment {
  type: 'audio';
  url: string;
  mimeType: string;
  size: number;
  duration?: number;
  name?: string;
}

const isBrowser = () => typeof window !== 'undefined';

/**
 * Enregistre un message vocal via l'API MediaRecorder (WebM/Opus ou MP4/AAC
 * selon le navigateur). Le flux micro est libéré à chaque fin d'enregistrement.
 */
export function useAudioRecorder() {
  const [supported, setSupported] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const startTimeRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSupported(
        isBrowser() &&
          typeof window.MediaRecorder !== 'undefined' &&
          typeof navigator !== 'undefined' &&
          !!navigator.mediaDevices?.getUserMedia
      );
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(async () => {
    if (!isBrowser()) return false;

    // Nettoie un éventuel enregistrement en cours.
    stopTimer();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // ignore
      }
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeCandidates = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg;codecs=opus',
      ];
      const mimeType = mimeCandidates.find((m) => MediaRecorder.isTypeSupported(m)) || '';
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      startTimeRef.current = Date.now();
      setRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 250);

      return true;
    } catch (error) {
      console.error('[useAudioRecorder] Impossible de démarrer l’enregistrement:', error);
      return false;
    }
  }, [stopTimer]);

  const stop = useCallback(
    (): Promise<RecordedVoice | null> =>
      new Promise((resolve) => {
        if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
          resolve(null);
          return;
        }

        const duration = (Date.now() - startTimeRef.current) / 1000;

        mediaRecorderRef.current.onstop = () => {
          stopTimer();
          setRecording(false);

          const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
          const blob = new Blob(chunksRef.current, { type: mimeType });
          streamRef.current?.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
          mediaRecorderRef.current = null;

          if (blob.size === 0) {
            resolve(null);
            return;
          }
          resolve({ blob, mimeType, duration: Math.max(1, Math.round(duration)) });
        };

        try {
          mediaRecorderRef.current.stop();
        } catch {
          resolve(null);
        }
      }),
    [stopTimer]
  );

  const cancel = useCallback(() => {
    stopTimer();
    setRecording(false);
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    } catch {
      // ignore
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    mediaRecorderRef.current = null;
    chunksRef.current = [];
  }, [stopTimer]);

  useEffect(() => {
    return () => {
      stopTimer();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [stopTimer]);

  return { supported, recording, recordingTime, start, stop, cancel };
}

/** Téléverse l'audio enregistré et retourne la pièce jointe prête pour POST /api/messages. */
export async function uploadVoiceMessage(voice: RecordedVoice): Promise<VoiceAttachment | null> {
  try {
    const form = new FormData();
    const ext = voice.mimeType.includes('mp4') ? 'm4a' : voice.mimeType.includes('ogg') ? 'ogg' : 'webm';
    const file = new File([voice.blob], `message-vocal.${ext}`, { type: voice.mimeType });
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

/** Formate une durée en secondes vers m:ss. */
export function formatVoiceDuration(seconds?: number): string {
  if (!seconds || seconds <= 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}
