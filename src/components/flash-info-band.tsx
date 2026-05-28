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
        setData(flashData);
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

  return (
    <div
      className="w-full text-white overflow-hidden"
      style={{ backgroundColor: data.settings.bgColor }}
    >
      <div className="relative">
        {/* Fixed Container - aligned to left */}
        <div className="py-3 px-4">
          <div className="flex items-center gap-12 flex-nowrap overflow-x-auto">
            {data.items.map((info) => (
              <div
                key={info.id}
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
      </div>
    </div>
  );
}
