import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { ForexMetrics } from "@/lib/binance-api";

interface TickerBarProps {
  metrics: ForexMetrics;
  lastUpdate: Date;
}

export function TickerBar({ metrics, lastUpdate }: TickerBarProps) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Mercado Spot: USDT/VES</h2>
        <div className="text-sm text-muted-foreground">
          Última Actualización: {lastUpdate.toLocaleTimeString('es-VE')}
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {/* BID */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground font-medium">BID (Compra)</div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-success" />
            <span className="text-2xl font-bold text-success font-mono">
              {metrics.bid.toFixed(2)}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">VES/USDT</div>
        </div>

        {/* ASK */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground font-medium">ASK (Venta)</div>
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-warning" />
            <span className="text-2xl font-bold text-warning font-mono">
              {metrics.ask.toFixed(2)}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">VES/USDT</div>
        </div>

        {/* SPREAD */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground font-medium">SPREAD</div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <span className="text-2xl font-bold text-primary font-mono">
              {metrics.spread.toFixed(2)}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {metrics.spreadPercent.toFixed(2)}% VES
          </div>
        </div>

        {/* PRECIO MEDIO */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground font-medium">PRECIO MEDIO</div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold font-mono">
              {metrics.midPrice.toFixed(2)}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">VES/USDT</div>
        </div>

        {/* VOLUMEN 24H */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground font-medium">VOLUMEN 24H</div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-accent font-mono">
              {(metrics.volume24h / 1000000).toFixed(2)}M
            </span>
          </div>
          <div className="text-xs text-muted-foreground">USDT</div>
        </div>
      </div>
    </div>
  );
}
