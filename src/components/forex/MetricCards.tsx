import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { MarketData, calculateTotalVolume, calculateWeightedAveragePrice } from "@/lib/binance-api";

interface MetricCardsProps {
  data: MarketData;
}

export function MetricCards({ data }: MetricCardsProps) {
  const totalOfferVolume = calculateTotalVolume(data.sellAds);
  const totalBidVolume = calculateTotalVolume(data.buyAds);
  const avgBuyPrice = calculateWeightedAveragePrice(data.buyAds);
  const avgSellPrice = calculateWeightedAveragePrice(data.sellAds);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Volumen Total de Offer (Venta) */}
      <Card className="glass-card p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Volumen Total de Offer</div>
            <TrendingUp className="w-5 h-5 text-success" />
          </div>
          <div>
            <div className="text-3xl font-bold text-success font-mono">
              {totalOfferVolume.toLocaleString('es-VE', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })}
            </div>
            <div className="text-xs text-muted-foreground mt-1">USDT disponibles</div>
          </div>
        </div>
      </Card>

      {/* Volumen Total de Bid (Compra) */}
      <Card className="glass-card p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Volumen Total de Bid</div>
            <TrendingDown className="w-5 h-5 text-warning" />
          </div>
          <div>
            <div className="text-3xl font-bold text-warning font-mono">
              {totalBidVolume.toLocaleString('es-VE', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })}
            </div>
            <div className="text-xs text-muted-foreground mt-1">USDT disponibles</div>
          </div>
        </div>
      </Card>

      {/* Precio Promedio de Compra */}
      <Card className="glass-card p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Precio Promedio de Compra</div>
            <DollarSign className="w-5 h-5 text-success" />
          </div>
          <div>
            <div className="text-3xl font-bold text-success font-mono">
              {avgBuyPrice.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">VES por USDT</div>
          </div>
        </div>
      </Card>

      {/* Precio Promedio de Venta */}
      <Card className="glass-card p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Precio Promedio de Venta</div>
            <DollarSign className="w-5 h-5 text-warning" />
          </div>
          <div>
            <div className="text-3xl font-bold text-warning font-mono">
              {avgSellPrice.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">VES por USDT</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
