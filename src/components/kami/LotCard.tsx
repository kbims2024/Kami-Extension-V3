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
        return <Badge className="bg-brand-blue/20 text-brand-blue text-[10px] px-2 py-0.5 font-bold border border-brand-blue/30">DISPONIBLE</Badge>;
      case 'RESERVED':
        return <Badge className="bg-brand-yellow/20 text-yellow-700 text-[10px] px-2 py-0.5 font-bold border border-brand-yellow/30">RÉSERVÉ</Badge>;
      case 'PAID':
        return <Badge className="bg-gray-200 text-gray-700 text-[10px] px-2 py-0.5 font-bold border border-gray-300">VENDU</Badge>;
    }
  };

  const getIconColor = () => {
    if (isAvailable) return 'text-brand-blue';
    if (isReserved) return 'text-brand-yellow';
    return 'text-gray-400';
  };

  const getBgClass = () => {
    if (isAvailable) return 'bg-card border-brand-blue/30 hover:border-brand-blue hover:shadow-md hover:shadow-brand-blue/10';
    if (isReserved) return 'bg-card/50 border-brand-yellow/30 opacity-75';
    return 'bg-card/30 border-gray-300 opacity-60';
  };

  const getButton = () => {
    if (isAvailable) {
      return (
        <Button
          onClick={onReserve}
          className="w-full mt-2 bg-brand-blue hover:bg-blue-700 text-white text-xs font-bold h-8"
        >
          Réserver
        </Button>
      );
    }
    return (
      <Button
        disabled
        className="w-full mt-2 bg-muted text-muted-foreground text-xs font-bold h-8 cursor-not-allowed"
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
          <h4 className="font-bold text-foreground text-sm">Lot {name}</h4>
          <p className="text-xs text-muted-foreground">{surface}</p>
        </div>
        <div>
          <p className="font-extrabold text-brand-blue dark:text-brand-blue text-sm">
            Dès {priceRes.toLocaleString('fr-FR')} F
          </p>
          {getButton()}
        </div>
      </CardContent>
    </Card>
  );
}
