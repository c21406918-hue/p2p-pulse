import { Card } from "@/components/ui/card";
import { MarketData } from "@/lib/types";
import { calculateTotalVolume, calculateWeightedAveragePrice, calculateDayChanges, calculateTotalUSDT } from "@/lib/binance-api";
import { ArrowDown, ArrowUp, DollarSign, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

interface MetricCardsProps {
  data: MarketData;
}

const formatChange = (change: number) => {
  return `${change.toFixed(2)}%`;
};

export function MetricCards({ data }: MetricCardsProps) {
  const totalOfferVolume = calculateTotalVolume(data.sellAds);
  const totalBidVolume = calculateTotalVolume(data.buyAds);
  const avgSellPrice = calculateWeightedAveragePrice(data.sellAds);
  const avgBuyPrice = calculateWeightedAveragePrice(data.buyAds);
  const changes = calculateDayChanges(data);
  const { totalBuyUSDT, totalSellUSDT } = calculateTotalUSDT(data);

  return (
    <div className="space-y-6">
      {/* Primera fila: Volumen Total de Oferta y Demanda */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total USDT de Compra (Demanda) */}
        <Card className="bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border-green-500/30 p-8 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <div className="text-sm text-slate-400 font-medium">Total USDT de</div>
                  <div className="text-lg font-bold text-green-400">COMPRA (Demanda)</div>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-green-500/20">
              <div className="text-5xl font-bold text-green-400 font-mono tracking-tight">
                {totalBuyUSDT.toLocaleString('es-VE', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
              <div className="text-sm text-slate-400 mt-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                USDT que el mercado quiere comprar
              </div>
            </div>
          </div>
        </Card>

        {/* Total USDT de Venta (Oferta) */}
        <Card className="bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent border-orange-500/30 p-8 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-500/20 rounded-xl">
                  <TrendingDown className="w-8 h-8 text-orange-400" />
                </div>
                <div>
                  <div className="text-sm text-slate-400 font-medium">Total USDT de</div>
                  <div className="text-lg font-bold text-orange-400">VENTA (Oferta)</div>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-orange-500/20">
              <div className="text-5xl font-bold text-orange-400 font-mono tracking-tight">
                {totalSellUSDT.toLocaleString('es-VE', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
              <div className="text-sm text-slate-400 mt-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                USDT disponibles para vender
              </div>
            </div>
          </div>
        </Card>

        {/* Volumen Total de Compra (Bid) */}
        <Card className="bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border-green-500/30 p-8 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 relative overflow-hidden">
          {/* Badge de variación */}
          <div className="absolute top-4 right-4">
            <div className={}>
              {changes.bidVolumeChange >= 0 ? (
                <ArrowUp className="w-3 h-3" />
              ) : (
                <ArrowDown className="w-3 h-3" />
              )}
              {formatChange(changes.bidVolumeChange)}
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <div className="text-sm text-slate-400 font-medium">Volumen Total de</div>
                  <div className="text-lg font-bold text-green-400">COMPRA (Bid)</div>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-green-500/20">
              <div className="text-5xl font-bold text-green-400 font-mono tracking-tight">
                {totalBidVolume.toLocaleString('es-VE', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
              <div className="text-sm text-slate-400 mt-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                USDT en anuncios de compra
              </div>
            </div>
          </div>
        </Card>

        {/* Volumen Total de Venta (Offer) */}
        <Card className="bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent border-orange-500/30 p-8 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 relative overflow-hidden">
          {/* Badge de variación */}
          <div className="absolute top-4 right-4">
            <div className={}>
              {changes.offerVolumeChange >= 0 ? (
                <ArrowUp className="w-3 h-3" />
              ) : (
                <ArrowDown className="w-3 h-3" />
              )}
              {formatChange(changes.offerVolumeChange)}
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-500/20 rounded-xl">
                  <TrendingDown className="w-8 h-8 text-orange-400" />
                </div>
                <div>
                  <div className="text-sm text-slate-400 font-medium">Volumen Total de</div>
                  <div className="text-lg font-bold text-orange-400">VENTA (Offer)</div>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-orange-500/20">
              <div className="text-5xl font-bold text-orange-400 font-mono tracking-tight">
                {totalOfferVolume.toLocaleString('es-VE', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
              <div className="text-sm text-slate-400 mt-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                USDT en anuncios de venta
              </div>
            </div>
          </div>
        </Card>
      </div>
      {/* Segunda fila: Precios Promedio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Precio Promedio de Compra */}
        <Card className="bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border-green-500/30 p-8 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 relative overflow-hidden">
          {/* Badge de variación */}
          <div className="absolute top-4 right-4">
            <div className={}>
              {changes.buyPriceChange >= 0 ? (
                <ArrowUp className="w-3 h-3" />
              ) : (
                <ArrowDown className="w-3 h-3" />
              )}
              {formatChange(changes.buyPriceChange)}
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <DollarSign className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <div className="text-sm text-slate-400 font-medium">Precio Promedio de</div>
                  <div className="text-lg font-bold text-green-400">COMPRA (Bid)</div>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-green-500/20">
              <div className="flex items-baseline gap-2">
                <div className="text-5xl font-bold text-green-400 font-mono tracking-tight">
                  {avgBuyPrice.toFixed(2)}
                </div>
                <div className="text-xl text-slate-400 font-medium">VES</div>
              </div>
              <div className="text-sm text-slate-400 mt-3">
                Por cada USDT (ponderado por volumen)
              </div>
            </div>
          </div>
        </Card>
        {/* Precio Promedio de Venta */}
        <Card className="bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent border-orange-500/30 p-8 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 relative overflow-hidden">
          {/* Badge de variación */}
          <div className="absolute top-4 right-4">
            <div className={}>
              {changes.sellPriceChange >= 0 ? (
                <ArrowUp className="w-3 h-3" />
              ) : (
                <ArrowDown className="w-3 h-3" />
              )}
              {formatChange(changes.sellPriceChange)}
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-500/20 rounded-xl">
                  <DollarSign className="w-8 h-8 text-orange-400" />
                </div>
                <div>
                  <div className="text-sm text-slate-400 font-medium">Precio Promedio de</div>
                  <div className="text-lg font-bold text-orange-400">VENTA (Offer)</div>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-orange-500/20">
              <div className="flex items-baseline gap-2">
                <div className="text-5xl font-bold text-orange-400 font-mono tracking-tight">
                  {avgSellPrice.toFixed(2)}
                </div>
                <div className="text-xl text-slate-400 font-medium">VES</div>
              </div>
              <div className="text-sm text-slate-400 mt-3">
                Por cada USDT (ponderado por volumen)
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
