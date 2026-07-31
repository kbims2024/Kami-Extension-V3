'use client';

import React, { useCallback, type HTMLAttributes, type ReactNode } from 'react';
import { playClickSound, type ClickSoundType } from '@/hooks/use-click-sound';

interface SoundDivProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  sound?: ClickSoundType;
}

// Div cliquable avec son
export function SoundDiv({ children, sound = 'soft', onClick, className, ...props }: SoundDivProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      playClickSound(sound);
      onClick?.(e);
    },
    [onClick, sound]
  );

  return (
    <div onClick={handleClick} className={className} {...props}>
      {children}
    </div>
  );
}

interface SoundSpanProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  sound?: ClickSoundType;
}

// Span cliquable avec son
export function SoundSpan({ children, sound = 'soft', onClick, className, ...props }: SoundSpanProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>) => {
      playClickSound(sound);
      onClick?.(e);
    },
    [onClick, sound]
  );

  return (
    <span onClick={handleClick} className={className} {...props}>
      {children}
    </span>
  );
}

// Hook pour ajouter le son à un onClick existant
export function useSoundClick<T extends (...args: any[]) => void>(
  callback?: T,
  sound: ClickSoundType = 'tap'
): T | undefined {
  return useCallback(
    ((...args: any[]) => {
      playClickSound(sound);
      callback?.(...args);
    }) as T,
    [callback, sound]
  );
}
