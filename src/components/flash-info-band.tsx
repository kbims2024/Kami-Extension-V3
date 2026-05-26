'use client';

import { AlertCircle, Calendar, TrendingUp, Users } from 'lucide-react';

interface FlashInfoItem {
  id: string;
  icon: React.ReactNode;
  text: string;
  urgent?: boolean;
}

export function FlashInfoBand() {
  const flashInfos: FlashInfoItem[] = [
    {
      id: '1',
      icon: <AlertCircle className="h-4 w-4" />,
      text: '🎉 Promotion spéciale : -10% sur tous les lots de l\'Îlot A jusqu\'au 31 décembre !',
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

  // Duplicate the items to create a seamless loop
  const scrollContent = [...flashInfos, ...flashInfos, ...flashInfos];

  return (
    <div className="w-full bg-gradient-to-r from-brand-blue to-blue-700 dark:from-blue-900 dark:to-blue-950 text-white overflow-hidden">
      <div className="relative">
        {/* Scrolling Container */}
        <div className="overflow-hidden py-3">
          <div className="flex items-center gap-12 animate-scroll hover:pause">
            {scrollContent.map((info, index) => (
              <div
                key={`${info.id}-${index}`}
                className="flex items-center gap-2 flex-shrink-0 whitespace-nowrap"
              >
                {info.urgent && (
                  <span className="inline-flex items-center bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    URGENT
                  </span>
                )}
                <span className="text-brand-yellow">{info.icon}</span>
                <span className="text-sm font-medium">{info.text}</span>
                <span className="text-brand-blue/50 mx-4">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }

        .pause {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
