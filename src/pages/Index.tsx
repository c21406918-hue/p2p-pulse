import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw, Activity, LogOut, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchMarketData, 
  calculateForexMetrics,
  type MarketData 
} from "@/lib/binance-api";
import { TickerBar } from "@/components/forex/TickerBar";
import { MetricCards } from "@/components/forex/MetricCards";
import { DepthChart } from "@/components/forex/DepthChart";
import { MarketStats } from "@/components/forex/MarketStats";
import { OrderCalculator } from "@/components/forex/OrderCalculator";

const REFRESH_INTERVAL = 30000; // 30 seconds

const Index = () => {
  const { toast } = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente",
    });
  };

  const { data, isLoading, error, refetch, isRefetching } = useQuery<MarketData>({
    queryKey: ['binanceMarket'],
    queryFn: fetchMarketData,
    refetchInterval: REFRESH_INTERVAL,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      setLastUpdate(new Date());
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error al cargar datos",
        description: "No se pudieron obtener los datos del mercado. Reintentando...",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleManualRefresh = () => {
    refetch();
    toast({
      title: "Actualizando datos",
      description: "Obteniendo información actualizada del mercado...",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Activity className="w-12 h-12 text-primary animate-pulse mx-auto" />
          <p className="text-lg text-muted-foreground">Cargando datos del mercado...</p>
        </div>
      </div>
    );
  }

  const forexMetrics = data ? calculateForexMetrics(data) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800/50 backdrop-blur-xl bg-slate-900/80 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                BinanceVES Monitor
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Monitor Profesional P2P • Última actualización: {lastUpdate.toLocaleTimeString('es-VE')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={handleManualRefresh} 
                disabled={isRefetching}
                size="sm"
                variant="outline"
                className="border-slate-700 hover:bg-slate-800"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
              <Button 
                onClick={handleLogout}
                size="sm"
                variant="outline"
                className="border-slate-700 hover:bg-slate-800"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          
          {/* SECCIÓN PRINCIPAL: MÉTRICAS DE OFFER Y BID */}
          {data && <MetricCards data={data} />}

          {/* SECCIÓN: BID Y ASK */}
          {forexMetrics && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">BID (Compra)</span>
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-4xl font-bold text-green-400 font-mono">
                  {forexMetrics.bid.toFixed(2)}
                </div>
                <div className="text-xs text-slate-500 mt-2">VES/USDT</div>
              </div>

              <div className="glass-card p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">ASK (Venta)</span>
                  <Activity className="w-5 h-5 text-orange-400" />
                </div>
                <div className="text-4xl font-bold text-orange-400 font-mono">
                  {forexMetrics.ask.toFixed(2)}
                </div>
                <div className="text-xs text-slate-500 mt-2">VES/USDT</div>
              </div>

              <div className="glass-card p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">SPREAD</span>
                  <Activity className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-4xl font-bold text-blue-400 font-mono">
                  {forexMetrics.spread.toFixed(2)}
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  {forexMetrics.spreadPercent.toFixed(2)}% VES
                </div>
              </div>
            </div>
          )}

          {/* ESTADÍSTICAS DETALLADAS */}
          {data && <MarketStats data={data} />}

          {/* GRÁFICOS Y CALCULADORA */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data && <DepthChart data={data} />}
            {data && <OrderCalculator buyAds={data.buyAds} sellAds={data.sellAds} />}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 mt-12 bg-slate-900/50">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-xs text-slate-400">
            Dashboard Forex Profesional • Datos en tiempo real desde Binance P2P • Actualización automática cada 30s
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
