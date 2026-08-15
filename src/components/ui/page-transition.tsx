'use client';

import React from 'react';

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col">
      {children}
    </div>
  );
}

export function FadeTransition({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 flex flex-col">{children}</div>;
}

export function ScaleTransition({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 flex flex-col">{children}</div>;
}

export function SlideFadeTransition({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 flex flex-col">{children}</div>;
}
