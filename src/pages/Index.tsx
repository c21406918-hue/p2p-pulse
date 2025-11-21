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

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Depth Chart */}
            {data && <DepthChart data={data} />}
            
            {/* Market Stats */}
            {data && <MarketStats data={data} />}
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Calculator */}
            {data && <OrderCalculator buyAds={data.buyAds} sellAds={data.sellAds} />}
            
            {/* Additional Info Panel */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">Información del Mercado</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="text-sm font-medium mb-2">Sobre BID y ASK</div>
                  <p className="text-xs text-muted-foreground">
                    <strong>BID:</strong> Precio más alto que alguien pagará por USDT (compra).<br/>
                    <strong>ASK:</strong> Precio más bajo al que alguien venderá USDT.<br/>
                    <strong>SPREAD:</strong> Diferencia entre ASK y BID, indica la liquidez del mercado.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                  <div className="text-sm font-medium mb-2">Gráfico de Profundidad</div>
                  <p className="text-xs text-muted-foreground">
                    Visualiza el volumen acumulado de órdenes a diferentes precios. 
                    Los "muros" grandes indican niveles de soporte/resistencia importantes.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                  <div className="text-sm font-medium mb-2">Impacto de Mercado</div>
                  <p className="text-xs text-muted-foreground">
                    Indica cuánto puede cambiar el precio tu orden. Un impacto bajo (&lt;1%) 
                    significa buena liquidez. Alto (&gt;3%) puede mover significativamente el mercado.
                  </p>
                </div>
              </div>
            </div>
          </div>
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
