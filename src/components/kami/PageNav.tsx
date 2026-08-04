'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

interface PageNavProps {
  onBack: () => void;
  onHome: () => void;
  title?: string;
  titleRight?: React.ReactNode;
  className?: string;
}

export function PageNav({ onBack, onHome, title, titleRight, className = '' }: PageNavProps) {
  return (
    <div className={`flex items-center justify-between px-4 py-3 sticky top-0 z-20 bg-card border-b border-border ${className}`}>
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        className="shrink-0"
        aria-label="Retour"
      >
        <ArrowLeft className="h-5 w-5 text-foreground" />
      </Button>
      {title && (
        <h2 className="flex-1 text-center text-lg font-bold text-foreground truncate px-2">
          {title}
        </h2>
      )}
      {!title && <div className="flex-1" />}
      <div className="flex items-center gap-1">
        {titleRight}
        <Button
          variant="ghost"
          size="icon"
          onClick={onHome}
          className="shrink-0"
          aria-label="Accueil"
        >
          <Home className="h-5 w-5 text-foreground" />
        </Button>
      </div>
    </div>
  );
}
