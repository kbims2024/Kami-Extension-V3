'use client';

import { useCallback, useRef } from 'react';

// AudioContext singleton pour éviter de recréer à chaque clic
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export type ClickSoundType = 'tap' | 'success' | 'error' | 'navigate' | 'soft';

function playSound(type: ClickSoundType) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    switch (type) {
      case 'tap': {
        // Son de tap court et net — style iOS/Android
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.06);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.start(now);
        osc.stop(now + 0.08);
        break;
      }

      case 'success': {
        // Son de succès montant — double ton
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        const gain2 = ctx.createGain();

        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(880, now);
        gain1.gain.setValueAtTime(0.15, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1100, now + 0.12);
        gain2.gain.setValueAtTime(0, now);
        gain2.gain.setValueAtTime(0.15, now + 0.12);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc1.start(now);
        osc1.stop(now + 0.15);
        osc2.start(now + 0.12);
        osc2.stop(now + 0.3);
        break;
      }

      case 'error': {
        // Son d'erreur — ton descendant court
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.2);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.start(now);
        osc.stop(now + 0.25);
        break;
      }

      case 'navigate': {
        // Son de navigation — clic léger et sec
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1800, now);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.04);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.start(now);
        osc.stop(now + 0.06);
        break;
      }

      case 'soft': {
        // Son doux — pour les actions discrètes
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(500, now + 0.1);

        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.start(now);
        osc.stop(now + 0.12);
        break;
      }
    }
  } catch {
    // Silently fail — audio not supported or blocked by browser
  }
}

export function useClickSound(type: ClickSoundType = 'tap') {
  const soundType = useRef(type);

  const play = useCallback(() => {
    playSound(type);
  }, [type]);

  return play;
}

// Fonction utilitaire pour jouer directement un son (pour les cas hors hook)
export function playClickSound(type: ClickSoundType = 'tap') {
  playSound(type);
}
