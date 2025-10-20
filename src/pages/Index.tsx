import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  RefreshCw,
  Activity 
} from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { Calculator } from "@/components/Calculator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchMarketData, 
  calculateTotalVolume, 
  calculateWeightedAveragePrice,
  type MarketData 
} from "@/lib/binance-api";

const REFRESH_INTERVAL = 30000; // 30 seconds

const Index = () => {
  const { toast } = useToast();
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Activity className="w-12 h-12 text-primary animate-pulse mx-auto" />
          <p className="text-lg text-muted-foreground">Cargando datos del mercado...</p>
        </div>
      </div>
    );
  }

  const buyVolume = data ? calculateTotalVolume(data.buyAds) : 0;
  const sellVolume = data ? calculateTotalVolume(data.sellAds) : 0;
  const buyAvgPrice = data ? calculateWeightedAveragePrice(data.buyAds) : 0;
  const sellAvgPrice = data ? calculateWeightedAveragePrice(data.sellAds) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                BinanceVES Monitor
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Análisis en Tiempo Real del Mercado P2P USDT/VES
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Última actualización</p>
                <p className="text-sm font-mono">{lastUpdate.toLocaleTimeString('es-VE')}</p>
              </div>
              <Button 
                onClick={handleManualRefresh} 
                disabled={isRefetching}
                size="icon"
                variant="outline"
                className="animate-glow"
              >
                <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Volumen Total de Compra"
              value={buyVolume.toLocaleString('es-VE', { maximumFractionDigits: 2 })}
              subtitle="USDT disponibles"
              icon={TrendingUp}
              variant="buy"
            />
            
            <MetricCard
              title="Volumen Total de Venta"
              value={sellVolume.toLocaleString('es-VE', { maximumFractionDigits: 2 })}
              subtitle="USDT disponibles"
              icon={TrendingDown}
              variant="sell"
            />
            
            <MetricCard
              title="Precio Promedio de Compra"
              value={buyAvgPrice.toFixed(2)}
              subtitle="VES por USDT"
              icon={DollarSign}
              variant="buy"
            />
            
            <MetricCard
              title="Precio Promedio de Venta"
              value={sellAvgPrice.toFixed(2)}
              subtitle="VES por USDT"
              icon={DollarSign}
              variant="sell"
            />
          </div>

          {/* Calculator */}
          {data && <Calculator buyAds={data.buyAds} sellAds={data.sellAds} />}

          {/* Market Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-success" />
                Estadísticas de Compra
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Anuncios Activos:</span>
                  <span className="font-mono font-semibold">{data?.buyAds.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Precio Mínimo:</span>
                  <span className="font-mono">
                    {Math.min(...(data?.buyAds.map(a => a.price) || [0])).toFixed(2)} VES
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Precio Máximo:</span>
                  <span className="font-mono">
                    {Math.max(...(data?.buyAds.map(a => a.price) || [0])).toFixed(2)} VES
                  </span>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-warning" />
                Estadísticas de Venta
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Anuncios Activos:</span>
                  <span className="font-mono font-semibold">{data?.sellAds.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Precio Mínimo:</span>
                  <span className="font-mono">
                    {Math.min(...(data?.sellAds.map(a => a.price) || [0])).toFixed(2)} VES
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Precio Máximo:</span>
                  <span className="font-mono">
                    {Math.max(...(data?.sellAds.map(a => a.price) || [0])).toFixed(2)} VES
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Datos actualizados automáticamente cada 30 segundos desde Binance P2P
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
