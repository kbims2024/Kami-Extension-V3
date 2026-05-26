import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Menu, Home, Wallet, Map as MapIcon, Building2, Filter } from 'lucide-react';
import { LotFilters } from './LotFilters';
import { LotBlock } from './LotBlock';

interface Lot {
  id: string;
  name: string;
  surface: string;
  priceRes: number;
  priceNon: number;
  status: 'AVAILABLE' | 'RESERVED' | 'PAID';
}

interface EnhancedMapScreenProps {
  lots: Lot[];
  handleOpenReservation: (lot: Lot) => void;
  setCurrentScreen: (screen: string) => void;
  setIsMenuOpen: (open: boolean) => void;
}

export function EnhancedMapScreen({ lots, handleOpenReservation, setCurrentScreen, setIsMenuOpen }: EnhancedMapScreenProps) {
  const [activeFilter, setActiveFilter] = useState('all');

  const availableCount = lots.filter((l) => l.status === 'AVAILABLE').length;
  const reservedCount = lots.filter((l) => l.status === 'RESERVED').length;
  const soldCount = lots.filter((l) => l.status === 'PAID').length;

  const filteredLots = activeFilter === 'all' ? lots : lots.filter((l) => l.status === activeFilter);

  // Group lots by block (first letter)
  const groupedLots: Record<string, Lot[]> = {};
  filteredLots.forEach((lot) => {
    const block = lot.name.charAt(0);
    if (!groupedLots[block]) {
      groupedLots[block] = [];
    }
    groupedLots[block].push(lot);
  });

  const sortedBlocks = Object.keys(groupedLots).sort();

  return (
    <div className="flex-1 flex flex-col bg-gray-100 pb-20">
      <header className="bg-white p-4 shadow-sm">
        <div className="flex items-center mb-3">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)}>
            <Menu className="h-5 w-5 text-gray-700" />
          </Button>
          <h2 className="text-lg font-bold text-gray-800 ml-2">Plan du Village</h2>
        </div>
        <LotFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          availableCount={availableCount}
          reservedCount={reservedCount}
          soldCount={soldCount}
        />
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {sortedBlocks.length === 0 ? (
          <Card className="p-8 text-center">
            <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">Aucun lot ne correspond à ce filtre.</p>
            <Button
              variant="outline"
              onClick={() => setActiveFilter('all')}
              className="mt-4"
            >
              <Filter className="mr-2 h-4 w-4" />
              Voir tous les lots
            </Button>
          </Card>
        ) : (
          sortedBlocks.map((block) => (
            <LotBlock
              key={block}
              blockName={block}
              lots={groupedLots[block]}
              onReserve={handleOpenReservation}
            />
          ))
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 text-gray-400">
        <Button
          variant="ghost"
          className="flex flex-col items-center h-auto"
          onClick={() => setCurrentScreen('home')}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Accueil</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center h-auto text-[#10B981]"
          disabled
        >
          <MapIcon className="h-5 w-5" />
          <span className="text-xs mt-1 font-bold">Lots</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center h-auto"
          onClick={() => setCurrentScreen('dashboard')}
        >
          <Wallet className="h-5 w-5" />
          <span className="text-xs mt-1">Mes Lots</span>
        </Button>
      </nav>
    </div>
  );
}
