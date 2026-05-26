'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, Calendar, TrendingUp, Users } from 'lucide-react';

interface FlashInfo {
  id: string;
  icon: React.ReactNode;
  text: string;
  urgent?: boolean;
}

export function FlashInfoBand() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const flashInfos: FlashInfo[] = [
    {
      id: '1',
      icon: <AlertCircle className="h-4 w-4" />,
      text: '🎉 Promotion spéciale : -10% sur tous les lots du Bloc A jusqu\'au 31 décembre !',
      urgent: true,
    },
    {
      id: '2',
      icon: <TrendingUp className="h-4 w-4" />,
      text: '📈 15 lots déjà réservés cette semaine ! Ne manquez pas cette opportunité.',
      urgent: false,
    },
    {
      id: '3',
      icon: <Calendar className="h-4 w-4" />,
      text: '📅 Journée portes ouvertes : Samedi 15 Décembre de 9h à 17h sur le site.',
      urgent: false,
    },
    {
      id: '4',
      icon: <Users className="h-4 w-4" />,
      text: '👥 Plus de 50 familles ont déjà rejoint KAMI-EXTENSION. Rejoignez-nous !',
      urgent: false,
    },
    {
      id: '5',
      icon: <AlertCircle className="h-4 w-4" />,
      text: '⚡ Nouveau : Paiement en plusieurs fois disponible pour tous les lots !',
      urgent: true,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % flashInfos.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [flashInfos.length]);

  const nextInfo = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashInfos.length);
  };

  const prevInfo = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + flashInfos.length) % flashInfos.length
    );
  };

  const currentInfo = flashInfos[currentIndex];

  return (
    <div className="w-full bg-gradient-to-r from-brand-blue to-blue-700 dark:from-blue-900 dark:to-blue-950 text-white overflow-hidden">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-4">
          {/* Previous Button */}
          <button
            onClick={prevInfo}
            className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex-shrink-0"
            aria-label="Info précédente"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Flash Info Content */}
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center justify-center gap-3 animate-fade-in">
              {currentInfo.urgent && (
                <span className="inline-flex items-center bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse flex-shrink-0">
                  URGENT
                </span>
              )}
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-brand-yellow flex-shrink-0">
                  {currentInfo.icon}
                </span>
                <span className="text-sm sm:text-base font-medium truncate">
                  {currentInfo.text}
                </span>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="hidden md:flex items-center gap-1.5 flex-shrink-0">
            {flashInfos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-brand-yellow w-6'
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Aller à l'info ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={nextInfo}
            className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex-shrink-0"
            aria-label="Info suivante"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dots */}
      <div className="flex md:hidden items-center justify-center gap-1.5 mt-2 pb-1">
        {flashInfos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-brand-yellow w-4'
                : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Aller à l'info ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
