import { Card } from "@/components/ui/card";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MarketData, getPaymentMethodDistribution } from "@/lib/binance-api";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MarketStatsProps {
  data: MarketData;
}

export function MarketStats({ data }: MarketStatsProps) {
  const paymentDistribution = getPaymentMethodDistribution(data);
  
  const maxPrice24h = Math.max(
    ...data.buyAds.map(a => a.price),
    ...data.sellAds.map(a => a.price)
  );
  
  const minPrice24h = Math.min(
    ...data.buyAds.map(a => a.price),
    ...data.sellAds.map(a => a.price)
  );

  const COLORS = [
    'hsl(var(--success))',
    'hsl(var(--warning))',
    'hsl(var(--primary))',
    'hsl(var(--accent))',
    'hsl(var(--success) / 0.7)',
    'hsl(var(--warning) / 0.7)',
    'hsl(var(--primary) / 0.7)',
    'hsl(var(--accent) / 0.7)',
  ];

  return (
    <Card className="glass-card p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-1">Estadísticas de Mercado</h3>
          <p className="text-xs text-muted-foreground">Liquidez y Actividad</p>
        </div>

        {/* Precios 24h */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Precio Máximo 24h</div>
            <div className="text-xl font-bold text-success font-mono">{maxPrice24h.toFixed(2)}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Precio Mínimo 24h</div>
            <div className="text-xl font-bold text-warning font-mono">{minPrice24h.toFixed(2)}</div>
          </div>
        </div>

        {/* Anuncios Activos */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Anuncios Activos (Compra)</span>
            <span className="font-mono font-semibold text-success">{data.buyAds.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Anuncios Activos (Venta)</span>
            <span className="font-mono font-semibold text-warning">{data.sellAds.length}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border/40">
            <span className="text-sm text-muted-foreground">Tendencia de Anuncios</span>
            <div className="flex items-center gap-1">
              {data.buyAds.length > data.sellAds.length ? (
                <>
                  <TrendingUp className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium text-success">Más Compradores</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4 text-warning" />
                  <span className="text-sm font-medium text-warning">Más Vendedores</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Liquidez por Método de Pago */}
        <div className="space-y-3">
          <div className="text-sm font-medium">Liquidez por Método de Pago</div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentDistribution} layout="horizontal">
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))" 
                  tick={{ fontSize: 10 }}
                  width={80}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => `${value.toFixed(2)} USDT`}
                />
                <Bar dataKey="volume" radius={[0, 4, 4, 0]}>
                  {paymentDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
}
