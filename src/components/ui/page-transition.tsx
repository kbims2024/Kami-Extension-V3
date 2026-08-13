'use client';

interface PageTransitionProps {
  children: React.ReactNode;
}

// Version simple et légère des transitions de page
export function PageTransition({ children }: PageTransitionProps) {
  return (
    <div className="flex-1 flex flex-col animate-fade-in">
      {children}
    </div>
  );
}

// Transition de fondu simple
export function FadeTransition({ children }: PageTransitionProps) {
  return (
    <div className="flex-1 flex flex-col animate-fade-in">
      {children}
    </div>
  );
}

// Transition avec effet d'échelle
export function ScaleTransition({ children }: PageTransitionProps) {
  return (
    <div className="flex-1 flex flex-col animate-scale-in">
      {children}
    </div>
  );
}

// Transition avec effet de slide
export function SlideFadeTransition({ children }: PageTransitionProps) {
  return (
    <div className="flex-1 flex flex-col animate-slide-in-up">
      {children}
    </div>
  );
}