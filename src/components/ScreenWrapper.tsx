'use client';

import { ReactNode } from 'react';

interface ScreenWrapperProps {
  children: ReactNode;
  screenKey: string;
  className?: string;
}

export function ScreenWrapper({ children, screenKey, className = '' }: ScreenWrapperProps) {
  const animations: { [key: string]: string } = {
    // Home screen - slide up with fade
    home: 'animate-fade-in-up',

    // Auth screens - scale and fade
    'login-screen': 'animate-scale-in',
    'auth-choice': 'animate-scale-in',
    register: 'animate-scale-in',

    // Map - slide from right
    map: 'animate-slide-in-right',

    // Dashboard - fade with slide
    dashboard: 'animate-fade-in',

    // Profile - scale up
    profile: 'animate-scale-in',

    // Rules - fade in
    rules: 'animate-fade-in',

    // Admin screens
    admin: 'animate-slide-in-left',
    'management-committee': 'animate-fade-in-up',
    'admin-chat': 'animate-fade-in',

    // Chat - slide up
    chat: 'animate-slide-in-up',

    // Settings - scale
    settings: 'animate-scale-in',
  };

  const animationClass = animations[screenKey] || 'animate-fade-in';

  return (
    <div className={`screen-transition ${animationClass} ${className}`}>
      {children}
    </div>
  );
}