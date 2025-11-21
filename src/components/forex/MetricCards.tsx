import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Activity, ArrowUp, ArrowDown } from "lucide-react";
import { 
  MarketData, 
  calculateTotalVolume, 
  calculateWeightedAveragePrice,
  calculateDayChanges,
  saveDayStartValues 
} from "@/lib/binance-api";
import { useEffect } from "react";

interface MetricCardsProps {
  data: MarketData;
}

export function MetricCards({ data }: MetricCardsProps) {
  const totalOfferVolume = calculateTotalVolume(data.sellAds);
  const totalBidVolume = calculateTotalVolume(data.buyAds);
  const avgBuyPrice = calculateWeightedAveragePrice(data.buyAds);
  const avgSellPrice = calculateWeightedAveragePrice(data.sellAds);

  // Guardar valores del inicio del día si es necesario
  useEffect(() => {
    saveDayStartValues(data);
  }, [data]);

  // Obtener las variaciones del día
  const changes = calculateDayChanges(data);

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  const getCurrentDate = () => {
    const today = new Date();
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white mb-2">📊 Métricas Principales del Mercado P2P</h2>
        <span className="text-sm text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full">
          {getCurrentDate()}
        </span>
      </div>
      
      {/* Primera fila: Volúmenes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Volumen Total de Offer (Venta) */}
        <Card className="bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent border-orange-500/30 p-8 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 relative overflow-hidden">
          {/* Badge de variación */}
          <div className="absolute top-4 right-4">
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
              changes.offerVolumeChange >= 0 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
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
                  <TrendingUp className="w-8 h-8 text-orange-400" />
                </div>
                <div>
                  <div className="text-sm text-slate-400 font-medium">Volumen Total de</div>
                  <div className="text-lg font-bold text-orange-400">OFFER (Venta)</div>
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
                <Activity className="w-4 h-4" />
                USDT disponibles para comprar
              </div>
            </div>
          </div>
        </Card>

        {/* Volumen Total de Bid (Compra) */}
        <Card className="bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border-green-500/30 p-8 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 relative overflow-hidden">
          {/* Badge de variación */}
          <div className="absolute top-4 right-4">
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
              changes.bidVolumeChange >= 0 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
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
                  <TrendingDown className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <div className="text-sm text-slate-400 font-medium">Volumen Total de</div>
                  <div className="text-lg font-bold text-green-400">BID (Compra)</div>
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
                <Activity className="w-4 h-4" />
                USDT disponibles para vender
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
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
              changes.buyPriceChange >= 0 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
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
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
              changes.sellPriceChange >= 0 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
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
