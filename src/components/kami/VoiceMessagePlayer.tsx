'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import { formatVoiceDuration } from '@/hooks/useAudioRecorder';

interface VoiceMessagePlayerProps {
  url: string;
  mimeType?: string;
  duration?: number;
  accentColor?: string;
  isDark?: boolean;
}

/**
 * Lecteur de message vocal : play/pause, barre de progression et durée.
 * Les durées sont mises à jour dynamiquement une fois le métadonnées connues.
 */
export function VoiceMessagePlayer({
  url,
  mimeType,
  duration,
  accentColor = '#1E3A5F',
  isDark = false,
}: VoiceMessagePlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState<number>(duration || 0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setTotalDuration(audio.duration);
      }
      setIsReady(true);
    };
    const onTime = () => setCurrentTime(audio.currentTime);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [url]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {
        /* lecture bloquée par le navigateur */
      });
    } else {
      audio.pause();
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !totalDuration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    audio.currentTime = ratio * totalDuration;
    setCurrentTime(ratio * totalDuration);
  };

  const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div
      className="flex items-center gap-2 rounded-2xl px-3 py-2 min-w-[200px] max-w-[260px]"
      style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.55)' }}
    >
      <audio ref={audioRef} src={url} preload="metadata" />

      <button
        type="button"
        onClick={togglePlay}
        className="w-9 h-9 rounded-full flex items-center justify-center text-white flex-shrink-0"
        style={{ backgroundColor: accentColor }}
        aria-label={isPlaying ? 'Pause' : 'Écouter'}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4 ml-0.5" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div
          className="h-1.5 rounded-full cursor-pointer bg-black/15 dark:bg-white/20 relative"
          onClick={seek}
        >
          <div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{ width: `${progress}%`, backgroundColor: accentColor }}
          />
        </div>
        <p className="text-[10.5px] mt-1 tabular-nums" style={{ color: isDark ? '#B7C4D6' : '#54656F' }}>
          {isReady ? formatVoiceDuration(currentTime) : formatVoiceDuration(0)} /{' '}
          {totalDuration > 0 ? formatVoiceDuration(totalDuration) : formatVoiceDuration(duration)}
        </p>
      </div>
    </div>
  );
}
