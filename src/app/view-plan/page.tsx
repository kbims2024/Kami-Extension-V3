'use client';

import { useEffect } from 'react';

export default function ViewPlanPage() {
  useEffect(() => {
    // Rediriger directement vers le PDF
    window.location.href = '/api/plan-view';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-lg text-muted-foreground">Ouverture du plan...</p>
      </div>
    </div>
  );
}