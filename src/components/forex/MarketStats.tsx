import { Card } from "@/components/ui/card";
import { MarketData } from "@/lib/binance-api";
import { TrendingUp, TrendingDown, BarChart3, Target } from "lucide-react";

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
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">📈 Estadísticas Detalladas del Mercado</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estadísticas de Compra */}
        <Card className="bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border-green-500/30 p-8 hover:border-green-500/50 transition-all duration-300">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-green-400">Estadísticas de Compra</h3>
                <p className="text-sm text-slate-400">Anuncios BID activos en el mercado</p>
              </div>
            </div>
            
            <div className="space-y-4 pt-4">
              {/* Anuncios Activos */}
              <div className="flex items-center justify-between p-5 rounded-xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/15 transition-colors">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-green-400" />
                  <span className="text-slate-300 font-medium">Anuncios Activos</span>
                </div>
                <span className="font-mono font-bold text-3xl text-green-400">{buyStats.activeAds}</span>
              </div>
              
              {/* Precio Mínimo */}
              <div className="flex items-center justify-between p-5 rounded-xl bg-slate-800/50 hover:bg-slate-800/70 transition-colors">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-green-400" />
                  <span className="text-slate-400">Precio Mínimo</span>
                </div>
                <div className="text-right">
                  <div className="font-mono font-semibold text-xl text-green-400">
                    {buyStats.minPrice.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500">VES</div>
                </div>
              </div>
              
              {/* Precio Máximo */}
              <div className="flex items-center justify-between p-5 rounded-xl bg-slate-800/50 hover:bg-slate-800/70 transition-colors">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-green-400" />
                  <span className="text-slate-400">Precio Máximo</span>
                </div>
                <div className="text-right">
                  <div className="font-mono font-semibold text-xl text-green-400">
                    {buyStats.maxPrice.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500">VES</div>
                </div>
              </div>

              {/* Rango de Precio */}
              <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                <div className="text-xs text-slate-400 mb-2">Rango de Precio</div>
                <div className="font-mono text-sm text-green-400">
                  {buyStats.minPrice.toFixed(2)} - {buyStats.maxPrice.toFixed(2)} VES
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Estadísticas de Venta */}
        <Card className="bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent border-orange-500/30 p-8 hover:border-orange-500/50 transition-all duration-300">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <TrendingDown className="w-8 h-8 text-orange-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-orange-400">Estadísticas de Venta</h3>
                <p className="text-sm text-slate-400">Anuncios OFFER activos en el mercado</p>
              </div>
            </div>
            
            <div className="space-y-4 pt-4">
              {/* Anuncios Activos */}
              <div className="flex items-center justify-between p-5 rounded-xl bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/15 transition-colors">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-orange-400" />
                  <span className="text-slate-300 font-medium">Anuncios Activos</span>
                </div>
                <span className="font-mono font-bold text-3xl text-orange-400">{sellStats.activeAds}</span>
              </div>
              
              {/* Precio Mínimo */}
              <div className="flex items-center justify-between p-5 rounded-xl bg-slate-800/50 hover:bg-slate-800/70 transition-colors">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-orange-400" />
                  <span className="text-slate-400">Precio Mínimo</span>
                </div>
                <div className="text-right">
                  <div className="font-mono font-semibold text-xl text-orange-400">
                    {sellStats.minPrice.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500">VES</div>
                </div>
              </div>
              
              {/* Precio Máximo */}
              <div className="flex items-center justify-between p-5 rounded-xl bg-slate-800/50 hover:bg-slate-800/70 transition-colors">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-orange-400" />
                  <span className="text-slate-400">Precio Máximo</span>
                </div>
                <div className="text-right">
                  <div className="font-mono font-semibold text-xl text-orange-400">
                    {sellStats.maxPrice.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500">VES</div>
                </div>
              </div>

              {/* Rango de Precio */}
              <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
                <div className="text-xs text-slate-400 mb-2">Rango de Precio</div>
                <div className="font-mono text-sm text-orange-400">
                  {sellStats.minPrice.toFixed(2)} - {sellStats.maxPrice.toFixed(2)} VES
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
