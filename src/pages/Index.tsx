import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw, Activity, LogOut } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-xl bg-background/95 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard Forex - USDT/VES</h1>
              <p className="text-xs text-muted-foreground mt-1">Monitor Profesional P2P Binance</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={handleManualRefresh} 
                disabled={isRefetching}
                size="sm"
                variant="outline"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
              <Button 
                onClick={handleLogout}
                size="sm"
                variant="outline"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Ticker Bar */}
          {forexMetrics && (
            <TickerBar metrics={forexMetrics} lastUpdate={lastUpdate} />
          )}

          {/* Metric Cards - Volúmenes y Precios Promedio */}
          {data && <MetricCards data={data} />}

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Depth Chart */}
            {data && <DepthChart data={data} />}
            
            {/* Order Calculator */}
            {data && <OrderCalculator buyAds={data.buyAds} sellAds={data.sellAds} />}
          </div>

          {/* Market Stats - Estadísticas de Compra y Venta */}
          {data && <MarketStats data={data} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-12">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-xs text-muted-foreground">
            Dashboard Forex Profesional • Datos en tiempo real desde Binance P2P • Actualización automática cada 30s
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
