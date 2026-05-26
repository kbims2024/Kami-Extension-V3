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
              ? 'bg-[#10B981] hover:bg-[#059669] text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {filter.label}
          <Badge
            className={`ml-2 ${
              activeFilter === filter.id
                ? 'bg-white text-[#10B981]'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {filter.count}
          </Badge>
        </Button>
      ))}
    </div>
  );
}
