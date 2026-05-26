import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface LotCardProps {
  id: string;
  name: string;
  surface: string;
  priceRes: number;
  priceNon: number;
  status: 'AVAILABLE' | 'RESERVED' | 'PAID';
  onReserve: () => void;
}

export function LotCard({ name, surface, priceRes, priceNon, status, onReserve }: LotCardProps) {
  const isAvailable = status === 'AVAILABLE';
  const isReserved = status === 'RESERVED';
  const isPaid = status === 'PAID';

  const getStatusBadge = () => {
    switch (status) {
      case 'AVAILABLE':
        return <Badge className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 font-bold">DISPONIBLE</Badge>;
      case 'RESERVED':
        return <Badge className="bg-orange-100 text-orange-700 text-[10px] px-2 py-0.5 font-bold">RÉSERVÉ</Badge>;
      case 'PAID':
        return <Badge className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 font-bold">VENDU</Badge>;
    }
  };

  const getIconColor = () => {
    if (isAvailable) return 'text-emerald-500';
    if (isReserved) return 'text-orange-400';
    return 'text-red-400';
  };

  const getBgClass = () => {
    if (isAvailable) return 'bg-white border-emerald-200 hover:border-emerald-400 hover:shadow-md';
    if (isReserved) return 'bg-gray-50 border-orange-200 opacity-75';
    return 'bg-gray-50 border-red-200 opacity-60';
  };

  const getButton = () => {
    if (isAvailable) {
      return (
        <Button
          onClick={onReserve}
          className="w-full mt-2 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold h-8"
        >
          Réserver
        </Button>
      );
    }
    return (
      <Button
        disabled
        className="w-full mt-2 bg-gray-300 text-gray-500 text-xs font-bold h-8 cursor-not-allowed"
      >
        {isReserved ? 'Réservé' : 'Vendu'}
      </Button>
    );
  };

  return (
    <Card className={`border-2 rounded-2xl transition-all ${getBgClass()}`}>
      <CardContent className="p-3 flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between items-start mb-2">
            <Home className={`h-5 w-5 ${getIconColor()}`} />
            {getStatusBadge()}
          </div>
          <h4 className="font-bold text-gray-800 text-sm">Lot {name}</h4>
          <p className="text-xs text-gray-500">{surface}</p>
        </div>
        <div>
          <p className="font-extrabold text-[#8B5E3C] text-sm">
            Dès {priceRes.toLocaleString('fr-FR')} F
          </p>
          {getButton()}
        </div>
      </CardContent>
    </Card>
  );
}
