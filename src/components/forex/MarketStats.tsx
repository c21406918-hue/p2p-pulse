import { Card } from "@/components/ui/card";
import { MarketData } from "@/lib/binance-api";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MarketStatsProps {
  data: MarketData;
}

export function MarketStats({ data }: MarketStatsProps) {
  // Estadísticas de Compra (BID)
  const buyStats = {
    activeAds: data.buyAds.length,
    minPrice: data.buyAds.length > 0 ? Math.min(...data.buyAds.map(a => a.price)) : 0,
    maxPrice: data.buyAds.length > 0 ? Math.max(...data.buyAds.map(a => a.price)) : 0,
  };

  // Estadísticas de Venta (OFFER/ASK)
  const sellStats = {
    activeAds: data.sellAds.length,
    minPrice: data.sellAds.length > 0 ? Math.min(...data.sellAds.map(a => a.price)) : 0,
    maxPrice: data.sellAds.length > 0 ? Math.max(...data.sellAds.map(a => a.price)) : 0,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Estadísticas de Compra */}
      <Card className="glass-card p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-success" />
            <h3 className="text-lg font-semibold">Estadísticas de Compra</h3>
          </div>
          
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-success/5 border border-success/20">
              <span className="text-sm text-muted-foreground">Anuncios Activos:</span>
              <span className="font-mono font-bold text-xl text-success">{buyStats.activeAds}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
              <span className="text-sm text-muted-foreground">Precio Mínimo:</span>
              <span className="font-mono font-semibold text-success">
                {buyStats.minPrice.toFixed(2)} VES
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
              <span className="text-sm text-muted-foreground">Precio Máximo:</span>
              <span className="font-mono font-semibold text-success">
                {buyStats.maxPrice.toFixed(2)} VES
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Estadísticas de Venta */}
      <Card className="glass-card p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-warning" />
            <h3 className="text-lg font-semibold">Estadísticas de Venta</h3>
          </div>
          
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-warning/5 border border-warning/20">
              <span className="text-sm text-muted-foreground">Anuncios Activos:</span>
              <span className="font-mono font-bold text-xl text-warning">{sellStats.activeAds}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
              <span className="text-sm text-muted-foreground">Precio Mínimo:</span>
              <span className="font-mono font-semibold text-warning">
                {sellStats.minPrice.toFixed(2)} VES
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
              <span className="text-sm text-muted-foreground">Precio Máximo:</span>
              <span className="font-mono font-semibold text-warning">
                {sellStats.maxPrice.toFixed(2)} VES
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
