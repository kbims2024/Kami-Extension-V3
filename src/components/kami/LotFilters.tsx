import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface LotFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  availableCount: number;
  reservedCount: number;
  soldCount: number;
}

export function LotFilters({
  activeFilter,
  onFilterChange,
  availableCount,
  reservedCount,
  soldCount,
}: LotFiltersProps) {
  const filters = [
    { id: 'all', label: 'Tous', count: availableCount + reservedCount + soldCount },
    { id: 'AVAILABLE', label: 'Disponibles', count: availableCount },
    { id: 'RESERVED', label: 'Réservés', count: reservedCount },
    { id: 'PAID', label: 'Vendus', count: soldCount },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 px-4">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={activeFilter === filter.id ? 'default' : 'outline'}
          onClick={() => onFilterChange(filter.id)}
          className={`flex-shrink-0 ${
            activeFilter === filter.id
              ? 'bg-brand-blue hover:bg-blue-700 text-white'
              : 'bg-card text-foreground hover:bg-accent'
          }`}
        >
          {filter.label}
          <Badge
            className={`ml-2 ${
              activeFilter === filter.id
                ? 'bg-white/20 text-white'
                : 'bg-accent text-muted-foreground'
            }`}
          >
            {filter.count}
          </Badge>
        </Button>
      ))}
    </div>
  );
}
