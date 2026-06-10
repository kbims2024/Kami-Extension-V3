import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Menu, Map, Wrench, Zap, Droplet, ShieldCheck, FileText, Home, Building2, CheckCircle, TrendingUp } from 'lucide-react';
import { StatsCard } from './StatsCard';

interface EnhancedHomeScreenProps {
  lots: any[];
  setCurrentScreen: (screen: string) => void;
  setIsMenuOpen: (open: boolean) => void;
}

export function EnhancedHomeScreen({ lots, setCurrentScreen, setIsMenuOpen }: EnhancedHomeScreenProps) {
  const availableCount = lots.filter((l) => l.status === 'AVAILABLE').length;
  const reservedCount = lots.filter((l) => l.status === 'RESERVED').length;
  const soldCount = lots.filter((l) => l.status === 'PAID').length;
  const totalCount = lots.length;
  const sellRate = totalCount > 0 ? Math.round(((soldCount + reservedCount) / totalCount) * 100) : 0;

  return (
    <div className="flex-1 flex flex-col bg-card">
      <header className="flex justify-between items-center p-4 bg-card sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-extrabold text-[#8B5E3C]">KAMI-EXTENSION</h1>
        <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)}>
          <Menu className="h-6 w-6 text-foreground" />
        </Button>
      </header>

      <div className="bg-[#8B5E3C] text-white p-8 pb-12 rounded-b-[2rem] relative overflow-hidden">
        <Building2 className="absolute top-0 right-0 opacity-10 h-[150px] w-[150px]" />
        <h2 className="text-3xl font-extrabold mb-2 relative z-10">
          Construisez votre avenir au village
        </h2>
        <p className="opacity-90 mb-6 relative z-10">
          Le nouveau quartier moderne, propre et discipliné de Kami.
        </p>
        <Button
          onClick={() => setCurrentScreen('map')}
          className="bg-card text-[#8B5E3C] font-bold py-3 px-6 rounded-full shadow-lg hover:bg-background relative z-10"
        >
          <Map className="mr-2 h-4 w-4" />
          Voir les lots disponibles
        </Button>
      </div>

      {/* Stats Section */}
      <div className="p-6 -mt-6 relative z-10">
        <div className="grid grid-cols-2 gap-4">
          <StatsCard
            title="Lots Disponibles"
            value={availableCount}
            icon={Home}
            iconColor="text-[#10B981]"
            bgColor="bg-card"
          />
          <StatsCard
            title="Taux de Vente"
            value={`${sellRate}%`}
            icon={TrendingUp}
            iconColor="text-blue-500 dark:text-blue-400"
            bgColor="bg-card"
          />
        </div>
      </div>

      {/* Features Grid */}
      <div className="px-6 pb-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Nos Atouts</h3>
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800">
            <CardContent className="p-4 text-center">
              <Wrench className="text-[#10B981] dark:text-emerald-400 h-8 w-8 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-foreground">Routes Pavées</h4>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800">
            <CardContent className="p-4 text-center">
              <Zap className="text-blue-500 dark:text-blue-400 h-8 w-8 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-foreground">Électricité</h4>
            </CardContent>
          </Card>
          <Card className="bg-cyan-50 border-cyan-100 dark:bg-cyan-900/20 dark:border-cyan-800">
            <CardContent className="p-4 text-center">
              <Droplet className="text-cyan-500 dark:text-cyan-400 h-8 w-8 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-foreground">Eau Courante</h4>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 border-purple-100 dark:bg-purple-900/20 dark:border-purple-800">
            <CardContent className="p-4 text-center">
              <ShieldCheck className="text-purple-500 dark:text-purple-400 h-8 w-8 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-foreground">Sécurité</h4>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Progress Section */}
      <div className="px-6 pb-6">
        <Card className="bg-gradient-to-r from-[#8B5E3C] to-[#A67C52] border-0 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">Progression du Projet</h3>
                <p className="text-sm opacity-90">Suivi en temps réel</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-extrabold">{sellRate}%</p>
                <p className="text-xs opacity-80">Vendu/Réservé</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="opacity-90">Disponibles</span>
                <span className="font-bold">{availableCount} lots</span>
              </div>
              <div className="w-full bg-card/20 rounded-full h-2">
                <div className="bg-card h-2 rounded-full transition-all" style={{ width: `${(availableCount / totalCount) * 100}%` }} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-90">Réservés</span>
                <span className="font-bold">{reservedCount} lots</span>
              </div>
              <div className="w-full bg-orange-400/30 rounded-full h-2">
                <div className="bg-orange-400 h-2 rounded-full transition-all" style={{ width: `${(reservedCount / totalCount) * 100}%` }} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-90">Vendus</span>
                <span className="font-bold">{soldCount} lots</span>
              </div>
              <div className="w-full bg-emerald-400/30 rounded-full h-2">
                <div className="bg-emerald-400 h-2 rounded-full transition-all" style={{ width: `${(soldCount / totalCount) * 100}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rules Card */}
      <div className="px-6 pb-6">
        <Card className="border-2 border-dashed border-[#8B5E3C]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-foreground">Règlement Intérieur</h4>
              <p className="text-xs text-muted-foreground">Discipline et propreté</p>
            </div>
            <Button
              onClick={() => setCurrentScreen('rules')}
              className="bg-[#8B5E3C] hover:bg-[#6B472C] text-white px-4 py-2 rounded-xl text-sm font-bold"
            >
              Lire
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
