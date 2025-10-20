import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'buy' | 'sell' | 'neutral';
}

export function MetricCard({ title, value, subtitle, icon: Icon, variant = 'neutral' }: MetricCardProps) {
  const gradientClass = variant === 'buy' 
    ? 'text-gradient-success' 
    : variant === 'sell' 
    ? 'text-gradient-warning' 
    : '';

  const iconColorClass = variant === 'buy'
    ? 'text-success'
    : variant === 'sell'
    ? 'text-warning'
    : 'text-primary';

  return (
    <Card className="glass-card p-6 transition-all hover:shadow-lg hover:shadow-primary/20">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={`text-3xl font-bold font-mono tracking-tight ${gradientClass}`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-secondary/50 ${iconColorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
}
