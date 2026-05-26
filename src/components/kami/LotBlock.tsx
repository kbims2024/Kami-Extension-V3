import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Building2 } from 'lucide-react';
import { LotCard } from './LotCard';

interface Lot {
  id: string;
  name: string;
  surface: string;
  priceRes: number;
  priceNon: number;
  status: 'AVAILABLE' | 'RESERVED' | 'PAID';
}

interface LotBlockProps {
  blockName: string;
  lots: Lot[];
  onReserve: (lotId: string) => void;
}

export function LotBlock({ blockName, lots, onReserve }: LotBlockProps) {
  if (lots.length === 0) return null;

  const availableCount = lots.filter((l) => l.status === 'AVAILABLE').length;
  const totalCount = lots.length;

  return (
    <Card className="mb-6 bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center text-foreground">
            <Building2 className="h-5 w-5 mr-2 text-brand-blue" />
            Bloc {blockName}
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {availableCount}/{totalCount} disponibles
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {lots.map((lot) => (
            <LotCard
              key={lot.id}
              id={lot.id}
              name={lot.name}
              surface={lot.surface}
              priceRes={lot.priceRes}
              priceNon={lot.priceNon}
              status={lot.status}
              onReserve={() => onReserve(lot.id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
