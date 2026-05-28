import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  bgColor?: string;
}

export function StatsCard({ title, value, icon: Icon, iconColor = 'text-[#10B981]', bgColor = 'bg-card' }: StatsCardProps) {
  return (
    <Card className={`${bgColor} shadow-sm border-0`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-extrabold text-foreground">{value}</p>
          </div>
          <div className={`p-3 rounded-xl ${iconColor.replace('text-', 'bg-').replace('-600', '-100').replace('-500', '-100').replace('-700', '-100')}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
