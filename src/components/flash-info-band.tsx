'use client';

import { AlertCircle, Calendar, TrendingUp, Users, Star, Info, Bell, Flame, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FlashInfoItem {
  id: string;
  icon: string;
  text: string;
  textColor: string;
  bgColor: string;
  urgent?: boolean;
  position: number;
}

interface FlashInfoData {
  items: FlashInfoItem[];
  settings: {
    scrollSpeed: number;
    bgColor: string;
    textColor: string;
  };
}

const iconMap: { [key: string]: React.ReactNode } = {
  AlertCircle: <AlertCircle className="h-4 w-4" />,
  TrendingUp: <TrendingUp className="h-4 w-4" />,
  Calendar: <Calendar className="h-4 w-4" />,
  Users: <Users className="h-4 w-4" />,
  Star: <Star className="h-4 w-4" />,
  Info: <Info className="h-4 w-4" />,
  Bell: <Bell className="h-4 w-4" />,
  Flame: <Flame className="h-4 w-4" />,
  Sparkles: <Sparkles className="h-4 w-4" />
};

export function FlashInfoBand() {
  const [data, setData] = useState<FlashInfoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFlashInfo();
  }, []);

  const loadFlashInfo = async () => {
    try {
      const response = await fetch('/api/flash-info');
      if (response.ok) {
        const flashData = await response.json();
        const items = [...(flashData.items || [])].sort((a, b) => a.position - b.position);
        setData({ ...flashData, items });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des flash infos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return null;
  }

  // Duplicate the items to create a seamless loop
  const scrollContent = [...data.items, ...data.items, ...data.items];

  return (
    <div
      className="w-full text-white overflow-hidden flex items-center"
      style={{ backgroundColor: data.settings.bgColor }}
    >
      {/* Static "FLASH INFO" label on the left - INFO on mobile, FLASH INFO on desktop */}
      <div className="flex-shrink-0 bg-orange-500 px-3 md:px-4 py-2 md:py-3 border-2 border-red-600">
        <span className="hidden md:inline text-sm font-bold text-white">FLASH</span>
        <span className="text-xs md:text-sm font-bold text-white"> INFO</span>
      </div>

      {/* Scrolling Container - starts from left, right of the label */}
      <div className="flex-1 overflow-hidden py-2 md:py-3">
        <div
          className="flex items-center gap-12 animate-scroll hover:pause"
          style={{ animationDuration: `${data.settings.scrollSpeed}s` }}
        >
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
              <span style={{ color: '#fbbf24' }}>
                {iconMap[info.icon] || <AlertCircle className="h-4 w-4" />}
              </span>
              <span className="text-sm font-medium" style={{ color: info.textColor }}>
                {info.text}
              </span>
              <span className="mx-4 opacity-50">•</span>
            </div>
          ))}
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
          animation: scroll linear infinite;
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
